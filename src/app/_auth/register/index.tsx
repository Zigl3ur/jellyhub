import {
  Link,
  createFileRoute,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";
import type { registerSchemaType } from "@/schemas/auth.schema";
import { isSignupAllowed } from "@/functions/auth.functions";
import { authClient } from "@/lib/auth-client";
import { registerSchema } from "@/schemas/auth.schema";
import Logo from "@/components/logo";
import { FieldError, FieldLabel, FieldRoot } from "@/components/ui/field";
import Button from "@/components/ui/button";
import { Input, InputAddon } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import LoaderIcon from "@/components/ui/loader-icon";

export const Route = createFileRoute("/_auth/register/")({
  beforeLoad: async () => {
    const canSignup = await isSignupAllowed();

    if (!canSignup) throw redirect({ to: "/login" });
  },
  component: RegisterPage,
  head: () => ({ meta: [{ title: "Register - JellyHub" }] }),
});

function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerForm = useForm({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    } satisfies registerSchemaType,
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      const { username, confirmPassword } = value;

      await authClient.signUp.email({
        email: `${username}@jellyhub.com`,
        name: username,
        username,
        password: confirmPassword,
        fetchOptions: {
          onSuccess: () => {
            setError(null);
            registerForm.reset();
            router.navigate({ to: "/" });
          },
          onError: ({ error }) => setError(error.message),
        },
      });
    },
  });

  return (
    <div className="flex items-center flex-col justify-center h-dvh gap-8">
      <Logo />
      <div className="max-w-sm w-full p-6 rounded-xl space-y-8 bg-accent-foreground">
        <h3 className="font-serif italic text-3xl font-semibold text-foreground">
          Register to get started
        </h3>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            registerForm.handleSubmit();
          }}
        >
          {error && (
            <Alert type="destructive" title="Register Failed" message={error} />
          )}
          <registerForm.Field name="username">
            {(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name={field.name} invalid={invalid}>
                  <FieldLabel>Username</FieldLabel>

                  <Input
                    name={field.name}
                    placeholder="Username"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />

                  {error && <FieldError match>{error.message}</FieldError>}
                </FieldRoot>
              );
            }}
          </registerForm.Field>
          <registerForm.Field name="password">
            {(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name="password" invalid={invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <InputAddon side="right">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <IconEyeOff /> : <IconEye />}
                      </Button>
                    </InputAddon>
                  </Input>
                  {error && <FieldError match>{error.message}</FieldError>}
                </FieldRoot>
              );
            }}
          </registerForm.Field>
          <registerForm.Field name="confirmPassword">
            {(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name="confirmPassword" invalid={invalid}>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <Input
                    name={field.name}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <InputAddon side="right">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
                      </Button>
                    </InputAddon>
                  </Input>
                  {error && <FieldError match>{error.message}</FieldError>}
                </FieldRoot>
              );
            }}
          </registerForm.Field>
          <div className="flex justify-center w-full">
            <registerForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full xs:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderIcon />
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              )}
            />
          </div>
          <div className="text-center text-sm">
            Already have an account ?{" "}
            <Link to="/login" className="hover:underline text-blue-500">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
