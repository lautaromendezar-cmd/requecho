"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { useContenido } from "@/content/ContenidoProvider";
import { Kicker } from "@/components/ui/Kicker";
import { Placeholder } from "@/components/ui/Placeholder";

/**
 * BLOQUE 6 — FUNDADORAS
 * Foto con reveal de máscara, apertura por párrafos, dos cards con tilt muy suave
 * y el slot de cita preparado (oculto hasta que existan las citas).
 */
export function Fundadoras() {
  const { fundadoras } = useContenido();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(`${motion.media.wide} and ${motion.media.fine} and ${motion.media.ok}`, () => {
        const offs = Array.from(root.querySelectorAll<HTMLElement>("[data-tilt]")).map((card) => {
          gsap.set(card, { transformPerspective: 1200 });
          const rX = gsap.quickTo(card, "rotationX", { duration: 0.7, ease: "power3.out" });
          const rY = gsap.quickTo(card, "rotationY", { duration: 0.7, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            rY(nx * 3);
            rX(-ny * 3);
          };
          const leave = () => {
            rX(0);
            rY(0);
          };
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          return () => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          };
        });
        return () => offs.forEach((fn) => fn());
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="py-section" aria-labelledby="fundadoras-titulo">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <figure className="m-0 lg:col-span-5">
            <div data-reveal="mask-up" className="aspect-[4/5] overflow-hidden rounded-lg">
              <Image
                src={fundadoras.foto.src}
                alt={fundadoras.foto.alt}
                width={fundadoras.foto.width}
                height={fundadoras.foto.height}
                sizes="(min-width: 64rem) 40vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
            {fundadoras.foto.epigrafe ? (
              <figcaption className="mt-3 text-small text-muted">{fundadoras.foto.epigrafe}</figcaption>
            ) : null}
          </figure>

          <div className="lg:col-span-6 lg:col-start-7">
            <Kicker>{fundadoras.kicker}</Kicker>
            <h2 id="fundadoras-titulo" data-reveal className="mt-6 text-h2">
              {fundadoras.titulo}
            </h2>
            <div className="mt-10 space-y-6 text-lead text-text">
              {fundadoras.apertura.map((p, i) => (
                <p key={i} data-reveal data-reveal-delay={String(100 + i * 120)}>
                  {p}
                </p>
              ))}
            </div>
            <p data-reveal className="mt-8 border-l-2 border-accent-line pl-6 text-text">
              {fundadoras.complementariedad}
            </p>
          </div>
        </div>

        <ul className="mt-14 grid list-none gap-6 p-0 md:grid-cols-2 lg:mt-20">
          {fundadoras.cards.map((f, i) => (
            <li
              key={f.nombre}
              data-tilt
              data-reveal
              data-reveal-delay={String(i * 120)}
              className="flex flex-col gap-6 rounded-lg bg-surface p-7 will-change-transform lg:p-9"
            >
              <figure className="m-0">
                {f.retrato ? (
                  <div className="overflow-hidden rounded-md">
                    <Image
                      src={f.retrato.src}
                      alt={f.retrato.alt}
                      width={f.retrato.width}
                      height={f.retrato.height}
                      sizes="(min-width: 64rem) 40vw, 100vw"
                      className="h-auto w-full"
                    />
                  </div>
                ) : (
                  <Placeholder ratio="16 / 10" />
                )}
                <figcaption className="mt-5">
                  <h3 className="text-h3">{f.nombre}</h3>
                  <p className="mt-1 text-small text-muted">{f.rol}</p>
                </figcaption>
              </figure>
              {f.cita ? (
                <blockquote className="m-0 font-display text-h3 font-bold text-text-strong">“{f.cita}”</blockquote>
              ) : null}
              <p className="text-text">{f.bio}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-x-8">
          <p data-reveal className="font-display text-h3 font-bold text-text-strong lg:col-span-6">
            <span className="accent-line mb-5" data-reveal="line" aria-hidden="true" />
            {fundadoras.impacto[0]}
          </p>
          <p data-reveal data-reveal-delay="140" className="self-end text-lead text-text lg:col-span-5 lg:col-start-8">
            {fundadoras.impacto[1]}
          </p>
        </div>
      </div>
    </section>
  );
}
