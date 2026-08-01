import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import z from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
import { FieldError, FieldLabel, FieldRoot } from "../ui/field";
import { Input, InputAddon } from "../ui/input";
import Badge from "../ui/badge";
import type { JellyfinServer } from "@/types";
import type { Dialog as BaseDialog } from "@base-ui/react";
import { refreshServerToken } from "@/functions/jellyfin.functions";

const defaultValues = {
  password: "",
};

interface RefreshTokenDialogProps extends BaseDialog.Root.Props {
  server: JellyfinServer;
  onSuccess?: () => void;
}

export default function RefreshTokenDialog({
  server,
  onSuccess,
  onOpenChange,
  ...props
}: RefreshTokenDialogProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: (data: { url: string; password: string }) =>
      refreshServerToken({ data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [server.serverUrl, "state"],
      });
      onSuccess?.();
      form.reset();
    },
  });

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: z.object({
        password: z.string().min(1, { error: "Provide server password" }),
      }),
    },
    onSubmit: ({ value }) =>
      mutate({
        url: server.serverUrl,
        password: value.password,
      }),
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Dialog
      {...props}
      onOpenChange={(state, event) => {
        onOpenChange?.(state, event);
        if (!state) {
          reset();
          form.reset();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refresh Server Token</DialogTitle>
        </DialogHeader>
        {isError && (
          <Alert
            type="destructive"
            title="Failed to refresh server token"
            message={error.message}
          />
        )}
        <div>
          Provide the password for the user{" "}
          <Badge>{server.serverUsername}</Badge>
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="password"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name={field.name} invalid={invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="Server password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <InputAddon side="right">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </InputAddon>
                  </Input>
                  <FieldError match={invalid}>{error?.message}</FieldError>
                </FieldRoot>
              );
            }}
          />

          <DialogFooter className="flex justify-end items-center gap-2">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <form.Subscribe
              selector={(state) => [state.canSubmit]}
              children={([canSubmit]) => (
                <Button type="submit" disabled={!canSubmit || isPending}>
                  {isPending ? (
                    <>
                      <LoaderIcon /> Refreshing
                    </>
                  ) : (
                    "Refresh"
                  )}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
