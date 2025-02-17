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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useState } from "react";

const serverSchema = z.object({
  address: z.string().url({ message: "Please enter a valid URL" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function ServerDialog() {
  const [open, setOpen] = useState<boolean>(false);

  const serverform = useForm<z.infer<typeof serverSchema>>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      address: "",
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof serverSchema>) {
    console.log(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Server</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Jellyfin Server</DialogTitle>
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
                  <FormDescription>
                    Enter the URL of your Jellyfin server
                  </FormDescription>
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
