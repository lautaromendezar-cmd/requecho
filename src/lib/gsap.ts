// Registro único de GSAP y sus plugins (todos gratuitos desde la 3.13).
// Draggable e InertiaPlugin no se registran acá: sólo los usa la galería y los
// carga ella bajo demanda, para no cargar el arranque de la página.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };

/** Formatea un número al estilo rioplatense (500.000). */
export const formatoNumero = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
