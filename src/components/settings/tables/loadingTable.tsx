import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Plus, RefreshCcw, Trash2 } from "lucide-react";

interface LoadingTableProps {
  inputPlaceholder: string;
  tableHeads: Array<string>;
}

export default function LoadingTable({
  inputPlaceholder,
  tableHeads,
}: LoadingTableProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-2">
        <Input
          placeholder={inputPlaceholder}
          disabled={true}
          className=" bg-black/30 backdrop-blur-lg max-w-sm"
        />
        <div className="flex gap-2">
          <Button variant="outline" size={"icon"} disabled={true}>
            <Plus />
          </Button>
          <Button variant="destructive" disabled={true} size={"icon"}>
            <Trash2 />
          </Button>
          <Button size={"icon"} variant={"outline"} disabled={true}>
            <RefreshCcw className="animate-reverse-spin" />
          </Button>
        </div>
      </div>
      <div className="rounded-md border bg-black/50 backdrop-blur-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex">
                  <Checkbox disabled={true} />
                </div>
              </TableHead>
              {tableHeads.map((head, index) => {
                return <TableHead key={index}>{head}</TableHead>;
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {tableHeads.slice(0, -1).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex">
                    <Skeleton className="h-4 w-4" />
                  </div>
                </TableCell>
                {tableHeads.map((_, index) => (
                  <TableCell key={index}>
                    <div className="w-[80px] sm:w-[150px] md:w-[200px]">
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <span className="text-sm text-muted-foreground">
          <Skeleton className="h-4 w-32" />
        </span>
      </div>
    </div>
  );
}
