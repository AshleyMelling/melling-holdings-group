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
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
} from "@tabler/icons-react";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";

// Update the type to reflect all CSV columns
export type KrakenLedger = {
  id: string;
  txid: string;
  refid: string;
  time: number; // timestamp as number (e.g. Unix time)
  type: string;
  subtype: string;
  aclass: string;
  asset: string;
  wallet: string;
  amount: string;
  fee: string;
  balance: string;
  raw_data?: any;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

function DraggableLedgerRow({ row }: { row: Row<KrakenLedger> }) {
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

export default function KrakenLedgerHistoryTable() {
  const [data, setData] = useState<KrakenLedger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "time", desc: true },
  ]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const fetchLedgers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/kraken/history/ledgers", {
        cache: "no-store",
        credentials: "include", // Sends the cookie automatically
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      console.log("Fetched Kraken ledgers:", result);
      setData(result);
    } catch (err) {
      console.error("❌ Failed to fetch Kraken ledgers", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncAndRefresh = async () => {
    try {
      setIsLoading(true);
      const syncResponse = await fetch("/api/kraken/history/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!syncResponse.ok) {
        throw new Error("Sync failed: " + syncResponse.statusText);
      }
      const syncResult = await syncResponse.json();
      console.log("Sync result:", syncResult);
      await fetchLedgers();
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  // Define columns to show most of the CSV fields
  const columns: ColumnDef<KrakenLedger>[] = [
    {
      accessorKey: "refid",
      header: "RefID",
      cell: ({ row }) => (
        <div className="px-2 font-mono">{row.original.refid}</div>
      ),
    },
    {
      accessorKey: "txid",
      header: "TxID",
      cell: ({ row }) => (
        <div className="px-2 font-mono">{row.original.txid}</div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <div
          className="cursor-pointer select-none px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="inline w-4 h-4 ml-1" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="inline w-4 h-4 ml-1" />
          ) : null}
        </div>
      ),
      cell: ({ row }) => (
        <div className="capitalize px-2">{row.original.type}</div>
      ),
    },
    {
      accessorKey: "subtype",
      header: "Subtype",
      cell: ({ row }) => (
        <div className="px-2">{row.original.subtype || "-"}</div>
      ),
    },
    {
      accessorKey: "aclass",
      header: "Asset Class",
      cell: ({ row }) => (
        <div className="px-2">{row.original.aclass || "-"}</div>
      ),
    },
    {
      accessorKey: "asset",
      header: "Asset",
      cell: ({ row }) => (
        <div className="px-2 font-mono">{row.original.asset}</div>
      ),
    },
    {
      accessorKey: "wallet",
      header: "Wallet",
      cell: ({ row }) => (
        <div className="px-2">{row.original.wallet || "-"}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="text-right px-2">
          {parseFloat(row.original.amount).toFixed(8)}
        </div>
      ),
    },
    {
      accessorKey: "fee",
      header: "Fee",
      cell: ({ row }) => (
        <div className="text-right px-2">
          {parseFloat(row.original.fee).toFixed(8)}
        </div>
      ),
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => (
        <div className="text-right px-2">
          {parseFloat(row.original.balance).toFixed(8)}
        </div>
      ),
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => {
        // row.original.time is now a string in ISO format, e.g. "2025-04-09 10:01:03.647498"
        const timeValue = row.original.time;
        const dateObj = new Date(timeValue);
        // Check if the date is valid:
        if (isNaN(dateObj.getTime())) {
          return (
            <div className="text-right px-2 text-xs text-muted-foreground">
              Invalid Date
            </div>
          );
        }
        return (
          <div className="text-right px-2 text-xs text-muted-foreground">
            {dateObj.toLocaleString()}
          </div>
        );
      },
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
    <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
      {/* Header + Refresh Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Ledger History</h2>
        <Button
          onClick={handleSyncAndRefresh}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refresh Ledger History...
            </>
          ) : (
            "Refresh Ledger History"
          )}
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
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
                    <DraggableLedgerRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No ledger history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      {/* Pagination */}
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
                  placeholder={`${table.getState().pagination.pageSize}`}
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
    </div>
  );
}
