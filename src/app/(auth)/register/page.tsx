import RegisterForm from "@/components/auth/forms/registerForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "JellyHub - Register",
};

export default function RegisterPage() {
  const isSignupAllowed = process.env.ALLOW_SIGNUP === "true";

  if (!isSignupAllowed) redirect("/login");

  return (
    <div className="flex items-center justify-center h-screen px-4">
      <RegisterForm />
    </div>
  );
}
