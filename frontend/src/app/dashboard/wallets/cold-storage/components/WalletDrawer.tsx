// app/dashboard/wallets/components/WalletDrawer.tsx
"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { walletSchema } from "./schema";
import { z } from "zod";
import { LabelWithValue, LabelWithCopy } from "@/components/ui/display-utils";

export function WalletDrawer({ item }: { item: z.infer<typeof walletSchema> }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-fit px-0 text-left text-sm font-medium"
        >
          {item.label}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-md">
        <DrawerHeader className="gap-1 pb-0">
          <DrawerTitle className="text-lg">{item.label}</DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            Wallet Details
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2 space-y-4 text-sm">
          <LabelWithCopy label="Address" value={item.address} />
          <LabelWithValue label="Balance" value={item.balance} />
          <LabelWithValue label="Last Checked" value={item.lastChecked} />
          <LabelWithValue label="Category" value={item.category} />
          {item.notes && <LabelWithValue label="Notes" value={item.notes} />}
        </div>

        <DrawerFooter className="px-4">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
