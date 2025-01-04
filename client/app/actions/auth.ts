'use server'

import { RegisterFormSchema } from "@/lib/auth/rules";
import { auth } from "@/lib/firebase/client";
import { createSessionCookie } from "@/lib/auth/sessions";
import { redirect } from "next/navigation";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function Register(
  state: { errors: { name?: string[]; email?: string[]; password?: string[]; confirmPassword?: string[]; terms?: string[]; }; email: string; name: string; generalError: string; } | undefined,
  formData: FormData
) {
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    terms: formData.get("terms") === "on",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      generalError: "Registration failed. Please try again later."
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Create session token
    const idToken = await userCredential.user.getIdToken();
    if (!idToken) {
      throw new Error("Failed to get ID token");
    }

    // Create Prisma user record
    await prisma.user.create({
      data: {
        id: userCredential.user.uid,
        email: email,
        name: name,
      },
    });

    // Create session cookie
    const { success, error } = await createSessionCookie(idToken);
    if (!success) {
      throw new Error(error);
    }

    

  } catch (error: any) {
    console.error('Registration error:', error);

    // Clean up if Prisma user was created but session failed
    if (error.message === "Failed to create session" && error?.uid) {
      await prisma.user.delete({
        where: { id: error.uid }
      }).catch(console.error);
    }

    if (error.code === 'auth/email-already-in-use') {
      return {
        errors: {
          email: ["This email is already registered. Please try logging in."]
        },
        email,
        name,
        generalError: ""
      };
    }

    return {
      errors: {},
      email: email || '',
      name: name || '',
      generalError: "Registration failed. Please try again later."
    };
  } finally {
    await prisma.$disconnect();
  }

  redirect('/dashboard')
}