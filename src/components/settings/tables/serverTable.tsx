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
import { useCallback, useEffect, useState } from "react";
import { Input } from "../../ui/input";
import { DeleteAlertDialog } from "../alerts/deleteServerAlert";
import { LoaderCircle, RefreshCcw, Wifi, WifiOff } from "lucide-react";
import { jellydataDisplayed } from "@/types/actions.types";
import { State } from "@/types/jellyfin-api.types";
import { AddServerDialog } from "../dialogs/AddserverDialog";
import Link from "next/link";
import { getJellyfinServers } from "@/server/actions/settings.actions";
import { Button } from "../../ui/button";

export const columns: ColumnDef<jellydataDisplayed>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
  },
  {
    accessorKey: "serverUrl",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("serverUrl") as string;
      return (
        <Link href={address} title={address} className="hover:underline">
          {address.split("//")[1]}
        </Link>
      );
    },
  },
  {
    accessorKey: "serverUsername",
    header: "Username",
    cell: ({ row }) => {
      const username = row.getValue("serverUsername") as string;
      return <div title={username}>{username}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as State;
      return (
        <div className="flex items-center">
          {status === "Up" && <Wifi className="w-4 h-4 text-green-500 mr-2" />}
          {status === "Down" && (
            <WifiOff className="w-4 h-4 text-red-500 mr-2" />
          )}
          {status === "Checking" && (
            <LoaderCircle className="w-4 h-4 mr-2 animate-reverse-spin" />
          )}
          {status}
        </div>
      );
    },
  },
];

interface DataTableProps {
  columns: ColumnDef<jellydataDisplayed>[];
  serversData: jellydataDisplayed[];
}

export function ServerTable({ columns, serversData }: DataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [data, setData] = useState<jellydataDisplayed[]>(serversData);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const refreshTable = useCallback(async () => {
    setIsFetching(true);

    setData((prevData) =>
      prevData.map((server) => ({ ...server, status: "Checking" as State }))
    );
    const response = await getJellyfinServers();

    if (response.success && response.data) {
      setData(response.data);
    }
    setIsFetching(false);
  }, []);

  // refetch every 30s
  useEffect(() => {
    const refresh = setInterval(refreshTable, 30000);

    return () => clearInterval(refresh);
  }, [refreshTable]);

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
    <div className="space-y-2">
      <div className="flex justify-between gap-2">
        <Input
          placeholder="Search Servers"
          disabled={data.length === 0}
          value={
            (table.getColumn("serverUrl")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("serverUrl")?.setFilterValue(event.target.value)
          }
          className=" bg-black/30 backdrop-blur-lg max-w-sm"
        />
        <div className="flex gap-2">
          <AddServerDialog onAdd={refreshTable} />
          <DeleteAlertDialog
            disable={table.getFilteredSelectedRowModel().rows.length === 0}
            checkedRows={checkedRows.map((row) => ({
              address: row.serverUrl,
              username: row.serverUsername,
            }))}
            onDelete={refreshTable}
          />
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={refreshTable}
            disabled={isFetching}
          >
            <RefreshCcw className={`${isFetching && "animate-reverse-spin"}`} />
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-md border bg-black/50 backdrop-blur-lg">
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
                  No Servers.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <span className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} server(s) selected.
        </span>
      </div>
    </div>
  );
}
