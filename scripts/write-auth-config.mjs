import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAllowlist } from "../lib/allowlist-core.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const emails = [...parseAllowlist(readFileSync(join(ROOT, "allowed-emails.txt"), "utf8"))];
const config = {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY || "",
  emails,
};
const file = join(ROOT, "share", "auth-config.js");
writeFileSync(file, "window.ALFORA_AUTH = " + JSON.stringify(config) + ";\n");
console.log("wrote share/auth-config.js", emails.length, "emails", config.publishableKey ? "with Clerk key" : "WITHOUT Clerk key");
