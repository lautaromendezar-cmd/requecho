"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { contacto } from "@/content/landing";
import { Kicker } from "@/components/ui/Kicker";
import { LeadForm } from "./contacto/LeadForm";

/**
 * BLOQUE 8 — CIERRE Y FORMULARIO
 * Fondo mostaza. Al entrar, un velo warm light se desvanece con el scroll y el
 * bloque pasa al acento. Formulario con labels flotantes, validación en vivo,
 * botón con estado de envío y éxito que reemplaza al formulario. Pie de página.
 */
export function Contacto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const veil = root.querySelector<HTMLElement>("[data-veil]");
      if (!veil) return;
      const mm = gsap.matchMedia();
      mm.add(motion.media.ok, () => {
        gsap.fromTo(
          veil,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top 90%", end: "top 30%", scrub: true },
          },
        );
      });
      mm.add(motion.media.reduce, () => {
        gsap.set(veil, { opacity: 0 });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="surface-accent relative py-section" aria-labelledby="contacto-titulo">
      <div data-veil aria-hidden="true" className="contact-veil pointer-events-none absolute inset-0 bg-bg" />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <Kicker>{contacto.kicker}</Kicker>
            <h2 id="contacto-titulo" data-reveal className="mt-6 text-display">
              {contacto.titulo}
            </h2>
            <p data-reveal data-reveal-delay="120" className="mt-8 max-w-[40ch] text-lead">
              {contacto.bajada}
            </p>
          </div>
          <div data-reveal data-reveal-delay="200" className="lg:col-span-6 lg:col-start-7">
            <LeadForm />
          </div>
        </div>

        <footer className="mt-24 flex flex-col gap-4 border-t border-on-accent/15 pt-8 text-small sm:flex-row sm:items-center sm:justify-between lg:mt-32">
          <p className="font-display font-bold tracking-[0.08em]">{contacto.pie}</p>
          {contacto.redes ? (
            <ul className="m-0 flex list-none gap-6 p-0">
              {contacto.redes.map((r) => (
                <li key={r.url}>
                  <a href={r.url} className="underline-offset-4 hover:underline">
                    {r.nombre}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </footer>
      </div>
    </section>
  );
}
