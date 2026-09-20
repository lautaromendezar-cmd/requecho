// =============================================================================
// LeadStore: dónde termina cada envío del formulario.
//
// Vercel no tiene disco persistente y el Excel de destino todavía no está
// definido, así que la implementación es un webhook genérico: POST JSON a
// LEADS_WEBHOOK_URL. Las recetas para Google Sheets (Apps Script) y Excel en
// OneDrive (Power Automate) están en docs/formulario.md.
//
// En desarrollo sin variable, se loguea a consola. En producción sin variable,
// no hay store y la API responde con el mensaje de falla: nunca un éxito falso.
// =============================================================================
import type { LeadInput, Utm } from "./schema";

export type LeadRow = {
  fecha_hora: string;
} & LeadInput &
  Utm;

export interface LeadStore {
  readonly nombre: string;
  guardar(fila: LeadRow): Promise<void>;
}

export class WebhookLeadStore implements LeadStore {
  readonly nombre = "webhook";
  constructor(
    private readonly url: string,
    private readonly timeoutMs = 8000,
  ) {}

  async guardar(fila: LeadRow): Promise<void> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);
    try {
      const res = await fetch(this.url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(fila),
        signal: ctrl.signal,
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`El webhook respondió ${res.status}`);
    } finally {
      clearTimeout(timer);
    }
  }
}

export class ConsoleLeadStore implements LeadStore {
  readonly nombre = "consola";
  async guardar(fila: LeadRow): Promise<void> {
    console.log("[lead] Sin LEADS_WEBHOOK_URL (sólo desarrollo). Fila:", JSON.stringify(fila, null, 2));
  }
}

export function crearLeadStore(): LeadStore | null {
  const url = process.env.LEADS_WEBHOOK_URL?.trim();
  if (url) return new WebhookLeadStore(url);
  if (process.env.NODE_ENV !== "production") return new ConsoleLeadStore();
  return null;
}

/** "20/09/2026 19:05:33" en hora de Buenos Aires. */
export function fechaHoraBuenosAires(d: Date = new Date()): string {
  const partes = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const p = Object.fromEntries(partes.map((x) => [x.type, x.value]));
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}:${p.second}`;
}
