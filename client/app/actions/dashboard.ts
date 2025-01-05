'use server'

import { validateSession } from "@/lib/auth/sessions";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDashboardData() {
  
  try {
    const session = await validateSession();
    if (!session) {
      return { 
        error: "Not authenticated",
        user: {
          id: '',
          name: '',
          email: '',
        },
        success: false 
      };
    }

    const uid = session.uid;
    
    // Get user data from Prisma
    const user = await prisma.user.findUnique({
      where: { id: uid },
    });

    return {
      success: true,
      user: {
        id: uid,
        name: user?.name,
        email: user?.email,
      },
      error: '',
    };
  } catch (error) {
    return { 
      error: "Failed to fetch dashboard data",
      success: false,
      user: {
        id: '',
        name: '',
        email: '',
      },
    };
  } finally {
    await prisma.$disconnect();
  }
}
