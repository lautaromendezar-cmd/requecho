// =============================================================================
// IDIOMAS: el sitio existe en español (/) e inglés (/en).
//
// Cada idioma es un módulo con la misma forma: landing.ts (español, el texto del
// documento de las clientas) y landing.en.ts (traducción). El tipo `Contenido`
// sale del español, así que a la traducción no le puede faltar ningún campo.
// =============================================================================
import * as es from "./landing";
import * as en from "./landing.en";

export const IDIOMAS = ["es", "en"] as const;
export type Lang = (typeof IDIOMAS)[number];

export type Contenido = typeof es;

export const contenidos: Record<Lang, Contenido> = { es, en };

export const esIdioma = (v: string): v is Lang => (IDIOMAS as readonly string[]).includes(v);

/** Ruta pública de cada idioma: el español vive en la raíz. */
export const rutaIdioma: Record<Lang, string> = { es: "/", en: "/en" };
