import { SendCard } from "../../../components/SendCard";
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";
import { P2pTransfer } from "../../../components/P2pTransfer"; // Make sure this component is correctly implemented
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";


async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id),
        },
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0,
    };
}

async function getP2pTransfer() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id),
        },
        include: {
            toUser: {
                select: {
                    name: true
                }
            }
        }
    });

    return txns.map((t) => ({
        time: t.timestamp,
        amount: t.amount,
        toUserId: t.toUserId,
        fromUserId: t.fromUserId,
        toUser: {
            name: t.toUser?.name || "Unknown", // Ensure safety in case the user data is missing
        },
    }));
}


export default async function TransferPage() {
    const balance = await getBalance();
    const transactions = await getP2pTransfer();

    return (
        <div className="w-screen p-4">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                P2P Transfer
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                    <div>
                        <SendCard />
                    </div>
                    <div>
                        <BalanceCard amount={balance.amount} locked={balance.locked} />
                    </div>
                </div>
                <div>
                    <div className="text-lg font-medium mb-2">
                        <P2pTransfer transactions={transactions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
