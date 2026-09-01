import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

export const { auth: middleware } = NextAuth(authConfig);

export default middleware((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Route yang boleh diakses tanpa login
  const publicRoutes = ["/login", "/register", "/"];
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "?"));

  // API dan static files di-bypass via config matcher, tapi jika lolos:
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Redirect user yang belum login dari protected routes
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect user yang sudah login dari halaman auth (login, register, root)
  if (isLoggedIn && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth api routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, svg, icons static extensions
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
