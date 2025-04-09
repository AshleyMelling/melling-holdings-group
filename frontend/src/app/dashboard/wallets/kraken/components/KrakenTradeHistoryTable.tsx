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

// Define the type for Kraken Trade data
export type KrakenTrade = {
  id: string;
  asset_pair: string;
  order_txid: string;
  cost: string;
  fee: string;
  vol: string;
  time: number;
};

// Draggable row for table display
function DraggableRow({ row }: { row: Row<KrakenTrade> }) {
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

export default function KrakenTradeHistoryTable() {
  const [data, setData] = useState<KrakenTrade[]>([]);
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

  // Function to fetch Kraken Trade History from your backend API
  const fetchTrades = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/kraken/history/trades", {
        cache: "no-store",
        credentials: "include", // Sends the cookie automatically
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      console.log("Fetched Kraken trades:", result);
      // Assuming result is an array of trade objects
      setData(result);
    } catch (err) {
      console.error("❌ Failed to fetch Kraken trades", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // New sync function to first trigger the backend sync endpoint then refresh trades
  const handleSyncAndRefresh = async () => {
    try {
      setIsLoading(true);
      // Trigger sync endpoint
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
      // Now fetch the updated trade history from the backend API
      await fetchTrades();
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // Define table columns for KrakenTrade
  const columns: ColumnDef<KrakenTrade>[] = [
    {
      accessorKey: "asset_pair",
      header: ({ column }) => (
        <div
          className="text-left px-2 cursor-pointer select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Asset Pair
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="inline w-4 h-4 ml-1" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="inline w-4 h-4 ml-1" />
          ) : null}
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-left px-2 font-mono">
          {row.original.asset_pair}
        </div>
      ),
    },
    {
      accessorKey: "order_txid",
      header: "Order TxID",
      cell: ({ row }) => (
        <div className="text-left px-2 font-mono text-xs">
          {row.original.order_txid}
        </div>
      ),
    },
    {
      accessorKey: "cost",
      header: "Cost",
      cell: ({ row }) => (
        <div className="text-right px-2">
          {parseFloat(row.original.cost).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "fee",
      header: "Fee",
      cell: ({ row }) => (
        <div className="text-right px-2">
          {parseFloat(row.original.fee).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "vol",
      header: "Volume",
      cell: ({ row }) => (
        <div className="text-right px-2">
          {parseFloat(row.original.vol).toFixed(4)}
        </div>
      ),
    },
    {
      accessorKey: "time",
      header: "Time",
      cell: ({ row }) => (
        <div className="text-right px-2 text-xs text-muted-foreground">
          {new Date(row.original.time * 1000).toLocaleString()}
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
    <Tabs defaultValue="trades" className="w-full flex-col gap-6">
      {/* Top Toolbar with Sync and Refresh Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 lg:px-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSyncAndRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Syncing & Refreshing Trade History...
            </>
          ) : (
            "Sync Trade History"
          )}
        </Button>
      </div>

      <TabsContent
        value="trades"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
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
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No trade history.
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
}
