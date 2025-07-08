"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { useCallback, useEffect, useState } from "react";
import { Input } from "../../ui/input";
import { DeleteAlertDialog } from "../alerts/deleteServerAlert";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RefreshCcw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { jellydataDisplayed } from "@/types/actions.types";
import { State } from "@/types/jellyfin-api.types";
import { AddServerDialog } from "../dialogs/AddserverDialog";
import Link from "next/link";
import { getJellyfinServers } from "@/server/actions/settings.actions";
import { Button } from "../../ui/button";
import DataTable from "@/components/dataTable";
import { TableCell } from "@/components/ui/table";

export const columns: ColumnDef<jellydataDisplayed>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center w-fit">
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
      <div className="flex items-center w-fit">
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
        <div title={address}>
          <Link href={address} className="hover:underline">
            {address.split("//")[1]}
          </Link>
        </div>
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
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      columnFilters,
    },
  });

  const checkedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  return (
    <div className="w-full space-y-2">
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
          className="bg-background/50 max-w-sm"
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
      <DataTable
        table={table}
        emptyPlaceholder={
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No Servers.
          </TableCell>
        }
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} server(s) selected.
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
