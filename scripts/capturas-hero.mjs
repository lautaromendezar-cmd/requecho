// Hero (fotos en fundido) y pie, a 1440 y 375 px. Uso: node scripts/capturas-hero.mjs
import { chromium } from "playwright";
import { spawn, execSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const PORT = Number(process.env.PORT || 3104);
const URL = process.env.URL || `http://localhost:${PORT}`;
mkdirSync("capturas", { recursive: true });
let server;
const kill = () => { if (server) try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" }); } catch {} };
if (!process.env.URL) {
  server = spawn("npx next start -p " + PORT, { shell: true, stdio: ["ignore", "pipe", "pipe"] });
  process.on("exit", kill);
  for (let i = 0; i < 60; i++) { try { if ((await fetch(URL)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 1000)); }
}
const browser = await chromium.launch({ channel: "chrome", args: ["--disable-gpu"] });
for (const a of [{ w: 1440, h: 900, n: "desktop" }, { w: 375, h: 812, n: "mobile" }]) {
  const ctx = await browser.newContext({ viewport: { width: a.w, height: a.h }, deviceScaleFactor: 1, hasTouch: a.w < 1024, isMobile: a.w < 1024 });
  await ctx.addInitScript(() => { try { localStorage.setItem("rq_popup_cerrado", String(Date.now())); } catch {} });
  const page = await ctx.newPage();
  const errores = [];
  page.on("console", (m) => m.type() === "error" && errores.push(m.text()));
  page.on("pageerror", (e) => errores.push(String(e)));
  for (const ruta of ["/", "/en"]) {
    const tag = ruta === "/" ? "es" : "en";
    await page.goto(URL + ruta, { waitUntil: "networkidle" });
    for (let k = 0; k < (tag === "es" ? 4 : 1); k++) {
      await page.waitForTimeout(k === 0 ? 3000 : 5000);
      await page.screenshot({ path: `capturas/hero-${tag}-${a.n}-${k}.png` });
    }
    const vis = await page.evaluate(() => [...document.querySelectorAll("[data-foto]")].map((e) => getComputedStyle(e).opacity.slice(0, 4)).join(" "));
    console.log(a.n, tag, "capas:", vis);
  }
  await page.goto(URL + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  await (await page.$("footer")).screenshot({ path: `capturas/pie-${a.n}.png` });
  console.log(a.n, "errores:", errores.length ? errores : "ninguno");
  await ctx.close();
}
await browser.close();
kill();
