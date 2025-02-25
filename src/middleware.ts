import { NextResponse, NextRequest } from "next/server";
import { getSession } from "./lib/auth";

const protectedRoutes = ["/dashboard", "/", "/settings"];
const publicRoutes = ["/login"];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const session = await getSession();

  // protected route and invalid session ?
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // public route and valid session ? or admin route and not admin
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard", "/settings", "/api/:path*"], // routes affected by middleware
};
