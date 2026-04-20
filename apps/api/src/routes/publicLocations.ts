import { Request, Response } from 'express';

import { locationMatchesPostcodeFilter, normalizeUkPostcode } from '../lib/postcode';
import { prisma } from '../lib/prisma';

function sendError(res: Response, status: number, messages: Record<string, string> | string[]) {
  res.status(status).json({ messages });
}

/**
 * Public lookup for registration: list clinic locations that match the given postcode
 * (prefix / outward matching against Location.postcode).
 */
export async function publicLocationsByPostcode(req: Request, res: Response) {
  try {
    const body = (req.body || {}) as { postcode?: string };
    const raw = String(body.postcode ?? '').trim();
    const norm = normalizeUkPostcode(raw);
    if (norm.length < 2) {
      return res.json({ locations: [] as { id: string; name: string; address: string | null; postcode: string | null }[] });
    }

    const all = await prisma.location.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, address: true, postcode: true },
    });

    const matches = all.filter((l) => locationMatchesPostcodeFilter(raw, l.postcode)).slice(0, 80);

    return res.json({ locations: matches });
  } catch (e) {
    console.error('publicLocationsByPostcode', e);
    sendError(res, 500, { error: 'Lookup failed' });
  }
}
