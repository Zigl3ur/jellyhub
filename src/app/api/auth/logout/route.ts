import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();

  try {
    cookieStore.delete("token");

    const url = new URL(
      "/login",
      process.env.PUBLIC_APP_URL || "http://localhost:3000"
    );
    console.log("a");

    return NextResponse.redirect(url);
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json(
        { message: err.message },
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return NextResponse.json(
        { message: "Unknown Error" },
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
