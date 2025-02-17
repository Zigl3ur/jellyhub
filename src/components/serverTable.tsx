"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";
import {
  errorJellyfin,
  jellyfinServer,
  jellyfinServerCredentials,
} from "@/types/jellyfin.types";
import { useState } from "react";
import { Input } from "./ui/input";
import { ServerDialog } from "./serverDialog";
import { DeleteAlertDialog } from "./deleteAlert";

export const columns: ColumnDef<jellyfinServer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="flex items-center justify-center"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="flex items-center justify-center"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

interface DataTableProps {
  columns: ColumnDef<jellyfinServer>[];
  data: jellyfinServer[];
  addAction: (
    data: jellyfinServerCredentials
  ) => Promise<errorJellyfin | boolean>;
  deleteAction: (
    data: Omit<jellyfinServer, "status">[]
  ) => Promise<errorJellyfin | boolean>;
}

export function ServerTable({
  columns,
  data,
  addAction,
  deleteAction,
}: DataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
    },
  });

  // when going back after logout, throw an error here
  const checkedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  return (
    <div>
      <Input
        placeholder="Search Servers"
        value={(table.getColumn("address")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("address")?.setFilterValue(event.target.value)
        }
        className="mb-4 bg-black/30 backdrop-blur-lg"
      />
      <div className="rounded-md border bg-black/50 backdrop-blur-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="space-x-2">
          <ServerDialog addAction={addAction} />
          <DeleteAlertDialog
            disable={table.getFilteredSelectedRowModel().rows.length === 0}
            onClick={deleteAction}
            checkedRows={checkedRows}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} server(s) selected.
        </div>
      </div>
    </div>
  );
}
