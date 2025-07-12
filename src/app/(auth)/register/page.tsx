import RegisterForm from "@/components/auth/forms/registerForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "JellyHub - Register",
};

export default function RegisterPage() {
  const isSignupDisabled = process.env.DISABLE_SIGNUP === "true";

  if (isSignupDisabled) redirect("/login");

  return (
    <div className="flex items-center justify-center h-screen px-4">
      <RegisterForm />
    </div>
  );
}
