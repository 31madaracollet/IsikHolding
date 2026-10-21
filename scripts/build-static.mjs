/**
 * GitHub Pages için statik derleme.
 *
 * Depoyu geçici bir klasöre kopyalar, sunucuya bağlı parçaları (route
 * handler'lar, middleware) çıkarır ve `next build` ile `docs/` klasörüne
 * statik site üretir. `docs/` GitHub Pages'ten yayınlanır.
 */
import { cp, mkdir, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const work = path.join(root, ".static-build");
const out = path.join(root, "docs");
const basePath = "/IsikHolding";

const skip = new Set([
  "node_modules",
  ".next",
  ".git",
  ".static-build",
  "docs",
  "out",
  ".data",
  "tsconfig.tsbuildinfo",
  ".env.local",
  ".env.development.local",
  ".env.production.local",
]);

function parseEnv(text) {
  const entries = {};
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    entries[match[1]] = value;
  }
  return entries;
}

console.log("→ Statik derleme hazırlanıyor");

await rm(work, { recursive: true, force: true });
await mkdir(work, { recursive: true });

for (const entry of await readdir(root)) {
  if (skip.has(entry)) continue;
  await cp(path.join(root, entry), path.join(work, entry), { recursive: true });
}
await symlink(path.join(root, "node_modules"), path.join(work, "node_modules"), "dir");

// Sunucu tarafı parçalar statik dışa aktarımda desteklenmez.
await rm(path.join(work, "app", "api"), { recursive: true, force: true });
await rm(path.join(work, "middleware.ts"), { force: true });

// Dinamik sayfaları statik dışa aktarıma uygun hale getir.
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

for (const file of await walk(path.join(work, "app"))) {
  if (!/\.(tsx?|jsx?)$/.test(file)) continue;
  const source = await readFile(file, "utf8");
  const patched = source.replace(
    /^export const dynamic = "force-dynamic";\s*$/gm,
    'export const dynamic = "force-static";',
  );
  if (patched !== source) await writeFile(file, patched, "utf8");
}

// ISR/`revalidate` statik dışa aktarımda yok: sayfaları tamamen statik yap.
for (const file of [
  path.join("app", "(site)", "page.tsx"),
  path.join("app", "(site)", "haberler", "page.tsx"),
]) {
  const target = path.join(work, file);
  if (!existsSync(target)) continue;
  const source = await readFile(target, "utf8");
  await writeFile(
    target,
    source.replace(
      /^export const revalidate = .*;$/m,
      'export const dynamic = "force-static";',
    ),
    "utf8",
  );
}

// Ortam: yalnızca herkese açık (NEXT_PUBLIC_*) değerler.
const env = {};
for (const file of [".env.static", ".env.local"]) {
  const full = path.join(root, file);
  if (!existsSync(full)) continue;
  Object.assign(env, parseEnv(await readFile(full, "utf8")));
}
env.NEXT_PUBLIC_SITE_URL = `https://31madaracollet.github.io${basePath}`;

const envLines = Object.entries(env)
  .filter(([key]) => key.startsWith("NEXT_PUBLIC_"))
  .map(([key, value]) => `${key}=${value}`);
await writeFile(
  path.join(work, ".env.local"),
  [
    "STATIC_EXPORT=1",
    "NEXT_PUBLIC_STATIC_EXPORT=1",
    `NEXT_PUBLIC_BASE_PATH=${basePath}`,
    ...envLines,
    "",
  ].join("\n"),
  "utf8",
);

const result = spawnSync("npx", ["next", "build"], {
  cwd: work,
  stdio: "inherit",
  env: { ...process.env, STATIC_EXPORT: "1", NODE_ENV: "production" },
});
if (result.status !== 0) {
  console.error("✗ Statik derleme başarısız");
  process.exit(result.status ?? 1);
}

const exported = path.join(work, "out");
if (!existsSync(exported)) {
  console.error("✗ `out/` klasörü oluşmadı");
  process.exit(1);
}

await rm(out, { recursive: true, force: true });
await cp(exported, out, { recursive: true });
await writeFile(path.join(out, ".nojekyll"), "");
console.log(`✓ Statik site hazır: ${path.relative(root, out)}/`);
