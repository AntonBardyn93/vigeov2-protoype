import { RAW_ALLOWLIST } from "./allowed-emails.generated.js";

export function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export function parseAllowlist(text) {
  const emails = new Set();
  for (const rawLine of String(text || "").split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim().toLowerCase();
    if (!line) continue;
    emails.add(line);
  }
  return emails;
}

export function loadAllowlist() {
  return parseAllowlist(RAW_ALLOWLIST);
}

export function isEmailAllowed(value) {
  const email = normalizeEmail(value);
  if (!email || !email.includes("@")) return false;
  return loadAllowlist().has(email);
}
