"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { proceso } from "@/content/landing";
import { Icon } from "@/components/ui/Icon";

/**
 * BLOQUE 4 — CÓMO FUNCIONA
 * Cinco pasos unidos por una línea que se dibuja con el scroll y va activando cada
 * paso: el círculo se llena de acento, el ícono se dibuja y el número cambia de
 * peso. Desktop: horizontal, pineado con scrub (flag motion.pinProcess).
 * Mobile: apilado, sin pin. El remate revela la foto del panel terminado.
 */
export function ComoFunciona() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const stage = root.querySelector<HTMLElement>("[data-stage]");
      const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));
      const lineH = root.querySelector<HTMLElement>("[data-line-h]");
      const lineV = root.querySelector<HTMLElement>("[data-line-v]");
      if (!stage || !lineH || !lineV || steps.length === 0) return;
      const n = steps.length;
      const mm = gsap.matchMedia();

      const build = (line: HTMLElement, axis: "scaleX" | "scaleY", pin: boolean) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: pin
            ? { trigger: stage, start: "top 14%", end: "+=130%", pin: true, scrub: 0.6, anticipatePin: 1 }
            : { trigger: stage, start: "top 72%", end: "bottom 55%", scrub: 0.6 },
          onUpdate: () => {
            const p = tl.progress();
            steps.forEach((s, i) => s.classList.toggle("is-active", p >= (i + 0.55) / n));
          },
        });
        tl.fromTo(line, { [axis]: 0 }, { [axis]: 1, duration: 1 }, 0);
        steps.forEach((s, i) => {
          const at = Math.max(0, (i + 0.5) / n - 0.08);
          const strokes = s.querySelectorAll<SVGElement>("[data-draw]");
          tl.fromTo(strokes, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.12, stagger: 0.01 }, at);
          tl.fromTo(
            s.querySelector("[data-step-body]"),
            { opacity: 0.65, y: 8 }, // 0,65: el texto inactivo sigue cumpliendo 4,5:1
            { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
            at + 0.02,
          );
        });
        return tl;
      };

      mm.add(`${motion.media.wide} and ${motion.media.ok}`, () => {
        const tl = build(lineH, "scaleX", motion.pinProcess);
        return () => tl.scrollTrigger?.kill();
      });
      mm.add(`${motion.media.narrow} and ${motion.media.ok}`, () => {
        const tl = build(lineV, "scaleY", false);
        return () => tl.scrollTrigger?.kill();
      });
      mm.add(motion.media.reduce, () => {
        steps.forEach((s) => s.classList.add("is-active"));
        gsap.set([lineH, lineV], { scaleX: 1, scaleY: 1 });
        gsap.set(root.querySelectorAll("[data-step-body]"), { opacity: 1 });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="py-section" aria-labelledby="proceso-titulo">
      <div className="container-x">
        <div data-stage className="bg-bg">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-x-8">
            <h2 id="proceso-titulo" data-reveal className="text-h2 lg:col-span-5">
              {proceso.titulo}
            </h2>
            <p data-reveal data-reveal-delay="120" className="self-end text-lead lg:col-span-6 lg:col-start-7">
              {proceso.bajada}
            </p>
          </div>

          <ol className="relative mt-16 grid list-none gap-12 p-0 pl-[calc(1.75rem+1.5rem)] lg:mt-24 lg:grid-cols-5 lg:gap-6 lg:pl-0">
            {/* Línea horizontal (desktop) a la altura del centro de los círculos */}
            <span
              data-line-h
              aria-hidden="true"
              className="absolute left-0 top-[1.75rem] hidden h-[2px] w-full origin-left bg-accent-line lg:block"
            />
            {/* Línea vertical (mobile) */}
            <span
              data-line-v
              aria-hidden="true"
              className="absolute left-[1.75rem] top-0 h-full w-[2px] origin-top bg-accent-line lg:hidden"
            />
            {proceso.pasos.map((p) => (
              <li key={p.numero} data-step data-icon-host className="step relative">
                <div className="relative z-[1] -ml-[calc(1.75rem+1.5rem)] w-[3.5rem] lg:ml-0">
                  <span className="relative block h-14 w-14 rounded-full bg-bg">
                    <span
                      aria-hidden="true"
                      className="step__dot absolute inset-0 rounded-full bg-accent"
                    />
                    <Icon name={p.icono} size={56} draw={false} className="relative" />
                  </span>
                </div>
                <div data-step-body className="mt-6">
                  <p className="step-number text-text-strong">{p.numero}</p>
                  <h3 className="mt-3 text-h3">{p.titulo}</h3>
                  <p className="mt-2 max-w-[30ch] text-text">{p.texto}</p>
                  {p.foto ? (
                    <div className="mt-5 overflow-hidden rounded-md">
                      <Image
                        src={p.foto.src}
                        alt={p.foto.alt}
                        width={p.foto.width}
                        height={p.foto.height}
                        sizes="(min-width: 64rem) 18vw, 80vw"
                        className="h-auto w-full"
                      />
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Remate con la foto del panel terminado */}
        <div className="mt-24 grid items-center gap-10 lg:mt-36 lg:grid-cols-12 lg:gap-x-8">
          <p data-reveal className="max-w-[26ch] font-display text-h2 font-bold text-text-strong lg:col-span-6">
            {proceso.remate}
          </p>
          <div data-reveal="mask-up" className="overflow-hidden rounded-lg lg:col-span-5 lg:col-start-8">
            <Image
              src={proceso.imagenRemate.src}
              alt={proceso.imagenRemate.alt}
              width={proceso.imagenRemate.width}
              height={proceso.imagenRemate.height}
              sizes="(min-width: 64rem) 40vw, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
