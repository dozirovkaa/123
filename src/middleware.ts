import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const publicPaths = ["/", "/catalog", "/faq"];

function isPublicPath(path: string) {
  return publicPaths.some(
    (publicPath) =>
      path === publicPath || path.startsWith(`${publicPath}/`)
  );
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/auth/login") ||
      req.nextUrl.pathname.startsWith("/auth/register");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/profile", req.url));
      }
      return null;
    }

    if (!isAuth && !isPublicPath(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

export const config = {
  matcher: [
    "/profile/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/auth/:path*",
  ],
};
