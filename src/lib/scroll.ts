import type Lenis from "lenis";

// Freno del scroll de la página, para cuando un diálogo queda arriba (el pop-up
// de contacto). Con Lenis hay que pararlo a él: el overflow solo no alcanza,
// porque Lenis mueve la página por su cuenta con la rueda.
let lenis: Lenis | null = null;

export function registrarLenis(instancia: Lenis | null) {
  lenis = instancia;
}

export function bloquearScroll(bloquear: boolean) {
  document.documentElement.style.overflow = bloquear ? "hidden" : "";
  if (bloquear) lenis?.stop();
  else lenis?.start();
}
