import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public auth routes
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for token in cookies (set by the auth store on login)
  const token = request.cookies.get("token")?.value;

  // If no token and trying to access a protected route, redirect to login
  // Note: token is in localStorage (client-side), so middleware uses a cookie
  // we set alongside. If not present, we let the client-side AuthProvider handle
  // the redirect for now — this provides edge-case protection.
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
