import { useState } from "react";
import { deleteServerAction } from "@/functions/settings.functions";

interface DeleteAlertDialogProps {
  disable: boolean;
  checkedRows: Array<{
    address: string;
    username: string;
  }>;
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

    await deleteServerAction({ data: checkedRows })
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
