import 'dotenv/config';
import { PrismaClient, UserRole } from '../src/generated/prisma-client';
import bcrypt from 'bcryptjs';
import { loadSubIcbLocationsFromDataset, nhsEnglandRegionsFromLocations, type SubIcbLocationSeed } from './load-gp-regional-dataset';

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
  /** NHS England region from GP regional dataset — clinician is linked only to Sub-ICB sites in this area. */
  regionName: string;
};

/**
 * Four clinicians in the North West (including the demo GP) and three per other NHS England region.
 * Regions and Sub-ICB sites come from GP appointments regional open data (Dec 2025 CSVs).
 */
function buildPractitionerSeedsFixed(regions: string[]): PractitionerSeed[] {
  const slug = (r: string) =>
    r
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const triples: Record<string, [string, string | null, string | null, string | null][]> = {
    'North West': [
      ['Dr James Atherton', 'Dr', '7284510', 'General Practice'],
      ['Nurse Claire Hoyle', 'Nurse', null, 'Practice Nursing'],
      ['Dr Zainab Rehman', 'Dr', '7284511', 'Paediatrics'],
    ],
    London: [
      ['Dr David Mensah', 'Dr', '7284520', 'General Practice'],
      ['Dr Amara Okafor', 'Dr', '7284521', 'General Practice'],
      ['Nurse Priya Shah', 'Nurse', null, 'Practice Nursing'],
    ],
    Midlands: [
      ['Dr Laura Bennett', 'Dr', '7284530', 'General Practice'],
      ['Dr Sanjay Kapoor', 'Dr', '7284531', 'Cardiology'],
      ['Nurse Emma Bridges', 'Nurse', null, 'Practice Nursing'],
    ],
    'North East and Yorkshire': [
      ['Dr Rachel Hughes', 'Dr', '7284540', 'General Practice'],
      ['Dr Mohammed Farouk', 'Dr', '7284541', 'Mental Health'],
      ['Nurse Tom Sinclair', 'Nurse', null, 'Practice Nursing'],
    ],
    'South East': [
      ['Dr Olivia Grant', 'Dr', '7284550', 'General Practice'],
      ['Dr Henry Wells', 'Dr', '7284551', 'General Practice'],
      ['Nurse Sophie Lane', 'Nurse', null, 'Practice Nursing'],
    ],
    'South West': [
      ['Dr Charlotte Pike', 'Dr', '7284560', 'General Practice'],
      ['Dr Ben Carter', 'Dr', '7284561', 'Paediatrics'],
      ['Nurse Jess Morley', 'Nurse', null, 'Practice Nursing'],
    ],
    'East of England': [
      ['Dr Nina Foster', 'Dr', '7284570', 'General Practice'],
      ['Dr Alex Dimitriou', 'Dr', '7284571', 'General Practice'],
      ['Nurse Mia Roberts', 'Nurse', null, 'Practice Nursing'],
    ],
  };

  const roster: PractitionerSeed[] = [
    {
      email: 'sarah.mitchell@nhs-demo.local',
      name: 'Dr Sarah Mitchell',
      title: 'Dr',
      gmcNumber: '6147892',
      speciality: 'General Practice',
      regionName: 'North West',
    },
  ];

  for (const region of regions) {
    const rows = triples[region];
    if (!rows) {
      console.warn(`No clinician roster defined for region "${region}" — extend triples in seed.ts.`);
      continue;
    }
    let n = 0;
    for (const [name, title, gmc, speciality] of rows) {
      n += 1;
      roster.push({
        email: `seed.clinician.${slug(region)}.${n}@nhs-demo.local`,
        name,
        title,
        gmcNumber: gmc,
        speciality: speciality,
        regionName: region,
      });
    }
  }

  return roster;
}

// Seed availability for every practitioner x each Sub-ICB location they cover (same region).
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

/** Fewer synthetic patients when many Sub-ICB sites are seeded from open data. */
function patientsPerLocationCount(locationCount: number): number {
  if (locationCount <= 8) return 10;
  if (locationCount <= 30) return 5;
  return 2;
}

function hashStringForPostcode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Demo postcodes per Sub-ICB site so registration can filter clinics by outward / prefix.
 * (Open-data extract does not include per-site postcodes.)
 */
function demoPostcodeForSubIcbLocation(loc: SubIcbLocationSeed): string {
  const regionOutward: Record<string, string> = {
    'North West': 'M',
    London: 'SW',
    Midlands: 'B',
    'North East and Yorkshire': 'LS',
    'South East': 'GU',
    'South West': 'EX',
    'East of England': 'IP',
  };
  const outwardBase = regionOutward[loc.regionName] ?? 'CB';
  const h = hashStringForPostcode(loc.code);
  const mid = (h % 9) + 1;
  const inner = String((h % 89) + 10);
  return `${outwardBase}${mid} ${inner}AA`;
}

/** Former seed clinicians removed when roster was aligned to NHS regions. */
const LEGACY_PRACTITIONER_EMAILS = [
  'james.chen@nhs-demo.local',
  'emma.wilson@nhs-demo.local',
  'olivia.macleod@nhs-demo.local',
  'david.okonkwo@nhs-demo.local',
  'alex.bain@nhs-demo.local',
  'nina.khan@nhs-demo.local',
  'marcus.webb@nhs-demo.local',
  'laura.murray@nhs-demo.local',
  'ryan.patel@nhs-demo.local',
] as const;

/**
 * Drops locations not present in the new seed. Call only after all `keepIds` rows exist in the DB
 * (e.g. after upserting), so patient repoints satisfy `Patient_location_id_fkey`.
 */
async function removeLocationsNotInSeed(
  prisma: PrismaClient,
  keepIds: Set<string>,
  fallbackLocationId: string
) {
  if (!keepIds.has(fallbackLocationId)) {
    throw new Error(`removeLocationsNotInSeed: fallback ${fallbackLocationId} is not in keepIds`);
  }

  const existing = await prisma.location.findMany({ select: { id: true } });
  const obsolete = existing.map((e) => e.id).filter((id) => !keepIds.has(id));
  if (obsolete.length === 0) return;

  await prisma.patient.updateMany({
    where: { locationId: { in: obsolete } },
    data: { locationId: fallbackLocationId },
  });

  const slotsAtObsolete = await prisma.slot.findMany({
    where: { locationId: { in: obsolete } },
    select: { id: true },
  });
  const slotIds = slotsAtObsolete.map((s) => s.id);
  if (slotIds.length > 0) {
    await prisma.appointment.deleteMany({ where: { slotId: { in: slotIds } } });
    await prisma.slot.deleteMany({ where: { id: { in: slotIds } } });
  }

  await prisma.practitionerAvailabilityWindow.deleteMany({
    where: { locationId: { in: obsolete } },
  });
  await prisma.practitionerLocation.deleteMany({
    where: { locationId: { in: obsolete } },
  });
  await prisma.location.deleteMany({ where: { id: { in: obsolete } } });
}

async function seedPatientsPerLocation(
  prisma: PrismaClient,
  patientPasswordHash: string,
  locations: SubIcbLocationSeed[],
  patientsPerLocation: number
) {
  await prisma.user.deleteMany({
    where: { email: { startsWith: 'seed.patient.loc-' } },
  });

  let nhsSeq = 900_000_000;
  for (const loc of locations) {
    for (let i = 1; i <= patientsPerLocation; i += 1) {
      nhsSeq += 1;
      const short = loc.code.replace(/[^a-zA-Z0-9]/g, '') || 'clinic';
      const email = `seed.patient.loc-${short}.${i}@nhs-demo.local`;
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: patientPasswordHash,
          name: `Demo patient (${loc.code} · ${i})`,
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

async function linkPractitionersToLocationsByRegion(
  prisma: PrismaClient,
  locationSeeds: SubIcbLocationSeed[],
  practitionerSeeds: PractitionerSeed[]
) {
  const practitioners = await prisma.practitioner.findMany({
    include: { user: { select: { email: true } } },
  });
  const emailToPractitionerId = new Map(practitioners.map((p) => [p.user.email, p.id] as const));

  await prisma.practitionerLocation.deleteMany({});

  const rows: { practitionerId: string; locationId: string }[] = [];

  for (const ps of practitionerSeeds) {
    const pid = emailToPractitionerId.get(ps.email);
    if (!pid) {
      console.warn(`Practitioner user missing for ${ps.email}, skipping location links.`);
      continue;
    }
    for (const loc of locationSeeds) {
      if (loc.regionName !== ps.regionName) continue;
      rows.push({ practitionerId: pid, locationId: loc.id });
    }
  }

  if (rows.length > 0) {
    await prisma.practitionerLocation.createMany({
      data: rows,
      skipDuplicates: true,
    });
  }

  return rows.length;
}

async function main() {
  const locationSeeds = loadSubIcbLocationsFromDataset();
  const regions = nhsEnglandRegionsFromLocations(locationSeeds);
  const practitionerSeeds = buildPractitionerSeedsFixed(regions);
  const patientsPerLocation = patientsPerLocationCount(locationSeeds.length);
  const keepLocationIds = new Set(locationSeeds.map((l) => l.id));

  for (const email of LEGACY_PRACTITIONER_EMAILS) {
    await prisma.user.deleteMany({ where: { email } });
  }

  for (const loc of locationSeeds) {
    const postcode = demoPostcodeForSubIcbLocation(loc);
    await prisma.location.upsert({
      where: { id: loc.id },
      update: {
        name: loc.name,
        address: loc.address,
        postcode,
      },
      create: {
        id: loc.id,
        name: loc.name,
        address: loc.address,
        postcode,
      },
    });
  }

  const fallbackLocationId = locationSeeds[0]?.id;
  if (!fallbackLocationId) {
    throw new Error('No locations in dataset — cannot seed.');
  }
  await removeLocationsNotInSeed(prisma, keepLocationIds, fallbackLocationId);

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

  const plCount = await linkPractitionersToLocationsByRegion(prisma, locationSeeds, practitionerSeeds);

  // Create availability windows for every practitioner x each linked location.
  await prisma.practitionerAvailabilityWindow.deleteMany({});

  const plRows = await prisma.practitionerLocation.findMany({
    select: { practitionerId: true, locationId: true },
  });

  const windowRows: {
    practitionerId: string;
    locationId: string;
    dayOfWeek: number;
    windowStartMin: number;
    windowEndMin: number;
    slotDurationMin: number;
  }[] = [];

  for (const pl of plRows) {
    for (const dayOfWeek of WEEKDAY_ISO_DAYS) {
      windowRows.push({
        practitionerId: pl.practitionerId,
        locationId: pl.locationId,
        dayOfWeek,
        windowStartMin: WINDOW_MORNING.startMin,
        windowEndMin: WINDOW_MORNING.endMin,
        slotDurationMin: DEFAULT_SLOT_DURATION_MIN,
      });
      windowRows.push({
        practitionerId: pl.practitionerId,
        locationId: pl.locationId,
        dayOfWeek,
        windowStartMin: WINDOW_AFTERNOON.startMin,
        windowEndMin: WINDOW_AFTERNOON.endMin,
        slotDurationMin: DEFAULT_SLOT_DURATION_MIN,
      });
    }
  }

  if (windowRows.length > 0) {
    await prisma.practitionerAvailabilityWindow.createMany({
      data: windowRows,
    });
  }

  const seededPractitionerIds = [...new Set(plRows.map((p) => p.practitionerId))];
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

  await seedPatientsPerLocation(prisma, patientPasswordHash, locationSeeds, patientsPerLocation);

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

  const demoHomeLocationId =
    locationSeeds.find((l) => l.regionName === 'North West')?.id ?? locationSeeds[0]?.id;
  if (!demoHomeLocationId) {
    throw new Error('No locations loaded — cannot seed demo patient.');
  }

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
    [
      `Seeded ${locationSeeds.length} Sub-ICB locations from datasets/datasets/gp-appointments-regional-dec2025/ (${regions.length} NHS England regions).`,
      `${practitionerSeeds.length} clinicians linked by region (${plCount} practitioner–location rows).`,
      `${windowRows.length} availability window(s), ${slotRows.length} slot row(s).`,
      `${patientsPerLocation} synthetic patient(s) per location (password SeedPatient!).`,
      `Demo logins (password ${DEMO_PASSWORD}): admin@nhs-demo.local, patient@nhs-demo.local, sarah.mitchell@nhs-demo.local (North West GP).`,
    ].join(' ')
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
