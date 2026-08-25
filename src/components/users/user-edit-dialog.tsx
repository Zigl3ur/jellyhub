import { Eye, EyeOff } from "lucide-react";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Dialog as BaseDialog } from "@base-ui/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Button from "../ui/button";
import { FieldError, FieldLabel, FieldRoot } from "../ui/field";
import { Input, InputAddon } from "../ui/input";
import { Alert } from "../ui/alert";
import LoaderIcon from "../ui/loader-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { editUserSchema, type editUserSchemaType } from "@/schemas/auth.schema";
import { authClient } from "@/lib/auth-client";
import AvatarEditor from "./avatar-editor";

interface UserEditDialogProps extends BaseDialog.Root.Props {
  user: typeof authClient.$Infer.Session.user;
  onSuccess?: () => void;
}

export default function UserEditDialog({
  user,
  onSuccess,
  onOpenChange,
  ...props
}: UserEditDialogProps) {
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      username: user.username ?? "",
      password: "",
      confirmPassword: "",
      role: user.role as "admin" | "user",
      image: user.image ?? null,
    } satisfies editUserSchemaType,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: editUserSchema,
    },
    onSubmit: async ({ value }) => {
      if (value.password) {
        await authClient.admin.setUserPassword({
          userId: user.id,
          newPassword: value.password,
          fetchOptions: {
            onError: ({ error }) => {
              setError(error.message);
              return;
            },
          },
        });
      }

      await authClient.admin.updateUser({
        userId: user.id,
        data: {
          ...(user.username !== value.username && { username: value.username }),
          role: value.role,
          image: value.image,
        },
        fetchOptions: {
          onSuccess: async () => {
            setError(null);
            await queryClient.invalidateQueries({ queryKey: ["usersList"] });
            onSuccess?.();
            form.reset();
          },
          onError: ({ error }) =>
            setError(
              error.message ? error.message : "Username may be already used",
            ),
        },
      });
    },
  });

  return (
    <Dialog
      {...props}
      onOpenChange={(state, event) => {
        onOpenChange?.(state, event);
        if (!state) {
          setError(null);
          form.reset();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user details.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert
            type="destructive"
            title="Failed to update user"
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
            name="image"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot
                  name={field.name}
                  invalid={invalid}
                  className="items-center"
                >
                  <AvatarEditor
                    image={field.state.value}
                    username={user?.username as string}
                    onEdit={(value) => form.setFieldValue("image", value)}
                    onFailed={(err) =>
                      form.setFieldMeta("image", (prev) => ({
                        ...prev,
                        errorMap: {
                          ...prev.errorMap,
                          onChange: err,
                        },
                      }))
                    }
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError match={invalid}>{error?.message}</FieldError>
                </FieldRoot>
              );
            }}
          />

          <div className="flex gap-2 w-full">
            <form.Field
              name="username"
              children={(field) => {
                const error = field.state.meta.errors[0];
                const invalid = !field.state.meta.isValid;

                return (
                  <FieldRoot
                    name={field.name}
                    invalid={invalid}
                    className="w-full"
                  >
                    <FieldLabel>Username</FieldLabel>
                    <Input
                      name={field.name}
                      placeholder="Username"
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError match={invalid}>{error?.message}</FieldError>
                  </FieldRoot>
                );
              }}
            />

            <form.Field
              name="role"
              children={(field) => {
                const error = field.state.meta.errors[0];
                const invalid = !field.state.meta.isValid;

                return (
                  <FieldRoot name={field.name} invalid={invalid}>
                    <FieldLabel>Role</FieldLabel>
                    <Select
                      items={[
                        { label: "Admin", value: "admin" },
                        { label: "User", value: "user" },
                      ]}
                      value={field.state.value ?? ""}
                      onValueChange={(value) =>
                        field.handleChange(value as "admin" | "user")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError match={invalid}>{error?.message}</FieldError>
                  </FieldRoot>
                );
              }}
            />
          </div>

          <form.Field
            name="password"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name={field.name} invalid={invalid}>
                  <FieldLabel>New Password</FieldLabel>
                  <Input
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={field.state.value ?? ""}
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
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <Input
                    name={field.name}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={field.state.value ?? ""}
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
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isDefaultValue,
              ]}
              children={([canSubmit, isSubmitting, isDefaultValue]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || isDefaultValue}
                >
                  {isSubmitting ? (
                    <>
                      <LoaderIcon /> Updating
                    </>
                  ) : (
                    "Update"
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
