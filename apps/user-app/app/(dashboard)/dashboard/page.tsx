import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { BalanceCard } from "../../../components/BalanceCard";

async function getDashboardData() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/signin");
    }
    const userId = Number(session.user.id);
    const [balance, user] = await Promise.all([
        prisma.balance.findFirst({ where: { userId } }),
        prisma.user.findFirst({ where: { id: userId } }),
    ]);
    return {
        name: user?.name || session?.user?.name || "",
        amount: balance?.amount || 0,
        locked: balance?.locked || 0,
    };
}

export default async function DashboardPage() {
    const { name, amount, locked } = await getDashboardData();

    return (
        <div className="w-screen p-4">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-2 font-bold">
                {name ? `Welcome back, ${name}` : "Welcome back"}
            </div>
            <div className="text-lg text-slate-600 mb-8">
                Here's your wallet at a glance.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BalanceCard amount={amount} locked={locked} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <QuickAction
                        href="/transfer"
                        title="Add money"
                        subtitle="Top up your wallet"
                        icon={<WalletIcon />}
                    />
                    <QuickAction
                        href="/p2p"
                        title="Send"
                        subtitle="Pay another user"
                        icon={<SendIcon />}
                    />
                    <QuickAction
                        href="/transactions"
                        title="History"
                        subtitle="View transactions"
                        icon={<ClockIcon />}
                    />
                </div>
            </div>
        </div>
    );
}

function QuickAction({
    href,
    title,
    subtitle,
    icon,
}: {
    href: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="flex flex-col justify-between border bg-white rounded-xl p-5 hover:shadow-md hover:border-[#6a51a6] transition-all"
        >
            <div className="text-[#6a51a6]">{icon}</div>
            <div className="mt-6">
                <div className="font-semibold text-gray-900">{title}</div>
                <div className="text-sm text-slate-500">{subtitle}</div>
            </div>
        </Link>
    );
}

function WalletIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
    </svg>
}

function SendIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
}

function ClockIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
}
