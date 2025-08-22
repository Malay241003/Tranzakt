import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { z } from 'zod';


export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
            password: { label: "Password", type: "password", required: true }
          },
          // TODO: User credentials type from next-auth
          async authorize(credentials: any) {
            if (!credentials.phone || !credentials.password) {
                console.error("Phone number and password are required.");
                return null;
            }
            const LoginInputSchema = z.object({
                phone: z.string().length(10, "Phone number must be 10 digits").regex(/^\d+$/, "Phone number must contain only digits"),
                password: z.string().min(1, "Password is required"),
            });

            const parsedCredentials = LoginInputSchema.safeParse(credentials);

            if (!parsedCredentials.success) {
                console.error("Login input validation failed:", parsedCredentials.error.issues);
                return null;
            }

            const existingUser = await db.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            if (existingUser) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        number: existingUser.number
                    }
                }
                console.error(`Invalid password for existing user ${credentials.phone}`);
                return null;
            }
            else {
                console.error(`Login failed: User with phone number ${credentials.phone} does not exist.`);
                return null;
            }
          },
        })
    ],
    secret: process.env.JWT_SECRET,
    callbacks: {
        async session({ token, session }: any) {
            session.user.id = token.sub

            return session
        }
    },
    pages: {
      signIn: "/signin",
    }
  }
  