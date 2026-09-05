import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { syncGeneratedAllowlist } from "../lib/allowlist.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SHARE = join(ROOT, "share");
const PUBLIC = join(ROOT, "public");

syncGeneratedAllowlist();
rmSync(PUBLIC, { recursive: true, force: true });
mkdirSync(PUBLIC, { recursive: true });
cpSync(SHARE, PUBLIC, { recursive: true });
console.log("prepared public/ from share/");
