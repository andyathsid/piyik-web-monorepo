import { PrismaClient } from '@prisma/client';
import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const prisma = new PrismaClient();
const adminDb = admin.database();

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
      createdAt: admin.database.ServerValue.TIMESTAMP
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