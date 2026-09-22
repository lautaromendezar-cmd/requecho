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
  // Los datos de relleno del pie sirven para la revisión; si el sitio se
  // publica, no salen (la regla del proyecto: ningún dato a confirmar en vivo).
  const datos =
    contacto.datos.ejemplo && process.env.NEXT_PUBLIC_SITE_LIVE === "true" ? undefined : contacto.datos;

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

        <footer className="mt-24 border-t border-on-accent/15 pt-10 text-small lg:mt-32">
          {datos ? (
            <div className={`grid gap-10 sm:grid-cols-3 ${datos.ejemplo ? "opacity-60" : ""}`}>
              <div>
                <p className="footer-titulo">{datos.direccion.titulo}</p>
                {datos.direccion.lineas.map((l) => (
                  <p key={l} className="mt-2">
                    {l}
                  </p>
                ))}
              </div>
              <div>
                <p className="footer-titulo">{datos.contacto.titulo}</p>
                {[datos.contacto.telefono, datos.contacto.mail].map((d) => (
                  <p key={d.texto} className="mt-2">
                    {datos.ejemplo ? d.texto : <a href={d.href} className="underline-offset-4 hover:underline">{d.texto}</a>}
                  </p>
                ))}
              </div>
              <div>
                <p className="footer-titulo">{datos.redes.titulo}</p>
                {datos.redes.items.map((r) => (
                  <p key={r.url} className="mt-2">
                    {datos.ejemplo ? (
                      r.nombre
                    ) : (
                      <a href={r.url} className="underline-offset-4 hover:underline">
                        {r.nombre}
                      </a>
                    )}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
          {datos?.ejemplo ? (
            <p className="mt-8 italic opacity-55">Datos de ejemplo, a la espera de los definitivos.</p>
          ) : null}
          <p className="mt-10 font-display font-bold tracking-[0.08em]">{contacto.pie}</p>
        </footer>
      </div>
    </section>
  );
}
