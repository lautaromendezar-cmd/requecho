"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { useContenido } from "@/content/ContenidoProvider";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";

/**
 * BLOQUE 2 — PROBLEMA
 * Tres cifras enormes con conteo único, la línea amarilla que crece y el ícono que
 * se dibuja; el texto de cada cifra va debajo de la línea. En escritorio van en tres
 * columnas y sin foto (devolución del 8-oct-2026).
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

        {/* Escritorio: las tres cifras en columnas, con el ícono al lado del número
            (devolución final 2, 8-oct-2026: sin la foto). Mobile: una debajo de otra. */}
        <ol className="m-0 mt-10 grid list-none gap-x-8 p-0 lg:mt-20 lg:grid-cols-3">
          {cifras.map((c, i) => {
            const numero = formatoNumero.format(c.valor);
            const largo = numero.length > 3;
            const resto = "col-start-2 lg:col-span-2 lg:col-start-1";
            return (
              <li
                key={i}
                data-icon-host
                data-reveal
                className="grid auto-rows-min grid-cols-[auto_1fr] content-start gap-x-5 border-t border-line py-7 @container sm:gap-x-8 sm:py-10 lg:gap-x-4"
              >
                <div className="row-span-5 lg:row-span-1 lg:self-center">
                  <Icon name={c.icono} size={56} className="h-11 w-11 sm:h-14 sm:w-14 lg:h-11 lg:w-11" />
                </div>
                {/* En escritorio el número se achica con la columna para entrar en un renglón. */}
                <p
                  className={`col-start-2 whitespace-nowrap font-display font-extrabold tabular-nums text-text-strong ${
                    largo ? "text-[length:var(--text-stat-long)]" : "text-stat"
                  } lg:text-[length:var(--text-stat-col)]`}
                  style={
                    {
                      "--text-stat-long": "clamp(2.5rem, 1rem + 6vw, 6.5rem)",
                      "--text-stat-col": "min(4.5rem, 14cqi)",
                      lineHeight: 0.95,
                      letterSpacing: "-0.035em",
                    } as React.CSSProperties
                  }
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
                  <p aria-hidden="true" className={`mt-1 font-display text-h3 font-bold text-text-strong lg:mt-3 ${resto}`}>
                    {c.unidad}
                  </p>
                ) : null}
                <span className={`accent-line mt-5 ${resto}`} data-reveal="line" data-reveal-delay="200" aria-hidden="true" />
                <p className={`mt-4 max-w-[38ch] text-lead text-text sm:mt-5 ${resto}`}>{c.texto}</p>
                <p className={`mt-3 text-legal text-muted ${resto}`}>{c.fuente}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
