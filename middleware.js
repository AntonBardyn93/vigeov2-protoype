import { isEmailAllowed } from "./lib/allowlist.js";
import { COOKIE_NAME, readCookie, readSessionEmail } from "./lib/session.js";

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!access\\.html|api/auth/).*)"],
};

function isPublicPath(pathname) {
  return pathname === "/access.html" || pathname.startsWith("/api/auth/");
}

function safeNext(pathname, search) {
  const path = `${pathname}${search || ""}`;
  if (!path.startsWith("/") || path.startsWith("//")) return "/";
  if (path.startsWith("/access.html")) return "/";
  return path;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  if (isPublicPath(url.pathname)) return;

  const token = readCookie(request.headers.get("cookie") || "", COOKIE_NAME);
  const email = await readSessionEmail(token);
  if (email && isEmailAllowed(email)) return;

  const gate = new URL("/access.html", request.url);
  const next = safeNext(url.pathname, url.search);
  if (next && next !== "/") gate.searchParams.set("next", next);
  return Response.redirect(gate, 302);
}
