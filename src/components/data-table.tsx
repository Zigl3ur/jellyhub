import { flexRender, Table } from "@tanstack/react-table";
import {
  Table as TableUI,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import React from "react";

interface DataTableProps<TData> {
  table: Table<TData>;
  emptyPlaceholder: React.ReactNode;
}

export default function DataTable<TData>({
  table,
  emptyPlaceholder,
}: DataTableProps<TData>) {
  return (
    <div className="rounded-md border bg-background">
      <TableUI>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>{emptyPlaceholder}</TableRow>
          )}
        </TableBody>
      </TableUI>
    </div>
  );
}
