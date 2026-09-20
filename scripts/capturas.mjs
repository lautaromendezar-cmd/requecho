// Capturas de verificación a 375, 768 y 1440 px, con y sin movimiento, sobre next start.
// Uso: node scripts/capturas.mjs   (deja los PNG en capturas/ y lista problemas)
import { chromium } from "playwright";
import { spawn, execSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const PORT = Number(process.env.PORT || 3100);
const URL = `http://localhost:${PORT}`;
mkdirSync("capturas", { recursive: true });

const server = spawn("npx next start -p " + PORT, { shell: true, stdio: ["ignore", "pipe", "pipe"] });
server.stderr.on("data", (d) => process.stdout.write("[next!] " + d));
const kill = () => {
  try {
    execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" });
  } catch {}
};
process.on("exit", kill);

for (let i = 0; i < 60; i++) {
  try {
    const r = await fetch(URL);
    if (r.ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 1000));
  if (i === 59) {
    console.error("next start no levantó");
    process.exit(1);
  }
}

const browser = await chromium.launch({ channel: "chrome", args: ["--disable-gpu"] });
const problemas = [];
const anchos = [
  { w: 375, h: 812, n: "mobile" },
  { w: 768, h: 1024, n: "tablet" },
  { w: 1440, h: 900, n: "desktop" },
];

const ocultosEn = (page, selector) =>
  page.evaluate((sel) => {
    return Array.from(document.querySelectorAll(sel))
      .filter((el) => getComputedStyle(el).display !== "none" && getComputedStyle(el).opacity === "0")
      .map(
        (el) =>
          el.tagName.toLowerCase() +
          "[" +
          (el.getAttribute("data-reveal") || "") +
          "] " +
          (el.textContent || "").trim().slice(0, 40),
      );
  }, selector);

for (const modo of ["motion", "reduce"]) {
  for (const a of anchos) {
    const ctx = await browser.newContext({
      viewport: { width: a.w, height: a.h },
      deviceScaleFactor: 1,
      reducedMotion: modo === "reduce" ? "reduce" : "no-preference",
      hasTouch: a.w < 1024,
      isMobile: a.w < 1024,
    });
    const page = await ctx.newPage();
    page.on("console", (m) => {
      if (m.type() === "error" || m.type() === "warning")
        problemas.push(`${modo}/${a.n} console.${m.type()}: ${m.text().slice(0, 300)}`);
    });
    page.on("pageerror", (e) => problemas.push(`${modo}/${a.n} pageerror: ${e.message.slice(0, 300)}`));
    page.on("requestfailed", (r) => problemas.push(`${modo}/${a.n} request failed: ${r.url().slice(0, 120)}`));

    await page.goto(URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `capturas/${modo}-${a.n}-hero.png` });

    // El hero tiene que estar completo después de la secuencia de carga
    const heroOcultos = await ocultosEn(page, "section[aria-labelledby='hero-titulo'] [data-reveal]");
    if (heroOcultos.length) problemas.push(`${modo}/${a.n}: hero con ${heroOcultos.length} piezas ocultas → ${heroOcultos.join(" | ")}`);

    // Recorrido completo con scroll nativo, para disparar los reveals
    const paso = Math.round(a.h * 0.45);
    for (let i = 0; i < 400; i++) {
      const fin = await page.evaluate((p) => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollBy(0, p);
        return window.scrollY >= max - 2;
      }, paso);
      await page.waitForTimeout(120);
      if (fin) break;
    }
    await page.waitForTimeout(1800);
    const ocultos = await ocultosEn(page, "[data-reveal]");
    if (ocultos.length) problemas.push(`${modo}/${a.n}: ${ocultos.length} elementos con opacity 0 → ${ocultos.slice(0, 8).join(" | ")}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 0) problemas.push(`${modo}/${a.n}: overflow horizontal de ${overflow}px`);
    const h1s = await page.evaluate(() => document.querySelectorAll("h1").length);
    if (h1s !== 1) problemas.push(`${modo}/${a.n}: ${h1s} h1`);
    const total = await page.evaluate(() => document.documentElement.scrollHeight);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `capturas/${modo}-${a.n}-full.png`, fullPage: true });
    await ctx.close();
    console.log(`ok ${modo}/${a.n} (alto ${total}px)`);
  }
}
await browser.close();
kill();
console.log(problemas.length ? "\nPROBLEMAS:\n" + problemas.join("\n") : "\nSin errores de consola, sin elementos ocultos, sin overflow.");
