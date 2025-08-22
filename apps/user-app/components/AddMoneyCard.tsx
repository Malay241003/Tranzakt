"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnrampTransaction";
import { useRouter } from "next/navigation";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [amount, setAmount] = useState("");
    const router = useRouter();

    return (
    <Card title="Add Money">
        <div className="w-full">
            <TextInput label={"Amount"} placeholder={"Amount"} 
                onChange={(val) => {
                        setAmount(val);
                }} value={amount}
            />
            <div className="py-4 text-left">
                Bank
            </div>
            <Select onSelect={(val) => { 
                setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === val)?.redirectUrl || "");
                setProvider(SUPPORTED_BANKS.find(x => x.name === val)?.name || "");
            }} options={SUPPORTED_BANKS.map(x => ({
                key: x.name,
                value: x.name
            }))} />
            <div className="flex justify-center pt-4">
                <Button onClick={async () => {
                    const numAmount = Number(amount);
                    await createOnRampTransaction(provider, numAmount); 
                    window.location.href = redirectUrl || "";
                    // Correct: Call router.refresh() to revalidate data
                    router.refresh();
                }}>
                    Add Money
                </Button>
            </div>
        </div>
    </Card>
    )
}
