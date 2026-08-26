import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { loginSchemaType } from "@/schemas/auth.schema";
import { isSignupAllowed } from "@/functions/auth.functions";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/schemas/auth.schema";
import { FieldError, FieldLabel, FieldRoot } from "@/components/ui/field";
import Button from "@/components/ui/button";
import { Input, InputAddon } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import LoaderIcon from "@/components/ui/loader-icon";
import { Link } from "@/components/ui/link";
import SsoAuth from "@/components/sso-auth";

export const Route = createFileRoute("/_main/_auth/login/")({
  loader: async () => {
    const canSignup = await isSignupAllowed();

    return { canSignup };
  },
  component: RouteComponent,
  head: () => ({ meta: [{ title: "Login - JellyHub" }] }),
});

const defaultValues: loginSchemaType = {
  username: "",
  password: "",
};

function RouteComponent() {
  const { canSignup } = Route.useLoaderData();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginForm = useForm({
    defaultValues,
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: {
      onDynamic: loginSchema,
    },
    onSubmit: async ({ value }) => {
      const { username, password } = value;

      await authClient.signIn.username({
        username,
        password,
        fetchOptions: {
          onSuccess: () => {
            setError(null);
            loginForm.reset();
            navigate({ to: "/" });
          },
          onError: ({ error }) => setError(error.message),
        },
      });
    },
  });

  return (
    <div className="max-w-sm w-full p-6 rounded-xl space-y-8 bg-accent-foreground">
      <h3 className="font-serif italic text-3xl font-semibold text-foreground">
        Login to continue
      </h3>
      <div className="space-y-3">
        <SsoAuth />

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            loginForm.handleSubmit();
          }}
        >
          {error && (
            <Alert type="destructive" title="Login Failed" message={error} />
          )}
          <loginForm.Field
            name="username"
            children={(field) => {
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

                  <FieldError match={invalid}>{error?.message}</FieldError>
                </FieldRoot>
              );
            }}
          />
          <loginForm.Field
            name="password"
            children={(field) => {
              const error = field.state.meta.errors[0];
              const invalid = !field.state.meta.isValid;

              return (
                <FieldRoot name={field.name} invalid={invalid}>
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
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </InputAddon>
                  </Input>
                  <FieldError match={invalid}>{error?.message}</FieldError>
                </FieldRoot>
              );
            }}
          />
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
                      <LoaderIcon />
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
              <Link to="/register">Register</Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
