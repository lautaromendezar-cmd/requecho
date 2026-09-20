// Receptor de prueba para el formulario: imprime cada POST que llega y responde ok.
// Uso:  node scripts/webhook-prueba.mjs   (puerto 8787, o PORT=xxxx)
import { createServer } from "node:http";

const port = Number(process.env.PORT || 8787);
const recibidos = [];

createServer((req, res) => {
  if (req.method === "GET" && req.url === "/recibidos") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(recibidos, null, 2));
    return;
  }
  if (req.method !== "POST") {
    res.writeHead(405);
    res.end();
    return;
  }
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    let datos;
    try {
      datos = JSON.parse(body);
    } catch {
      datos = { crudo: body };
    }
    recibidos.push({ recibido: new Date().toISOString(), url: req.url, datos });
    console.log(`\n[webhook-prueba] POST ${req.url}\n${JSON.stringify(datos, null, 2)}`);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
  });
}).listen(port, () => console.log(`[webhook-prueba] escuchando en http://localhost:${port}/lead`));
