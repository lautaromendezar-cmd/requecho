"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { useContenido, useIdioma } from "@/content/ContenidoProvider";
import type { Contenido } from "@/content";
import { crearLeadSchema, erroresPorCampo, UTM_KEYS, type LeadErrors, type LeadField, type Utm } from "@/lib/leads/schema";
import { Icon } from "@/components/ui/Icon";
import { LEAD_ENVIADO } from "@/config/popup";

type Estado = "idle" | "enviando" | "error" | "exito";
type Valores = Record<LeadField, string>;

const inicial = (contacto: Contenido["contacto"]): Valores => ({
  nombre: "",
  apellido: "",
  empresa: "",
  whatsapp: contacto.campos.find((c) => c.name === "whatsapp")?.valorInicial ?? "",
  mail: "",
});

const UTM_STORAGE = "rq_utm";
/** En Vercel lo recibe la API de Next; en el HTML estático, lead.php (ver hosting/). */
const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_EXPORTAR === "1" ? "/lead.php" : "/api/lead";

function leerUtm(): Utm {
  const out = Object.fromEntries(UTM_KEYS.map((k) => [k, ""])) as Utm;
  try {
    const params = new URLSearchParams(window.location.search);
    let hay = false;
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) {
        out[k] = v.slice(0, 200);
        hay = true;
      }
    }
    if (hay) {
      sessionStorage.setItem(UTM_STORAGE, JSON.stringify(out));
      return out;
    }
    const guardado = sessionStorage.getItem(UTM_STORAGE);
    if (guardado) return { ...out, ...(JSON.parse(guardado) as Partial<Utm>) };
  } catch {
    /* sin storage o sin URL: se manda vacío */
  }
  return out;
}

/** Sólo dígitos, espacios y "+" (y el "+" únicamente al principio). */
function limpiarWhatsapp(v: string): string {
  const s = v.replace(/[^\d+ ]/g, "");
  return s.replace(/(?!^)\+/g, "");
}

/** `onEnviado`: lo usa el pop-up para saber que ya no tiene que volver a abrirse. */
export function LeadForm({ onEnviado }: { onEnviado?: () => void } = {}) {
  const { contacto } = useContenido();
  // El formulario está dos veces en la página (bloque 8 y pop-up): los id llevan prefijo.
  const uid = useId();
  const lang = useIdioma();
  const leadSchema = useMemo(() => crearLeadSchema(lang), [lang]);
  const [valores, setValores] = useState<Valores>(() => inicial(contacto));
  const [errores, setErrores] = useState<LeadErrors>({});
  const [estado, setEstado] = useState<Estado>("idle");
  const [nombreEnviado, setNombreEnviado] = useState("");
  const utm = useRef<Utm | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    utm.current = leerUtm();
  }, []);

  // Transición: el mensaje de éxito reemplaza al formulario
  useGSAP(
    () => {
      if (estado !== "exito" || !root.current) return;
      const ok = root.current.querySelector("[data-exito]");
      if (!ok) return;
      const mm = gsap.matchMedia();
      mm.add(motion.media.ok, () => {
        gsap.fromTo(ok, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: motion.eases.out });
        gsap.fromTo(
          ok.querySelectorAll("[data-draw]"),
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 1, ease: motion.eases.draw, stagger: 0.1, delay: 0.2 },
        );
      });
    },
    { scope: root, dependencies: [estado] },
  );

  const validarCampo = (name: LeadField, valor: string) => {
    const r = leadSchema.shape[name].safeParse(valor);
    setErrores((prev) => ({ ...prev, [name]: r.success ? undefined : r.error.issues[0]?.message }));
  };

  const onChange = (name: LeadField, raw: string) => {
    const v = name === "whatsapp" ? limpiarWhatsapp(raw) : raw;
    setValores((prev) => ({ ...prev, [name]: v }));
    if (errores[name]) validarCampo(name, v);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (estado === "enviando") return;
    const parsed = leadSchema.safeParse(valores);
    if (!parsed.success) {
      const errs = erroresPorCampo(parsed.error);
      setErrores(errs);
      const primero = contacto.campos.find((c) => errs[c.name])?.name;
      if (primero) formRef.current?.querySelector<HTMLInputElement>(`[name="${primero}"]`)?.focus();
      return;
    }
    setEstado("enviando");
    setErrores({});
    const honeypot = formRef.current?.querySelector<HTMLInputElement>('[name="website"]')?.value ?? "";
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...parsed.data, idioma: lang, website: honeypot, utm: utm.current ?? leerUtm() }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: LeadErrors };
      if (res.ok && data.ok) {
        // Éxito: el servidor guardó la fila. Con el honeypot lleno también dice ok
        // a propósito (no se guarda nada y el bot no se entera).
        setNombreEnviado(parsed.data.nombre);
        setEstado("exito");
        try {
          localStorage.setItem(LEAD_ENVIADO, String(Date.now()));
        } catch {
          /* sin storage: el pop-up puede volver a aparecer, nada más */
        }
        onEnviado?.();
        return;
      }
      if (res.status === 400 && data.errors) {
        setErrores(data.errors);
        setEstado("idle");
        return;
      }
      setEstado("error");
    } catch {
      setEstado("error");
    }
  };

  const mensajeFalla = contacto.mailAlternativo
    ? `${contacto.errores.envio} ${contacto.mailAlternativo}`
    : contacto.errores.envio;

  return (
    <div ref={root}>
      {estado === "exito" ? (
        <div data-exito role="status" aria-live="polite" className="rounded-lg bg-surface p-8 lg:p-10">
          <Icon name="check" size={64} draw={false} className="text-text-strong" />
          <p className="mt-6 font-display text-h3 font-bold text-text-strong">{contacto.exito(nombreEnviado)}</p>
        </div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-4" aria-busy={estado === "enviando"}>
          <div className="grid gap-4 sm:grid-cols-2">
            {contacto.campos.map((c) => {
              const error = errores[c.name];
              const campoId = `${uid}-campo-${c.name}`;
              const errorId = `${uid}-${c.name}-error`;
              const ancho = c.name === "empresa" || c.name === "mail" ? "sm:col-span-2" : "";
              return (
                <div key={c.name} className={`field ${error ? "is-invalid" : ""} ${ancho}`}>
                  <input
                    id={campoId}
                    name={c.name}
                    type={c.type}
                    inputMode={c.inputMode}
                    autoComplete={c.autoComplete}
                    placeholder={c.placeholder}
                    value={valores[c.name]}
                    onChange={(e) => onChange(c.name, e.target.value)}
                    onBlur={(e) => validarCampo(c.name, e.target.value)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    required
                    className="field__input"
                  />
                  <label htmlFor={campoId} className="field__label">
                    {c.label}
                  </label>
                  {error ? (
                    <span id={errorId} className="field__error" role="alert">
                      {error}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Campo trampa: invisible para personas, tentador para bots */}
          <div className="hp" aria-hidden="true">
            <label htmlFor={`${uid}-website`}>Website</label>
            <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          <div className="mt-2 flex flex-col items-start gap-4">
            <button type="submit" className="btn-primary" disabled={estado === "enviando"}>
              {estado === "enviando" ? <span className="spinner" aria-hidden="true" /> : null}
              <span>{contacto.boton}</span>
            </button>
            {estado === "error" ? (
              <p role="alert" className="text-small font-bold text-error">
                {mensajeFalla}
              </p>
            ) : null}
            <p className="text-legal text-on-accent/80">{contacto.privacidad}</p>
          </div>
        </form>
      )}
    </div>
  );
}
