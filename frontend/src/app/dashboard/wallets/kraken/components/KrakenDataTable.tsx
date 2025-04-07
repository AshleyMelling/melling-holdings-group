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

  // Fetch Kraken data from your backend API and transform it into an array
  const fetchKrakenData = async () => {
    setIsLoading(true); // Start loading
    try {
      const res = await fetch("/api/kraken/balance", {
        cache: "no-store",
        credentials: "include", // This sends the HttpOnly cookie
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      console.log("Fetched Kraken data:", result);
      const wallets: KrakenWallet[] = Object.entries(result).map(
        ([asset, balance]) => ({
          id: asset,
          asset,
          balance: parseFloat(balance as string),
        })
      );
      setData(wallets);
    } catch (err) {
      console.error("❌ Failed to fetch Kraken data", err);
      setData([]);
    } finally {
      setIsLoading(false); // End loading
    }
  };


  // Fetch data on mount
  useEffect(() => {
    fetchKrakenData();
  }, []);

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
      cell: ({ row }) => (
        <div className="text-left px-2 font-mono">{row.original.asset}</div>
      ),
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
    <Tabs defaultValue="kraken" className="w-full flex-col gap-6">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchKrakenData}
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
