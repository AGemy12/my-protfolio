import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { SESSION_COOKIE, verifySession } from "./lib/session";

const intl = createMiddleware(routing);

const ADMIN_PATH = /^\/(en|ar)\/admin(\/.*)?$/;

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(ADMIN_PATH);

  if (match && !pathname.startsWith(`/${match[1]}/admin/login`)) {
    const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = `/${match[1]}/admin/login`;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return intl(request);
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
