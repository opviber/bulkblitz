import { NextResponse } from "next/server";

const ACCESS_COOKIE = "bb-access-token";

// Routes that require *any* authenticated session.
const PROTECTED = [
  "/orders",
  "/wallet",
  "/profile",
  "/manufacturer",
  "/admin",
  "/refer",
  "/wishlist",
  "/become-a-seller",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only enforce session presence in production. In development the
  // DEV_FALLBACK_USER path keeps local work usable without Supabase.
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const needsAuth = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!needsAuth) return NextResponse.next();

  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/orders/:path*",
    "/wallet/:path*",
    "/profile/:path*",
    "/manufacturer/:path*",
    "/admin/:path*",
    "/refer/:path*",
    "/wishlist/:path*",
    "/become-a-seller/:path*",
  ],
};
