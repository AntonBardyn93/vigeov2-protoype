import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const LIST_CANDIDATES = [
  join(HERE, "..", "allowed-emails.txt"),
  join(process.cwd(), "allowed-emails.txt"),
];
const LIST_HEADER = `# Invitation-only. One email per line.
# Managed from the local invite form (npm run invites).
`;

export function allowlistPath() {
  for (const path of LIST_CANDIDATES) {
    try {
      readFileSync(path, "utf8");
      return path;
    } catch {
      // try the next known location
    }
  }
  return LIST_CANDIDATES[0];
}

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
  for (const path of LIST_CANDIDATES) {
    try {
      return parseAllowlist(readFileSync(path, "utf8"));
    } catch {
      // try the next known location
    }
  }
  return new Set();
}

export function isEmailAllowed(value) {
  const email = normalizeEmail(value);
  if (!email || !email.includes("@")) return false;
  return loadAllowlist().has(email);
}

export function extractEmails(value) {
  const found = String(value || "").match(/[^\s,;]+@[^\s,;]+/g) || [];
  return [...new Set(found.map(normalizeEmail).filter((email) => email.includes("@")))];
}

export function saveAllowlist(emails) {
  const unique = [...new Set([...emails].map(normalizeEmail).filter((email) => email.includes("@")))].sort();
  writeFileSync(allowlistPath(), LIST_HEADER + (unique.length ? unique.join("\n") + "\n" : ""), "utf8");
  return unique;
}

export function addAllowedEmails(values) {
  const next = loadAllowlist();
  const added = [];
  for (const email of extractEmails(Array.isArray(values) ? values.join("\n") : values)) {
    if (!next.has(email)) {
      next.add(email);
      added.push(email);
    }
  }
  saveAllowlist(next);
  return { emails: [...next].sort(), added };
}

export function removeAllowedEmail(value) {
  const email = normalizeEmail(value);
  const next = loadAllowlist();
  const removed = next.delete(email);
  saveAllowlist(next);
  return { emails: [...next].sort(), removed };
}
