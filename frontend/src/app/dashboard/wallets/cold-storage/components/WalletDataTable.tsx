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

import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";

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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const fetchWallets = async () => {
    try {
      const res = await fetch("/api/wallets");
      const wallets = await res.json();
      const formatted = wallets.map((w: any) => ({
        id: w.id,
        label: w.name,
        address: w.address,
        balance: w.balance,
        lastChecked: w.lastChecked,
        category: "Cold",
      }));
      setData(formatted);
    } catch (err) {
      console.error("❌ Failed to fetch wallets", err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  // ✅ Columns must be defined after hooks, before useReactTable
  const columns: ColumnDef<Wallet>[] = [
    {
      accessorKey: "label",
      header: () => <div className="text-left px-2">Label</div>,
      cell: ({ row }) => (
        <div className="text-left px-2">
          <WalletDrawer item={row.original} />
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: () => <div className="text-left text-sm">Address</div>,
      cell: ({ row }) => (
        <div className="text-left text-sm">{row.original.address}</div>
      ),
    },
    {
      accessorKey: "balance",
      header: () => <div className="text-right text-sm">Balance</div>,
      cell: ({ row }) => (
        <div className="text-right text-sm">{row.original.balance}</div>
      ),
    },
    {
      accessorKey: "lastChecked",
      header: () => <div className="text-right text-sm">Last Checked</div>,
      cell: ({ row }) => (
        <div className="text-right text-sm">{row.original.lastChecked}</div>
      ),
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

  const dataIds: UniqueIdentifier[] = data.map((item) => item.id);

  return (
    <Tabs defaultValue="wallets" className="w-full flex-col gap-6">
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

        {/* ✅ Confirm Delete Dialog */}
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
