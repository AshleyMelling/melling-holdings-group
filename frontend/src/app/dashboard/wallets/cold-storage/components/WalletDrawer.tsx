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
import { walletSchema } from "./schema";
import { z } from "zod";
import { LabelWithValue, LabelWithCopy } from "@/components/ui/display-utils";

export type Wallet = z.infer<typeof walletSchema>;

export function WalletDrawer({ item }: { item: Wallet }) {
  let extraMetrics = null;
  let utxoList: any[] = [];
  let parsed: any = null;

  if (item.data) {
    try {
      parsed =
        typeof item.data === "string" ? JSON.parse(item.data) : item.data;

      extraMetrics = {
        fundedTXOCount: parsed.chain_stats?.funded_txo_count,
        fundedTXOSum: parsed.chain_stats?.funded_txo_sum,
        spentTXOCount: parsed.chain_stats?.spent_txo_count,
        spentTXOSum: parsed.chain_stats?.spent_txo_sum,
        confirmedTxCount: parsed.chain_stats?.tx_count,
        unconfirmedTxCount: parsed.mempool_stats?.tx_count,
        utxoCount: parsed.utxos?.length ?? "N/A",
        totalFunded: parsed.chain_stats?.funded_txo_sum / 1e8,
        totalSpent: parsed.chain_stats?.spent_txo_sum / 1e8,
        finalBalance:
          (parsed.chain_stats?.funded_txo_sum -
            parsed.chain_stats?.spent_txo_sum) /
          1e8,
      };

      utxoList = parsed.utxos || [];
    } catch (err) {
      console.error("Failed to parse extra data", err);
    }
  }

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
      {/* Use overflow-hidden on the DrawerContent and wrap content in a flex column */}
      <DrawerContent className="sm:max-w-md max-h-screen overflow-hidden">
        <div className="flex flex-col h-full">
          <DrawerHeader className="gap-1 pb-0">
            <DrawerTitle className="text-lg">{item.label}</DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground">
              Wallet Details
            </DrawerDescription>
          </DrawerHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 text-sm">
            <LabelWithCopy label="Address" value={item.address} />
            <LabelWithValue label="Balance" value={item.balance} />
            <LabelWithValue label="Last Checked" value={item.lastChecked} />
            <LabelWithValue label="Category" value={item.category} />
            {item.notes && <LabelWithValue label="Notes" value={item.notes} />}

            {extraMetrics && (
              <div className="px-4 py-2 space-y-2 text-sm border-t mt-4">
                <h3 className="font-bold">Extra Metrics</h3>
                <LabelWithValue
                  label="Confirmed TX Count"
                  value={extraMetrics.confirmedTxCount}
                />
                <LabelWithValue
                  label="Unconfirmed TX Count"
                  value={extraMetrics.unconfirmedTxCount}
                />
                <LabelWithValue
                  label="Funded TXO Count"
                  value={extraMetrics.fundedTXOCount}
                />
                <LabelWithValue
                  label="Spent TXO Count"
                  value={extraMetrics.spentTXOCount}
                />
                <LabelWithValue
                  label="UTXO Count"
                  value={extraMetrics.utxoCount}
                />
                <LabelWithValue
                  label="Total Funded"
                  value={`${extraMetrics.totalFunded} BTC`}
                />
                <LabelWithValue
                  label="Total Spent"
                  value={`${extraMetrics.totalSpent} BTC`}
                />
                <LabelWithValue
                  label="Final Balance"
                  value={`${extraMetrics.finalBalance} BTC`}
                />
              </div>
            )}

            {utxoList.length > 0 && (
              <div className="px-4 py-2 space-y-3 text-sm border-t mt-4">
                <h3 className="font-bold">UTXO Breakdown</h3>
                <div className="text-muted-foreground">
                  Total UTXOs: <strong>{utxoList.length}</strong> • Total Value:{" "}
                  <strong>
                    {utxoList.reduce((sum, u) => sum + u.value, 0) / 1e8} BTC
                  </strong>
                </div>
                <ul className="space-y-2 max-h-72 overflow-y-auto pr-2">
                  {utxoList.map((utxo, idx) => (
                    <li
                      key={idx}
                      className="border border-muted rounded-lg p-3 bg-muted/10 space-y-1"
                    >
                      <div className="text-xs">
                        <strong>TXID:</strong>{" "}
                        <a
                          href={`https://mempool.space/tx/${utxo.txid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          {utxo.txid.slice(0, 12)}...{utxo.txid.slice(-6)}
                        </a>
                      </div>
                      <div className="text-xs">
                        <strong>Output Index (vout):</strong> {utxo.vout}
                      </div>
                      <div className="text-xs">
                        <strong>Value:</strong> {(utxo.value / 1e8).toFixed(8)}{" "}
                        BTC
                      </div>
                      <div className="text-xs">
                        <strong>Status:</strong>{" "}
                        {utxo.status?.confirmed ? (
                          <span className="text-green-500">✅ Confirmed</span>
                        ) : (
                          <span className="text-yellow-500">🕐 Pending</span>
                        )}
                      </div>
                      {utxo.status?.block_height && (
                        <div className="text-xs text-muted-foreground">
                          Block Height: {utxo.status.block_height}
                        </div>
                      )}
                      {utxo.status?.block_time && (
                        <div className="text-xs text-muted-foreground">
                          Block Time:{" "}
                          {new Date(
                            utxo.status.block_time * 1000
                          ).toLocaleString()}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
