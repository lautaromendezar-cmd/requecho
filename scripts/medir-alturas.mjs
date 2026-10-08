// Alto de cada sección en pantallas (375 y 1440 px). Uso: node scripts/medir-alturas.mjs
// (URL=https://requecho.vercel.app para medir el vivo; sin URL levanta next start).
import { chromium } from "playwright";
import { spawn, execSync } from "node:child_process";
const PORT = 3107;
const URL = process.env.URL || `http://localhost:${PORT}`;
let server;
if (!process.env.URL) {
  server = spawn("npx next start -p " + PORT, { shell: true, stdio: "ignore" });
  for (let i = 0; i < 60; i++) { try { if ((await fetch(URL)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 1000)); }
}
const b = await chromium.launch({ channel: "chrome", args: ["--disable-gpu"] });
for (const w of [375, 1440]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w < 1024 ? 812 : 900 }, isMobile: w < 1024, hasTouch: w < 1024 });
  await ctx.addInitScript(() => localStorage.setItem("rq_popup_cerrado", String(Date.now())));
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: "networkidle" });
  for (let y = 0; y < 30000; y += 400) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(40); }
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const vh = window.innerHeight;
    return {
      total: document.documentElement.scrollHeight,
      pant: +(document.documentElement.scrollHeight / vh).toFixed(1),
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
      secs: [...document.querySelectorAll("main > section, footer")].map((s) => [s.getAttribute("aria-labelledby") || "footer", +(s.getBoundingClientRect().height / vh).toFixed(1)]),
    };
  });
  console.log(w, "total", r.total, "=", r.pant, "pantallas | scroll horizontal:", r.overflowX, "|", r.secs.map((s) => s.join(" ")).join(", "));
  await ctx.close();
}
await b.close();
if (server) try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" }); } catch {}
