import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("fitflow_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/auth/");
  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/workouts") ||
    pathname.startsWith("/nutrition");

  if (isProtectedPage && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
