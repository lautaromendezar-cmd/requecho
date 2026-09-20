"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { reconocimientos } from "@/content/landing";

/**
 * BLOQUE 7 — RECONOCIMIENTOS
 * Tres badges circulares con los logos oficiales. Entran en stagger con el círculo
 * dibujándose; en hover el trazo gira un cuarto de vuelta. Sólo estos tres.
 */
export function Reconocimientos() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const rings = root.querySelectorAll<SVGCircleElement>("[data-badge-ring]");
      const mm = gsap.matchMedia();
      mm.add(motion.media.ok, () => {
        gsap.fromTo(
          rings,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: 1.4,
            ease: motion.eases.draw,
            stagger: 0.18,
            scrollTrigger: { trigger: root, start: "top 70%", once: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="py-section" aria-labelledby="reconocimientos-titulo">
      <div className="container-x">
        <h2 id="reconocimientos-titulo" className="kicker" data-reveal="fade">
          <span>{reconocimientos.kicker}</span>
          <span className="accent-line" data-reveal="line" data-reveal-delay="180" aria-hidden="true" />
        </h2>

        <ul className="mt-14 grid list-none gap-14 p-0 md:grid-cols-3 md:gap-8 lg:mt-20">
          {reconocimientos.badges.map((b, i) => (
            <li
              key={b.titulo}
              data-reveal
              data-reveal-delay={String(i * 140)}
              className="group flex flex-col items-center text-center"
            >
              <div className="badge relative h-44 w-44 lg:h-52 lg:w-52">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full text-text-strong transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] group-hover:rotate-90"
                  aria-hidden="true"
                >
                  <circle
                    data-badge-ring
                    cx="50"
                    cy="50"
                    r="49"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    className="transition-[stroke] duration-[var(--duration-base)] group-hover:stroke-[var(--color-accent-line)]"
                  />
                </svg>
                <div className="absolute inset-[9%] flex items-center justify-center overflow-hidden rounded-full bg-surface">
                  <div className="relative flex h-[62%] w-[62%] items-center justify-center">
                    <Image
                      src={b.logo.src}
                      alt={b.logo.alt}
                      width={b.logo.width}
                      height={b.logo.height}
                      sizes="160px"
                      className="h-auto max-h-full w-auto max-w-full object-contain"
                    />
                  </div>
                </div>
                {b.logoSecundario ? (
                  <div className="absolute -bottom-2 -right-2 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-surface p-3 shadow-[0_10px_30px_-12px_rgb(0_0_0_/_0.35)] lg:h-24 lg:w-24">
                    <Image
                      src={b.logoSecundario.src}
                      alt={b.logoSecundario.alt}
                      width={b.logoSecundario.width}
                      height={b.logoSecundario.height}
                      sizes="64px"
                      className="h-auto max-h-full w-auto max-w-full object-contain"
                    />
                  </div>
                ) : null}
              </div>
              <h3 className="mt-8 max-w-[22ch] text-h3">{b.titulo}</h3>
              <p className="mt-3 max-w-[36ch] text-text">{b.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
