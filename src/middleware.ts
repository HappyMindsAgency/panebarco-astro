import type { MiddlewareHandler } from "astro";
import { redirects } from "./lib/redirects.js";

const MAINTENANCE_MODE_ENABLED = true;
const MAINTENANCE_BYPASS_QUERY_PARAM = "bypass";
const MAINTENANCE_BYPASS_VALUE = "panebarco";
const MAINTENANCE_BYPASS_COOKIE = "maintenance_bypass";
const MAINTENANCE_BYPASS_DURATION_SECONDS = 60 * 60 * 12;
const MAINTENANCE_PAGE_PATH = "/maintenance";

export const onRequest: MiddlewareHandler = (context, next) => {
  const { url, cookies, redirect } = context;
  const { pathname, searchParams } = url;
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
  const isApiRoute =
    normalizedPathname === "/api" || normalizedPathname.startsWith("/api/");
  const isMaintenancePage = normalizedPathname === MAINTENANCE_PAGE_PATH;
  const redirectTarget = redirects[normalizedPathname as keyof typeof redirects];

  if (isApiRoute) {
    return next();
  }

  const bypassFromQuery =
    searchParams.get(MAINTENANCE_BYPASS_QUERY_PARAM) === MAINTENANCE_BYPASS_VALUE;

  if (bypassFromQuery) {
    cookies.set(MAINTENANCE_BYPASS_COOKIE, "true", {
      path: "/",
      maxAge: MAINTENANCE_BYPASS_DURATION_SECONDS,
      httpOnly: true,
      sameSite: "lax",
      secure: url.protocol === "https:",
    });

    searchParams.delete(MAINTENANCE_BYPASS_QUERY_PARAM);

    const cleanUrl = new URL(url);
    cleanUrl.search = searchParams.toString();

    return redirect(cleanUrl.toString(), 302);
  }

  if (!MAINTENANCE_MODE_ENABLED) {
    if (redirectTarget) {
      return redirect(redirectTarget, 301);
    }

    return next();
  }

  if (!isMaintenancePage) {
    const hasBypassCookie = cookies.get(MAINTENANCE_BYPASS_COOKIE)?.value === "true";

    if (!hasBypassCookie) {
      return redirect(MAINTENANCE_PAGE_PATH, 302);
    }
  }

  if (redirectTarget) {
    return redirect(redirectTarget, 301);
  }

  return next();
};
