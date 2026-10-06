"use client";

import { createContext, useContext, type ReactNode } from "react";
import { contenidos, type Contenido, type Lang } from "./index";

const Ctx = createContext<Lang>("es");

/**
 * El layout pasa sólo el código de idioma (un string, serializable); cada
 * componente cliente toma su texto con useContenido(). Así el contenido puede
 * tener funciones (p. ej. el mensaje de éxito con el nombre).
 */
export function ContenidoProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

export function useIdioma(): Lang {
  return useContext(Ctx);
}

export function useContenido(): Contenido {
  return contenidos[useContext(Ctx)];
}
