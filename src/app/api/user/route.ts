import { NextResponse } from "next/server";
import { decodeJwt } from "jose";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value as string;

  const decoded = decodeJwt(token);

  const userData = await prisma.accounts.findFirst({
    select: {
      username: true,
      admin: true,
      jellydata: true,
    },
    where: { username: { equals: decoded.username as string } },
  });

  return NextResponse.json({ ...userData }, { status: 200 });
}
