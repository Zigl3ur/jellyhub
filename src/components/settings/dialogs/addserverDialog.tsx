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
import { LoaderCircle, Plus } from "lucide-react";
import {
  addServerSchema,
  addServerSchemaType,
} from "@/schemas/settings.schema";
import { addServerAction } from "@/server/actions/settings.actions";
import { toast } from "sonner";
import PasswordField from "@/components/auth/forms/fields/passwordField";

interface AddServerDialogProps {
  onAdd: () => void;
}

export function AddServerDialog({ onAdd }: AddServerDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const serverForm = useForm<addServerSchemaType>({
    resolver: zodResolver(addServerSchema),
    defaultValues: {
      address: "",
      username: "",
      password: "",
    },
  });

  const { password: passwordError } = serverForm.formState.errors;

  const onSubmit = async (values: addServerSchemaType) => {
    const { address, username, password } = values;

    setLoading(true);

    addServerAction(address, username, password)
      .then((result) => {
        if (result.error)
          toast.error("Error", {
            description: result.error,
          });
        else if (result.success) {
          toast.success("Success", { description: result.message });
          setOpen(false);
          serverForm.reset();
        }
      })
      .finally(() => {
        setLoading(false);
        onAdd();
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Server</DialogTitle>
          <DialogDescription>Add a Jellyfin Server</DialogDescription>
        </DialogHeader>
        <Form {...serverForm}>
          <form
            onSubmit={serverForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={serverForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Address</FormLabel>
                  <FormControl>
                    <Input placeholder="address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={serverForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={serverForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Password</FormLabel>
                  <PasswordField
                    placeholder="********"
                    field={field}
                    error={passwordError}
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
              <Button type="submit">
                {loading && <LoaderCircle className="animate-spin" />}Add Server
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
