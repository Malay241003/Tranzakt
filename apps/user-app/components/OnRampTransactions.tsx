import { Card } from "@repo/ui/card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }

    const sortedTransactions = transactions.sort((a, b) => b.time.getTime() - a.time.getTime());

    return (
        <Card title="Recent Transactions">
            <div className="pt-2">
                {sortedTransactions.map((t) => (
                    <div className="flex justify-between border-b border-slate-300 py-2">
                        <div>
                            <div className="text-sm">Received INR</div>
                            <div className="text-slate-600 text-xs">
                                {t.time.toLocaleDateString('en-US', { weekday: 'short' })},
                                {t.time.getDate()} {t.time.toLocaleString('default', { month: 'short' })}, {t.time.getFullYear()},{' '}
                                {t.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-col justify-center">+ Rs {t.amount / 100}</div>
                            <div className="text-slate-600 text-xs">{t.provider}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
    
}