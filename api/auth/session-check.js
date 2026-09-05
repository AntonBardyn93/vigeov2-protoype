import { isEmailAllowed } from "../../lib/allowlist.js";
import { COOKIE_NAME, readCookie, readSessionEmail } from "../../lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false });
    return;
  }

  const token = readCookie(req.headers.cookie || "", COOKIE_NAME);
  const email = await readSessionEmail(token);
  const ok = Boolean(email && isEmailAllowed(email));
  res.status(ok ? 200 : 401).json({ ok });
}
