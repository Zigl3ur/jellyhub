import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginForm from "@/components/auth/forms/login-form";
import { isSignupAllowed } from "@/lib/auth.functions";

export const Route = createFileRoute("/_auth/login/")({
  beforeLoad: async () => {
    const canSignup = await isSignupAllowed();

    if (!canSignup) throw redirect({ to: "/login" });
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen px-4">
      <LoginForm isSignupAllowed={isSignupAllowed} />
    </div>
  );
}
