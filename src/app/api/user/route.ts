import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const decoded = decodeJwt(token.value);

  return NextResponse.json(decoded, { status: 200 });
}
