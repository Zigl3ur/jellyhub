"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { useState } from "react";
import { LoaderCircle, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import PasswordField from "@/components/auth/forms/fields/passwordField";
import { User } from "better-auth";
import { editUserSchema, editUserSchemaType } from "@/schemas/settings.schema";
import { editUserAction } from "@/server/actions/settings.actions";

interface EditUserDialogProps {
  user: User;
  onEdit: () => void;
}

export function EditUserDialog({ user, onEdit }: EditUserDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const userForm = useForm<editUserSchemaType>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: user.username,
      password: undefined,
      confirmPassword: undefined,
    },
  });

  const { password: passwordError, confirmPassword: confirmPasswordError } =
    userForm.formState.errors;

  const onSubmit = async (values: editUserSchemaType) => {
    const { username, confirmPassword } = values;

    setLoading(true);

    editUserAction(user.id, user.username, username, confirmPassword)
      .then((result) => {
        if (result.error)
          toast.error("Error", {
            description: result.error,
          });
        else if (result.success) {
          toast.success("Success", { description: result.message });
          setOpen(false);
        }
      })
      .finally(() => {
        setLoading(false);
        onEdit();
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit a User</DialogTitle>
          <DialogDescription>Edit the selected user</DialogDescription>
        </DialogHeader>
        <Form {...userForm}>
          <form
            onSubmit={userForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={userForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={userForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <PasswordField
                    placeholder="********"
                    error={passwordError}
                    field={{ ...field, value: field.value || "" }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={userForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <PasswordField
                    placeholder="********"
                    error={confirmPasswordError}
                    field={{ ...field, value: field.value || "" }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Editing user...
                  </>
                ) : (
                  "Edit User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
