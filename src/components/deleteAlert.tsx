import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { errorJellyfin } from "@/types/jellyfin.types";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

export function DeleteAlertDialog(deleteProps: {
  disable: boolean;
  checkedRows: {
    address: string;
    username: string;
  }[];
  onClick: (
    data: {
      address: string;
      username: string;
    }[]
  ) => Promise<errorJellyfin | boolean>;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={deleteProps.disable}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the selected servers from the list
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant={"destructive"}
            onClick={() => {
              setLoading(true);
              deleteProps.onClick(deleteProps.checkedRows).then((result) => {
                if (typeof result === "object" && "error" in result) {
                  setLoading(false);
                  toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                    duration: 2500,
                  });
                } else {
                  setLoading(false);
                  setOpen(false);
                  toast({
                    title: "Success",
                    description: `Successfully deleted ${deleteProps.checkedRows.length} server(s)`,
                    variant: "success",
                    duration: 2500,
                  });
                }
              });
            }}
          >
            {loading && <LoaderCircle className="animate-spin" />}
            Remove
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
