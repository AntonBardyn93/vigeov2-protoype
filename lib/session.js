import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "alfora_access";
const MAX_AGE_SEC = 60 * 60 * 24 * 30;

function secretKey() {
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) throw new Error("CLERK_SECRET_KEY is not set");
  return new TextEncoder().encode(secret);
}

export function isSecureRequest(request) {
  const proto = request.headers.get("x-forwarded-proto") || new URL(request.url).protocol.replace(":", "");
  return proto === "https" || process.env.VERCEL_ENV === "production";
}

export async function createSessionToken(email) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SEC}s`)
    .sign(secretKey());
}

export async function readSessionEmail(token) {
  if (!token) return "";
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return typeof payload.email === "string" ? payload.email : "";
  } catch {
    return "";
  }
}

export function readCookie(cookieHeader, name) {
  if (!cookieHeader) return "";
  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}

export function sessionCookie(token, { secure } = {}) {
  const parts = [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${MAX_AGE_SEC}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookie({ secure } = {}) {
  const parts = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}
