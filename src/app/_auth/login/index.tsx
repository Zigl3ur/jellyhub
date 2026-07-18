import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";
import type { loginSchemaType } from "@/schemas/auth.schema";
import { isSignupAllowed } from "@/functions/auth.functions";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/schemas/auth.schema";
import Logo from "@/components/logo";
import { FieldError, FieldLabel, FieldRoot } from "@/components/ui/field";
import Button from "@/components/ui/button";
import { Input, InputAddon } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export const Route = createFileRoute("/_auth/login/")({
  loader: async () => {
    const canSignup = await isSignupAllowed();

    return { canSignup };
  },
  component: LoginPage,
});

function LoginPage() {
  const { canSignup } = Route.useLoaderData();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginForm = useForm({
    defaultValues: {
      username: "",
      password: "",
    } satisfies loginSchemaType,
    onSubmit: async ({ value }) => {
      setError(null);
      const { username, password } = value;

      await authClient.signIn.username({
        username,
        password,
        fetchOptions: {
          onSuccess: (ctx) => {
            router.navigate({ to: "/" });
          },
          onError: ({ error }) => setError(error.message),
        },
      });
      loginForm.reset();
    },
  });

  return (
    <div className="flex items-center flex-col justify-center h-dvh gap-8">
      <Logo />
      <div className="max-w-sm w-full p-6 rounded-xl space-y-6 bg-accent-foreground">
        <h3 className="font-serif italic text-3xl font-semibold text-foreground">
          Login to continue
        </h3>
        {error && (
          <Alert type="destructive" title="Login Failed" message={error} />
        )}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            loginForm.handleSubmit();
          }}
        >
          <loginForm.Field
            name="username"
            validators={{ onChange: loginSchema.shape.username }}
          >
            {(field) => {
              const error = field.state.meta.errors[0];
              const invalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

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
          </loginForm.Field>

          <loginForm.Field
            name="password"
            validators={{ onChange: loginSchema.shape.password }}
          >
            {(field) => {
              const error = field.state.meta.errors[0];
              const invalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

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
          </loginForm.Field>

          <div className="flex justify-center w-full">
            <loginForm.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full xs:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <IconLoader2 className="animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              )}
            />
          </div>
          {canSignup && (
            <div className="text-center text-sm">
              Doesn&apos;t have an account ?{" "}
              <Link to="/register" className="hover:underline text-blue-500">
                Register
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
