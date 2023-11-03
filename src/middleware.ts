import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // check if the user is authenticated
  const cookies = request.cookies.get("token");

  if (cookies) {
    // check if the token is valid
    const form = new FormData();

    form.append("token", cookies.value);

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"
      }/api/v1/admin/authenticate/verify`,
      {
        method: "POST",
        body: form,
      }
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (request.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (data.role === "scanner") {
      return NextResponse.redirect(new URL("/scanner", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/((?!api/v1/admin/authenticate|login|_next/static|_next/image|favicon.ico).*)",
  ],
};
