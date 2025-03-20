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
import Logo from "./global/logo";
import { loginSchema } from "@/schemas/auth.schema";
import { useRouter } from "next/navigation";
import { loginActionType } from "@/types/auth.types";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

export default function LoginForm(loginProps: {
  onSubmit: (values: z.infer<typeof loginSchema>) => Promise<loginActionType>;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div className="w-full max-w-md mx-auto sm:w-[400px] p-5 bg-black/50 backdrop-blur-lg rounded-md">
      <div className="py-4 text-center">
        <Logo />
      </div>
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(async (values) => {
            await loginProps.onSubmit(values).then((result) => {
              if (!result.state) {
                toast({
                  title: "Error",
                  description: result.desc,
                  variant: "destructive",
                  duration: 2500,
                });
              } else {
                router.push(result.href);
              }
            });
          })}
          className="space-y-4"
        >
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
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Your secret password"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {!showPassword ? <EyeClosed /> : <Eye />}
                    </Button>
                  </div>
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
