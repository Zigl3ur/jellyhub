import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "./lib/auth";

const protectedRoutes = ["/", "/settings"];
const publicRoutes = ["/login"];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname;
  const isProtectedRoute =
    protectedRoutes.includes(path) ||
    (path.startsWith("/") && path.length > 1 && !publicRoutes.includes(path));
  const isPublicRoute = publicRoutes.includes(path);

  const session = await getSession();

  // protected route (including slugs) and invalid session ?
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // public route and valid session ?
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ], // routes affected by middleware
};
