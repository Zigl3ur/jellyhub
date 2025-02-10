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
import Logo from "../logo";

const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(15, { message: "Username cant exceed 15 characters" }),
  password: z
    .string()
    .min(6, { message: "Pasword must be at least 6 characters long" })
    .max(50, { message: "Pasword cant exceed 50 characters" }),
});

export default function LoginForm() {
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const data = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      if (data.status === 200) window.location.href = "/";
      else if (data.status === 405)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Bad Credentials",
          duration: 2500,
        });
      else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error while contacting Server",
          duration: 2500,
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
          duration: 2500,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An Unknow Error Occured",
          duration: 2500,
        });
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto sm:w-[400px] p-5 bg-black/50 backdrop-blur-lg rounded-md">
      {/* <h1 className="text-3xl font-bold mb-10 underline text-center">Login</h1> */}
      <div className="py-4 text-center">
        <Logo />
      </div>
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={loginForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Your secret pasword"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <div className="flex justify-center">
            <Button type="submit">Login</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
