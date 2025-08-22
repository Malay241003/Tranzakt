"use server"

import db from "@repo/db/client";
import bcrypt from "bcrypt";
import { z } from 'zod'; // Import Zod

interface SignupResponse {
    success: boolean;
    error?: string;
}

// Define the Zod schema for signup input
const SignupInputSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    phone: z.string()
             .length(10, "Phone number must be 10 digits")
             .regex(/^\d+$/, "Phone number must contain only digits"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function signupAndSignIn(
  name: string,
  phone: string,
  password: string
): Promise<SignupResponse> {

    const parsedInput = SignupInputSchema.safeParse({ name, phone, password });

    if (!parsedInput.success) {
        // Zod validation failed
        console.error("Signup input validation failed:", parsedInput.error.issues);
        return { success: false };
    }
    const validatedData = parsedInput.data;
    const { name: validatedName, phone: validatedPhone, password: validatedPassword } = validatedData;

    try {
        const existingUser = await db.user.findFirst({
            where: {
                number: validatedPhone,
            },
        });

        if (existingUser) {
            return { success: false, error: 'A user with this phone number already exists. Please sign in.' };
        }

        const hashedPassword = await bcrypt.hash(validatedPassword, 10);


        const newUser = await db.user.create({
            data: {
                name: validatedName, 
                number: validatedPhone,
                password: hashedPassword,
            },
        });
        
                // Add initial balance entry for the new user
        await db.balance.create({
            data: {
                userId: newUser.id,
                amount: 0,
                locked: 0,
            },
        });
        
        return { success: true };

    } catch (error: any) {
        console.error("Signup failed (server action):", error);
        return { success: false, error: 'An unexpected server error occurred during signup.' };
    }
}