import LoginForm from "@/components/auth/forms/loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

//to ALLOW_SIGNUP to be evaluated at runtime and not build time, else the user cant set it with -e in docker run cmd
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const isSignupAllowed = process.env.ALLOW_SIGNUP === "true";

  return (
    <div className="flex items-center justify-center h-screen px-4">
      <LoginForm isSignupAllowed={isSignupAllowed} />
    </div>
  );
}
