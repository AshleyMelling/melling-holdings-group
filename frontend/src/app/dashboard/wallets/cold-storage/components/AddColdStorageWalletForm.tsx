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

export type ColdStorageWalletRecord = {
  id: number;
  name: string;
  address: string;
  balance: string;
  lastChecked: string;
  data: any;
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
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ColdStorageForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLookupAndSave = async () => {
    console.log("🔥 Submitting form:", form);
    if (!form.name || !form.address) {
      toast.error("Please enter both wallet name and address.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Lookup wallet from Mempool API
      const fetchRes = await fetch(
        "https://www.mellingholdingsgroup.com/api/lookup-wallet",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            address: form.address,
          }),
        }
      );

      if (!fetchRes.ok) {
        const error = await fetchRes.json();
        throw new Error(error.detail || "Failed to fetch wallet info");
      }

      const walletData = await fetchRes.json();

      // Step 2: Save to backend
      const saveRes = await fetch("/api/cold-storage-wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(walletData),
      });

      // ✅ Handle duplicates
      if (saveRes.status === 409) {
        toast.error("⚠️ Wallet already exists (duplicate name or address)");
        console.warn("⚠️ Wallet already exists");
        return; // 👈 prevent further execution
      }

      if (!saveRes.ok) {
        throw new Error("Error saving wallet data to backend");
      }

      // Step 3: If success, notify + add to table
      const savedRecord: ColdStorageWalletRecord = await saveRes.json();
      onSubmit(savedRecord);
      toast.success("✅ Wallet saved successfully!");
      setForm(initialForm);
      setOpen(false);
    } catch (error: any) {
      console.error("❌ Save error:", error);
      toast.error(error.message || "Unexpected error");
    } finally {
      setLoading(false);
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
            Enter your wallet name and address to fetch data and save.
          </DialogDescription>
        </DialogHeader>

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
          <Button onClick={handleLookupAndSave} disabled={loading}>
            {loading ? "Saving..." : "Lookup & Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
