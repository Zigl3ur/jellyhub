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
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useState } from "react";
import {
  errorJellyfin,
  jellyfinServerCredentials,
} from "@/types/jellyfin.types";
import { useToast } from "@/hooks/use-toast";

const serverSchema = z.object({
  address: z.string().url({ message: "Please enter a valid URL" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function ServerDialog(dialogProps: {
  addAction: (
    data: jellyfinServerCredentials
  ) => Promise<errorJellyfin | boolean>;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const serverform = useForm<z.infer<typeof serverSchema>>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      address: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof serverSchema>) {
    const result = await dialogProps.addAction({
      address: values.address,
      username: values.username,
      password: values.password,
    });

    if (typeof result === "object" && "error" in result) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
        duration: 2500,
      });
    } else {
      toast({
        title: "Success",
        description: "Successfully added server",
        duration: 2500,
      });
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Server</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Jellyfin Server</DialogTitle>
          <DialogDescription>
            Add a Jellyfin server to index media from it
          </DialogDescription>
        </DialogHeader>
        <Form {...serverform}>
          <form
            onSubmit={serverform.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={serverform.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://jellyfin.example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={serverform.control}
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
              control={serverform.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
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
              <Button type="submit">Add Server</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
