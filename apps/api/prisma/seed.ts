import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed a few Glasgow-area locations. Using fixed IDs so this is idempotent.
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

