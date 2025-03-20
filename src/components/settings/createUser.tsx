"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { loginSchema } from "@/schemas/auth.schema";
import { createUserAction } from "@/lib/action";

const FormSchema = loginSchema;

export default function CreateUser() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createUserAction(data.username, data.password).then((result) => {
      form.reset();
      if (result.success) {
        toast({
          title: "Success",
          description: "User Successfully created",
          variant: "success",
          duration: 2500,
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
          duration: 2500,
        });
      }
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
