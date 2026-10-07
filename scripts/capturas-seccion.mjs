// Captura una sección de main (SECCION=2 → la segunda) a 1440 y 375 px, ya recorrida.
// Uso: SECCION=2 node scripts/capturas-seccion.mjs  (URL=... para mirar el vivo)
import { chromium } from "playwright";
import { spawn, execSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const N = Number(process.env.SECCION || 2);
const PORT = Number(process.env.PORT || 3105);
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
for (const ruta of (process.env.RUTAS || "/").split(",")) {
  for (const a of [{ w: 1440, h: 900, n: "desktop" }, { w: 375, h: 812, n: "mobile" }]) {
    const ctx = await browser.newContext({ viewport: { width: a.w, height: a.h }, deviceScaleFactor: 1, hasTouch: a.w < 1024, isMobile: a.w < 1024 });
    await ctx.addInitScript(() => { try { localStorage.setItem("rq_popup_cerrado", String(Date.now())); } catch {} });
    const page = await ctx.newPage();
    const errores = [];
    page.on("pageerror", (e) => errores.push(String(e)));
    await page.goto(URL + ruta, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const { top, height } = await page.evaluate((k) => {
      const r = document.querySelectorAll("main > section")[k].getBoundingClientRect();
      return { top: r.top + window.scrollY, height: r.height };
    }, N - 1);
    for (let y = top - a.h; y < top + height; y += 200) {
      await page.evaluate((v) => window.scrollTo(0, v), Math.max(0, y));
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(2500);
    const tag = ruta === "/" ? "es" : ruta.replace(/\W/g, "");
    await page.evaluate((v) => window.scrollTo(0, v), top + height * 0.35);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `capturas/seccion-${N}-${tag}-${a.n}-mid.png` });
    await page.evaluate((v) => window.scrollTo(0, v), top);
    await page.waitForTimeout(600);
    await (await page.$$("main > section"))[N - 1].screenshot({ path: `capturas/seccion-${N}-${tag}-${a.n}.png` });
    console.log(a.n, tag, Math.round(height) + "px", "errores:", errores.length ? errores : "ninguno");
    await ctx.close();
  }
}
await browser.close();
kill();
