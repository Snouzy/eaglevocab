import { NextRequest, NextResponse } from "next/server";

function hasSessionCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some(
    (c) =>
      c.name === "better-auth.session_token" ||
      c.name === "__Secure-better-auth.session_token"
  );
}

export function middleware(request: NextRequest) {
  const isAuthenticated = hasSessionCookie(request);
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard", "/decks", "/books", "/cards", "/settings"];
  const authRoutes = ["/sign-in", "/sign-up"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
