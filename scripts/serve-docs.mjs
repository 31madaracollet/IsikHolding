/**
 * `docs/` klasörünü GitHub Pages davranışıyla yerelde sunar:
 * site `/IsikHolding/` alt dizininden yayınlanır (proje sayfası).
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("docs");
const base = "/IsikHolding";
const port = Number(process.env.PORT ?? 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/\.\./g, "");
  if (!clean.startsWith(base)) return null;
  const rel = clean.slice(base.length).replace(/^\/+/, "");
  const candidates = rel === ""
    ? [path.join(root, "index.html")]
    : [
        path.join(root, rel),
        path.join(root, rel, "index.html"),
        path.join(root, `${rel}.html`),
      ];

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      /* sıradaki adaya bak */
    }
  }
  return null;
}

createServer(async (request, response) => {
  const url = request.url ?? "/";

  if (url === "/" || url === "") {
    response.writeHead(302, { Location: `${base}/` });
    response.end();
    return;
  }
  if (url === base) {
    response.writeHead(302, { Location: `${base}/` });
    response.end();
    return;
  }

  const file = await resolveFile(url);
  if (!file) {
    const notFound = path.join(root, "404.html");
    try {
      const body = await readFile(notFound);
      response.writeHead(404, { "Content-Type": types[".html"] });
      response.end(body);
      return;
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Bulunamadı");
      return;
    }
  }

  const body = await readFile(file);
  response.writeHead(200, {
    "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  response.end(body);
}).listen(port, "0.0.0.0", () => {
  console.log(`Statik önizleme: http://0.0.0.0:${port}${base}/`);
});
