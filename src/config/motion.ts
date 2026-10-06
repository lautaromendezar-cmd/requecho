// =============================================================================
// MOVIMIENTO: flags y tiempos de GSAP en un solo lugar.
// =============================================================================
export const motion = {
  /** Scroll suavizado con Lenis. Se apaga solo con prefers-reduced-motion. */
  smoothScroll: true,
  /** Bloque 4 pineado con scrub en desktop. En false, la línea se dibuja con el
   *  scroll pero la sección no se queda quieta. Apagado por devolución de las
   *  clientas (oct. 2026): el pin dejaba un espacio vacío largo al bajar. */
  pinProcess: false,
  /** Lupa de textura en el bloque 3 (desktop). */
  lens: true,

  durations: { fast: 0.35, base: 0.8, slow: 1.2, hero: 1.4 },
  eases: {
    out: "expo.out",
    inOut: "power3.inOut",
    soft: "power2.out",
    draw: "power2.inOut",
  },
  stagger: 0.08,

  /** Condiciones para gsap.matchMedia(). */
  media: {
    wide: "(min-width: 64rem)",
    narrow: "(max-width: 63.99rem)",
    fine: "(pointer: fine)",
    reduce: "(prefers-reduced-motion: reduce)",
    ok: "(prefers-reduced-motion: no-preference)",
  },
} as const;
