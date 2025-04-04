// app/dashboard/wallets/components/schema.ts
import { z } from "zod";

export const walletSchema = z.object({
  id: z.number(),
  label: z.string(),
  address: z.string().min(26).max(42),
  balance: z.string(), // You can change to z.number() if you prefer
  lastChecked: z.string(), // ISO timestamp string
  category: z.enum(["Cold", "Hot", "Exchange", "Business", "Personal"]),
  notes: z.string().optional(),
});
