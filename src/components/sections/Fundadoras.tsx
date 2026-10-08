"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { useContenido } from "@/content/ContenidoProvider";
import { Kicker } from "@/components/ui/Kicker";
import { Placeholder } from "@/components/ui/Placeholder";
import { IconoMarca } from "@/components/ui/IconoMarca";

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
          {/* En desktop la foto se estira hasta el final del texto de la derecha
              (devolución final, 7-oct-2026). */}
          <figure className="m-0 flex flex-col lg:col-span-5">
            <div data-reveal="mask-up" className="aspect-[4/3] overflow-hidden rounded-lg lg:aspect-auto lg:min-h-[28rem] lg:flex-1">
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
            <div className="mt-8 space-y-6 text-lead text-text lg:mt-10">
              {fundadoras.apertura.map((p, i) => (
                <p key={i} data-reveal data-reveal-delay={String(100 + i * 120)}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        <ul className="mt-10 grid list-none gap-4 p-0 md:mt-14 md:grid-cols-2 md:gap-6 lg:mt-20">
          {fundadoras.cards.map((f, i) => (
            <li
              key={f.nombre}
              data-tilt
              data-reveal
              data-reveal-delay={String(i * 120)}
              className="flex flex-col gap-5 rounded-lg bg-surface p-5 will-change-transform md:gap-6 md:p-7 lg:p-9"
            >
              {/* En mobile el retrato va chico, al lado del nombre (devolución general:
                  recorrido más corto); desde md vuelve arriba, a todo el ancho. */}
              <figure className="m-0 flex items-center gap-3 md:block">
                {f.retrato ? (
                  <div className="aspect-square w-20 shrink-0 overflow-hidden rounded-md md:aspect-auto md:w-auto">
                    <Image
                      src={f.retrato.src}
                      alt={f.retrato.alt}
                      width={f.retrato.width}
                      height={f.retrato.height}
                      sizes="(min-width: 64rem) 40vw, (min-width: 48rem) 46vw, 80px"
                      className="h-full w-full object-cover object-top md:h-auto"
                    />
                  </div>
                ) : (
                  <Placeholder ratio="16 / 10" />
                )}
                {/* LinkedIn a la izquierda del nombre (devolución final, 7-oct-2026). */}
                <figcaption className="flex min-w-0 flex-1 items-center gap-1 md:mt-5 md:gap-3">
                  {f.linkedin ? (
                    <a
                      href={f.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`LinkedIn: ${f.nombre}`}
                      title={`LinkedIn: ${f.nombre}`}
                      className="canal-header -ml-2 shrink-0"
                    >
                      <IconoMarca name="linkedin" size={26} />
                    </a>
                  ) : null}
                  <div>
                    <h3 className="text-h3">{f.nombre}</h3>
                    <p className="mt-1 text-small text-muted">{f.rol}</p>
                  </div>
                </figcaption>
              </figure>
              {f.cita ? (
                <blockquote className="m-0 font-display text-h3 font-bold text-text-strong">“{f.cita}”</blockquote>
              ) : null}
              <p className="text-text">{f.bio}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
