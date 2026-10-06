// Esquema compartido entre navegador y servidor. Los mensajes salen del
// contenido de cada idioma (src/content/landing*.ts).
import { z } from "zod";
import { contenidos, type Lang } from "@/content";

/** Sólo dígitos, espacios y "+", con código de país y al menos 10 dígitos. */
export function whatsappValido(v: string): boolean {
  const s = v.trim();
  if (!/^\+\d[\d ]*$/.test(s)) return false;
  return s.replace(/\D/g, "").length >= 10;
}

const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function crearLeadSchema(lang: Lang) {
  const e = contenidos[lang].contacto.errores;
  const requerido = z.string().trim().min(1, e.vacio);
  return z.object({
    nombre: requerido,
    apellido: requerido,
    empresa: requerido,
    whatsapp: requerido.refine(whatsappValido, e.whatsapp),
    mail: requerido.refine((v) => MAIL.test(v), e.mail),
  });
}

export type LeadInput = z.infer<ReturnType<typeof crearLeadSchema>>;
export type LeadField = keyof LeadInput;
export type LeadErrors = Partial<Record<LeadField, string>>;

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Record<UtmKey, string>;

/** Primer mensaje por campo, en el orden del formulario. */
export function erroresPorCampo(error: z.ZodError): LeadErrors {
  const out: LeadErrors = {};
  for (const issue of error.issues) {
    const k = issue.path[0] as LeadField | undefined;
    if (k && !out[k]) out[k] = issue.message;
  }
  return out;
}
