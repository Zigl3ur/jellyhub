import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();

    const { username, password } = await req.json();

    const schema = z.object({
      username: z.string().min(3).max(15),
      password: z.string().min(6).max(50),
    });

    const validateSchema = await schema.safeParse({ username, password });

    if (!validateSchema.success) {
      return NextResponse.json(
        { error: "given values are not valid" },
        { status: 406, headers: { "Content-Type": "application/json" } }
      );
    }

    const userData = await prisma.accounts.findFirst({
      where: { username: username },
    });

    // return if account doesnt exist
    if (!userData)
      return NextResponse.json(
        { error: "User do not exist" },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );

    // check password match
    const passwordCheck = await bcrypt.compare(password, userData.password);

    // return if no password match
    if (!passwordCheck)
      return NextResponse.json(
        { error: "Bad Credentials" },
        { status: 405, headers: { "Content-Type": "application/json" } }
      );

    // JWT payload
    const payload = {
      username: userData.username,
    };

    // ensure oken to sign is defined
    if (!process.env.JWT)
      return NextResponse.json(
        { error: "Failed to get token to sign JWT" },
        { status: 500, headers: { "Content-Type": "application/json" } }
      );

    // create the JWT
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(new TextEncoder().encode(process.env.JWT));

    const response = NextResponse.json(
      { message: "Succesfully logged in" },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

    // set the JWT in the cookies
    cookieStore.set("token", token);
    return response;
  } catch (err) {
    if (err instanceof Error)
      return NextResponse.json(
        { error: err.message },
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    else
      return NextResponse.json(
        { error: "Unknown Error" },
        { status: 520, headers: { "Content-Type": "application/json" } }
      );
  }
}
