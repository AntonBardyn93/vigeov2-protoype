import http from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { addAllowedEmails, loadAllowlist, removeAllowedEmail } from "../lib/allowlist.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGE = join(ROOT, "admin", "index.html");
const META = join(ROOT, "admin", "invites.json");
const PORT = Number(process.env.INVITE_PORT || 4177);
const HOST = "127.0.0.1";

function json(res, data, status = 200) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function loadMeta() {
  try {
    return JSON.parse(readFileSync(META, "utf8"));
  } catch {
    return { prototypeUrl: "", people: {} };
  }
}

function saveMeta(meta) {
  writeFileSync(META, JSON.stringify(meta, null, 2) + "\n", "utf8");
}

function snapshot() {
  const meta = loadMeta();
  const emails = [...loadAllowlist()].sort();
  const people = emails.map((email) => {
    const row = meta.people?.[email] || {};
    return {
      email,
      addedAt: row.addedAt || null,
      linkCopiedAt: row.linkCopiedAt || null,
    };
  });
  return {
    prototypeUrl: meta.prototypeUrl || "",
    people,
    waiting: people.filter((row) => !row.linkCopiedAt).length,
    sent: people.filter((row) => row.linkCopiedAt).length,
  };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${HOST}:${PORT}`);

    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
      res.end(readFileSync(PAGE));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/invites") {
      json(res, snapshot());
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/invites") {
      const body = await readBody(req);
      const result = addAllowedEmails(body.emails || body.email || "");
      const meta = loadMeta();
      meta.people ||= {};
      const now = new Date().toISOString();
      for (const email of result.added) {
        meta.people[email] = { addedAt: now, linkCopiedAt: null };
      }
      saveMeta(meta);
      json(res, { ...snapshot(), added: result.added });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/invites/remove") {
      const body = await readBody(req);
      const result = removeAllowedEmail(body.email || "");
      const meta = loadMeta();
      if (result.removed && meta.people) {
        delete meta.people[String(body.email || "").trim().toLowerCase()];
      }
      saveMeta(meta);
      json(res, snapshot());
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/invites/link") {
      const body = await readBody(req);
      const email = String(body.email || "").trim().toLowerCase();
      const meta = loadMeta();
      meta.people ||= {};
      if (email && loadAllowlist().has(email)) {
        meta.people[email] = {
          addedAt: meta.people[email]?.addedAt || new Date().toISOString(),
          linkCopiedAt: new Date().toISOString(),
        };
        saveMeta(meta);
      }
      json(res, snapshot());
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/invites/url") {
      const body = await readBody(req);
      const meta = loadMeta();
      meta.prototypeUrl = String(body.prototypeUrl || "").trim();
      saveMeta(meta);
      json(res, snapshot());
      return;
    }

    res.writeHead(404);
    res.end("not found");
  } catch (err) {
    json(res, { error: String(err.message || err) }, 500);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Invite form: http://${HOST}:${PORT}`);
});
