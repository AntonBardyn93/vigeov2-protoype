import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { syncGeneratedAllowlist } from "../lib/allowlist.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SHARE = join(ROOT, "share");
const DIST = join(ROOT, "dist");

const GATE_JS = `(function(){
  if (/\\/access\\.html$/.test(location.pathname)) return;
  document.documentElement.classList.add("alfora-gate-pending");
  fetch("/api/auth/session-check", { credentials: "same-origin" })
    .then(function(r){ return r.json().then(function(d){ return r.ok && d.ok; }); })
    .catch(function(){ return false; })
    .then(function(ok){
      if (ok) {
        document.documentElement.classList.remove("alfora-gate-pending");
        return;
      }
      var next = location.pathname + location.search;
      location.replace("/access.html" + (next && next !== "/" ? "?next=" + encodeURIComponent(next) : ""));
    });
})();
`;

const GATE_SNIPPET = `<style data-alfora-gate>html.alfora-gate-pending body{visibility:hidden!important}</style><script data-alfora-gate src="/gate.js"></script>`;

function walkHtml(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walkHtml(path, files);
    else if (name.endsWith(".html") && name !== "access.html") files.push(path);
  }
  return files;
}

function injectGate(html) {
  if (html.includes("data-alfora-gate")) return html;
  if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (tag) => tag + GATE_SNIPPET);
  return GATE_SNIPPET + html;
}

syncGeneratedAllowlist();
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(SHARE, DIST, { recursive: true });
writeFileSync(join(DIST, "gate.js"), GATE_JS);
for (const file of walkHtml(DIST)) {
  writeFileSync(file, injectGate(readFileSync(file, "utf8")));
}
console.log("prepared dist/ from share/");
