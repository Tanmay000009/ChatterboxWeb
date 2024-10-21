import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow asset calls to pass through
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static/")
  ) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken");

  const publicRoutes = ["/", "/register"];
  console.log("pathname", pathname);

  if (publicRoutes.includes(pathname)) {
    if (!accessToken) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (accessToken) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url);
}
