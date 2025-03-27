///home/remem/bitcoinholdings/frontend/src/app/dashboard/governance/components/data_table.tsx

"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";

// shadcn/ui components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { truncateHash } from "/home/remem/bitcoinholdings/frontend/src/lib/utils";
import {
  LabelWithValue,
  LabelWithCopy,
} from "/home/remem/bitcoinholdings/frontend/src/components/ui/display-utils";
import { AddGovernanceForm } from "/home/remem/bitcoinholdings/frontend/src/app/dashboard/governance/components/AddGovernanceForm";

// 1. Updated governance schema
export const governanceSchema = z.object({
  id: z.number(),
  title: z.string(),
  documentType: z.string(),
  anchoringStatus: z.string(),
  txid: z.string(),
  anchoredAt: z.string(),
  createdBy: z.string(),
  createdAt: z.string(),
  entity: z.string(),
  documentHash: z.string(),
  previousHash: z.string().nullable(),
  description: z.string(),
  documentUrl: z.string().url(),
  btcBlockHeight: z.number(),
});

// 2. Drag handle (unchanged)
{/* function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}*/}


// 3. Column Definitions
const columns: ColumnDef<z.infer<typeof governanceSchema>>[] = [
  // {
  //   id: "drag",
  //   header: () => <div className="w-10" />,
  //   cell: ({ row }) => (
  //     <div className="w-10">
  //       <DragHandle id={row.original.id} />
  //     </div>
  //   ),
  // },
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <div className="w-5 flex items-center justify-center">
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) =>
  //           table.toggleAllPageRowsSelected(!!value)
  //         }
  //         aria-label="Select all"
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="w-5 flex items-center justify-center">
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "title",
    header: () => <div className="text-left px-2">Title</div>,
    cell: ({ row }) => (
      <div className="text-left px-2">
        <TableCellViewer item={row.original} />
      </div>
    ),
  },
  {
    accessorKey: "documentType",
    header: () => <div className="text-left text-sm">Document Type</div>,
    cell: ({ row }) => (
      <div className="text-left text-sm">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.documentType}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "entity",
    header: () => <div className="text-center text-sm">Entity</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">
        <Badge variant="secondary">{row.original.entity}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "anchoringStatus",
    header: () => <div className="text-center text-s">Anchoring Status</div>,
    cell: ({ row }) => (
      <div className="flex justify-center items-center gap-1 text-muted-foreground">
        {row.original.anchoringStatus === "Anchored" ? (
          <IconCircleCheckFilled className="text-green-500 size-4" />
        ) : (
          <IconLoader className="animate-spin size-4" />
        )}
        <Badge variant="outline">{row.original.anchoringStatus}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "txid",
    header: () => <div className="text-left text-sm">TxID</div>,
    cell: ({ row }) => (
      <div className="text-left text-sm">
        <code className="truncate text-xs">{row.original.txid}</code>
      </div>
    ),
  },
  {
    accessorKey: "anchoredAt",
    header: () => <div className="text-left text-sm">Anchored At</div>,
    cell: ({ row }) => (
      <div className="text-left text-sm">{row.original.anchoredAt}</div>
    ),
  },
  {
    accessorKey: "documentHash",
    header: () => <div className="text-center text-sm">Document Hash</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">
        <code className="truncate text-xs">
          {truncateHash(row.original.documentHash)}
        </code>
      </div>
    ),
  },
  {
    accessorKey: "previousHash",
    header: () => <div className="text-left text-sm">Previous Hash</div>,
    cell: ({ row }) => (
      <div className="text-left text-sm">
        {row.original.previousHash ? (
          <code className="truncate text-xs">
            {truncateHash(row.original.previousHash)}
          </code>
        ) : (
          <span className="text-muted-foreground italic text-xs">None</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdBy",
    header: () => <div className="text-left text-sm">Created By</div>,
    cell: ({ row }) => (
      <div className="text-left text-sm">{row.original.createdBy}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-left text-sm">Created At</div>,
    cell: ({ row }) => (
      <div className="text-left text-sm">{row.original.createdAt}</div>
    ),
  },
  {
    accessorKey: "btcBlockHeight",
    header: () => <div className="text-left text-sm">btcBlockHeight</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm">{row.original.btcBlockHeight}</div>
    ),
  },
];





// 4. DraggableRow (unchanged)
function DraggableRow({ row }: { row: Row<z.infer<typeof governanceSchema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// 5. Main DataTable component
export function GovernanceDataTable({
  data: initialData,
}: {
  data: z.infer<typeof governanceSchema>[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // For drag-and-drop
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );
  const sortableId = React.useId();

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data.map(({ id }) => id),
    [data]
  );

  // React Table instance
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

  // Reorder rows after drag
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((oldData) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(oldData, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      {/* Top bar with tabs and actions */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="past-performance">Past Performance</SelectItem>
            <SelectItem value="key-personnel">Key Personnel</SelectItem>
            <SelectItem value="focus-documents">Focus Documents</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="past-performance">
            Past Performance <Badge variant="secondary">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel">
            Key Personnel <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          {/* Customize Columns */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Add Record */}
          <AddGovernanceForm/>
        </div>
      </div>

      {/* Main tab content */}
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
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
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
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
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}

// 6. Example chart data (kept the same)
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

// 7. Chart config (unchanged, you can rename if you want)
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

// 8. The side-drawer viewer component (unchanged except renaming fields)

export function TableCellViewer({
  item,
}: {
  item: z.infer<typeof governanceSchema>;
}) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-fit px-0 text-left text-sm font-medium"
        >
          {item.title}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-md">
        <DrawerHeader className="gap-1 pb-0">
          <DrawerTitle className="text-lg">{item.title}</DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            {item.documentType} • {item.entity}
          </DrawerDescription>
        </DrawerHeader>

        {/* ⬇️ START MAIN CONTENT */}
        <div className="px-4 py-2">
          {/* METADATA GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <LabelWithValue
              label="Anchoring Status"
              value={item.anchoringStatus}
            />
            <LabelWithCopy label="TxID" value={item.txid} />
            <LabelWithValue
              label="Anchored At"
              value={item.anchoredAt || "Pending"}
            />
            <LabelWithCopy label="Document Hash" value={item.documentHash} />
            <LabelWithCopy
              label="Previous Hash"
              value={item.previousHash || "None"}
            />
            <LabelWithValue label="Created By" value={item.createdBy} />
            <LabelWithValue label="Created At" value={item.createdAt} />
          </div>

          {/* ⬇️ DESCRIPTION SECTION (Place this right below the grid) */}
          <div className="mt-6 space-y-2">
            <div className="text-muted-foreground text-xs">Description</div>
            <div className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">
              {item.description}
            </div>
          </div>

          {/* ⬇️ DOCUMENT LINK SECTION */}
          {item.documentUrl && (
            <div className="mt-4 flex flex-col gap-2">
              <div className="text-muted-foreground text-xs">
                Attached Document
              </div>
              <a
                href={item.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm underline underline-offset-2"
              >
                View Document
              </a>
            </div>
          )}
        </div>
        {/* ⬆️ END MAIN CONTENT */}

        {/* FOOTER */}
        <DrawerFooter className="px-4">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

