// Tres momentos del bloque 5 en desktop (inicio, mitad, final del scrub) + hero desktop.
import { chromium } from "playwright";
import { spawn, execSync } from "node:child_process";
const PORT = 3104, URL = `http://localhost:${PORT}`;
const server = spawn("npx next start -p " + PORT, { shell: true, stdio: ["ignore", "pipe", "pipe"] });
const kill = () => { try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" }); } catch {} };
process.on("exit", kill);
for (let i = 0; i < 60; i++) { try { if ((await fetch(URL)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 1000)); }
const browser = await chromium.launch({ channel: "chrome", args: ["--disable-gpu"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(3500);
await page.screenshot({ path: "capturas/hero-desktop-v2.png" });
const { top, height } = await page.evaluate(() => { const s = document.querySelectorAll("main > section")[4]; const r = s.getBoundingClientRect(); return { top: r.top + window.scrollY, height: r.height }; });
for (let y = top - 400; y < top + height * 0.2; y += 300) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(100); }
for (const [k, f] of [["a", 0.16], ["b", 0.3], ["c", 0.42], ["d", 0.55]]) {
  await page.evaluate((v) => window.scrollTo(0, v), top + height * f);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `capturas/bloque-5-${k}.png` });
}
await browser.close();
kill();
console.log("listo");
