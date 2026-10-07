"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { useContenido } from "@/content/ContenidoProvider";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/brand/Logo";
import { SelectorIdioma } from "@/components/ui/SelectorIdioma";
import { IconoMarca } from "@/components/ui/IconoMarca";
import { instagram, linkedin, mail, whatsapp } from "@/content/canales";
import { LeadForm } from "./contacto/LeadForm";
import { ContactoPopup } from "./contacto/ContactoPopup";

/**
 * BLOQUE 8 — CIERRE Y FORMULARIO
 * Fondo mostaza. Al entrar, un velo warm light se desvanece con el scroll y el
 * bloque pasa al acento. Formulario con labels flotantes, validación en vivo,
 * botón con estado de envío y éxito que reemplaza al formulario. Pie de página.
 */
export function Contacto() {
  const { contacto } = useContenido();
  const ref = useRef<HTMLElement>(null);
  const datos = contacto.datos;

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
    <>
    <section ref={ref} className="surface-accent relative py-section" aria-labelledby="contacto-titulo">
      <div data-veil aria-hidden="true" className="contact-veil pointer-events-none absolute inset-0 bg-bg" />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <Kicker>{contacto.kicker}</Kicker>
            <h2 id="contacto-titulo" data-reveal className="mt-6 text-h2">
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

      </div>
    </section>

    <ContactoPopup seccion={ref} />

    {/* El pie tiene escenario propio: cierra la página en grafito y despega del
        mostaza del bloque 8. */}
    <footer className="surface-inverse py-16 text-body lg:py-20">
      <div className="container-x">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="footer-titulo">{datos.direccion.titulo}</p>
            <div className="mt-4 flex gap-3">
              <Icon name="ubicacion" size={22} bare draw={false} className="mt-[2px] shrink-0 text-accent-line" />
              <div>
                {datos.direccion.lineas.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="footer-titulo">{datos.contacto.titulo}</p>
            <ul className="mt-4 m-0 list-none space-y-3 p-0">
              {[
                ...whatsapp.map((w) => ({ ...w, icono: "whatsapp" as const, externo: true })),
                { ...mail, icono: "mail" as const, externo: false },
              ].map((d) => (
                <li key={d.texto} className="flex items-center gap-3">
                  <IconoMarca name={d.icono} size={20} className="shrink-0 text-accent-line" />
                  <a
                    href={d.href}
                    {...(d.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="underline-offset-4 hover:underline"
                  >
                    {d.texto}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-titulo">{datos.redes.titulo}</p>
            <ul className="mt-4 m-0 list-none space-y-3 p-0">
              {[
                { ...instagram, icono: "instagram" as const },
                { ...linkedin, icono: "linkedin" as const },
              ].map((r) => (
                <li key={r.url} className="flex items-center gap-3">
                  <IconoMarca name={r.icono} size={20} className="shrink-0 text-accent-line" />
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                    {r.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Versión negativa del logo (letras claras, escuadras amarillas), como
            pide el manual sobre fondos oscuros. */}
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-inverse-text/15 pt-8">
          <Logo height={40} className="text-inverse-text" />
          <div className="flex items-center gap-6">
            <SelectorIdioma />
            <p className="text-legal text-inverse-muted">{contacto.pie}</p>
          </div>
        </div>
      </div>
    </footer>

    {/* Firma: una franja más oscura que el grafito, en la letra de los legales. */}
    <div className="firma">
      <div className="container-x py-4">
        <p className="text-legal">
          {contacto.firma.texto}{" "}
          <a href={contacto.firma.url} target="_blank" rel="noopener noreferrer" className="firma__link">
            {contacto.firma.nombre}
          </a>
        </p>
      </div>
    </div>
    </>
  );
}
