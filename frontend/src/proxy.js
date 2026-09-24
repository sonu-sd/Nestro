import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;
  const isProtectedPage =
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/") ||
    pathname === "/profile" ||
    pathname.startsWith("/profile/");

  if (token && pathname === "/sign_in") {
    const nextPath = request.nextUrl.searchParams.get("next");
    const safeNext =
      nextPath?.startsWith("/") && !nextPath.startsWith("//")
        ? nextPath
        : "/profile";
    return NextResponse.redirect(new URL(safeNext, request.url));
  }

  if (!token && isProtectedPage) {
    const signInUrl = new URL("/sign_in", request.url);
    signInUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/checkout/:path*", "/sign_in", "/profile/:path*"],
};
