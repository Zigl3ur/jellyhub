import { createFileRoute, redirect } from "@tanstack/react-router";
import RegisterForm from "@/components/auth/forms/register-form";
import { isSignupAllowed } from "@/functions/auth.functions";

export const Route = createFileRoute("/_auth/register/")({
  beforeLoad: async () => {
    const canSignup = await isSignupAllowed();

    if (!canSignup) throw redirect({ to: "/login" });
  },
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="flex items-center justify-center h-screen px-4">
      <RegisterForm />
    </div>
  );
}
