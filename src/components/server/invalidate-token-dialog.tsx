import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Alert } from "../ui/alert";
import LoaderIcon from "../ui/loader-icon";
import type { JellyfinServer } from "@/types";
import type { Dialog as BaseDialog } from "@base-ui/react";
import { invalidateServerTokenDB } from "@/functions/jellyfin.functions";
import Badge from "../ui/badge";

interface InvalidateTokenDialogProps extends BaseDialog.Root.Props {
  server: JellyfinServer;
  onSuccess?: () => void;
}

export default function InvalidateTokenDialog({
  server,
  onSuccess,
  onOpenChange,
  ...props
}: InvalidateTokenDialogProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: (data: { url: string }) => invalidateServerTokenDB({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [server.serverUrl, "state"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["items"],
        refetchType: "all",
      });
      onSuccess?.();
    },
  });

  return (
    <Dialog
      {...props}
      onOpenChange={(state, event) => {
        onOpenChange?.(state, event);
        if (!state) reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invalidate Server Token</DialogTitle>
        </DialogHeader>
        {isError && (
          <Alert
            type="destructive"
            title="Failed to rerol server token"
            message={error.message}
          />
        )}
        <div>
          This will revoke the token for the server{" "}
          <Badge>{server.serverName}</Badge> with url{" "}
          <Badge>{server.serverUrl}</Badge>. You will need to re-authenticate to
          be able to fetch medias from it.
        </div>
        <DialogFooter className="flex justify-end items-center gap-2">
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() =>
              mutate({
                url: server.serverUrl,
              })
            }
          >
            {isPending ? (
              <>
                <LoaderIcon /> Invalidating
              </>
            ) : (
              "Invalidate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
