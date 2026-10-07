"use client";

import { useEffect, useId, useRef, type RefObject } from "react";
import { useContenido } from "@/content/ContenidoProvider";
import { Kicker } from "@/components/ui/Kicker";
import { popup, POPUP_CERRADO, LEAD_ENVIADO } from "@/config/popup";
import { bloquearScroll } from "@/lib/scroll";
import { LeadForm } from "./LeadForm";

const DIA = 24 * 60 * 60 * 1000;

function leer(clave: string): number | null {
  try {
    const v = localStorage.getItem(clave);
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}

function guardar(clave: string) {
  try {
    localStorage.setItem(clave, String(Date.now()));
  } catch {
    /* sin storage: puede volver a aparecer en la próxima visita */
  }
}

/** ¿La sección de contacto ya está a la vista? Entonces el pop-up sobra. */
function aLaVista(el: HTMLElement | null) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

/**
 * POP-UP DE CONTACTO
 * El formulario del bloque 8 en un <dialog> modal (foco atrapado y Esc los da el
 * navegador). Se abre una vez, unos segundos después de entrar; no vuelve si la
 * persona lo cerró hace poco o si ya mandó sus datos, y no aparece si el bloque 8
 * ya está en pantalla. Se cierra con la cruz, con Esc o tocando afuera.
 */
export function ContactoPopup({ seccion }: { seccion: RefObject<HTMLElement | null> }) {
  const { contacto } = useContenido();
  const ref = useRef<HTMLDialogElement>(null);
  const enviado = useRef(false);
  const tituloId = useId();

  useEffect(() => {
    if (!popup.activo) return;
    if (leer(LEAD_ENVIADO)) return;
    const cerrado = leer(POPUP_CERRADO);
    if (cerrado && Date.now() - cerrado < popup.diasSinRepetir * DIA) return;

    const t = window.setTimeout(() => {
      const d = ref.current;
      if (!d || d.open || aLaVista(seccion.current)) return;
      d.showModal();
      bloquearScroll(true);
    }, popup.retrasoMs);
    return () => window.clearTimeout(t);
  }, [seccion]);

  // Todas las salidas (cruz, Esc, clic afuera) terminan en el evento close.
  const alCerrar = () => {
    bloquearScroll(false);
    if (!enviado.current) guardar(POPUP_CERRADO);
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={tituloId}
      onClose={alCerrar}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      data-lenis-prevent
      className="contacto-popup surface-accent"
    >
      <div className="relative p-6 pt-14 sm:p-10 lg:p-12">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={contacto.popup.cerrar}
          className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] transition-colors duration-[var(--duration-fast)] hover:bg-on-accent/10"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <Kicker manual>{contacto.kicker}</Kicker>
        <h2 id={tituloId} className="mt-6 text-h2">
          {contacto.titulo}
        </h2>
        <p className="mt-6 max-w-[40ch] text-lead">{contacto.bajada}</p>
        <div className="mt-8">
          <LeadForm onEnviado={() => (enviado.current = true)} />
        </div>
      </div>
    </dialog>
  );
}
