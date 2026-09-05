import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  isEmailAllowed,
  loadAllowlist as loadGeneratedAllowlist,
  normalizeEmail,
  parseAllowlist,
} from "./allowlist-core.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const LIST_PATH = join(HERE, "..", "allowed-emails.txt");
const GENERATED_PATH = join(HERE, "allowed-emails.generated.js");
const LIST_HEADER = `# Invitation-only. One email per line.
# Managed from the local invite form (npm run invites).
`;

export { isEmailAllowed, normalizeEmail, parseAllowlist };

export function allowlistPath() {
  return LIST_PATH;
}

export function loadAllowlist() {
  try {
    return parseAllowlist(readFileSync(LIST_PATH, "utf8"));
  } catch {
    return loadGeneratedAllowlist();
  }
}

export function extractEmails(value) {
  const found = String(value || "").match(/[^\s,;]+@[^\s,;]+/g) || [];
  return [...new Set(found.map(normalizeEmail).filter((email) => email.includes("@")))];
}

function writeGenerated(text) {
  writeFileSync(GENERATED_PATH, `export const RAW_ALLOWLIST = ${JSON.stringify(text)};\n`, "utf8");
}

export function saveAllowlist(emails) {
  const unique = [...new Set([...emails].map(normalizeEmail).filter((email) => email.includes("@")))].sort();
  const text = LIST_HEADER + (unique.length ? unique.join("\n") + "\n" : "");
  writeFileSync(LIST_PATH, text, "utf8");
  writeGenerated(text);
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

export function syncGeneratedAllowlist() {
  const text = readFileSync(LIST_PATH, "utf8");
  writeGenerated(text);
}
