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

import { walletSchema } from "./schema";
import { WalletDrawer } from "./WalletDrawer";
import { AddColdStorageWalletForm } from "./AddColdStorageWalletForm";
import { z } from "zod";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

export type Wallet = z.infer<typeof walletSchema>;

function DraggableRow({ row }: { row: Row<Wallet> }) {
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

const WalletDataTable = () => {
  const [data, setData] = useState<Wallet[]>([]);
  const [walletToDelete, setWalletToDelete] = useState<Wallet | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "balance", desc: true },
  ]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const [isLoading, setIsLoading] = useState(true);

  const fetchWallets = async () => {
    try {
      const res = await fetch("/api/wallets", { cache: "no-store" });
      const wallets = await res.json();
      const formatted = wallets.map((w: any) => ({
        id: w.id,
        label: w.name,
        address: w.address,
        balance: w.balance,
        lastChecked: w.lastChecked,
        category: "Cold",
        notes: w.notes,
        data: typeof w.data === "string" ? JSON.parse(w.data) : w.data,
      }));
      setData(formatted);
    } catch (err) {
      console.error("❌ Failed to fetch wallets", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const columns: ColumnDef<Wallet>[] = [
    {
      accessorKey: "label",
      header: ({ column }) => (
        <div
          className="text-left px-2 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Label
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="inline w-4 h-4 ml-1" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="inline w-4 h-4 ml-1" />
          ) : null}
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-left px-2">
          <WalletDrawer item={row.original} />
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <div
          className="text-left text-sm cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="inline w-4 h-4 ml-1" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="inline w-4 h-4 ml-1" />
          ) : null}
        </div>
      ),
      cell: ({ row }) => {
        const full = row.original.address;
        const display = `${full.slice(0, 7)}...${full.slice(-4)}`;

        return (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-sm cursor-pointer underline underline-offset-2 decoration-dotted">
                  {display}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <span className="font-mono text-xs">{full}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: "txCount",
      accessorFn: (row) => {
        const chainTx = row.data?.chain_stats?.tx_count ?? 0;
        const mempoolTx = row.data?.mempool_stats?.tx_count ?? 0;
        return chainTx + mempoolTx;
      },
      header: ({ column }) => (
        <div
          className="text-right text-sm cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Transactions
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="inline w-4 h-4 ml-1" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="inline w-4 h-4 ml-1" />
          ) : null}
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="text-right text-sm">{getValue<number>()}</div>
      ),
      enableSorting: true,
      sortingFn: "basic",
    },
    {
      accessorKey: "balance",
      header: ({ column }) => (
        <div
          className="text-right text-sm cursor-pointer select-none"
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
        const balance = Number(row.original.balance);
        const formattedBalance = balance.toFixed(7);
        return <div className="text-right text-sm">{formattedBalance} BTC</div>;
      },
    },
    {
      accessorKey: "lastChecked",
      header: ({ column }) => (
        <div
          className="text-right text-sm cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Checked
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="inline w-4 h-4 ml-1" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="inline w-4 h-4 ml-1" />
          ) : null}
        </div>
      ),
      cell: ({ row }) => {
        const rawDate = row.original.lastChecked;
        const formatted = new Date(rawDate).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return <div className="text-right text-sm">{formatted}</div>;
      },
    },
    {
      accessorKey: "category",
      header: () => <div className="text-center text-sm">Category</div>,
      cell: ({ row }) => (
        <div className="text-center text-sm">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.category}
          </Badge>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right text-sm">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right pr-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setWalletToDelete(row.original);
              setShowDeleteDialog(true);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

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
    getRowId: (row) => row.id.toString(),
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

  const handleDelete = async (walletId: string) => {
    try {
      const res = await fetch(`/api/wallets/${walletId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setData((prev) =>
        prev.filter((wallet) => wallet.id.toString() !== walletId)
      );
      setShowDeleteDialog(false);
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const syncWalletProfiles = async () => {
    setIsLoading(true);
    const updatedWallets: Wallet[] = [];

    for (const wallet of data) {
      try {
        const res = await fetch("/api/lookup-wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: wallet.label, address: wallet.address }),
        });

        if (!res.ok) {
          console.error(`🔴 Wallet sync failed for: "${wallet.address}"`);
          continue;
        }

        const updated = await res.json();

        updatedWallets.push({
          ...wallet,
          balance: updated.balance,
          lastChecked: updated.lastChecked,
        });

        await delay(250);
      } catch (err) {
        console.error(`❌ Wallet ${wallet.address} failed to sync`, err);
      }
    }

    setData(updatedWallets);
    setIsLoading(false);
    toast.success("✅ Wallets synced!");
  };

  const exportToCSV = (data: Wallet[]) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(","));
    for (const wallet of data) {
      const values = headers.map((header) => {
        let cell = (wallet as any)[header];
        if (typeof cell === "string") {
          cell = cell.replace(/"/g, '""');
          if (cell.includes(",") || cell.includes('"')) {
            cell = `"${cell}"`;
          }
        }
        return cell;
      });
      csvRows.push(values.join(","));
    }
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wallets.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const dataIds: UniqueIdentifier[] = data.map((item) => item.id);

  return (
    <Tabs defaultValue="wallets" className="w-full flex-col gap-6">
      {/* Updated Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center">
          <div className="w-full sm:w-auto">
            <AddColdStorageWalletForm
              onSubmit={async (newRecord) => {
                const addressAlreadyExists = data.some(
                  (wallet) =>
                    wallet.address.trim().toLowerCase() ===
                    newRecord.address.trim().toLowerCase()
                );
                if (addressAlreadyExists) return;

                try {
                  const res = await fetch("/api/cold-storage-wallets", {
                    method: "POST",
                    body: JSON.stringify(newRecord),
                    headers: { "Content-Type": "application/json" },
                  });

                  if (!res.ok) {
                    if (res.status === 409) {
                      const error = await res.json();
                      if (
                        error.detail.includes(
                          "Wallet with that address already exists"
                        )
                      ) {
                        return;
                      }
                    }
                    const error = await res.json();
                    throw new Error(
                      error.detail || "Error saving wallet data to backend"
                    );
                  }

                  const saved = await res.json();
                  setData((prev) => [
                    ...prev,
                    { ...saved, label: saved.name, category: "Cold" },
                  ]);
                  toast.success("Wallet saved to backend!");
                } catch (err: any) {
                  console.error("❌ Save error:", err);
                  toast.error(
                    err.message || "Network error while saving wallet"
                  );
                }
              }}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={syncWalletProfiles}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                "Sync Wallets"
              )}
            </Button>
          </div>
        </div>
      </div>

      <TabsContent
        value="wallets"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
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
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

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

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>Confirm Delete</DialogTitle>
            <div className="flex flex-col space-y-4">
              <p>
                Are you sure you want to delete{" "}
                <strong>{walletToDelete?.label}</strong>?
              </p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (walletToDelete) {
                    handleDelete(walletToDelete.id.toString());
                  }
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>
    </Tabs>
  );
};

export default WalletDataTable;
