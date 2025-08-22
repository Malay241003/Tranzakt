import { TransactionsList } from "../../../components/CombinedTransactions";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    // Mock or actual logic to fetch OnRampTransactions (replace as needed)
    const onRampTransactions = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number((session?.user?.id))
        }
    });

    return onRampTransactions.map((t) => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }));
}

async function getP2PTransactions() {
    const session = await getServerSession(authOptions);
    const currentUserId = Number(session?.user?.id);
    
    const p2pTransactions = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: currentUserId },
                { toUserId: currentUserId }
            ]
        },
        include: {
            toUser: {
                select: {
                    name: true
                }
            },
            fromUser: {
                select: {
                    name: true
                }
            }
        }
    });

    return p2pTransactions.map((t) => ({
        time: t.timestamp,
        amount: t.amount,
        fromUserId: t.fromUserId,
        toUserId: t.toUserId,
        toUser: {
            name: t.toUser?.name || "Unknown"
        },
        fromUser: {
            name: t.fromUser?.name || "Unknown"
        },
        currentUserId: currentUserId
    }));
}

// async function getP2PTransactions() {
//     const session = await getServerSession(authOptions);
//     const p2pTransactions = await prisma.p2pTransfer.findMany({
//         where: {
//             OR: [
//                 { fromUserId: Number(session?.user?.id) },
//                 { toUserId: Number(session?.user?.id) }
//             ]
//         },
//         include: {
//             toUser: {
//                 select: {
//                     name: true
//                 }
//             }
//         }
//     });

//     return p2pTransactions.map((t) => ({
//         time: t.timestamp,
//         amount: t.amount,
//         fromUserId: t.fromUserId,
//         toUserId: t.toUserId,
//         toUser: {
//             name: t.toUser?.name || "Unknown"
//         }
//     }));
// }

export default async function Page() {
    const onRampTransactions = await getOnRampTransactions();
    const p2pTransactions = await getP2PTransactions();

    return (
        <div className="w-screen p-4">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                Transactions
            </div>
            <TransactionsList
                onRampTransactions={onRampTransactions}
                p2pTransactions={p2pTransactions}
            />
        </div>
    );
}
