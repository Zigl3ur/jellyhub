import LoginForm from "@/components/forms/loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JellyHub - Login",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen px-4">
      <LoginForm />
    </div>
  );
}
