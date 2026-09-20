// Lighthouse mobile, tres corridas sobre next start; imprime scores, LCP/CLS/TBT y benchmarkIndex.
// Uso: node scripts/lighthouse.mjs
import { spawn, execSync } from "node:child_process";
import { readFileSync, mkdirSync } from "node:fs";

const PORT = Number(process.env.PORT || 3102);
const URL = `http://localhost:${PORT}`;
mkdirSync("capturas", { recursive: true });
const server = spawn("npx next start -p " + PORT, { shell: true, stdio: ["ignore", "pipe", "pipe"] });
const kill = () => { try { execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: "ignore" }); } catch {} };
process.on("exit", kill);
for (let i = 0; i < 60; i++) { try { if ((await fetch(URL)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 1000)); }

const RUNS = Number(process.env.RUNS || 3);
const runs = [];
for (let i = 1; i <= RUNS; i++) {
  const out = `capturas/lighthouse-${i}.json`;
  try {
    execSync(
      `npx --yes lighthouse@latest ${URL} --quiet --output=json --output-path=${out} --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new --disable-gpu"`,
      { stdio: ["ignore", "ignore", "ignore"] },
    );
  } catch {
    // En Windows chrome-launcher falla al borrar su carpeta temporal después de escribir
    // el informe (EPERM). Si el JSON está, la corrida sirve.
  }
  const r = JSON.parse(readFileSync(out, "utf8"));
  const c = r.categories;
  runs.push({
    perf: Math.round(c.performance.score * 100),
    a11y: Math.round(c.accessibility.score * 100),
    bp: Math.round(c["best-practices"].score * 100),
    seo: Math.round(c.seo.score * 100),
    lcp: Math.round(r.audits["largest-contentful-paint"].numericValue),
    cls: Number(r.audits["cumulative-layout-shift"].numericValue.toFixed(3)),
    tbt: Math.round(r.audits["total-blocking-time"].numericValue),
    fcp: Math.round(r.audits["first-contentful-paint"].numericValue),
    bench: Math.round(r.environment.benchmarkIndex),
    lcpEl: r.audits["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node?.snippet?.slice(0, 90),
    fallos: Object.values(r.audits)
      .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== "informative" && a.scoreDisplayMode !== "notApplicable")
      .map((a) => `${a.id} (${a.score})`),
  });
  console.log(`corrida ${i}:`, JSON.stringify({ ...runs[i - 1], fallos: undefined }));
}
runs.sort((a, b) => a.perf - b.perf);
const med = runs[Math.floor(runs.length / 2)];
console.log("\nMEDIANA perf:", med.perf, "a11y:", med.a11y, "bp:", med.bp, "seo:", med.seo, "LCP:", med.lcp, "ms", "CLS:", med.cls, "TBT:", med.tbt, "bench:", med.bench);
console.log("LCP element:", med.lcpEl);
console.log("Auditorías < 0.9:", med.fallos.join(", ") || "ninguna");
kill();
