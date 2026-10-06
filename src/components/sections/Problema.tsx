"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { useContenido } from "@/content/ContenidoProvider";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";

/**
 * BLOQUE 2 — PROBLEMA
 * Sin fotos. Tres cifras enormes con conteo único, la línea amarilla que crece y el
 * ícono que se dibuja. La línea puente se revela palabra por palabra con el scroll.
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

        const puente = root.querySelector<HTMLElement>("[data-puente]");
        if (!puente) return;
        // aria: "none": sin aria-label en el <p> (prohibido por WAI-ARIA), el texto
        // sigue siendo legible tal cual. Opacidad inicial 0,5: mantiene contraste 3:1.
        const split = SplitText.create(puente, {
          type: "words",
          aria: "none",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.5, yPercent: 24 },
              {
                opacity: 1,
                yPercent: 0,
                stagger: 0.06,
                ease: "none",
                scrollTrigger: { trigger: puente, start: "top 80%", end: "bottom 45%", scrub: 0.5 },
              },
            ),
        });
        return () => split.revert();
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

        <ol className="mt-14 list-none p-0 lg:mt-20">
          {cifras.map((c, i) => {
            const numero = formatoNumero.format(c.valor);
            const largo = numero.length > 3;
            return (
              <li
                key={i}
                data-icon-host
                data-reveal
                className="grid gap-6 border-t border-line py-10 lg:grid-cols-12 lg:items-end lg:gap-x-8 lg:py-14"
              >
                <div className="lg:col-span-1">
                  <Icon name={c.icono} size={56} />
                </div>
                <div className="lg:col-span-7">
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
                </div>
                <div className="lg:col-span-4">
                  <p className="max-w-[34ch] text-lead text-text">{c.texto}</p>
                  <p className="mt-4 text-legal text-muted">{c.fuente}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <p
          data-puente
          className="mt-14 max-w-[28ch] font-display text-h2 font-bold text-text-strong lg:mt-20"
        >
          {problema.puente}
        </p>
      </div>
    </section>
  );
}
