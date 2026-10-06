// =============================================================================
// TIPOGRAFÍA: el único lugar donde se eligen las familias.
//
// Manual de marca (oct. 2026): Montserrat en todo — ExtraBold (800) para títulos,
// Bold (700) para subtítulos, Regular (400) para párrafos. Se carga la variable,
// así que cualquier peso intermedio (p. ej. la transición de los números de paso)
// sale del mismo archivo. Para separar display y body, alcanza con declarar otra fuente de next/font y
// asignarla a `displayFont` o `bodyFont`: el CSS las lee como --font-display y
// --font-body (ver src/styles/tokens.css) y nada más cambia.
// =============================================================================
import type { CSSProperties } from "react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const displayFont = montserrat;
export const bodyFont = montserrat;

/** Variables que el layout inyecta en <html>; tokens.css las enchufa al tema. */
export const fontVariables = {
  "--rq-font-display": displayFont.style.fontFamily,
  "--rq-font-body": bodyFont.style.fontFamily,
} as CSSProperties;

export const fontClassName = Array.from(
  new Set([displayFont.variable, bodyFont.variable]),
).join(" ");
