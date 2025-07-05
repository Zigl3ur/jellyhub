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
import { useCallback, useState } from "react";
import { Input } from "../../ui/input";
import { RefreshCcw } from "lucide-react";
import { userDataType } from "@/types/actions.types";
import { getUsersList } from "@/server/actions/settings.actions";
import { Button } from "../../ui/button";
import { UserWithRole } from "better-auth/plugins/admin";
import { AddUserDialog } from "../dialogs/addUserDialog";
import { DeleteUserDialog } from "../alerts/deleteUserAlert";

export const columns: ColumnDef<UserWithRole>[] = [
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <div
          className="w-[80px] sm:w-[150px] md:w-[200px] truncate"
          title={role}
        >
          {role}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as Date;
      return (
        <div
          className="w-[80px] sm:w-[150px] md:w-[200px] truncate"
          title={updatedAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        >
          {updatedAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return (
        <div
          className="w-[80px] sm:w-[150px] md:w-[200px] truncate"
          title={createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        >
          {createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
];

interface DataTableProps {
  columns: ColumnDef<UserWithRole>[];
  usersData: userDataType;
}

export function UserTable({ columns, usersData }: DataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [data, setData] = useState<UserWithRole[]>(usersData.users);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const refreshTable = useCallback(async () => {
    setIsFetching(true);
    const response = await getUsersList();

    if (response.success && response.data) {
      setData(response.data.users);
    }
    setIsFetching(false);
  }, []);

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
      <div className="flex gap-2">
        <Input
          placeholder="Search Users"
          disabled={data.length === 0}
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className=" bg-black/30 backdrop-blur-lg"
        />
        <AddUserDialog onAdd={refreshTable} />
        <DeleteUserDialog
          disable={table.getFilteredSelectedRowModel().rows.length === 0}
          checkedRows={checkedRows.map((user) => {
            // @ts-expect-error idk why ts refuse to get the property username but its here (better auth issue i guess)
            return user.username;
          })}
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
                  No Users.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <span className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} user(s) selected.
        </span>
      </div>
    </div>
  );
}
