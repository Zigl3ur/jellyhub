import { NextResponse } from "next/server";

export function GET(): NextResponse {
  return NextResponse.json(
    { statut: "OK" },
    { status: 200, headers: { Content: "application/json" } }
  );
}
