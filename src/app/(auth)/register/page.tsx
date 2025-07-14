import RegisterForm from "@/components/auth/forms/registerForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Register",
};

//to ALLOW_SIGNUP to be evaluated at runtime and not build time, else the user cant set it with -e in docker run cmd
export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const isSignupAllowed = process.env.ALLOW_SIGNUP === "true";

  if (!isSignupAllowed) redirect("/login");

  return (
    <div className="flex items-center justify-center h-screen px-4">
      <RegisterForm />
    </div>
  );
}
