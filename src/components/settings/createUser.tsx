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
import { addUserAction } from "@/server/actions/settings.actions";

export default function CreateUser() {
  const userForm = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: loginSchemaType) {
    addUserAction(data.username, data.password).then((result) => {
      if (result.success) {
        toast.success("Success", {
          description: result.message,
        });
        userForm.reset();
      } else if (result.error)
        toast.error("Error", {
          description: result.error,
        });
    });
  }

  return (
    <div className="rounded-md p-5 w-full">
      <Form {...userForm}>
        <form onSubmit={userForm.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={userForm.control}
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
            control={userForm.control}
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
          <Button type="submit">Create</Button>
        </form>
      </Form>
    </div>
  );
}
