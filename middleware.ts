import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, ADMIN_LOGIN_PATH } from "@/lib/auth-constants";

/**
 * /admin altını korur. İmza doğrulaması sunucu tarafında (layout) yapılır;
 * burada yalnızca oturum çerezinin varlığı hızlıca kontrol edilir.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith(ADMIN_LOGIN_PATH)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (token) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = ADMIN_LOGIN_PATH;
  loginUrl.search = "";
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
