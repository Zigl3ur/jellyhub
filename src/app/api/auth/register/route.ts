import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

export async function POST(req: NextRequest): Promise<NextResponse | void> {
  try {
    const { username, password } = await req.json();

    const schema = z.object({
      username: z.string().min(3).max(15),
      password: z.string().min(6).max(50).trim(),
    });

    const validateSchema = await schema.safeParse({
      username,
      password,
    });

    if (!validateSchema.success) {
      return NextResponse.json(
        { error: "given values are not valid" },
        { status: 406, headers: { "Content-Type": "application/json" } }
      );
    }
    // check if user already exist in db
    const checkExist = await prisma.accounts.findFirst({
      where: {
        username: username,
      },
    });

    // return if user already exist
    if (checkExist)
      return NextResponse.json(
        { error: "User already exist" },
        { status: 409, headers: { "Content-Type": "application/json" } }
      );

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // add user to db
    const addUser = await prisma.accounts.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    if (addUser)
      return NextResponse.json(
        { message: "User registered successfully" },
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
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
