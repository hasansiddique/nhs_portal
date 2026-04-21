import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { TRPCError } from '@trpc/server';
import { UserRole } from '../generated/prisma-client';
import { router, protectedProcedure, adminProcedure } from '../trpc/trpc';
const SALT_ROUNDS = 10;

export const patientsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullable().optional(),
        limit: z.number().min(1).max(500).default(50),
        locationId: z.string().optional(),
        locationIds: z.array(z.string()).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user!;
      const where: Record<string, unknown> = {};

      if (user.role === UserRole.PATIENT) {
        where.userId = user.id;
      } else if (user.role === UserRole.PRACTITIONER && user.practitionerId) {
        const locs = await ctx.prisma.practitionerLocation.findMany({
          where: { practitionerId: user.practitionerId },
          select: { locationId: true },
        });
        const ids = locs.map((l) => l.locationId);
        if (ids.length === 0) {
          return { items: [], nextCursor: undefined };
        }
        where.OR = [{ locationId: { in: ids } }, { locationId: null }];
        const requested = input.locationIds?.length ? input.locationIds : input.locationId ? [input.locationId] : [];
        const filterIds = requested.filter((f) => ids.includes(f));
        if (filterIds.length === 1) {
          where.locationId = filterIds[0];
        } else if (filterIds.length > 1) {
          where.locationId = { in: filterIds };
        }
      } else if (user.role === UserRole.ADMIN) {
        const filterIds = input.locationIds?.length ? input.locationIds : input.locationId ? [input.locationId] : [];
        if (filterIds.length === 1) {
          where.locationId = filterIds[0];
        } else if (filterIds.length > 1) {
          where.locationId = { in: filterIds };
        }
      } else {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Invalid role' });
      }

      const items = await ctx.prisma.patient.findMany({
        take: input.limit + 1,
        cursor: input.cursor != null && input.cursor !== '' ? { id: input.cursor } : undefined,
        where,
        include: {
          user: { select: { id: true, email: true, name: true, phone: true } },
          location: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      let nextCursor: string | undefined;
      if (items.length > input.limit) {
        const next = items.pop();
        nextCursor = next?.id;
      }
      return { items, nextCursor };
    }),

  byId: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const user = ctx.user!;
    const row = await ctx.prisma.patient.findUnique({
      where: { id: input.id },
      include: {
        user: { select: { id: true, email: true, name: true, phone: true } },
        appointments: {
          include: {
            slot: true,
            practitioner: { include: { user: { select: { name: true, email: true } } } },
          },
          orderBy: { createdAt: 'desc' },
        },
        location: { select: { id: true, name: true } },
      },
    });
    if (!row) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Patient not found' });
    }

    if (user.role === UserRole.PATIENT && row.userId !== user.id) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'You cannot view this patient record' });
    }

    if (user.role === UserRole.PRACTITIONER && user.practitionerId) {
      if (!row.locationId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You cannot view this patient record' });
      }
      const ok = await ctx.prisma.practitionerLocation.findFirst({
        where: { practitionerId: user.practitionerId, locationId: row.locationId },
      });
      if (!ok) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'You cannot view this patient record' });
      }
    }

    return row;
  }),

  /** Admin: create login + patient profile in one step. */
  adminRegister: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
        nhsNumber: z.string().min(3),
        dateOfBirth: z.coerce.date(),
        locationId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase();
      const existing = await ctx.prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Email is already registered' });
      }
      const dupNhs = await ctx.prisma.patient.findUnique({ where: { nhsNumber: input.nhsNumber } });
      if (dupNhs) {
        throw new TRPCError({ code: 'CONFLICT', message: 'NHS number already in use' });
      }

      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

      const user = await ctx.prisma.user.create({
        data: {
          email,
          passwordHash,
          name: input.name,
          role: UserRole.PATIENT,
        },
      });

      const patient = await ctx.prisma.patient.create({
        data: {
          userId: user.id,
          nhsNumber: input.nhsNumber,
          dateOfBirth: input.dateOfBirth,
          ...(input.locationId ? { locationId: input.locationId } : {}),
        },
        include: {
          user: { select: { id: true, email: true, name: true } },
          location: { select: { id: true, name: true } },
        },
      });

      return patient;
    }),

  /** Legacy create (user must already exist). Admin only. */
  create: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        nhsNumber: z.string(),
        dateOfBirth: z.coerce.date(),
        addressLine1: z.string().optional(),
        addressLine2: z.string().optional(),
        postcode: z.string().optional(),
        gpSurgeryName: z.string().optional(),
        gpSurgeryCode: z.string().optional(),
        locationId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.patient.create({
        data: {
          userId: input.userId,
          nhsNumber: input.nhsNumber,
          dateOfBirth: input.dateOfBirth,
          addressLine1: input.addressLine1,
          addressLine2: input.addressLine2,
          postcode: input.postcode,
          gpSurgeryName: input.gpSurgeryName,
          gpSurgeryCode: input.gpSurgeryCode,
          ...(input.locationId ? { locationId: input.locationId } : {}),
        },
      });
    }),
});
