"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { porQue } from "@/content/landing";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";

/**
 * BLOQUE 5 — POR QUÉ REQUECHO (segundo escenario: grafito)
 * La comparativa arranca con las cuatro capas de la solución convencional en línea
 * fina, separadas; con el scroll se comprimen, se funden en una sola pieza y esa
 * pieza pasa a ser la foto real del panel. Debajo, la grilla 2x2 con hover.
 */
export function PorQue() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const stage = root.querySelector<HTMLElement>("[data-compare]");
      const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-layer]"));
      const labels = Array.from(root.querySelectorAll<HTMLElement>("[data-layer-label]"));
      const piece = root.querySelector<HTMLElement>("[data-piece]");
      const left = root.querySelector<HTMLElement>("[data-compare-left]");
      const right = root.querySelector<HTMLElement>("[data-compare-right]");
      if (!stage || !piece || layers.length === 0) return;
      const mm = gsap.matchMedia();

      const build = (scrub: boolean) => {
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: scrub
            ? { trigger: stage.parentElement, start: "top 70%", end: "bottom 60%", scrub: 0.7, invalidateOnRefresh: true }
            : { trigger: stage, start: "top 70%", once: true },
        });
        // Cada capa termina siendo una franja de la pieza: apiladas y sin
        // separación cubren su silueta exacta. El estiramiento es de apenas
        // 1,2× (no deforma el borde) y el cambio por la foto ocurre sobre el
        // mismo contorno, así que se lee como fusión y no como superposición.
        const franja = () => piece.offsetHeight / layers.length;

        // 1. Las capas se juntan hasta tocarse
        tl.to(
          layers,
          {
            y: (i, el) => {
              const l = el as HTMLElement;
              const destino = piece.offsetTop + (i + 0.5) * franja();
              return destino - (l.offsetTop + l.offsetHeight / 2);
            },
            scaleY: () => franja() / layers[0].offsetHeight,
            transformOrigin: "50% 50%",
            duration: 1,
          },
          0,
        );
        // 2. Los nombres acompañan el viaje y se apagan al cerrarse la pila
        tl.to(labels, { opacity: 0, duration: 0.3 }, 0.6);
        tl.to(left, { opacity: 0.55, duration: 0.5 }, 0.55);
        // 3. La pila ya es la pieza: el material se abre desde el centro a
        //    opacidad plena (con opacidad quedaría translúcido y gris sobre el
        //    grafito) y los contornos se apagan detrás.
        tl.fromTo(
          piece,
          { opacity: 1, clipPath: "inset(50% 0% 50% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power2.out" },
          0.95,
        );
        tl.to(layers, { opacity: 0, duration: 0.4 }, 1.15);
        // 4. El lado Requecho gana presencia
        tl.fromTo(right, { opacity: 0.65, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 1.25);
        return tl;
      };

      mm.add(`${motion.media.wide} and ${motion.media.ok}`, () => {
        const tl = build(true);
        return () => tl.scrollTrigger?.kill();
      });
      mm.add(`${motion.media.narrow} and ${motion.media.ok}`, () => {
        const tl = build(false);
        return () => tl.scrollTrigger?.kill();
      });
      mm.add(motion.media.reduce, () => {
        // Estado final, sin animar
        gsap.set(layers, { opacity: 0 });
        gsap.set(labels, { opacity: 0 });
        gsap.set(piece, { opacity: 1, clipPath: "none" });
        gsap.set([left, right], { opacity: 1 });
      });
    },
    { scope: ref },
  );

  const { comparativa } = porQue;

  return (
    <section ref={ref} className="surface-inverse py-section" aria-labelledby="porque-titulo">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-6">
            <Kicker>{porQue.kicker}</Kicker>
            <h2 id="porque-titulo" data-reveal className="mt-6 text-h2">
              {porQue.titulo}
            </h2>
          </div>
          <p data-reveal data-reveal-delay="120" className="self-end text-lead lg:col-span-5 lg:col-start-8">
            {porQue.bajada}
          </p>
        </div>

        {/* Comparativa: en desktop, un tramo alto con la escena pegajosa */}
        <div className="mt-20 lg:mt-28 lg:min-h-[160vh]">
          <div data-compare className="lg:sticky lg:top-[12vh]">
            <p className="kicker text-inverse-muted" data-reveal="fade">
              <span>{comparativa.titulo}</span>
            </p>
            <div className="mt-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-x-8">
              {/* Izquierda: solución convencional */}
              <div data-compare-left className="lg:col-span-3">
                <h3 className="text-h3">{comparativa.convencional.titulo}</h3>
                <ol className="mt-4 list-none space-y-1 p-0 text-small text-inverse-muted">
                  {comparativa.convencional.capas.map((c, i) => (
                    <li key={c}>
                      {i > 0 ? <span aria-hidden="true">→ </span> : null}
                      {c}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Centro: escena */}
              <div className="relative mx-auto aspect-[4/3] w-full max-w-[34rem] lg:col-span-6">
                <ul className="absolute inset-0 m-0 list-none p-0" aria-hidden="true">
                  {comparativa.convencional.capas.map((c, i) => (
                    <li
                      key={c}
                      data-layer
                      className="layer absolute left-[8%] right-[8%] flex h-[13%] items-center px-4 text-small text-inverse-text"
                      style={{ top: `${9 + i * 21}%` }}
                    >
                      <span data-layer-label className="truncate">
                        {c}
                      </span>
                    </li>
                  ))}
                </ul>
                <div
                  data-piece
                  className="js-piece absolute left-[8%] right-[8%] top-[18%] aspect-[421/243] overflow-hidden rounded-sm shadow-[0_30px_60px_-30px_rgb(0_0_0_/_0.8)]"
                >
                  <Image
                    src={comparativa.requecho.imagen.src}
                    alt={comparativa.requecho.imagen.alt}
                    fill
                    sizes="(min-width: 64rem) 30vw, 84vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Derecha: Requecho */}
              <div data-compare-right className="lg:col-span-3">
                <h3 className="text-h3">{comparativa.requecho.titulo}</h3>
                <span className="accent-line mt-4" aria-hidden="true" />
                <p className="mt-4 text-text-inverse text-inverse-text">{comparativa.requecho.texto}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Diferenciales 2x2 */}
        <div className="mt-24 lg:mt-32">
          <h3 data-reveal className="text-h3">
            {porQue.diferencialesTitulo}
          </h3>
          <span className="accent-line mt-4" data-reveal="line" aria-hidden="true" />
          <ul className="mt-10 grid list-none gap-4 p-0 md:grid-cols-2">
            {porQue.diferenciales.map((d, i) => (
              <li
                key={d.titulo}
                data-icon-host
                data-reveal
                data-reveal-delay={String(i * 90)}
                className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-7 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] hover:-translate-y-1 lg:p-9"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-7 top-0 h-[2px] origin-left scale-x-0 bg-accent-line transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] group-hover:scale-x-100 lg:inset-x-9"
                />
                <Icon name={d.icono} size={52} />
                <h4 className="mt-6 text-h3 font-bold">{d.titulo}</h4>
                <p className="mt-3 max-w-[40ch] text-inverse-muted">{d.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
