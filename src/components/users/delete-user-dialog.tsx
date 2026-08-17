import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Button from "../ui/button";
import Badge from "../ui/badge";
import LoaderIcon from "../ui/loader-icon";
import { Alert } from "../ui/alert";
import type { Dialog as BaseDialog } from "@base-ui/react";
import type { UserWithRole } from "better-auth/plugins";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

interface RemoveServerDialogProps extends BaseDialog.Root.Props {
  user: UserWithRole;
  onSuccess?: () => void;
}

export default function DeleteUserDialog({
  user,
  onSuccess,
  ...props
}: RemoveServerDialogProps) {
  const queryClient = useQueryClient();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (userId: string) => {
    await authClient.admin.removeUser({
      userId,
      fetchOptions: {
        onRequest: () => {
          setError(null);
          setIsPending(true);
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["usersList"] });
          onSuccess?.();
        },
        onError: ({ error }) => setError(error.message),
        onResponse: () => setIsPending(false),
      },
    });
  };

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Server</DialogTitle>
        </DialogHeader>
        {error && (
          <Alert
            type="destructive"
            title="Failed to delte user"
            message={error}
          />
        )}
        <span>
          You are about to permanently delete the user{" "}
          <Badge>{user.name}</Badge>.
        </span>
        <span>Are you sure ?</span>
        <DialogFooter className="flex justify-end items-center gap-2">
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => deleteUser(user.id)}
          >
            {isPending ? (
              <>
                <LoaderIcon /> Deleting
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
