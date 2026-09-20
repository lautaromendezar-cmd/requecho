"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import type { Imagen } from "@/content/landing";

const ZOOM = 1.5;

/**
 * Macro de textura con lupa que sigue al cursor (puntero fino) y zoom al tocar
 * (puntero grueso). Sólo transform y opacity.
 */
export function TextureLens({ imagen }: { imagen: Imagen }) {
  const host = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = host.current;
      if (!el || !motion.lens) return;
      const lens = el.querySelector<HTMLElement>(".lens");
      const lensImg = el.querySelector<HTMLElement>(".lens img");
      if (!lens || !lensImg) return;
      const mm = gsap.matchMedia();

      mm.add(`${motion.media.fine} and ${motion.media.ok}`, () => {
        const R = lens.offsetWidth / 2;
        const lx = gsap.quickTo(lens, "x", { duration: 0.35, ease: "power3.out" });
        const ly = gsap.quickTo(lens, "y", { duration: 0.35, ease: "power3.out" });
        const ix = gsap.quickTo(lensImg, "x", { duration: 0.35, ease: "power3.out" });
        const iy = gsap.quickTo(lensImg, "y", { duration: 0.35, ease: "power3.out" });
        const size = () => gsap.set(lensImg, { width: el.clientWidth * ZOOM, height: el.clientHeight * ZOOM });
        size();
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          lx(x - R);
          ly(y - R);
          ix(-(x * ZOOM - R));
          iy(-(y * ZOOM - R));
        };
        const enter = () => gsap.to(lens, { opacity: 1, duration: 0.3 });
        const leave = () => gsap.to(lens, { opacity: 0, duration: 0.3 });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
        const ro = new ResizeObserver(size);
        ro.observe(el);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerenter", enter);
          el.removeEventListener("pointerleave", leave);
          ro.disconnect();
        };
      });

      mm.add("(pointer: coarse)", () => {
        const toggle = () => el.classList.toggle("is-zoomed");
        el.addEventListener("click", toggle);
        return () => el.removeEventListener("click", toggle);
      });
    },
    { scope: host },
  );

  return (
    <div ref={host} className="lens-host rounded-lg" style={{ aspectRatio: `${imagen.width} / ${imagen.height}` }}>
      <Image
        src={imagen.src}
        alt={imagen.alt}
        width={imagen.width}
        height={imagen.height}
        sizes="(min-width: 64rem) 40vw, 100vw"
        className="lens-base h-full w-full object-cover"
      />
      <div className="lens" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imagen.src} alt="" draggable={false} loading="lazy" decoding="async" />
      </div>
    </div>
  );
}
