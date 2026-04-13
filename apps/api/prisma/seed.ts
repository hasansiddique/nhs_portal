import 'dotenv/config';
import { PrismaClient, UserRole } from '../src/generated/prisma-client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

/** Days ahead to materialise bookable slots from availability windows */
const SLOT_GENERATION_DAYS = 90;

/** Postgres rejects `IN (...)` with more than ~32k bind variables. */
const DELETE_SLOT_IDS_CHUNK = 8000;

async function deleteSlotsByIdsInChunks(ids: string[]) {
  for (let i = 0; i < ids.length; i += DELETE_SLOT_IDS_CHUNK) {
    const chunk = ids.slice(i, i + DELETE_SLOT_IDS_CHUNK);
    await prisma.slot.deleteMany({ where: { id: { in: chunk } } });
  }
}

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
  {
    email: 'alex.bain@nhs-demo.local',
    name: 'Dr Alex Bain',
    title: 'Dr',
    gmcNumber: '7021144',
    speciality: 'General Practice',
  },
  {
    email: 'nina.khan@nhs-demo.local',
    name: 'Dr Nina Khan',
    title: 'Dr',
    gmcNumber: '7122255',
    speciality: 'General Practice',
  },
  {
    email: 'marcus.webb@nhs-demo.local',
    name: 'Nurse Marcus Webb',
    title: 'Nurse',
    gmcNumber: null,
    speciality: 'Practice Nursing',
  },
  {
    email: 'laura.murray@nhs-demo.local',
    name: 'Dr Laura Murray',
    title: 'Dr',
    gmcNumber: '7233366',
    speciality: 'General Practice',
  },
  {
    email: 'ryan.patel@nhs-demo.local',
    name: 'Dr Ryan Patel',
    title: 'Dr',
    gmcNumber: '7344477',
    speciality: 'Paediatrics',
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

const PATIENTS_PER_LOCATION = 10;
const DOCTORS_PER_LOCATION = 10;

async function seedDirectoryPerLocation(prisma: PrismaClient, patientPasswordHash: string) {
  const locations = await prisma.location.findMany({ select: { id: true, name: true } });
  const practitioners = await prisma.practitioner.findMany({
    orderBy: { createdAt: 'asc' },
    take: DOCTORS_PER_LOCATION,
    select: { id: true },
  });

  if (practitioners.length < DOCTORS_PER_LOCATION) {
    console.warn(
      `Expected at least ${DOCTORS_PER_LOCATION} practitioners for directory seed; found ${practitioners.length}.`
    );
  }

  await prisma.practitionerLocation.deleteMany({});

  const plRows: { practitionerId: string; locationId: string }[] = [];
  for (const loc of locations) {
    for (const pr of practitioners) {
      plRows.push({ practitionerId: pr.id, locationId: loc.id });
    }
  }
  if (plRows.length > 0) {
    await prisma.practitionerLocation.createMany({
      data: plRows,
      skipDuplicates: true,
    });
  }

  await prisma.user.deleteMany({
    where: { email: { startsWith: 'seed.patient.loc-' } },
  });

  let nhsSeq = 900_000_000;
  for (const loc of locations) {
    for (let i = 1; i <= PATIENTS_PER_LOCATION; i += 1) {
      nhsSeq += 1;
      const email = `seed.patient.loc-${loc.id}.${i}@nhs-demo.local`;
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: patientPasswordHash,
          name: `Demo Patient (${loc.name.split(' ')[0] ?? 'Clinic'} ${i})`,
          role: UserRole.PATIENT,
        },
      });
      await prisma.patient.create({
        data: {
          userId: user.id,
          nhsNumber: String(nhsSeq).slice(0, 10),
          dateOfBirth: new Date(1990 + (i % 20), (i % 12) + 1, (i % 27) + 1),
          locationId: loc.id,
        },
      });
    }
  }
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
  const patientPasswordHash = await bcrypt.hash('SeedPatient!', SALT_ROUNDS);

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
    await deleteSlotsByIdsInChunks(slotIdsToRemove);
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

  await seedDirectoryPerLocation(prisma, patientPasswordHash);

  const DEMO_PASSWORD = 'Demo2026!';
  const demoPasswordHash = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email: 'admin@nhs-demo.local' },
    update: { passwordHash: demoPasswordHash, name: 'Demo Admin', role: UserRole.ADMIN },
    create: {
      email: 'admin@nhs-demo.local',
      passwordHash: demoPasswordHash,
      name: 'Demo Admin',
      role: UserRole.ADMIN,
    },
  });

  const demoHomeLocationId = 'loc-glasgow-central';
  const demoPatientUser = await prisma.user.upsert({
    where: { email: 'patient@nhs-demo.local' },
    update: { passwordHash: demoPasswordHash, name: 'Demo Patient', role: UserRole.PATIENT },
    create: {
      email: 'patient@nhs-demo.local',
      passwordHash: demoPasswordHash,
      name: 'Demo Patient',
      role: UserRole.PATIENT,
    },
  });

  await prisma.patient.upsert({
    where: { userId: demoPatientUser.id },
    update: { locationId: demoHomeLocationId },
    create: {
      userId: demoPatientUser.id,
      nhsNumber: '9990001111',
      dateOfBirth: new Date('1985-05-15T00:00:00.000Z'),
      locationId: demoHomeLocationId,
    },
  });

  await prisma.user.updateMany({
    where: { email: 'sarah.mitchell@nhs-demo.local' },
    data: { passwordHash: demoPasswordHash },
  });

  console.log(
    `Seeded ${windows.length} availability window(s), ${slotRows.length} slot row(s), practitioner–location links, and ${PATIENTS_PER_LOCATION} patients per location. Demo logins (password ${DEMO_PASSWORD}): admin@nhs-demo.local, patient@nhs-demo.local, sarah.mitchell@nhs-demo.local (doctor).`
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
