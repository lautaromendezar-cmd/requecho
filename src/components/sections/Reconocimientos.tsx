"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { reconocimientos } from "@/content/landing";

/**
 * BLOQUE 7 — RECONOCIMIENTOS
 * Tres badges con los logos oficiales en tarjetas cuadradas de esquina redondeada.
 * Entran en stagger con el trazo dibujándose; en hover se elevan y el trazo pasa a
 * amarillo. Sólo estos tres.
 */
export function Reconocimientos() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const rings = root.querySelectorAll<SVGGeometryElement>("[data-badge-ring]");
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
              <div className="badge relative h-48 w-48 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:-translate-y-1 lg:h-60 lg:w-60">
                {/* Los dos logos van dentro de la misma tarjeta: colgado afuera,
                    el segundo corría el badge respecto del texto. */}
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-[var(--radius-lg)] bg-surface ${
                    b.logoSecundario ? "gap-4 p-4 lg:gap-5 lg:p-5" : "p-6 lg:p-8"
                  }`}
                >
                  <div className="relative h-[78%] flex-1">
                    <Image
                      src={b.logo.src}
                      alt={b.logo.alt}
                      fill
                      sizes="(min-width: 64rem) 200px, 160px"
                      className="object-contain"
                    />
                  </div>
                  {b.logoSecundario ? (
                    <>
                      <span aria-hidden="true" className="h-[52%] w-px shrink-0 bg-line" />
                      <div className="relative h-[78%] flex-1">
                        <Image
                          src={b.logoSecundario.src}
                          alt={b.logoSecundario.alt}
                          fill
                          sizes="(min-width: 64rem) 200px, 160px"
                          className="object-contain"
                        />
                      </div>
                    </>
                  ) : null}
                </div>
                <svg
                  viewBox="0 0 100 100"
                  className="pointer-events-none absolute inset-0 h-full w-full text-text-strong"
                  aria-hidden="true"
                >
                  <rect
                    data-badge-ring
                    x="0.5"
                    y="0.5"
                    width="99"
                    height="99"
                    rx="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    className="transition-[stroke] duration-[var(--duration-base)] group-hover:stroke-[var(--color-accent-line)]"
                  />
                </svg>
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
