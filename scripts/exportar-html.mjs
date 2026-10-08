// Arma el sitio como HTML estático para el hosting de las clientas (DUPLIKA:
// Apache + PHP) en out/, y lo empaqueta en requecho-html.zip para subirlo.
//
// Uso:  node scripts/exportar-html.mjs
//       (opcional) LEADS_WEBHOOK_URL=https://script.google.com/.../exec  → escribe
//       lead-config.php con ese destino. Sin la variable no se escribe, para no pisar
//       el que ya esté en el servidor.
//
// Qué hace, además de `next build` con output: "export" (ver next.config.ts):
//  - saca src/app/api del build (un POST no se puede exportar; lo reemplaza lead.php)
//    y lo vuelve a poner al terminar, salga bien o mal;
//  - copia el español (out/es) a la raíz: "/" es el español, como en Vercel;
//  - genera los .webp por ancho que pide el loader de src/lib/image-loader.ts;
//  - suma .htaccess, lead.php, robots.txt y sitemap.xml.
import { spawnSync, execFileSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import sharp from "sharp";

const SITE = "https://requecho.com";
const RAIZ = process.cwd();
const OUT = join(RAIZ, "out");
const API = join(RAIZ, "src/app/api");
const API_FUERA = join(RAIZ, "src/app/_api-fuera-del-export");
// Tienen que coincidir con ANCHOS_EXPORTACION de next.config.ts.
const ANCHOS = [256, 384, 640, 960, 1280, 1920];

// 1. Build estático, sin la API.
if (existsSync(API_FUERA)) throw new Error(`Quedó ${API_FUERA} de una corrida anterior: devolverlo a src/app/api.`);
renameSync(API, API_FUERA);
let build;
try {
  rmSync(OUT, { recursive: true, force: true });
  build = spawnSync("npx next build", {
    shell: true,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_EXPORTAR: "1",
      NEXT_PUBLIC_SITE_URL: SITE,
      NEXT_PUBLIC_SITE_LIVE: "true",
    },
  });
} finally {
  renameSync(API_FUERA, API);
}
if (build.status !== 0) process.exit(build.status ?? 1);

// 2. El español en la raíz.
cpSync(join(OUT, "es"), OUT, { recursive: true });

// 3. Imágenes: un .webp por ancho al lado de cada .jpg/.png de las carpetas que usa
//    next/image (images/ y logos/; og.jpg y los íconos se sirven tal cual).
const archivos = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return n === "_next" ? [] : archivos(p);
    return [p];
  });
const imagenes = ["images", "logos"].flatMap((d) => archivos(join(OUT, d))).filter((p) => /\.(jpe?g|png)$/i.test(p));
for (const img of imagenes) {
  const base = img.replace(/\.(jpe?g|png)$/i, "");
  await Promise.all(
    ANCHOS.map((w) =>
      sharp(img).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${base}-${w}.webp`),
    ),
  );
}
console.log(`\n${imagenes.length} imágenes → ${imagenes.length * ANCHOS.length} .webp`);

// 4. Archivos del hosting.
cpSync(join(RAIZ, "hosting/.htaccess"), join(OUT, ".htaccess"));
cpSync(join(RAIZ, "hosting/lead.php"), join(OUT, "lead.php"));
const webhook = process.env.LEADS_WEBHOOK_URL?.trim();
if (webhook) {
  writeFileSync(join(OUT, "lead-config.php"), `<?php\nreturn ['webhook' => ${JSON.stringify(webhook)}];\n`);
  console.log("lead-config.php escrito con el webhook.");
} else {
  console.log("Sin LEADS_WEBHOOK_URL: no se escribe lead-config.php (ver docs/subir-a-duplika.md).");
}
writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
const alternos = `
    <xhtml:link rel="alternate" hreflang="es" href="${SITE}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`;
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE}/</loc>${alternos}
  </url>
  <url>
    <loc>${SITE}/en/</loc>${alternos}
  </url>
</urlset>
`,
);

// 5. Zip para subir y descomprimir en public_html.
const ZIP = join(RAIZ, "requecho-html.zip");
rmSync(ZIP, { force: true });
execFileSync("python", [join(RAIZ, "scripts/empaquetar-zip.py"), OUT, ZIP], { stdio: "inherit" });
const total = archivos(OUT).length;
console.log(`\nListo: ${relative(RAIZ, OUT)}/ (${total} archivos) y ${relative(RAIZ, ZIP)}.`);
