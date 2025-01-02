import { adminDb, adminAuth } from '@/config/firebase-admin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test Prisma
    const prismaTest = await prisma.user.findMany({
      take: 1,
    }).catch(err => {
      console.log('Prisma error:', err);
      return [];
    });

    // Test Firebase RTDB
    const firebaseTest = await adminDb.ref('test').limitToFirst(1).once('value')
      .catch(err => {
        console.log('Firebase error:', err);
        return { val: () => null };
      });

    return Response.json({
      status: 'success',
      prisma: {
        connected: !!prisma,
        users: prismaTest
      },
      firebase: {
        connected: !!adminDb,
        testData: firebaseTest.val()
      }
    });
  } catch (error) {
    return Response.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      details: error
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 