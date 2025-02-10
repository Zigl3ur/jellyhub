import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();

  try {
    cookieStore.delete("token");

    return NextResponse.json(
      { message: "Successfully disconnected" },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
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
