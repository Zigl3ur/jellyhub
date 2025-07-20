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
import { deleteServerAction } from "@/server/actions/settings.actions";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteAlertDialogProps {
  disable: boolean;
  checkedRows: {
    address: string;
    username: string;
  }[];
  onDelete: () => void;
}

export function DeleteAlertDialog({
  disable,
  checkedRows,
  onDelete,
}: DeleteAlertDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setLoading(true);

    deleteServerAction(checkedRows)
      .then((result) => {
        if (result.success) {
          toast.success("Success", { description: result.message });
          setOpen(false);
        } else if (result.error)
          toast.error("Error", {
            description: result.error,
          });
      })
      .finally(() => {
        setLoading(false);
        onDelete();
      });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={disable} size={"icon"}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the selected server(s) from the list
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={loading}
            variant="destructive"
            onClick={handleDelete}
          >
            {loading && <LoaderCircle className="animate-spin" />}
            Remove
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
