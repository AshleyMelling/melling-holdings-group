// WIP - Governance Record Creation Form Component
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMediaQuery } from "/home/remem/bitcoinholdings/frontend/src/hooks/use-media-guery";
import { cn } from "@/lib/utils";

const initialForm = {
  title: "",
  documentType: "",
  entity: "",
  description: "",
  documentUrl: "",
};

export function AddGovernanceForm(props) {
const [records, setRecords] = useState([]);
  const { onSubmit } = props;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.documentType ||
      !form.entity ||
      !form.description
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const fetchBlockHeight = async () => {
      try {
        const res = await fetch("https://mempool.space/api/blocks/tip/height");
        const height = await res.text();
        return parseInt(height);
      } catch {
        return 0;
      }
    };

    const btcBlockHeight = await fetchBlockHeight();
    const now = new Date().toISOString();
    const documentHash = crypto.randomUUID(); // TEMP: Replace with real hash logic
    const previousHash = "mock-previous-hash"; // TODO: Pull from last record

    const newRecord = {
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
    setOpen(false);
    setForm(initialForm);
    toast.success("Record created.");
  };

  const FormFields = (props) => {
    return (
      <form className={cn("grid items-start gap-4", props.className)}>
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <Select onValueChange={(v) => handleChange("documentType", v)}>
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
          onChange={(e) => handleChange("entity", e.target.value)}
        />
        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <Input
          placeholder="Document URL (optional)"
          value={form.documentUrl}
          onChange={(e) => handleChange("documentUrl", e.target.value)}
        />
        <Button type="button" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    );
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Record</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Governance Record</DialogTitle>
            <DialogDescription>
              Fill out the form to create a new immutable record.
            </DialogDescription>
          </DialogHeader>
          <FormFields />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create Governance Record</DrawerTitle>
          <DrawerDescription>
            Fill out the form to create a new immutable record.
          </DrawerDescription>
        </DrawerHeader>
        <FormFields className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
