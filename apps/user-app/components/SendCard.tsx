"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import { useRouter } from "next/navigation"; // Correct: Import useRouter


export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const router = useRouter(); // Correct: Initialize useRouter hook
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
                <div className="pt-4 flex justify-center">
                    <Button
                        onClick={async () => {
                            await p2pTransfer(number, Number(amount) * 100);
                            setNumber("");
                            setAmount("");
                            // Correct: Call router.refresh() to revalidate data
                            router.refresh();
                        }}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </Card>
}
