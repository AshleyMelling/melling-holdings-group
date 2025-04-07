"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { AccountDrawer } from "./AccountDrawer";

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
};

const AccountDataTable = () => {
  const [data, setData] = useState<AccountWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAndAggregate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/wallets", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch wallets");

      const rawWallets: any[] = await res.json();

      const wallets = rawWallets.map((w) => ({
        id: w.id,
        label: w.name,
        balance: Number(w.balance),
        unconfirmedTxs: w.data?.mempool_stats?.tx_count || 0,
      }));

      const grouped: Record<string, AccountWithDetails> = {};

      for (const wallet of wallets) {
        const account = wallet.label || "Unknown";

        if (!grouped[account]) {
          grouped[account] = {
            account,
            walletCount: 0,
            totalBTC: 0,
            averageBalance: 0,
            largestWallet: { label: wallet.label, balance: wallet.balance },
            smallestWallet: { label: wallet.label, balance: wallet.balance },
            totalUnconfirmedTxs: 0,
          };
        }

        const group = grouped[account];
        group.walletCount += 1;
        group.totalBTC += wallet.balance;

        if (wallet.balance > group.largestWallet.balance) {
          group.largestWallet = {
            label: wallet.label,
            balance: wallet.balance,
          };
        }

        if (wallet.balance < group.smallestWallet.balance) {
          group.smallestWallet = {
            label: wallet.label,
            balance: wallet.balance,
          };
        }

        group.totalUnconfirmedTxs += wallet.unconfirmedTxs || 0;
      }

      for (const group of Object.values(grouped)) {
        group.averageBalance = group.totalBTC / group.walletCount;
      }

      setData(Object.values(grouped));
    } catch (err) {
      console.error("❌ Fetch error", err);
      toast.error("Failed to load account stats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndAggregate();
  }, []);

  const columns: ColumnDef<AccountWithDetails>[] = [
    {
      accessorKey: "account",
      header: "Account",
      cell: ({ row }) => <AccountDrawer account={row.original} />,
    },
    {
      accessorKey: "walletCount",
      header: "Wallet Count",
    },
    {
      accessorKey: "totalBTC",
      header: "Total BTC",
      cell: (info) => Number(info.getValue()).toFixed(8),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <Button
          onClick={fetchAndAggregate}
          size="sm"
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            "Refresh"
          )}
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-left text-sm font-medium px-2"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-sm px-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No accounts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AccountDataTable;
