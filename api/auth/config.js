export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false });
    return;
  }

  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY || "";
  res.status(200).json({
    ok: Boolean(publishableKey),
    publishableKey,
  });
}
