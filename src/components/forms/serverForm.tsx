"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const serverSchema = z.object({
  server_url: z.string().url({ message: "Invalid URL format" }),
  username: z.string().min(1, { message: "Username cant be empty" }),
  password: z.string().min(1, { message: "Password cant be empty" }),
});

export default function ServerForm() {
  const { toast } = useToast();

  const serverForm = useForm<z.infer<typeof serverSchema>>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      server_url: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof serverSchema>) {}

  return (
    <div className="w-full max-w-md mx-auto sm:w-[400px] p-5 bg-black/50 backdrop-blur-lg rounded-md">
      <h1 className="text-3xl font-bold mb-10 underline text-center">
        Add a Jellyfin Server
      </h1>
      <div className="py-4 text-center"></div>
      <Form {...serverForm}>
        <form
          onSubmit={serverForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={serverForm.control}
            name="server_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Server URL</FormLabel>
                <FormControl>
                  <Input placeholder="Jellyfin Server URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={serverForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Jellyfin Server Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={serverForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Jellyfin Server Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <div className="flex justify-center">
            <Button type="submit">Add Server</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
