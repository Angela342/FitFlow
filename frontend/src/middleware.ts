import { NextRequest, NextResponse } from "next/server";

// Routes that should redirect to home if the user is already logged in
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

// Routes that require any authenticated user
const PROTECTED_ROUTES = ["/workouts", "/nutrition"];

// Routes that require the Admin role
const ADMIN_ROUTES = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("fitflow_token")?.value;

  const isAuthed = Boolean(token);

  // If logged in, redirect away from auth pages
  if (AUTH_ROUTES.some((p) => pathname.startsWith(p))) {
    if (isAuthed) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes — must be logged in
  if (PROTECTED_ROUTES.some((p) => pathname.startsWith(p))) {
    if (!isAuthed) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Admin routes — must be logged in (role checked client-side)
  // We redirect unauthenticated users here; role check is done in AdminRoute
  if (ADMIN_ROUTES.some((p) => pathname.startsWith(p))) {
    if (!isAuthed) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
