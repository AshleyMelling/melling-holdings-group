"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  Row,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
} from "@tabler/icons-react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Loader2 } from "lucide-react";

// Define the type for Kraken wallet data
export type KrakenWallet = {
  id: string;
  asset: string;
  balance: number;
};

// Define the type for price data per asset
type PriceData = {
  usd: number;
  gbp: number;
};

// Simple helper function to get a cookie by name
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

function DraggableRow({ row }: { row: Row<KrakenWallet> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      data-dragging={isDragging}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

const KrakenDataTable = () => {
  const [data, setData] = useState<KrakenWallet[]>([]);
  const [priceData, setPriceData] = useState<Record<string, PriceData>>({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "balance", desc: true },
  ]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  // Fetch Kraken wallet data (balances) from your backend API
  const fetchKrakenData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/kraken/balance", {
        cache: "no-store",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      console.log("Fetched Kraken data:", result);

      const wallets: KrakenWallet[] = Object.entries(result)
        .map(([asset, balance]) => ({
          id: asset,
          asset,
          balance: parseFloat(balance as string),
        }))
        .filter((wallet) => wallet.balance !== 0);

      setData(wallets);
    } catch (err) {
      console.error("❌ Failed to fetch Kraken data", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };


  
  const fetchKrakenPrices = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;

    try {
      const res = await fetch(`${API_URL}/api/kraken/prices`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch prices");

      const result = await res.json();
      console.log("Fetched Kraken Prices:", result);

      const normalizedPrices = normalizePricesForFrontend(result);

      setPriceData(normalizedPrices); // <-- KEY LINE
    } catch (err) {
      console.error("❌ Failed to fetch Kraken prices", err);
      setPriceData({});
    }
  };
;

  // Optional: Create a single refresh function to load both balances and prices
  const refreshData = () => {
    fetchKrakenData();
    fetchKrakenPrices();
  };

  // Fetch data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const jsonToFrontendKeyMap: Record<string, string> = {
    BTC: "XXBT",
    ETH: "XETH",
    DOGE: "XXDG", // or "XDG" — whichever you prefer in your UI
    USD: "ZUSD",
    GBP: "ZGBP",
    EUR: "ZEUR",

    ADA: "ADA",
    DOT: "DOT",
    TRX: "TRX",
    SOL: "SOL",
    SUI: "SUI",
    WIF: "WIF",
    WIN: "WIN",
    POL: "POL",
    TIA: "TIA",
    LINK: "LINK",
  };

  const normalizePricesForFrontend = (
    pricesFromApi: Record<string, { usd: number; gbp: number }>
  ) => {
    return Object.entries(pricesFromApi).reduce((acc, [apiKey, priceData]) => {
      const frontendKey = jsonToFrontendKeyMap[apiKey] || apiKey;
      const meta = assetMetaMap[frontendKey];

      if (!meta) return acc; // skip unknown assets

      acc[frontendKey] = {
        label: meta.label,
        icon: meta.icon,
        usd: priceData.usd,
        gbp: priceData.gbp,
      };

      return acc;
    }, {} as Record<string, { label: string; icon?: string; usd: number; gbp: number }>);
  };

  const assetMetaMap: Record<string, { label: string; icon?: string }> = {
    XXBT: { label: "BTC", icon: "btc" },
    XETH: { label: "ETH", icon: "eth" },
    ZUSD: { label: "USD", icon: "usd" },
    ZGBP: { label: "GBP", icon: "gbp" },
    ZEUR: { label: "EUR", icon: "eur" },
    XDG: { label: "DOGE", icon: "doge" },
    XXDG: { label: "DOGE", icon: "doge" },
    POL: { label: "POL", icon: "pol" },
    ADA: { label: "ADA", icon: "ada" }, // Add this
    DOT: { label: "DOT", icon: "dot" }, // Add this
    TRX: { label: "TRX", icon: "trx" }, // Add this
    SOL: { label: "SOL", icon: "sol" }, // Add this
    SUI: { label: "SUI", icon: "sui" }, // Add this
    WIF: { label: "WIF", icon: "wif" }, // Add this
    WIN: { label: "WIN", icon: "win" }, // Add this
    LINK: { label: "LINK", icon: "link" }, // Add this
    TIA: { label: "TIA", icon: "tia" }, // Add this
  };

  const mapAssetToPriceSymbol = (asset: string): string => {
    const meta = assetMetaMap[asset] || { label: asset };
    return meta.label;
  };

  const cleanAssetSymbol = (asset: string) => {
    return asset.replace(".F", "");
  };

  const getPriceForAsset = (
    asset: string,
    currency: "usd" | "gbp"
  ): number | undefined => {
    const cleanKey = cleanAssetSymbol(asset);
    const mappedKey = jsonToFrontendKeyMap[cleanKey] || cleanKey;
    return priceData[mappedKey]?.[currency];
  };


  const columns: ColumnDef<KrakenWallet>[] = [
    {
      accessorKey: "asset",
      header: ({ column }) => (
        <div
          className="text-left px-2 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Asset
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="inline w-4 h-4 ml-1" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="inline w-4 h-4 ml-1" />
          ) : null}
        </div>
      ),
      cell: ({ row }) => {
        const raw = row.original.asset;
        const meta = assetMetaMap[raw] || {
          label: raw,
          icon: raw.toLowerCase(),
        };

        const fallbackUrl = `https://cryptoicon-api.pages.dev/api/icon/${meta.icon}`;
        const defaultIconUrl = "/default-coin.png";

        const [imgSrc, setImgSrc] = useState(fallbackUrl);

        return (
          <div className="flex items-center gap-2 px-2 font-mono">
            <img
              src={imgSrc}
              alt={meta.label}
              className="w-4 h-4 rounded-full"
              onError={() => setImgSrc(defaultIconUrl)}
            />
            <span>{meta.label}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "balance",
      header: ({ column }) => (
        <div
          className="text-right px-2 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Balance
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="inline w-4 h-4 ml-1" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="inline w-4 h-4 ml-1" />
          ) : null}
        </div>
      ),
      cell: ({ row }) => {
        const balance = row.original.balance;
        return <div className="text-right px-2">{balance.toFixed(8)}</div>;
      },
    },
    // Update the 'priceUSD' cell renderer
    {
      id: "priceUSD",
      header: () => <div className="text-right px-2">Price (USD)</div>,
      cell: ({ row }) => {
        const price = getPriceForAsset(row.original.asset, "usd");
        return (
          <div className="text-right px-2">
            {price ? `$${price.toFixed(2)}` : "-"}
          </div>
        );
      },
    },
    {
      id: "priceGBP",
      header: () => <div className="text-right px-2">Price (GBP)</div>,
      cell: ({ row }) => {
        const price = getPriceForAsset(row.original.asset, "gbp");
        return (
          <div className="text-right px-2">
            {price ? `£${price.toFixed(2)}` : "-"}
          </div>
        );
      },
    },
    {
      id: "totalUSD",
      header: () => <div className="text-right px-2">Total (USD)</div>,
      cell: ({ row }) => {
        const price = getPriceForAsset(row.original.asset, "usd");
        const total = price ? price * row.original.balance : null;
        return (
          <div className="text-right px-2">
            {total ? `$${total.toFixed(2)}` : "-"}
          </div>
        );
      },
    },
    {
      id: "totalGBP",
      header: () => <div className="text-right px-2">Total (GBP)</div>,
      cell: ({ row }) => {
        const price = getPriceForAsset(row.original.asset, "gbp");
        const total = price ? price * row.original.balance : null;
        return (
          <div className="text-right px-2">
            {total ? `£${total.toFixed(2)}` : "-"}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 60000);
    return () => clearInterval(interval);
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    autoResetPageIndex: true,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = data.findIndex((item) => item.id === active.id);
      const newIndex = data.findIndex((item) => item.id === over?.id);
      setData((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const dataIds: UniqueIdentifier[] = data.map((item) => item.id);

  return (
    <Tabs defaultValue="kraken" className="w-full flex-col gap-6">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refresh Kraken Data...
              </>
            ) : (
              "Refresh Kraken Data"
            )}
          </Button>
        </div>
      </div>

      <TabsContent
        value="kraken"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
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
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No Kraken data.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        {/* Pagination & Toolbar */}
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>

          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>

            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">First page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Previous</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Next</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default KrakenDataTable;
