// AccountDrawer.tsx

"use client";

import React from "react";
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
import { LabelWithValue } from "@/components/ui/display-utils";

export type WalletSummary = {
  label: string;
  balance: number;
};

export type AccountWithDetails = {
  account: string;
  walletCount: number;
  totalBTC: number;
  averageBalance: number;
  largestWallet: WalletSummary;
  smallestWallet: WalletSummary;
  totalUnconfirmedTxs: number;
  wallets: WalletSummary[];
};

export function AccountDrawer({ account }: { account: AccountWithDetails }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-fit px-0 text-left text-sm font-medium"
        >
          {account.account}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="sm:max-w-md max-h-screen overflow-hidden">
        <div className="flex flex-col h-full">
          <DrawerHeader className="gap-1 pb-0">
            <DrawerTitle className="text-lg">{account.account}</DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground">
              Aggregated Account Details
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 text-sm">
            <LabelWithValue
              label="Total Wallets"
              value={account.walletCount.toString()}
            />
            <LabelWithValue
              label="Total BTC"
              value={`${account.totalBTC.toFixed(8)} BTC`}
            />
            <LabelWithValue
              label="Average Balance"
              value={`${account.averageBalance.toFixed(8)} BTC`}
            />
            <LabelWithValue
              label="Largest Wallet"
              value={`${
                account.largestWallet.label
              } (${account.largestWallet.balance.toFixed(8)} BTC)`}
            />
            <LabelWithValue
              label="Smallest Wallet"
              value={`${
                account.smallestWallet.label
              } (${account.smallestWallet.balance.toFixed(8)} BTC)`}
            />
            <LabelWithValue
              label="Total Unconfirmed TXs"
              value={account.totalUnconfirmedTxs.toString()}
            />

            <div className="pt-4">
              <h3 className="font-semibold text-sm mb-2">
                Wallets in this Account
              </h3>
              <div className="space-y-2">
                {account.wallets.map((wallet, i) => (
                  <div
                    key={i}
                    className="text-muted-foreground border border-border rounded-lg p-3 bg-muted/10"
                  >
                    <div className="text-xs">
                      <strong>{wallet.label}</strong>:{" "}
                      {wallet.balance.toFixed(8)} BTC
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DrawerFooter className="px-4">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
