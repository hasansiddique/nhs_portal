import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { locationMatchesPostcodeFilter, normalizeUkPostcode } from '../lib/postcode';
import { prisma } from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'nhs-portal-secret-change-in-production';
const SALT_ROUNDS = 10;
const RESET_TOKEN_EXPIRY_HOURS = 24;

async function generateDemoNhsNumber() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = String(Date.now() + Math.floor(Math.random() * 1000)).slice(-10);
    const existing = await prisma.patient.findUnique({
      where: { nhsNumber: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  return String(Date.now()).padStart(10, '0').slice(-10);
}

function sendError(res: Response, status: number, messages: Record<string, string> | string[]) {
  res.status(status).json({ messages: messages });
}

function toUserPayload(user: {
  id: string;
  email: string;
  name: string | null;
  role: string;
  patient?: { id: string; locationId: string | null } | null;
  practitioner?: {
    id: string;
    practitionerLocations: { locationId: string }[];
  } | null;
}) {
  const displayName = user.name || user.email;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    displayName,
    username: displayName,
    role: user.role,
    patientId: user.patient?.id,
    practitionerId: user.practitioner?.id,
    homeLocationId: user.patient?.locationId ?? undefined,
    workLocationIds: user.practitioner?.practitionerLocations?.map((l) => l.locationId) ?? undefined,
  };
}

export async function authLogin(req: Request, res: Response) {
  try {
    const body = (req.body || {}) as { username?: string; email?: string; password?: string };
    const username = String(body.username ?? body.email ?? '').trim();
    const password = body.password != null ? String(body.password) : '';

    if (!username || !password) {
      sendError(res, 400, { error: 'Username and password are required' });
      return;
    }

    const email = username.includes('@') ? username.trim().toLowerCase() : null;
    if (!email) {
      sendError(res, 401, { error: 'Invalid email or password' });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patient: { select: { id: true, locationId: true } },
        practitioner: {
          select: {
            id: true,
            practitionerLocations: { select: { locationId: true } },
          },
        },
      },
    });

    if (!user) {
      sendError(res, 401, { error: 'Invalid email or password' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      sendError(res, 401, { error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        ...(user.patient?.id ? { patientId: user.patient.id } : {}),
        ...(user.practitioner?.id ? { practitionerId: user.practitioner.id } : {}),
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: toUserPayload(user),
    });
  } catch (e: unknown) {
    console.error('authLogin', e);
    const msg = e instanceof Error ? e.message : String(e);
    if (/Can't reach database server|P1001|ECONNREFUSED|ENOTFOUND|database server/i.test(msg)) {
      sendError(res, 503, {
        error:
          'Database unreachable. Set DATABASE_URL in a `.env` file at the repository root (or in your environment), ensure PostgreSQL is running, then restart the API.',
      });
      return;
    }
    sendError(res, 500, { error: 'Login failed' });
  }
}

export async function authSignup(req: Request, res: Response) {
  try {
    const body = (req.body || {}) as {
      email?: string;
      username?: string;
      password?: string;
      confirmPassword?: string;
      role?: string;
      type?: string;
      postcode?: string;
      locationIds?: string[];
    };
    const email = String(body.email ?? '').trim().toLowerCase();
    const username = String(body.username ?? body.email ?? '').trim();
    const password = body.password != null ? String(body.password) : '';
    const confirmPassword = body.confirmPassword != null ? String(body.confirmPassword) : '';
    const roleRaw = String(body.role ?? '').trim().toUpperCase();
    const role = roleRaw === 'PRACTITIONER' ? 'PRACTITIONER' : 'PATIENT';
    const postcodeRaw = String(body.postcode ?? '').trim();
    const postcodeNorm = normalizeUkPostcode(postcodeRaw);
    const locationIds = Array.isArray(body.locationIds)
      ? [...new Set(body.locationIds.map((id) => String(id ?? '').trim()).filter(Boolean))]
      : [];

    if (!email || !password) {
      sendError(res, 400, { error: 'Email and password are required' });
      return;
    }

    if (confirmPassword && confirmPassword !== password) {
      sendError(res, 400, { error: 'Password and confirm password do not match' });
      return;
    }

    if (!postcodeNorm || postcodeNorm.length < 2) {
      sendError(res, 400, { error: 'Please enter a valid postcode' });
      return;
    }

    if (locationIds.length === 0) {
      sendError(res, 400, { error: 'Select at least one clinic location' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      sendError(res, 400, { error: 'Email is already registered' });
      return;
    }

    const locations = await prisma.location.findMany({
      where: { id: { in: locationIds } },
      select: { id: true, postcode: true },
    });
    if (locations.length !== locationIds.length) {
      sendError(res, 400, { error: 'One or more selected clinics are invalid' });
      return;
    }

    for (const loc of locations) {
      if (!locationMatchesPostcodeFilter(postcodeRaw, loc.postcode)) {
        sendError(res, 400, { error: 'Selected clinics do not match the postcode you entered' });
        return;
      }
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: username || email,
        role: role as any,
      },
    });

    if (role === 'PRACTITIONER') {
      const practitioner = await prisma.practitioner.create({
        data: {
          userId: user.id,
          title: 'Dr',
        },
        select: { id: true },
      });
      await prisma.practitionerLocation.createMany({
        data: locationIds.map((locationId) => ({
          practitionerId: practitioner.id,
          locationId,
        })),
        skipDuplicates: true,
      });
    } else {
      await prisma.patient.create({
        data: {
          userId: user.id,
          nhsNumber: await generateDemoNhsNumber(),
          dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
          locationId: locationIds[0],
          postcode: postcodeRaw,
        },
      });
    }

    res.json({ message: 'Account created successfully. You can sign in now.' });
  } catch (e) {
    console.error('authSignup', e);
    sendError(res, 500, { error: 'Sign up failed' });
  }
}

/**
 * Check if email is already used by an existing user (User table).
 * Returns status: true if available, status: false if already taken or invalid.
 * Form should show error when status is false and allow create account when status is true.
 */
export async function checkEmail(req: Request, res: Response) {
  try {
    const body = (req.body || {}) as { email?: string };
    const email = String(body.email ?? '').trim().toLowerCase();
    if (!email) {
      return res.status(200).json({ status: false, message: 'Email is required' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    return res.status(200).json({
      status: !existing,
      message: existing ? 'Email is already taken' : 'Email is available',
    });
  } catch (e) {
    console.error('checkEmail', e);
    return res.status(500).json({ status: false, message: 'Validation failed' });
  }
}

/**
 * Check if username (User.name) is already used by an existing user (User table).
 * Returns status: true if available, status: false if already taken or invalid.
 * Form should show error when status is false and allow create account when status is true.
 */
export async function checkUsername(req: Request, res: Response) {
  try {
    const body = (req.body || {}) as { username?: string };
    const username = String(body.username ?? '').trim();
    if (!username) {
      return res.status(200).json({ status: false, message: 'Username is required' });
    }
    const existing = await prisma.user.findFirst({
      where: { name: username },
    });
    return res.status(200).json({
      status: !existing,
      message: existing ? 'Username is already taken' : 'Username is available',
    });
  } catch (e) {
    console.error('checkUsername', e);
    return res.status(500).json({ status: false, message: 'Validation failed' });
  }
}

export async function authForgotPassword(req: Request, res: Response) {
  try {
    const body = req.body as { email?: string; redirect_url?: string };
    const email = (body.email || '').trim().toLowerCase();
    if (!email) {
      sendError(res, 400, { error: 'Email is required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.json({ message: 'If that email is registered, you will receive a reset link.' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiresAt },
    });

    // In production you would send an email with a link like:
    // ${redirectUrl}?token=${resetToken}
    // For now we just return success; you can add nodemailer later.
    res.json({ message: 'If that email is registered, you will receive a reset link.' });
  } catch (e) {
    console.error('authForgotPassword', e);
    sendError(res, 500, { error: 'Request failed' });
  }
}

export async function authVerifyResetToken(req: Request, res: Response) {
  try {
    const body = req.body as { reset_token?: string };
    const token = (body.reset_token || '').trim();
    if (!token) {
      res.json({ status: false });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiresAt: { gt: new Date() },
      },
    });

    res.json({ status: !!user });
  } catch (e) {
    console.error('authVerifyResetToken', e);
    res.json({ status: false });
  }
}

export async function authResetPassword(req: Request, res: Response) {
  try {
    const body = req.body as { reset_token?: string; password?: string; confirm_password?: string };
    const token = (body.reset_token || '').trim();
    const password = body.password;

    if (!token || !password) {
      sendError(res, 400, { error: 'Token and password are required' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      sendError(res, 400, { error: 'Invalid or expired reset link' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (e) {
    console.error('authResetPassword', e);
    sendError(res, 500, { error: 'Reset failed' });
  }
}

export async function authRefreshToken(req: Request, res: Response) {
  try {
    const body = req.body as { user_id?: string; email?: string };
    const userId = body.user_id;
    const email = (body.email || '').trim().toLowerCase();

    if (!userId || !email) {
      sendError(res, 400, { error: 'user_id and email are required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.email !== email) {
      sendError(res, 401, { error: 'Invalid refresh request' });
      return;
    }

    const newToken = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ newToken });
  } catch (e) {
    console.error('authRefreshToken', e);
    sendError(res, 500, { error: 'Refresh failed' });
  }
}
