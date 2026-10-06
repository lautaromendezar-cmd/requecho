"use client";

import Image from "next/image";
import { useContenido } from "@/content/ContenidoProvider";
import { Kicker } from "@/components/ui/Kicker";
import { Icon } from "@/components/ui/Icon";

/**
 * BLOQUE 5 — POR QUÉ REQUECHO (segundo escenario: grafito)
 * Cuatro diferenciales, cada uno con su foto. Reemplazan a la comparativa de
 * capas (devolución de las clientas, oct. 2026: no se entendía y repetía las
 * mismas palabras que la bajada). La idea de "varias capas contra una sola
 * pieza" queda dicha en la bajada.
 */
export function PorQue() {
  const { porQue } = useContenido();

  return (
    <section className="surface-inverse py-section" aria-labelledby="porque-titulo">
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

        <ul className="mt-14 grid list-none gap-4 p-0 sm:grid-cols-2 lg:mt-20 xl:grid-cols-4">
          {porQue.diferenciales.map((d, i) => (
            <li
              key={d.titulo}
              data-icon-host
              data-reveal
              data-reveal-delay={String(i * 90)}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={d.imagen.src}
                  alt={d.imagen.alt}
                  width={d.imagen.width}
                  height={d.imagen.height}
                  sizes="(min-width: 80rem) 22vw, (min-width: 40rem) 46vw, 92vw"
                  className="h-full w-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                />
                {/* Línea amarilla que se dibuja al pasar el mouse, al pie de la foto */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-accent-line transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 lg:p-7">
                <Icon name={d.icono} size={48} />
                <h3 className="mt-5 text-h3 font-bold text-inverse-text">{d.titulo}</h3>
                <p className="mt-3 text-inverse-muted">{d.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
