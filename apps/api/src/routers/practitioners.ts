import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { TRPCError } from '@trpc/server';
import { UserRole } from '../generated/prisma-client';
import { router, protectedProcedure, adminProcedure } from '../trpc/trpc';

const SALT_ROUNDS = 10;

export const practitionersRouter = router({
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
      const requested = input.locationIds?.length ? input.locationIds : input.locationId ? [input.locationId] : [];

      if (user.role === UserRole.PATIENT) {
        let locIds = requested;
        if (locIds.length === 0 && user.patientId) {
          const p = await ctx.prisma.patient.findUnique({
            where: { id: user.patientId },
            select: { locationId: true },
          });
          if (p?.locationId) locIds = [p.locationId];
        }
        if (locIds.length > 1) {
          where.practitionerLocations = { some: { locationId: { in: locIds } } };
        } else if (locIds.length === 1) {
          where.practitionerLocations = { some: { locationId: locIds[0] } };
        } else {
          where.practitionerLocations = { some: {} };
        }
      } else if (user.role === UserRole.PRACTITIONER && user.practitionerId) {
        const locs = await ctx.prisma.practitionerLocation.findMany({
          where: { practitionerId: user.practitionerId },
          select: { locationId: true },
        });
        const ids = locs.map((l) => l.locationId);
        if (ids.length === 0) {
          where.id = user.practitionerId;
        } else {
          const filterIds = requested.filter((f) => ids.includes(f));
          if (filterIds.length > 1) {
            where.practitionerLocations = { some: { locationId: { in: filterIds } } };
          } else if (filterIds.length === 1) {
            where.practitionerLocations = { some: { locationId: filterIds[0] } };
          } else {
            where.OR = [
              { id: user.practitionerId },
              { practitionerLocations: { some: { locationId: { in: ids } } } },
            ];
          }
        }
      } else if (user.role === UserRole.ADMIN) {
        if (requested.length > 1) {
          where.practitionerLocations = { some: { locationId: { in: requested } } };
        } else if (requested.length === 1) {
          where.practitionerLocations = { some: { locationId: requested[0] } };
        }
      }

      const plWhere =
        requested.length > 1
          ? { where: { locationId: { in: requested } } }
          : requested.length === 1
            ? { where: { locationId: requested[0] } }
            : {};

      const items = await ctx.prisma.practitioner.findMany({
        take: input.limit + 1,
        cursor: input.cursor != null && input.cursor !== '' ? { id: input.cursor } : undefined,
        where,
        include: {
          user: { select: { id: true, email: true, name: true } },
          practitionerLocations: {
            ...plWhere,
            include: { location: { select: { id: true, name: true } } },
          },
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
    return ctx.prisma.practitioner.findUnique({
      where: { id: input.id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        slots: { include: { location: true } },
        practitionerLocations: { include: { location: { select: { id: true, name: true } } } },
      },
    });
  }),

  /** Admin: create clinician login + practitioner + link to locations. */
  adminRegister: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
        title: z.string().optional(),
        speciality: z.string().optional(),
        gmcNumber: z.string().optional().nullable(),
        locationIds: z.array(z.string()).min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase();
      const existing = await ctx.prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Email is already registered' });
      }
      if (input.gmcNumber) {
        const gmcTaken = await ctx.prisma.practitioner.findFirst({
          where: { gmcNumber: input.gmcNumber },
          select: { id: true },
        });
        if (gmcTaken) {
          throw new TRPCError({ code: 'CONFLICT', message: 'GMC number already in use' });
        }
      }

      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

      const user = await ctx.prisma.user.create({
        data: {
          email,
          passwordHash,
          name: input.name,
          role: UserRole.PRACTITIONER,
        },
      });

      const practitioner = await ctx.prisma.practitioner.create({
        data: {
          userId: user.id,
          title: input.title ?? null,
          speciality: input.speciality ?? null,
          gmcNumber: input.gmcNumber ?? null,
          practitionerLocations: {
            create: input.locationIds.map((locationId) => ({ locationId })),
          },
        },
        include: {
          user: { select: { id: true, email: true, name: true } },
          practitionerLocations: { include: { location: true } },
        },
      });

      return practitioner;
    }),
});
