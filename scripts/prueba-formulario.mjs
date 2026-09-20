// Prueba de punta a punta del formulario: next start (producción) + receptor local.
// Uso: node scripts/prueba-formulario.mjs
import { spawn, execSync } from "node:child_process";

const RECV = 8787;
const PORT = Number(process.env.PORT || 3101);
const receptor = spawn("node", ["scripts/webhook-prueba.mjs"], { stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, PORT: String(RECV) } });
const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  shell: true,
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, LEADS_WEBHOOK_URL: `http://localhost:${RECV}/lead` },
});
server.stderr.on("data", (d) => process.stdout.write("[next!] " + d));
const kill = (p) => { try { execSync(`taskkill /PID ${p.pid} /T /F`, { stdio: "ignore" }); } catch {} };
process.on("exit", () => { kill(server); kill(receptor); });

for (let i = 0; i < 60; i++) {
  try { const r = await fetch(`http://localhost:${PORT}`); if (r.ok) break; } catch {}
  await new Promise((r) => setTimeout(r, 1000));
}

const post = async (body) => {
  const r = await fetch(`http://localhost:${PORT}/api/lead`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return { status: r.status, json: await r.json().catch(() => null) };
};
const valido = {
  nombre: "Ana", apellido: "Pérez", empresa: "Estudio AP", whatsapp: "+54 9 11 1234 5678", mail: "ana@estudioap.com",
  website: "", utm: { utm_source: "prueba", utm_medium: "cli", utm_campaign: "e2e", utm_content: "", utm_term: "" },
};
console.log("1) válido      →", JSON.stringify(await post(valido)));
console.log("2) inválido    →", JSON.stringify(await post({ nombre: "", apellido: "Pérez", empresa: "X", whatsapp: "11 1234", mail: "ana@", website: "" })));
console.log("3) honeypot    →", JSON.stringify(await post({ ...valido, nombre: "Bot", website: "http://spam" })));
console.log("4) cuerpo roto →", JSON.stringify(await (async () => { const r = await fetch(`http://localhost:${PORT}/api/lead`, { method: "POST", body: "{{" }); return { status: r.status, json: await r.json().catch(() => null) }; })()));
const recibidos = await (await fetch(`http://localhost:${RECV}/recibidos`)).json();
console.log("\nPayload recibido por el webhook (" + recibidos.length + "):\n" + JSON.stringify(recibidos, null, 2));
kill(receptor);
await new Promise((r) => setTimeout(r, 500));
console.log("\n5) webhook caído →", JSON.stringify(await post(valido)));
kill(server);
