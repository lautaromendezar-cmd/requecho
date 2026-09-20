"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { glyphs, type Glyph, type IconName } from "./icon-glyphs";

type Props = {
  name: IconName;
  /** Tamaño en px del círculo. */
  size?: number;
  /** Dibuja el trazo con DrawSVG al entrar en viewport. */
  draw?: boolean;
  /** Sin círculo contenedor (para usos inline, como el check de éxito). */
  bare?: boolean;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Ícono del sistema: línea fina en círculo. Se dibuja al entrar en viewport y
 * tiene una microanimación propia al hover del contenedor más cercano marcado
 * con data-icon-host (o del propio ícono) y al tocar.
 */
export function Icon({ name, size = 56, draw = true, bare = false, label, className = "", style }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;

      // Hover/tap → .is-live
      const host = (svg.closest("[data-icon-host]") as HTMLElement | null) ?? svg;
      const on = () => svg.classList.add("is-live");
      const off = () => svg.classList.remove("is-live");
      let tapTimer: number | undefined;
      const tap = () => {
        on();
        window.clearTimeout(tapTimer);
        tapTimer = window.setTimeout(off, 1400);
      };
      host.addEventListener("pointerenter", on);
      host.addEventListener("pointerleave", off);
      host.addEventListener("pointerdown", tap, { passive: true });

      if (draw) {
        const mm = gsap.matchMedia();
        mm.add(motion.media.ok, () => {
          const strokes = svg.querySelectorAll<SVGElement>("[data-draw]");
          gsap.fromTo(
            strokes,
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              duration: motion.durations.slow,
              ease: motion.eases.draw,
              stagger: 0.07,
              scrollTrigger: { trigger: svg, start: "top 92%", once: true },
            },
          );
        });
      }

      return () => {
        host.removeEventListener("pointerenter", on);
        host.removeEventListener("pointerleave", off);
        host.removeEventListener("pointerdown", tap);
        window.clearTimeout(tapTimer);
      };
    },
    { scope: ref, dependencies: [draw] },
  );

  const parts: readonly Glyph[] = glyphs[name];
  const inner = bare ? 24 : 48;
  const offset = bare ? 0 : 12;

  return (
    <svg
      ref={ref}
      className={`icon icon--${name} ${className}`}
      viewBox={`0 0 ${inner} ${inner}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-hidden={label ? undefined : true}
      style={style}
    >
      {label ? <title>{label}</title> : null}
      {!bare ? <circle className="icon__ring" cx={24} cy={24} r={23} data-draw="" /> : null}
      <g transform={`translate(${offset} ${offset})`}>
        {parts.map((p, i) => (
          <path key={i} d={p.d} data-draw="" data-part={p.part} />
        ))}
      </g>
    </svg>
  );
}
