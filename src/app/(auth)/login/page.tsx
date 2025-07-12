import LoginForm from "@/components/auth/forms/loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JellyHub - Login",
};

export default function LoginPage() {
  const isSignupAllowed = process.env.ALLOW_SIGNUP === "true";

  return (
    <div className="flex items-center justify-center h-screen px-4">
      <LoginForm isSignupAllowed={isSignupAllowed} />
    </div>
  );
}
