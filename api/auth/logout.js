import { clearSessionCookie, isSecureRequest } from "../../lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const proto = req.headers["x-forwarded-proto"] || "http";
  const request = new Request(`${proto}://${host}${req.url}`, {
    method: req.method,
    headers: req.headers,
  });

  res.setHeader("Set-Cookie", clearSessionCookie({ secure: isSecureRequest(request) }));
  res.status(200).json({ ok: true });
}
