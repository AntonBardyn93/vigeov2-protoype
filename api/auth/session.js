import { createClerkClient, verifyToken } from "@clerk/backend";
import { isEmailAllowed, normalizeEmail } from "../../lib/allowlist.js";
import { createSessionToken, isSecureRequest, sessionCookie } from "../../lib/session.js";

function requestFromNode(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const proto = req.headers["x-forwarded-proto"] || "http";
  return new Request(`${proto}://${host}${req.url}`, {
    method: req.method,
    headers: req.headers,
  });
}

function authorizedParties(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || "http";
  return [
    process.env.CLERK_AUTHORIZED_PARTY,
    host ? `${proto}://${host}` : "",
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    "http://localhost:3000",
  ].filter(Boolean);
}

function primaryEmail(user) {
  const primary = user.emailAddresses?.find((item) => item.id === user.primaryEmailAddressId);
  return normalizeEmail(primary?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    res.status(503).json({ ok: false });
    return;
  }

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    res.status(401).json({ ok: false });
    return;
  }

  try {
    let payload;
    try {
      payload = await verifyToken(token, {
        secretKey,
        authorizedParties: authorizedParties(req),
      });
    } catch {
      payload = await verifyToken(token, { secretKey });
    }
    const clerk = createClerkClient({ secretKey });
    const user = await clerk.users.getUser(payload.sub);
    const email = primaryEmail(user);
    if (!email || !isEmailAllowed(email)) {
      res.status(403).json({ ok: false });
      return;
    }

    const session = await createSessionToken(email);
    const secure = isSecureRequest(requestFromNode(req));
    res.setHeader("Set-Cookie", sessionCookie(session, { secure }));
    res.status(200).json({ ok: true });
  } catch {
    res.status(401).json({ ok: false });
  }
}
