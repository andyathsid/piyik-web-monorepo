import { PrismaClient } from '@prisma/client';
import { adminDb } from '@/lib/firebase/admin';

const prisma = new PrismaClient();

async function main() {
  try {
    // Prisma seed
    const user = await prisma.user.upsert({
      where: {
        email: 'test@example.com',
      },
      update: {
        name: 'Test User',
      },
      create: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });
    console.log('Upserted test user:', user);

    // Firebase RTDB seed
    await adminDb.ref('test').set({
      message: 'Test data',
      createdAt: adminDb.ServerValue.TIMESTAMP
    });
    console.log('Created test Firebase RTDB data');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main(); 