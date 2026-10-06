"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { useContenido } from "@/content/ContenidoProvider";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";
import { TextureLens } from "./producto/TextureLens";
import { Gallery } from "./producto/Gallery";

/**
 * BLOQUE 3 — PRODUCTO
 * El bloque de acento se expande detrás de la foto (como "Nuestra mirada").
 * Cuatro propiedades como cards interactivas, aplicaciones, ficha breve en texto,
 * macro de textura con lupa y galería arrastrable sin autoplay.
 */
export function Producto() {
  const { producto, idioma } = useContenido();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const block = root.querySelector<HTMLElement>("[data-accent-block]");
      if (!block) return;
      const mm = gsap.matchMedia();
      mm.add(motion.media.ok, () => {
        gsap.fromTo(
          block,
          { scaleX: 0.15, scaleY: 0.4, transformOrigin: "left bottom" },
          {
            scaleX: 1,
            scaleY: 1,
            duration: 1.6,
            ease: "expo.inOut",
            scrollTrigger: { trigger: block, start: "top 80%", once: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="surface-soft py-section" aria-labelledby="producto-titulo">
      <div className="container-x">
        {/* Encabezado */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-6">
            <Kicker>{producto.kicker}</Kicker>
            <h2 id="producto-titulo" data-reveal className="mt-6 text-h2">
              {producto.titulo}
            </h2>
          </div>
          <p data-reveal data-reveal-delay="120" className="self-end text-lead lg:col-span-5 lg:col-start-8">
            {producto.bajada}
          </p>
        </div>

        {/* Panel sobre mostaza + cuerpo */}
        <div className="mt-12 grid items-end gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-x-8">
          <div className="relative lg:col-span-7">
            <div
              data-accent-block
              aria-hidden="true"
              className="absolute -bottom-6 -left-4 h-[72%] w-[78%] rounded-lg bg-accent lg:-bottom-10 lg:-left-10"
            />
            <div data-reveal="mask-left" className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={producto.imagenPrincipal.src}
                alt={producto.imagenPrincipal.alt}
                width={producto.imagenPrincipal.width}
                height={producto.imagenPrincipal.height}
                sizes="(min-width: 64rem) 55vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p data-reveal className="text-lead text-text">
              {producto.cuerpo}
            </p>
          </div>
        </div>

        {/* Propiedades y desempeño */}
        <div className="mt-16 lg:mt-24">
          <h3 data-reveal className="text-h3">
            {producto.propiedadesTitulo}
          </h3>
          <span className="accent-line mt-4" data-reveal="line" aria-hidden="true" />
          <ul className="mt-10 grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-4">
            {producto.propiedades.map((p, i) => (
              <li
                key={p.id}
                data-icon-host
                data-reveal
                data-reveal-delay={String(i * 90)}
                className="group relative flex flex-col gap-5 overflow-hidden rounded-lg bg-bg p-7 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] hover:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-7 top-0 h-[2px] origin-left scale-x-0 bg-accent-line transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                />
                <Icon name={p.icono} size={52} />
                <h4 className="text-h3 font-bold">{p.titulo}</h4>
                {p.datoLabel ? <p className="-mb-3 text-small text-muted">{p.datoLabel}</p> : null}
                {p.dato ? (
                  <p
                    className={`origin-left font-display font-bold text-text-strong transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:scale-[1.04] ${
                      p.datoLabel ? "text-[1.45rem] tabular-nums" : "text-body"
                    }`}
                  >
                    {p.dato}
                  </p>
                ) : null}
                {p.rango ? <RangeBar min={p.rango.min} max={p.rango.max} escalaMax={p.rango.escalaMax} locale={idioma.locale} /> : null}
                {p.texto ? <p className="text-text">{p.texto}</p> : null}
                {p.referencias ? (
                  <div>
                    <p className="text-small font-bold text-text">{p.referencias.titulo}</p>
                    <ul className="mt-2 list-none space-y-1 p-0 text-small text-muted">
                      {p.referencias.items.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {p.norma ? <p className="mt-auto text-small text-muted">{p.norma}</p> : null}
                {p.nota ? <p className="mt-auto text-small text-muted">{p.nota}</p> : null}
              </li>
            ))}
          </ul>
        </div>

        {/* Aplicaciones */}
        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-x-8">
          <h3 data-reveal className="text-h3 lg:col-span-3">
            {producto.aplicacionesTitulo}
          </h3>
          <ul className="m-0 flex list-none flex-wrap gap-x-3 gap-y-3 p-0 text-lead lg:col-span-9">
            {producto.aplicaciones.map((a, i) => (
              <li key={a} data-reveal data-reveal-delay={String(i * 80)} className="flex items-center gap-3">
                {i > 0 ? (
                  <span aria-hidden="true" className="text-accent-line">
                    ·
                  </span>
                ) : null}
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ficha breve + macro de textura */}
        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-6">
            <h3 data-reveal className="text-h3">
              {producto.fichaTitulo}
            </h3>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {producto.ficha.map(([k, v], i) => (
                <div
                  key={k}
                  data-reveal
                  data-reveal-delay={String(i * 70)}
                  className="grid grid-cols-[minmax(9rem,1fr)_2fr] gap-4 py-4"
                >
                  <dt className="text-small font-bold uppercase tracking-[0.08em] text-muted">{k}</dt>
                  <dd className="m-0 text-text">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div data-reveal className="lg:col-span-5 lg:col-start-8">
            <TextureLens imagen={producto.textura} />
          </div>
        </div>

        {/* Galería */}
        <div className="mt-14 lg:mt-14" data-reveal>
          <Gallery imagenes={producto.galeria} />
        </div>
      </div>
    </section>
  );
}

/** Barra de rango: sólo representa los valores del documento (α 0,51–0,70). */
function RangeBar({ min, max, escalaMax, locale }: { min: number; max: number; escalaMax: number; locale: string }) {
  const left = (min / escalaMax) * 100;
  const width = ((max - min) / escalaMax) * 100;
  const f = (n: number) => n.toLocaleString(locale, { minimumFractionDigits: 2 });
  return (
    <div aria-hidden="true" className="mt-1">
      <div className="relative h-[3px] w-full rounded-pill bg-line">
        <span
          data-reveal="line"
          data-reveal-delay="300"
          className="absolute inset-y-0 rounded-pill bg-accent"
          style={{ left: `${left}%`, width: `${width}%` }}
        />
      </div>
      <div className="relative mt-2 h-5 text-[0.8125rem] text-muted">
        <span className="absolute left-0">0</span>
        <span className="absolute -translate-x-1/2 font-bold text-text" style={{ left: `${left}%` }}>
          {f(min)}
        </span>
        <span className="absolute -translate-x-1/2 font-bold text-text" style={{ left: `${left + width}%` }}>
          {f(max)}
        </span>
        <span className="absolute right-0">{escalaMax}</span>
      </div>
    </div>
  );
}
