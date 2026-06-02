"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOnRampTransaction(provider: string, amount: number) {
    // Ideally the token + confirmation would come from the banking provider
    // (hdfc/axis) via the bank-webhook service. For this hosted demo we skip
    // the external bank round-trip and credit the wallet immediately, in one
    // atomic DB transaction, so you can simulate "add money" straight from the
    // browser (no Postman / no separate webhook service to keep awake).
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request"
        }
    }

    const userId = Number(session.user.id);

    // Amounts are stored in paise (1 INR = 100 paise). Round to avoid float drift.
    const amountInPaise = Math.round(amount * 100);
    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
        return {
            message: "Invalid amount"
        }
    }

    const token = (Math.random() * 1000).toString();

    await prisma.$transaction([
        prisma.onRampTransaction.create({
            data: {
                provider,
                status: "Success",
                startTime: new Date(),
                token: token,
                userId: userId,
                amount: amountInPaise
            }
        }),
        // upsert keeps this safe even for users created before the balance row existed
        prisma.balance.upsert({
            where: { userId: userId },
            update: { amount: { increment: amountInPaise } },
            create: { userId: userId, amount: amountInPaise, locked: 0 }
        })
    ]);

    return {
        message: "Done"
    }
}
