"use client";

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
import { Input } from "../ui/input";
import { loginSchema, loginSchemaType } from "@/schemas/auth.schema";
import { toast } from "sonner";
import { createUserAction } from "@/server/actions/settings.actions";

export default function CreateUser() {
  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: loginSchemaType) {
    createUserAction(data.username, data.password).then((result) => {
      if (result.success) {
        toast.success("Success", {
          description: result.message,
        });
        form.reset();
      } else if (result.error)
        toast.error("Error", {
          description: result.error,
        });
    });
  }

  return (
    <div className=" bg-black/50 backdrop-blur-lg rounded-md p-5 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="User username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="User password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={"create"}>
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
}
