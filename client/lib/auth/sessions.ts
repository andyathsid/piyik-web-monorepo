'use server'

import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createSessionCookie(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (!decodedToken) return { success: false, error: "Invalid token." };

    // Create session cookie that lasts 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set cookie in browser
    (await cookies()).set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { success: true, uid: decodedToken.uid };
  } catch (error) {
    console.error('Error creating session:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function signOut(state: { success: boolean; error: string; } | undefined) {
  try {
    const session = (await cookies()).get('session')?.value;
    
    if (session) {
      // Verify and revoke session
      const decodedClaims = await adminAuth.verifySessionCookie(session);
      await adminAuth.revokeRefreshTokens(decodedClaims.sub);
      
      // Delete session cookie
      (await cookies()).delete('session');
      
      return { success: true, error: "" };
    }

  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: 'Failed to sign out' };
  }
}

export async function validateSession() {
  try {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;

    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    return decodedClaims;
  } catch (error) {
    return null;
  }
}