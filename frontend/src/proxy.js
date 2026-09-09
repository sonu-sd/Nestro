import { NextResponse } from 'next/server'

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  if (token && pathname === "/sign_in") {
    return NextResponse.redirect(new URL("/checkout", request.url));
  }

  if (!token && pathname === "/checkout") {
    return NextResponse.redirect(new URL("/sign_in", request.url));
  }
  
  if (!token && pathname === "/profile") {
      return NextResponse.redirect(new URL("/sign_in", request.url) );
  }
        return NextResponse.next();

}
export const config = {
  matcher: ["/checkout", "/sign_in","/profile"],
};