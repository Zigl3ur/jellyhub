import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import { ssoProvidersList } from "@/functions/sso.functions";
import { authClient } from "@/lib/auth-client";

interface DeleteSsoDialogProps extends BaseDialog.Root.Props {
  provider: Awaited<ReturnType<typeof ssoProvidersList>>[number];
  onSuccess?: () => void;
}

export default function DeleteSsoDialog({
  provider,
  onSuccess,
  ...props
}: DeleteSsoDialogProps) {
  const queryClient = useQueryClient();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProvider = async () => {
    await authClient.sso.deleteProvider({
      providerId: provider.providerId,
      fetchOptions: {
        onRequest: () => {
          setError(null);
          setIsPending(true);
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["ssoProviders"] });
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
          <DialogTitle>Delete SSO Provider</DialogTitle>
        </DialogHeader>
        {error && (
          <Alert
            type="destructive"
            title="Failed to delete provider"
            message={error}
          />
        )}
        <span>
          You are about to delete the SSO provider{" "}
          <Badge>{provider.providerId}</Badge>.
        </span>
        <span>Users will no longer be able to sign in with this provider.</span>
        <span>Are you sure ?</span>
        <DialogFooter className="flex justify-end items-center gap-2">
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={deleteProvider}
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
