import { createFileRoute, redirect } from "@tanstack/react-router";
import RegisterForm from "@/components/auth/forms/register-form";

export const Route = createFileRoute("/_auth/register/")({
  beforeLoad: () => {
    const isSignupAllowed = process.env.ALLOW_SIGNUP === "true";

    if (!isSignupAllowed) throw redirect({ to: "/login" });
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
