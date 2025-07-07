"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

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
import DataTable from "@/components/dataTable";
import { TableCell } from "@/components/ui/table";

export const columns: ColumnDef<UserWithRole>[] = [
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
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      const username = row.getValue("username") as string;
      return <div title={username}>{username}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <div title={role}>{role}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as Date;
      return (
        <div title={updatedAt.toLocaleDateString()}>
          {updatedAt.toLocaleDateString()}
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
        <div title={createdAt.toLocaleDateString()}>
          {createdAt.toLocaleDateString()}
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
    <div className="w-full space-y-2">
      <div className="flex justify-between gap-2">
        <Input
          placeholder="Search Users"
          disabled={data.length === 0}
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="bg-background/50  max-w-sm"
        />
        <div className="flex gap-2">
          <AddUserDialog onAdd={refreshTable} />
          <DeleteUserDialog
            disable={table.getFilteredSelectedRowModel().rows.length === 0}
            checkedRows={checkedRows.map((user) => {
              return user.email;
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
      </div>
      <DataTable
        table={table}
        emptyPlaceholder={
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No Users.
          </TableCell>
        }
      />
      <div className="flex justify-end">
        <span className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} user(s) selected.
        </span>
      </div>
    </div>
  );
}
