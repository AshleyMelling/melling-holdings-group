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
  getSortedRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { AccountDrawer } from "./AccountDrawer";
import { ChevronUp, ChevronDown } from "lucide-react";

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

const AccountDataTable = () => {
  const [data, setData] = useState<AccountWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [btcPrice, setBtcPrice] = useState<{ usd: number; gbp: number } | null>(
    null
  );

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
            wallets: [],
          };
        }

        grouped[account].walletCount++;
        grouped[account].totalBTC += wallet.balance;
        grouped[account].wallets.push({
          label: wallet.label,
          balance: wallet.balance,
        });
        grouped[account].totalUnconfirmedTxs += wallet.unconfirmedTxs;

        if (wallet.balance > grouped[account].largestWallet.balance) {
          grouped[account].largestWallet = {
            label: wallet.label,
            balance: wallet.balance,
          };
        }

        if (wallet.balance < grouped[account].smallestWallet.balance) {
          grouped[account].smallestWallet = {
            label: wallet.label,
            balance: wallet.balance,
          };
        }

        grouped[account].averageBalance =
          grouped[account].totalBTC / grouped[account].walletCount;
      }

      setData(Object.values(grouped));
    } catch (err) {
      console.error("❌ Fetch error", err);
      toast.error("Failed to load account stats");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBtcPrice = async () => {
    try {
      const res = await fetch("/api/kraken/prices", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch BTC price");
      const result = await res.json();

      // Assume result returns an object with a BTC or XXBT key.
      const btcKey = result["BTC"] ? "BTC" : result["XXBT"] ? "XXBT" : null;
      if (btcKey) {
        setBtcPrice(result[btcKey]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch BTC price", err);
    }
  };

  useEffect(() => {
    fetchAndAggregate();
  }, []);

  useEffect(() => {
    fetchBtcPrice();
  }, []);

  const columns: ColumnDef<AccountWithDetails>[] = React.useMemo(
    () => [
      {
        accessorKey: "account",
        header: ({ column }) => (
          <div
            className="text-left px-2 cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Account
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="inline w-4 h-4 ml-1" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="inline w-4 h-4 ml-1" />
            ) : null}
          </div>
        ),
        cell: ({ row }) => <AccountDrawer account={row.original} />,
      },
      {
        accessorKey: "walletCount",
        header: ({ column }) => (
          <div
            className="text-left px-2 cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Wallet Count
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="inline w-4 h-4 ml-1" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="inline w-4 h-4 ml-1" />
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "totalBTC",
        header: ({ column }) => (
          <div
            className="text-left px-2 cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total BTC
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="inline w-4 h-4 ml-1" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="inline w-4 h-4 ml-1" />
            ) : null}
          </div>
        ),
        cell: ({ getValue }) => Number(getValue()).toFixed(7),
      },
      {
        id: "priceUSD",
        accessorFn: (row: AccountWithDetails) =>
          btcPrice ? row.totalBTC * btcPrice.usd : 0,
        header: ({ column }) => (
          <div
            className="text-left px-2 cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price (USD)
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="inline w-4 h-4 ml-1" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="inline w-4 h-4 ml-1" />
            ) : null}
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <div className="text-left px-2">
              {btcPrice ? `$${value.toFixed(2)}` : "-"}
            </div>
          );
        },
      },
      {
        id: "priceGBP",
        accessorFn: (row: AccountWithDetails) =>
          btcPrice ? row.totalBTC * btcPrice.gbp : 0,
        header: ({ column }) => (
          <div
            className="text-left px-2 cursor-pointer select-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price (GBP)
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="inline w-4 h-4 ml-1" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="inline w-4 h-4 ml-1" />
            ) : null}
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue<number>();
          return (
            <div className="text-left px-2">
              {btcPrice ? `£${value.toFixed(2)}` : "-"}
            </div>
          );
        },
      },
    ],
    [btcPrice]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Refreshing...
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
