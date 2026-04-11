import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

/** Days ahead to materialise bookable slots from availability windows */
const SLOT_GENERATION_DAYS = 90;

type PractitionerSeed = {
  email: string;
  name: string;
  title: string | null;
  gmcNumber: string | null;
  speciality: string | null;
};

const practitionerSeeds: PractitionerSeed[] = [
  {
    email: 'sarah.mitchell@nhs-demo.local',
    name: 'Dr Sarah Mitchell',
    title: 'Dr',
    gmcNumber: '6147892',
    speciality: 'General Practice',
  },
  {
    email: 'james.chen@nhs-demo.local',
    name: 'Dr James Chen',
    title: 'Dr',
    gmcNumber: '7284519',
    speciality: 'General Practice',
  },
  {
    email: 'emma.wilson@nhs-demo.local',
    name: 'Emma Wilson',
    title: 'Nurse',
    gmcNumber: null,
    speciality: 'Practice Nursing',
  },
  {
    email: 'olivia.macleod@nhs-demo.local',
    name: 'Dr Olivia MacLeod',
    title: 'Dr',
    gmcNumber: '5839201',
    speciality: 'Cardiology',
  },
  {
    email: 'david.okonkwo@nhs-demo.local',
    name: 'Dr David Okonkwo',
    title: 'Dr',
    gmcNumber: '6912345',
    speciality: 'Mental Health',
  },
];

// Seed availability for every practitioner x every location currently in the DB.
// Weekdays: Mon–Fri, morning + afternoon windows.
const WEEKDAY_ISO_DAYS = [1, 2, 3, 4, 5] as const;
const DEFAULT_SLOT_DURATION_MIN = 30;
const WINDOW_MORNING = { startMin: 9 * 60, endMin: 12 * 60 };
const WINDOW_AFTERNOON = { startMin: 13 * 60, endMin: 17 * 60 };

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

/** ISO weekday: Monday = 1 … Sunday = 7 */
function isoDayOfWeek(d: Date): number {
  const js = d.getDay();
  return js === 0 ? 7 : js;
}

async function main() {
  const locations = [
    {
      id: 'loc-glasgow-central',
      name: 'Glasgow Central Health Centre',
      address: '123 Sauchiehall Street, Glasgow',
      postcode: 'G2 3EX',
    },
    {
      id: 'loc-glasgow-west-end',
      name: 'Glasgow West End Clinic',
      address: '45 Byres Road, Glasgow',
      postcode: 'G11 5RG',
    },
    {
      id: 'loc-glasgow-southside',
      name: 'Glasgow Southside Medical Practice',
      address: '210 Pollokshaws Road, Glasgow',
      postcode: 'G41 1PG',
    },
    {
      id: 'loc-glasgow-city-gp',
      name: 'Glasgow City GP Hub',
      address: '10 George Square, Glasgow',
      postcode: 'G2 1DY',
    },
  ];

  for (const loc of locations) {
    await prisma.location.upsert({
      where: { id: loc.id },
      update: {
        name: loc.name,
        address: loc.address,
        postcode: loc.postcode,
      },
      create: loc,
    });
  }

  const practitionerPasswordHash = await bcrypt.hash('SeedPractitioner!', SALT_ROUNDS);

  for (const p of practitionerSeeds) {
    const user = await prisma.user.upsert({
      where: { email: p.email },
      update: {
        name: p.name,
        role: UserRole.PRACTITIONER,
      },
      create: {
        email: p.email,
        passwordHash: practitionerPasswordHash,
        name: p.name,
        role: UserRole.PRACTITIONER,
      },
    });

    await prisma.practitioner.upsert({
      where: { userId: user.id },
      update: {
        title: p.title,
        gmcNumber: p.gmcNumber,
        speciality: p.speciality,
      },
      create: {
        userId: user.id,
        title: p.title,
        gmcNumber: p.gmcNumber,
        speciality: p.speciality,
      },
    });
  }

  // Create availability windows for every practitioner x every location currently in the DB.
  // This guarantees each doctor has selectable time slots at each location right now.
  await prisma.practitionerAvailabilityWindow.deleteMany();

  const [allPractitioners, allLocations] = await Promise.all([
    prisma.practitioner.findMany({ select: { id: true } }),
    prisma.location.findMany({ select: { id: true } }),
  ]);

  const windowRows: {
    practitionerId: string;
    locationId: string;
    dayOfWeek: number;
    windowStartMin: number;
    windowEndMin: number;
    slotDurationMin: number;
  }[] = [];

  for (const pr of allPractitioners) {
    for (const loc of allLocations) {
      for (const dayOfWeek of WEEKDAY_ISO_DAYS) {
        windowRows.push({
          practitionerId: pr.id,
          locationId: loc.id,
          dayOfWeek,
          windowStartMin: WINDOW_MORNING.startMin,
          windowEndMin: WINDOW_MORNING.endMin,
          slotDurationMin: DEFAULT_SLOT_DURATION_MIN,
        });
        windowRows.push({
          practitionerId: pr.id,
          locationId: loc.id,
          dayOfWeek,
          windowStartMin: WINDOW_AFTERNOON.startMin,
          windowEndMin: WINDOW_AFTERNOON.endMin,
          slotDurationMin: DEFAULT_SLOT_DURATION_MIN,
        });
      }
    }
  }

  if (windowRows.length > 0) {
    await prisma.practitionerAvailabilityWindow.createMany({
      data: windowRows,
    });
  }

  const seededPractitionerIds = allPractitioners.map((p) => p.id);
  const todayStart = startOfDay(new Date());

  const freeFutureSlots = await prisma.slot.findMany({
    where: {
      practitionerId: { in: seededPractitionerIds },
      startAt: { gte: todayStart },
    },
    select: { id: true, appointment: { select: { id: true } } },
  });
  const slotIdsToRemove = freeFutureSlots.filter((s) => !s.appointment).map((s) => s.id);
  if (slotIdsToRemove.length > 0) {
    await prisma.slot.deleteMany({ where: { id: { in: slotIdsToRemove } } });
  }

  const windows = await prisma.practitionerAvailabilityWindow.findMany({
    where: { practitionerId: { in: seededPractitionerIds } },
  });

  const slotRows: { practitionerId: string; locationId: string; startAt: Date; endAt: Date }[] = [];

  for (let offset = 0; offset < SLOT_GENERATION_DAYS; offset += 1) {
    const day = startOfDay(addDays(new Date(), offset));
    const dow = isoDayOfWeek(day);

    for (const w of windows) {
      if (w.dayOfWeek !== dow) continue;

      for (
        let cursor = w.windowStartMin;
        cursor + w.slotDurationMin <= w.windowEndMin;
        cursor += w.slotDurationMin
      ) {
        const startAt = new Date(day);
        startAt.setHours(Math.floor(cursor / 60), cursor % 60, 0, 0);
        const endAt = new Date(startAt.getTime() + w.slotDurationMin * 60_000);
        slotRows.push({
          practitionerId: w.practitionerId,
          locationId: w.locationId,
          startAt,
          endAt,
        });
      }
    }
  }

  if (slotRows.length > 0) {
    await prisma.slot.createMany({
      data: slotRows,
      skipDuplicates: true,
    });
  }

  console.log(
    `Seeded ${windows.length} availability window(s) and ${slotRows.length} slot row(s) (createMany skipDuplicates).`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
