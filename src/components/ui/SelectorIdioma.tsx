"use client";

import { contenidos, IDIOMAS, rutaIdioma } from "@/content";
import { useContenido, useIdioma } from "@/content/ContenidoProvider";

/**
 * ES · EN. Enlaces comunes (no <Link>): cada idioma tiene su propio <html lang>,
 * así que el cambio es una carga de página completa, a propósito.
 */
export function SelectorIdioma({ className = "" }: { className?: string }) {
  const actual = useIdioma();
  const { ui } = useContenido();
  return (
    <nav aria-label={ui.selectorIdioma} className={`selector-idioma ${className}`}>
      {IDIOMAS.map((l, i) => {
        const { corto, nombre, htmlLang } = contenidos[l].idioma;
        return (
          <span key={l} className="inline-flex items-center">
            {i > 0 ? <span aria-hidden="true" className="selector-idioma__sep">·</span> : null}
            {l === actual ? (
              <span aria-current="true" className="selector-idioma__actual" title={nombre}>
                {corto}
              </span>
            ) : (
              <a href={rutaIdioma[l]} hrefLang={htmlLang} lang={htmlLang} title={nombre} className="selector-idioma__link">
                {corto}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
