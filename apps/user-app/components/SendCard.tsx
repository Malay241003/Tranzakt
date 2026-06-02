"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import { useRouter } from "next/navigation";

const DEMO_RECIPIENT = process.env.NEXT_PUBLIC_DEMO_RECIPIENT;

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    return <Card title="Send">
            <div className="w-full">
                <TextInput
                    placeholder="Number"
                    label="Number"
                    onChange={(value) => {setNumber(value);}}
                    value = {number}
                />
                <TextInput
                    placeholder="Amount"
                    label="Amount"
                    onChange={(value) => {setAmount(value)}}
                    value = {amount}
                />
                {DEMO_RECIPIENT && (
                    <div className="mt-3 rounded-lg border border-[#d9cdf0] bg-[#f3effa] p-3 text-sm text-slate-700">
                        No second account? Send a test payment to our demo wallet:{" "}
                        <button
                            type="button"
                            onClick={() => setNumber(DEMO_RECIPIENT)}
                            className="font-semibold text-[#6a51a6] underline underline-offset-2"
                        >
                            {DEMO_RECIPIENT}
                        </button>
                    </div>
                )}
                <div className="pt-4 flex justify-center">
                    <Button
                        onClick={async () => {
                            const numAmount = Number(amount);
                            if (!number || !numAmount || numAmount <= 0) {
                                return;
                            }
                            setLoading(true);
                            await p2pTransfer(number, numAmount * 100);
                            setNumber("");
                            setAmount("");
                            setLoading(false);
                            router.refresh();
                        }}
                    >
                        {loading ? "Sending..." : "Send"}
                    </Button>
                </div>
            </div>
        </Card>
}
