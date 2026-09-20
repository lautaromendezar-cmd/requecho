// =============================================================================
// TIPOGRAFÍA: el único lugar donde se eligen las familias.
//
// Hoy display y body son la misma Lato (300, 400, 700, 900), como pide la guía de
// marca. Para separarlas, alcanza con declarar otra fuente de next/font y
// asignarla a `displayFont` o `bodyFont`: el CSS las lee como --font-display y
// --font-body (ver src/styles/tokens.css) y nada más cambia.
// =============================================================================
import type { CSSProperties } from "react";
import { Lato } from "next/font/google";

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const displayFont = lato;
export const bodyFont = lato;

/** Variables que el layout inyecta en <html>; tokens.css las enchufa al tema. */
export const fontVariables = {
  "--rq-font-display": displayFont.style.fontFamily,
  "--rq-font-body": bodyFont.style.fontFamily,
} as CSSProperties;

export const fontClassName = Array.from(
  new Set([displayFont.variable, bodyFont.variable]),
).join(" ");
