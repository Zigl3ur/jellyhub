import RegisterForm from "@/components/auth/forms/registerForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JellyHub - Register",
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center h-screen px-4">
      <RegisterForm />
    </div>
  );
}
