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

export default function SettingsLoading() {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Search Servers"
          disabled={true}
          className=" bg-black/30 backdrop-blur-lg"
        />
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
      <div className="rounded-md border bg-black/50 backdrop-blur-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex">
                  <Checkbox disabled={true} />
                </div>
              </TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {[0, 1, 2].map((value) => (
              <TableRow key={value}>
                <TableCell>
                  <div className="flex">
                    <Skeleton className="h-4 w-4" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-[80px] sm:w-[150px] md:w-[200px]">
                    <Skeleton className="h-4 w-full" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-[80px] sm:w-[150px] md:w-[200px]">
                    <Skeleton className="h-4 w-full" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </TableCell>
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
