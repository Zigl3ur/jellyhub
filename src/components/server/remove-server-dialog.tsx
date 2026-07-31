import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import type { JellyfinServer } from "@/types";
import { deleteJellyfinServer } from "@/functions/settings.functions";

interface RemoveServerDialogProps extends BaseDialog.Root.Props {
  server: JellyfinServer & { serverName?: string | null };
  onSuccess?: () => void;
}

export default function RemoveServerDialog({
  server,
  onSuccess,
  ...props
}: RemoveServerDialogProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: { url: string }) => deleteJellyfinServer({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["jellydata"] });
      onSuccess?.();
    },
  });

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Server</DialogTitle>
        </DialogHeader>
        {isError && (
          <Alert
            type="destructive"
            title="Failed to remove server"
            message={error.message}
          />
        )}
        <span>
          You are about to permanently remove the configured Jellyfin server
          with{" "}
          {server.serverName && (
            <>
              the name <Badge>{server.serverName}</Badge> and{" "}
            </>
          )}
          the url <Badge>{server.serverUrl}</Badge>.
        </span>
        <span>Are you sure ?</span>
        <DialogFooter className="flex justify-end items-center gap-2">
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => mutate({ url: server.serverUrl })}
          >
            {isPending ? (
              <>
                <LoaderIcon /> Removing
              </>
            ) : (
              "Remove"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
