// Esquema compartido entre navegador y servidor. Los mensajes son los del
// documento de estructura (src/content/landing.ts).
import { z } from "zod";
import { contacto } from "@/content/landing";

const e = contacto.errores;

const requerido = z.string().trim().min(1, e.vacio);

/** Sólo dígitos, espacios y "+", con código de país y al menos 10 dígitos. */
export function whatsappValido(v: string): boolean {
  const s = v.trim();
  if (!/^\+\d[\d ]*$/.test(s)) return false;
  return s.replace(/\D/g, "").length >= 10;
}

const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const leadSchema = z.object({
  nombre: requerido,
  apellido: requerido,
  empresa: requerido,
  whatsapp: requerido.refine(whatsappValido, e.whatsapp),
  mail: requerido.refine((v) => MAIL.test(v), e.mail),
});

export type LeadInput = z.infer<typeof leadSchema>;
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
