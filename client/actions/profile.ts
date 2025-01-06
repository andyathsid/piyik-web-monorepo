'use server'

import { PrismaClient } from '@prisma/client';
import { auth } from "@/lib/firebase/client";
import { sendPasswordResetEmail } from "firebase/auth";
import { z } from "zod";

const prisma = new PrismaClient();

const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function updateProfile(
  state: { 
    success: boolean; 
    error: string; 
    name: string;
  } | undefined,
  formData: FormData
) {
  const validatedFields = UpdateProfileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors.name?.[0] || "Invalid input",
      name: formData.get("name") as string,
    };
  }

  const { name } = validatedFields.data;
  const uid = formData.get("uid") as string;

  try {
    // Update Prisma
    await prisma.user.update({
      where: { id: uid },
      data: { name },
    });

    return {
      success: true,
      error: "",
      name,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: "Failed to update profile: " + error,
      name,
    };
  }
}

export async function sendPasswordReset(
  state: { 
    success: boolean; 
    error: string; 
  } | undefined,
  formData: FormData
) {
  const email = formData.get("email") as string;
  console.log("Email:", email);

  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      error: "",
    };
  } catch (error: any) {
    console.log("Error sending password reset email:", error);
    return {
      success: false,
      error: "Failed to send password reset email: " + error.message,
    };
  }
} 