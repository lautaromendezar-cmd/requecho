"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { reconocimientos, type Badge } from "@/content/landing";

/**
 * BLOQUE 7 — RECONOCIMIENTOS
 * Tres badges con los logos oficiales en tarjetas cuadradas de esquina redondeada.
 * Entran en stagger con el trazo dibujándose; en hover se elevan y el trazo pasa a
 * amarillo. Sólo estos tres.
 */
/** Porción del cuadro que ocupa cada logo, medida en área. */
const PESO = 0.16;
/** Lo que queda del lado de la tarjeta una vez descontado el margen. */
const DISPONIBLE = 84;

/**
 * El peso visual de un logo es su área, no su alto ni su ancho: con el mismo
 * alto, uno apaisado pesa el doble. A cada uno se le da el ancho que iguala su
 * área a la de los demás; si dos no entran al lado del otro, se apilan.
 */
function repartir(badge: Badge) {
  const lista = badge.logoSecundario ? [badge.logo, badge.logoSecundario] : [badge.logo];
  const proporciones = lista.map((l) => l.width / l.height);
  const apilados = lista.length > 1 && proporciones.every((r) => r > 2);
  let anchos = proporciones.map((r) => Math.sqrt(PESO * r) * 100);

  // Si no entran, se achican todos por igual: es lo que mantiene parejas las
  // áreas dentro de la tarjeta.
  const ocupado = apilados
    ? Math.max(...anchos)
    : anchos.reduce((suma, a) => suma + a, 0) + (lista.length - 1) * 5;
  const margen = apilados ? DISPONIBLE - 6 : DISPONIBLE;
  if (ocupado > margen) anchos = anchos.map((a) => (a * margen) / ocupado);

  return { apilados, piezas: lista.map((logo, i) => ({ logo, ancho: anchos[i].toFixed(1) })) };
}

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
          {reconocimientos.badges.map((b, i) => {
            const { piezas, apilados } = repartir(b);
            return (
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
                    apilados ? "flex-col gap-[7%]" : "gap-[5%]"
                  }`}
                >
                  {piezas.map(({ logo, ancho }) => (
                    <Image
                      key={logo.src}
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width}
                      height={logo.height}
                      sizes="(min-width: 64rem) 200px, 160px"
                      className="h-auto"
                      style={{ width: `${ancho}%` }}
                    />
                  ))}
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
            );
          })}
        </ul>
      </div>
    </section>
  );
}
