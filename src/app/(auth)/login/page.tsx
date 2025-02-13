import LoginForm from "@/components/forms/loginForm";
import { encrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/schemas/auth.schema";
import { Metadata } from "next";
import { z } from "zod";
import bcrypt from "bcrypt";
import { payloadType } from "@/types/auth.types";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "JellyHub - Login",
};

async function loginAction(
  values: z.infer<typeof loginSchema>
): Promise<{ state: boolean; desc: string; href: string }> {
  "use server";

  try {
    const schema = z.object({
      username: z.string().min(3).max(15),
      password: z.string().min(6).max(50),
    });

    const validateSchema = schema.safeParse(values);

    if (!validateSchema.success) {
      return { state: false, desc: "Given Values are not Valid !", href: "/" };
    }

    const userData = await prisma.accounts.findFirst({
      where: { username: values.username },
    });

    // return if account doesnt exist
    if (!userData) {
      return { state: false, desc: "Bad Credentials", href: "" };
    }

    // check password match
    const passwordCheck = await bcrypt.compare(
      values.password,
      userData.password
    );

    if (!passwordCheck) {
      return { state: false, desc: "Bad Credentials", href: "" };
    }

    // Create the session
    const expires: Date = new Date(Date.now() + 24 * 60 * 60 * 1000); // one day
    const payload: payloadType = {
      username: userData.username,
      admin: userData.admin,
      expires,
    };
    const session: string = await encrypt(payload);

    // create cookie session
    (await cookies()).set("session-token", session, {
      expires,
      httpOnly: true,
    });
    return { state: true, desc: "Successfully Logged In", href: "/" };
  } catch {
    return { state: false, desc: "Server Error", href: "" };
  }
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen px-4">
      <LoginForm onSubmit={loginAction} />
    </div>
  );
}
