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
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { ServerDialog } from "./serverDialog";
import { DeleteAlertDialog } from "./deleteAlert";
import { LoaderCircle, Wifi, WifiOff } from "lucide-react";
import { checkConn } from "@/lib/api.jellyfin";

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
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      return (
        <div
          className="w-[80px] sm:w-[150px] md:w-[200px] truncate"
          title={address}
        >
          {address.split("//")[1]}
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      const username = row.getValue("username") as string;
      return (
        <div
          className="w-[80px] sm:w-[150px] md:w-[200px] truncate"
          title={username}
        >
          {username}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as "Up" | "Down" | "Checking";
      return (
        <div className="flex items-center">
          {status === "Up" && <Wifi className="w-4 h-4 text-green-500 mr-2" />}
          {status === "Down" && (
            <WifiOff className="w-4 h-4 text-red-500 mr-2" />
          )}
          {status === "Checking" && (
            <LoaderCircle className="w-4 h-4 text-yellow-500 mr-2 animate-spin" />
          )}
          {status}
        </div>
      );
    },
  },
];

interface DataTableProps {
  columns: ColumnDef<jellyfinServer>[];
  baseData: jellyfinServer[];
  addAction: (
    data: jellyfinServerCredentials
  ) => Promise<errorJellyfin | boolean>;
  deleteAction: (
    data: Omit<Omit<jellyfinServer, "status">, "token">[]
  ) => Promise<errorJellyfin | boolean>;
}

export function ServerTable({
  columns,
  baseData,
  addAction,
  deleteAction,
}: DataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [data, setData] = useState<jellyfinServer[]>(baseData);

  // check status every 30s and when data updates
  useEffect(() => {
    async function checkServerStatus() {
      const updatedData = [...data];
      for (const server of updatedData) {
        const serverStatus = await checkConn(server.address, server.token); // token is send to client maybe not the best idea

        if (server.status !== serverStatus) {
          server.status = serverStatus;
          setData([...updatedData]);
        }
      }
    }

    checkServerStatus();
    const interval = setInterval(() => {
      checkServerStatus();
    }, 30000);
    return () => clearInterval(interval);
  }, [data]);

  // update table data
  useEffect(() => {
    setData(baseData);
  }, [baseData]);

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
    },
  });

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
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <ServerDialog addAction={addAction} />
          <DeleteAlertDialog
            disable={table.getFilteredSelectedRowModel().rows.length === 0}
            onClick={deleteAction}
            checkedRows={checkedRows}
          />
        </div>
        <div className="text-sm text-muted-foreground py-2">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} server(s) selected.
        </div>
      </div>
    </div>
  );
}
