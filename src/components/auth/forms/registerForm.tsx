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
import { registerSchema, registerSchemaType } from "@/schemas/auth.schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Logo from "@/components/logo";
import PasswordField from "./fields/passwordField";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * RegisterForm Component
 * @returns register form component
 */
export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const registerForm = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { password: passwordError, confirmPassword: confirmPasswordError } =
    registerForm.formState.errors;

  const onSubmit = async (values: registerSchemaType) => {
    const { username, password } = values;

    authClient.signUp
      .email({
        email: `${username}@jellyhub.com`,
        name: username,
        username: username,
        password: password,
        fetchOptions: {
          onSuccess: (ctx) => {
            toast.success("Successfully registered", {
              description: `Welcome, ${ctx.data["user"].name} !`,
            });
            router.push("/");
          },
          onError: (ctx) => {
            toast.error("Register failed", {
              description:
                ctx.error.message || "An error occurred during register.",
            });
          },
          onRequest: () => setLoading(true),
        },
      })
      .then(() => setLoading(false));
  };

  return (
    <div className="w-full max-w-md mx-auto sm:w-[400px] p-5 bg-background rounded-md">
      <div className="py-4 text-center">
        <Logo />
      </div>
      <Form {...registerForm}>
        <form
          onSubmit={registerForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={registerForm.control}
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
            control={registerForm.control}
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
          <FormField
            control={registerForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <PasswordField
                  placeholder="Confirm Password"
                  error={confirmPasswordError}
                  field={{ ...field }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center w-full">
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
