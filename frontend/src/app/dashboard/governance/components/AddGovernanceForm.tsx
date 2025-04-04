"use client";

import React, { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Governance record interface
export interface GovernanceRecord {
  id: number;
  title: string;
  documentType: string;
  anchoringStatus: string;
  txid: string;
  anchoredAt: string;
  createdBy: string;
  createdAt: string;
  entity: string;
  documentHash: string;
  previousHash: string | null;
  description: string;
  documentUrl: string;
  btcBlockHeight: number;
}

// Form state interface
interface GovernanceFormState {
  title: string;
  documentType: string;
  entity: string;
  description: string;
  documentUrl: string;
}

const initialForm: GovernanceFormState = {
  title: "",
  documentType: "",
  entity: "",
  description: "",
  documentUrl: "",
};

export interface AddGovernanceFormProps {
  onSubmit: (record: GovernanceRecord) => void;
}

// Memoized inner form component to reduce re-renders
interface FormFieldsProps {
  form: GovernanceFormState;
  onChange: (field: keyof GovernanceFormState, value: string) => void;
  onSubmit: () => void;
}
const FormFields: React.FC<FormFieldsProps> = memo(
  ({ form, onChange, onSubmit }) => {
    console.log("FormFields rendered", form);
    return (
      <div className={cn("grid gap-4")}>
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
        <Select
          value={form.documentType}
          onValueChange={(val) => onChange("documentType", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cover Page">Cover Page</SelectItem>
            <SelectItem value="Narrative">Narrative</SelectItem>
            <SelectItem value="Internal Memo">Internal Memo</SelectItem>
            <SelectItem value="Report">Report</SelectItem>
            <SelectItem value="Shareholder Resolution">
              Shareholder Resolution
            </SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Entity"
          value={form.entity}
          onChange={(e) => onChange("entity", e.target.value)}
        />
        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
        <Input
          placeholder="Document URL (optional)"
          value={form.documentUrl}
          onChange={(e) => onChange("documentUrl", e.target.value)}
        />
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    );
  }
);

export function AddGovernanceForm({ onSubmit }: AddGovernanceFormProps) {
  // Local state for dialog open/close and form fields
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<GovernanceFormState>(initialForm);

  const handleChange = (field: keyof GovernanceFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Example: fetch block height from mempool.space API
  async function fetchBlockHeight(): Promise<number> {
    try {
      const res = await fetch("https://mempool.space/api/blocks/tip/height");
      const heightText = await res.text();
      return parseInt(heightText, 10);
    } catch {
      return 0;
    }
  }

  async function handleSubmit() {
    if (
      !form.title ||
      !form.documentType ||
      !form.entity ||
      !form.description
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const btcBlockHeight = await fetchBlockHeight();
    const now = new Date().toISOString();
    const documentHash = crypto.randomUUID(); // Example placeholder
    const previousHash = "mock-previous-hash"; // Placeholder

    const newRecord: GovernanceRecord = {
      id: Date.now(),
      title: form.title,
      documentType: form.documentType,
      anchoringStatus: "Pending",
      txid: "",
      anchoredAt: "",
      createdBy: "Ashley Melling",
      createdAt: now,
      entity: form.entity,
      documentHash,
      previousHash,
      description: form.description,
      documentUrl: form.documentUrl,
      btcBlockHeight,
    };

    onSubmit(newRecord);
    setForm(initialForm);
    setOpen(false);
    toast.success("Governance record created.");
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Add Governance Record
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Governance Record</DialogTitle>
            <DialogDescription>
              Fill out the form to create a new governance record.
            </DialogDescription>
          </DialogHeader>
          <FormFields
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
          <DialogClose asChild>
            <Button variant="outline" className="mt-4 w-full">
              Cancel
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
