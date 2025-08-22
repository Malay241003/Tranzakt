import express, { Request, Response } from 'express';
import db from "@repo/db/client";
import { z } from "zod";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
dotenv.config();

// Validation schema
const webhookSchema = z.object({
    token: z.string(),
    user_identifier: z.number(),
    amount: z.string(),
    secret: z.string().optional()
});

// Environment variable for webhook secret
const WEBHOOK_SECRET = process.env.HDFC_WEBHOOK_SECRET;

app.post("/hdfcWebhook", async (req: Request, res: Response) => {
    try {
        // Validate request body
        const validatedData = webhookSchema.parse(req.body);
        
        // Verify webhook secret
        if (validatedData.secret !== WEBHOOK_SECRET) {
            return res.status(401).json({ message: "Invalid webhook secret" });
        }

        const paymentInformation = {
            token: validatedData.token,
            userId: validatedData.user_identifier,
            amount: validatedData.amount
        };

        // Check if transaction is in processing state
        const transaction = await db.onRampTransaction.findFirst({
            where: {
                token: paymentInformation.token,
                status: "Processing"
            }
        });

        if (!transaction) {
            return res.status(400).json({
                message: "Transaction not found or not in processing state"
            });
        }

        await db.$transaction([
            db.balance.update({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.update({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({ message: "Captured" });
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        });
    }
});

app.listen(3003);