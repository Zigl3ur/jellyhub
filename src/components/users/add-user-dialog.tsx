import { Eye, EyeOff, Plus } from "lucide-react";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { registerSchema, type registerSchemaType } from "@/schemas/auth.schema";
import { authClient } from "@/lib/auth-client";

const defaultValues: registerSchemaType = {
  username: "",
  password: "",
  confirmPassword: "",
};

export default function AddUserDialog() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: registerSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.admin.createUser({
        email: `${value.username.replaceAll(" ", "")}@jellyhub.com`,
        password: value.password,
        name: value.username,
        role: "user",
        data: { username: value.username },
        fetchOptions: {
          onRequest: () => setError(null),
          onSuccess: async () => {
            setOpen(false);
            form.reset();
            await queryClient.invalidateQueries({ queryKey: ["usersList"] });
          },
          onError: ({ error }) => setError(error.message),
        },
      });
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state);
        if (!state) form.reset();
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus className="size-5" /> Add User
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a User</DialogTitle>
          <DialogDescription>Configure a new User.</DialogDescription>
        </DialogHeader>
        {error && (
          <Alert
            type="destructive"
            title="Failed to add user"
            message={error}
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
            name="username"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name={field.name} invalid={invalid}>
                  <FieldLabel>Username</FieldLabel>

                  <Input
                    name={field.name}
                    placeholder="Nice User"
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
                    placeholder="password"
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
          <form.Field
            name="confirmPassword"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name={field.name} invalid={invalid}>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <Input
                    name={field.name}
                    type={showConfirmPassword ? "text" : "password"}
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
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
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
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? (
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
