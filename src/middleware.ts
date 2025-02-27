import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "./lib/auth";

const protectedRoutes = ["/", "/settings", "/[slug]"];
const publicRoutes = ["/login"];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname;
  const isProtectedRoute =
    protectedRoutes.includes(path) ||
    (path.startsWith("/") && path.length > 1 && !publicRoutes.includes(path)); // prevent that slug 404 shows if not logged in
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
  matcher: ["/((?!api|_next/static|sitemap.xml|robots.txt|favicon.ico).*)"], // routes affected by middleware
};
