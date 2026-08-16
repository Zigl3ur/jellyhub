import { Eye, EyeOff, Plus } from "lucide-react";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Button from "../ui/button";
import { FieldError, FieldLabel, FieldRoot } from "../ui/field";
import { Input, InputAddon } from "../ui/input";
import { Alert } from "../ui/alert";
import LoaderIcon from "../ui/loader-icon";
import type { addServerSchemaType } from "@/schemas/settings.schema";
import { addServerSchema } from "@/schemas/settings.schema";
import { addJellyfinServer } from "@/functions/server.functions";

const defaultValues: addServerSchemaType = {
  url: "",
  username: "",
  password: "",
};

export default function AddServerDialog() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: (data: addServerSchemaType) => addJellyfinServer({ data }),
    onSuccess: async () => {
      setOpen(false);
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["jellydata"] });
      await queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: addServerSchema,
    },
    onSubmit: ({ value }) => mutate(value),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state);
        if (!state) {
          reset();
          form.reset();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-5" /> Add Server
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Jellyfin Server</DialogTitle>
          <DialogDescription>
            Configure a new Jellyfin server to aggregate medias from it.
          </DialogDescription>
        </DialogHeader>
        {isError && (
          <Alert
            type="destructive"
            title="Failed to add server"
            message={error.message}
          />
        )}

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="url"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name={field.name} invalid={invalid}>
                  <FieldLabel>Server Address</FieldLabel>

                  <Input
                    name={field.name}
                    placeholder="https://my.jellyfin.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  <FieldError match={invalid}>{error?.message}</FieldError>
                </FieldRoot>
              );
            }}
          />
          <form.Field
            name="username"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name={field.name} invalid={invalid}>
                  <FieldLabel>Username</FieldLabel>
                  <Input
                    name={field.name}
                    placeholder="Server username"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError match={invalid}>{error?.message}</FieldError>
                </FieldRoot>
              );
            }}
          />
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
                      <LoaderIcon /> Adding
                    </>
                  ) : (
                    "Add"
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
