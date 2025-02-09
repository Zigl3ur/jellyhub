import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(
  req: NextRequest
): Promise<NextResponse | void> {
  const currentLocation = req.nextUrl.pathname;
  const isPublic =
    currentLocation === "/login" ||
    currentLocation === "/register" ||
    currentLocation === "/api/auth/login";

  // get token
  const token = req.cookies.get("token")?.value;

  let isValidToken = false;

  // verify token
  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT)
      );

      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp > currentTime) isValidToken = true;
    } catch {
      isValidToken = false;
    }
  }

  // logged in and public route ? redirect to /
  if (isPublic && isValidToken) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // not logged in ? redirect to /login
  if (!isPublic && !isValidToken)
    return NextResponse.redirect(new URL("/login", req.nextUrl));
}

export const config = {
  matcher: ["/", "/api/:path*"], // routes affected by middleware
};
