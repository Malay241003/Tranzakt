import { Card } from "@repo/ui/card"

type OnRampTransaction = {
    time: Date,
    amount: number,
    status: string,
    provider: string
}

type P2PTransaction = {
    time: Date,
    amount: number,
    fromUserId: number,
    toUserId: number,
    toUser: {
        name: string
    },
    fromUser: {
        name: string
    },
    currentUserId: number  // Add this to help determine if user is sender or receiver
}

type CombinedTransaction = {
    time: Date,
    amount: number,
    type: 'received' | 'sent',
    description: string,
    subText?: string
}

export const TransactionsList = ({ 
    onRampTransactions,
    p2pTransactions 
}: { 
    onRampTransactions: OnRampTransaction[],
    p2pTransactions: P2PTransaction[]
}) => {
    // const combinedTransactions: CombinedTransaction[] = [
    //     ...onRampTransactions.map(t => ({
    //         time: t.time,
    //         amount: t.amount,
    //         type: 'received' as const,
    //         description: 'Received INR',
    //         subText: t.provider
    //     })),
    //     ...p2pTransactions.map(t => ({
    //         time: t.time,
    //         amount: t.amount,
    //         type: 'sent' as const,
    //         description: `Sent to ${t.toUser.name}`
    //     }))
    // ].sort((a, b) => b.time.getTime() - a.time.getTime());
    const combinedTransactions: CombinedTransaction[] = [
        ...onRampTransactions.map(t => ({
            time: t.time,
            amount: t.amount,
            type: 'received' as const,
            description: 'Received INR',
            subText: t.provider
        })),
        ...p2pTransactions.map(t => {
            const isReceived = t.toUserId === t.currentUserId;
            return {
                time: t.time,
                amount: t.amount,
                type: isReceived ? 'received' as const : 'sent' as const,
                description: isReceived 
                    ? `Received from ${t.fromUser.name}`
                    : `Sent to ${t.toUser.name}`
            };
        })
    ].sort((a, b) => b.time.getTime() - a.time.getTime());

    if (!combinedTransactions.length) {
        return (
            <Card title="Recent Transactions">
                <div className="text-center pb-8 pt-8">
                    No Recent transactions
                </div>
            </Card>
        );
    }

    return (
        <Card title="Recent Transactions">
            <div className="pt-2">
                {combinedTransactions.map((t, index) => (
                    <div className="flex justify-between border-b border-slate-300 py-2" key={`${t.time.getTime()}-${index}`}>
                        <div>
                            <div className="text-sm">{t.description}</div>
                            <div className="text-slate-600 text-xs">
                                {t.time.toLocaleDateString('en-US', { weekday: 'short' })},
                                {t.time.getDate()} {t.time.toLocaleString('default', { month: 'short' })}, {t.time.getFullYear()},{' '}
                                {t.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-col justify-center">
                                {t.type === 'received' ? '+ ' : '- '}
                                Rs {t.amount / 100}
                            </div>
                            {t.subText && <div className="text-slate-600 text-xs">{t.subText}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};