// Captura cada uno de los 8 bloques a 1440 y 375 px, después de recorrerlo con scroll.
// Uso: node scripts/capturas-bloques.mjs  → capturas/bloque-N-{desktop,mobile}[-mid].png
import { chromium } from "playwright";
import { spawn, execSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const PORT = Number(process.env.PORT || 3103);
const URL = `http://localhost:${PORT}`;
mkdirSync("capturas", { recursive: true });
const server = spawn("npx next start -p " + PORT, { shell: true, stdio: ["ignore", "pipe", "pipe"] });
const kill = () => { try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" }); } catch {} };
process.on("exit", kill);
for (let i = 0; i < 60; i++) { try { if ((await fetch(URL)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 1000)); }

const browser = await chromium.launch({ channel: "chrome", args: ["--disable-gpu"] });
for (const a of [{ w: 1440, h: 900, n: "desktop" }, { w: 375, h: 812, n: "mobile" }]) {
  const ctx = await browser.newContext({ viewport: { width: a.w, height: a.h }, deviceScaleFactor: 1, hasTouch: a.w < 1024, isMobile: a.w < 1024 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const n = await page.evaluate(() => document.querySelectorAll("main > section").length);
  for (let i = 0; i < n; i++) {
    const { top, height } = await page.evaluate((k) => {
      const s = document.querySelectorAll("main > section")[k];
      const r = s.getBoundingClientRect();
      return { top: r.top + window.scrollY, height: r.height };
    }, i);
    for (let y = top - a.h * 0.3; y < top + height; y += Math.round(a.h * 0.4)) {
      await page.evaluate((v) => window.scrollTo(0, v), Math.max(0, y));
      await page.waitForTimeout(110);
    }
    await page.evaluate((v) => window.scrollTo(0, v), Math.max(0, top + height * 0.5 - a.h * 0.5));
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `capturas/bloque-${i + 1}-${a.n}-mid.png` });
    await page.evaluate((v) => window.scrollTo(0, v), top);
    await page.waitForTimeout(900);
    const sec = (await page.$$("main > section"))[i];
    await sec.screenshot({ path: `capturas/bloque-${i + 1}-${a.n}.png` });
    console.log(`bloque ${i + 1} ${a.n} (${Math.round(height)}px)`);
  }
  await ctx.close();
}
await browser.close();
kill();
