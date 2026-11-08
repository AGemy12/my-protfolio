import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Redirects "/" to "/en" or "/ar" based on the visitor's saved choice or
// browser language, and remembers the choice in a cookie.
export default createMiddleware(routing);

export const config = {
  // /admin is the dashboard and has no language prefix.
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
