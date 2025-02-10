import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function middleware(
  req: NextRequest
): Promise<NextResponse | void> {
  const currentLocation = req.nextUrl.pathname;
  const isPublic =
    currentLocation === "/login" || currentLocation === "/api/auth/login";
  const isAdmin =
    currentLocation === "/dashboard" || currentLocation === "/api/admin/:path*";

  // get token
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let isValidToken;
  let admin;
  // verify token
  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT)
      );
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp > currentTime) {
        isValidToken = true;
        admin = payload.admin;
      }
    } catch {
      isValidToken = false;
      admin = false;
    }
  }

  // logged in and public route ? or not admin and admin route ? redirect to /
  if ((isPublic && isValidToken) || (isAdmin && !admin)) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (!isPublic && !isValidToken) {
    // not logged in ? redirect to /login
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/dashboard", "/api/:path*"], // routes affected by middleware
};
