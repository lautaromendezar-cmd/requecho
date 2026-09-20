import { NextResponse } from "next/server";
import { contacto } from "@/content/landing";
import { erroresPorCampo, leadSchema, UTM_KEYS, type Utm } from "@/lib/leads/schema";
import { crearLeadStore, fechaHoraBuenosAires, type LeadRow } from "@/lib/leads/store";

export const runtime = "nodejs";

const MAX = 200;
const recortar = (s: string) => s.trim().slice(0, MAX);

function leerUtm(raw: unknown): Utm {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out = {} as Utm;
  for (const k of UTM_KEYS) {
    const v = src[k];
    out[k] = typeof v === "string" ? recortar(v) : "";
  }
  return out;
}

const falla = (status: number) =>
  NextResponse.json({ ok: false, message: contacto.errores.envio }, { status });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return falla(400);
  }
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  // Campo trampa: los bots lo completan. Se responde éxito sin guardar nada.
  if (typeof b.website === "string" && b.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = leadSchema.safeParse(b);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: erroresPorCampo(parsed.error) }, { status: 400 });
  }

  const store = crearLeadStore();
  if (!store) {
    console.error("[lead] LEADS_WEBHOOK_URL no está configurada en producción: el envío no se guardó.");
    return falla(503);
  }

  const d = parsed.data;
  const fila: LeadRow = {
    fecha_hora: fechaHoraBuenosAires(),
    nombre: recortar(d.nombre),
    apellido: recortar(d.apellido),
    empresa: recortar(d.empresa),
    whatsapp: recortar(d.whatsapp),
    mail: recortar(d.mail),
    ...leerUtm(b.utm),
  };

  try {
    await store.guardar(fila);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] No se pudo guardar el envío:", err);
    return falla(502);
  }
}
