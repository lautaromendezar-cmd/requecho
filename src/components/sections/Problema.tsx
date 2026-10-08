"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { useContenido } from "@/content/ContenidoProvider";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";

/**
 * BLOQUE 2 — PROBLEMA
 * Tres cifras enormes con conteo único, la línea amarilla que crece y el ícono que
 * se dibuja; el texto de cada cifra va debajo de la línea. A la derecha, una foto
 * que acompaña a las tres (devolución final, 7-oct-2026: reemplaza a la línea puente,
 * que pasó al hero).
 */
export function Problema() {
  const { problema, idioma } = useContenido();
  const formatoNumero = new Intl.NumberFormat(idioma.locale, { maximumFractionDigits: 0 });
  const ref = useRef<HTMLElement>(null);
  // Las cifras no se publican sin su fuente.
  const cifras = problema.cifras.filter((c) => c.fuente);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(motion.media.ok, () => {
        root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const value = Number(el.dataset.count);
          const obj = { v: 0 };
          el.textContent = formatoNumero.format(0);
          gsap.to(obj, {
            v: value,
            duration: 1.9,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate: () => {
              el.textContent = formatoNumero.format(obj.v);
            },
            onComplete: () => {
              el.textContent = formatoNumero.format(value);
            },
          });
        });

      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="py-section" aria-labelledby="problema-titulo">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-6">
            <Kicker>{problema.kicker}</Kicker>
            <h2 id="problema-titulo" data-reveal className="mt-6 text-h2">
              {problema.titulo}
            </h2>
          </div>
          <p data-reveal data-reveal-delay="120" className="self-end text-lead lg:col-span-5 lg:col-start-8">
            {problema.bajada}
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-x-8">
          <ol className="m-0 list-none p-0 lg:col-span-7">
            {cifras.map((c, i) => {
              const numero = formatoNumero.format(c.valor);
              const largo = numero.length > 3;
              return (
                <li
                  key={i}
                  data-icon-host
                  data-reveal
                  className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-line py-7 sm:gap-x-8 sm:py-10 lg:py-12"
                >
                  <div>
                    <Icon name={c.icono} size={56} className="h-11 w-11 sm:h-14 sm:w-14" />
                  </div>
                  <div>
                    <p
                      className={`font-display font-extrabold tabular-nums text-text-strong ${
                        largo ? "text-[length:var(--text-stat-long)]" : "text-stat"
                      }`}
                      style={largo ? ({ "--text-stat-long": "clamp(2.5rem, 1rem + 6vw, 6.5rem)", lineHeight: 0.95, letterSpacing: "-0.035em" } as React.CSSProperties) : undefined}
                    >
                      <span aria-hidden="true">
                        {c.prefijo}
                        <span data-count={c.valor}>{numero}</span>
                        {c.sufijo}
                      </span>
                      <span className="sr-only">
                        {c.prefijo}
                        {numero}
                        {c.sufijo}
                        {c.unidad ? ` ${c.unidad}` : ""}
                      </span>
                    </p>
                    {c.unidad ? (
                      <p aria-hidden="true" className="mt-1 font-display text-h3 font-bold text-text-strong">
                        {c.unidad}
                      </p>
                    ) : null}
                    <span className="accent-line mt-5" data-reveal="line" data-reveal-delay="200" aria-hidden="true" />
                    <p className="mt-4 max-w-[38ch] text-lead text-text sm:mt-5">{c.texto}</p>
                    <p className="mt-3 text-legal text-muted">{c.fuente}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* La foto acompaña a las tres cifras y queda fija mientras pasan. */}
          <div data-reveal className="lg:col-span-5 lg:col-start-8 lg:pt-10">
            <div className="lg:sticky lg:top-24">
              {problema.imagen ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg lg:aspect-[2/3]">
                  <Image
                    src={problema.imagen.src}
                    alt={problema.imagen.alt}
                    fill
                    quality={75}
                    sizes="(min-width: 64rem) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <Placeholder ratio="2 / 3" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
