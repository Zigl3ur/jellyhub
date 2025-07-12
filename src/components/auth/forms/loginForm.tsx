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
import { Input } from "@/components/ui/input";
import { loginSchema, loginSchemaType } from "@/schemas/auth.schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Logo from "@/components/logo";
import PasswordField from "./fields/passwordField";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginFormProps {
  isSignupAllowed: boolean;
}

/**
 * LoginForm Component
 * @returns login form component
 */
export default function LoginForm({ isSignupAllowed }: LoginFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const loginForm = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { password: passwordError } = loginForm.formState.errors;

  const onSubmit = (values: loginSchemaType) => {
    const { username, password } = values;

    authClient.signIn
      .username({
        username,
        password,
        fetchOptions: {
          onSuccess: (ctx) => {
            toast.success("Successfully logged in", {
              description: `Welcome back, ${ctx.data["user"].username} !`,
            });
            router.push("/");
          },
          onError: (ctx) => {
            toast.error("Login failed", {
              description:
                ctx.error.message || "An error occurred during login.",
            });
          },
          onRequest: () => setLoading(true),
        },
      })
      .then(() => setLoading(false));
  };

  return (
    <div className="w-full max-w-md mx-auto xs:w-[400px] p-5 bg-background/50 rounded-md">
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
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <PasswordField
                  placeholder="Password"
                  error={passwordError}
                  field={{
                    ...field,
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center w-full">
            <Button
              type="submit"
              disabled={loading}
              className="w-full xs:w-auto"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
          {isSignupAllowed && (
            <div className="text-center text-xs">
              Doesn&apos;t have an account ?{" "}
              <Link
                href={"/register"}
                className="hover:underline text-blue-500"
              >
                Register
              </Link>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
