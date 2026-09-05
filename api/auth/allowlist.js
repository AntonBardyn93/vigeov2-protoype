import { isEmailAllowed } from "../../lib/allowlist.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const email = body.email;
  res.status(200).json({ ok: isEmailAllowed(email) });
}
