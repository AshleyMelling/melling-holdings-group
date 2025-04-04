"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Your record type
export type ColdStorageWalletRecord = {
  id: number;
  name: string;
  address: string;
  balance: string;
  lastChecked: string;
};

type ColdStorageForm = {
  name: string;
  address: string;
};

const initialForm: ColdStorageForm = {
  name: "",
  address: "",
};

type AddColdStorageWalletFormProps = {
  onSubmit: (record: ColdStorageWalletRecord) => void;
};

export function AddColdStorageWalletForm({
  onSubmit,
}: AddColdStorageWalletFormProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ColdStorageForm>(initialForm);

  const handleChange = (field: keyof ColdStorageForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLookupAndSave = async () => {
    if (!form.address || !form.name) {
      toast.error("Please enter both wallet name and address.");
      return;
    }
    try {
      // 1. Fetch data from BlockCypher
      const token = "YOUR_BLOCKCYPHER_API_TOKEN"; // Replace with your token
      const blockchainRes = await fetch(
        `https://api.blockcypher.com/v1/btc/main/addrs/${form.address}?token=${token}`
      );
      if (!blockchainRes.ok) {
        throw new Error("Wallet not found or API error");
      }
      const walletData = await blockchainRes.json();

      // 2. Extract fields
      const balanceSats = walletData.final_balance || 0;
      const balanceBTC = (balanceSats / 1e8).toFixed(8);
      const now = new Date().toISOString();

      // 3. POST data to your backend
      const backendRes = await fetch("/api/cold-storage-wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          address: walletData.address,
          balance: balanceBTC,
          data: walletData,
          lastChecked: now,
        }),
      });
      if (!backendRes.ok) {
        throw new Error("Error saving wallet data to backend");
      }
      const savedRecord: ColdStorageWalletRecord = await backendRes.json();
      onSubmit(savedRecord);
      setOpen(false);
      setForm(initialForm);
      toast.success("Cold Storage wallet record created.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error processing wallet data.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Cold Storage Wallet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Cold Storage Wallet</DialogTitle>
          <DialogDescription>
            Enter your wallet name and address to fetch all available data.
          </DialogDescription>
        </DialogHeader>

        {/* The form fields */}
        <div className={cn("grid items-start gap-4")}>
          <Input
            placeholder="Wallet Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <Input
            placeholder="Wallet Address"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
          <Button onClick={handleLookupAndSave}>Lookup &amp; Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
