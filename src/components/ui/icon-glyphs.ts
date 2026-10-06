// =============================================================================
// SISTEMA DE ÍCONOS
// Trazo fino uniforme, esquinas suaves, dentro de círculos. Cada glifo se dibuja
// en una grilla de 24 y el componente <Icon> lo centra dentro del círculo de 48.
// `part` engancha la microanimación de hover/tap definida en globals.css.
// =============================================================================
export type Glyph = { d: string; part?: string };

export const glyphs = {
  // --- Bloque 2 -------------------------------------------------------------
  /** Carrete de hilo: la industria textil */
  textil: [
    { d: "M6 4h12v3H6z" },
    { d: "M6 17h12v3H6z" },
    { d: "M8 7v10M16 7v10" },
    { d: "M8 10h8", part: "thread" },
    { d: "M8 13.5h8", part: "thread" },
  ],
  /** Tijera sobre la mesa de corte: el descarte preconsumo */
  tijera: [
    { d: "M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z", part: "blade" },
    { d: "M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
    { d: "M8.2 8.2 20 20", part: "blade" },
    { d: "M8.2 15.8 20 4" },
    { d: "M13 13l1.5-1.5" },
  ],
  /** Edificio en obra: la construcción consume materiales */
  construccion: [
    { d: "M3 21h18" },
    { d: "M5 21V9l6-4v16" },
    { d: "M11 11h8v10", part: "nudge-up" },
    { d: "M14.5 15h1.5M14.5 18h1.5" },
    { d: "M7 9.5h1.5M7 13h1.5M7 16.5h1.5" },
  ],

  // --- Bloque 3: propiedades ------------------------------------------------
  sonido: [
    { d: "M4 9h3l4-3.5v13L7 15H4z" },
    { d: "M14.5 9.5a3.5 3.5 0 0 1 0 5", part: "wave" },
    { d: "M17.5 7a7 7 0 0 1 0 10", part: "wave" },
  ],
  termometro: [
    { d: "M10 4a2 2 0 0 1 4 0v9.3a4 4 0 1 1-4 0z" },
    { d: "M12 9.5V16", part: "mercury" },
    { d: "M16.5 6h2.5M16.5 9h2.5" },
  ],
  llama: [
    {
      d: "M12 3.5c.6 3 3.9 4.6 3.9 8.1a3.9 3.9 0 0 1-7.8 0c0-1.8.9-2.9 1.5-3.9.5 1.3 1.4 1.9 1.4 1.9 0-2 .3-4.3 1-6.1z",
      part: "flame",
    },
    { d: "M12 20.5v-1.6" },
  ],
  emisiones: [
    { d: "M3.5 8h8.5a2 2 0 1 0-2-2", part: "wind" },
    { d: "M3.5 12h12.5a2.5 2.5 0 1 1-2.5 2.5", part: "wind" },
    { d: "M3.5 16h6.5a2 2 0 1 1-2 2", part: "wind" },
  ],

  // --- Bloque 4: proceso -----------------------------------------------------
  /** Mesa de corte con el recorte que vuelve */
  recuperar: [
    { d: "M4 5.5h16v4H4z" },
    { d: "M17.5 13.5v3.5H8", part: "arrow" },
    { d: "M10.5 14.5 8 17l2.5 2.5", part: "arrow" },
  ],
  /** Tres bandejas: separar por composición y color */
  clasificar: [
    { d: "M3.5 9.5h4.5v10.5H3.5z", part: "bar" },
    { d: "M9.75 4h4.5v16H9.75z", part: "bar" },
    { d: "M16 12.5h4.5v7.5H16z", part: "bar" },
  ],
  /** Matraz con fibras: triturar y formular */
  triturar: [
    { d: "M9.5 3.5h5" },
    { d: "M10.5 3.5v6L5.4 18.6A1.6 1.6 0 0 0 6.8 21h10.4a1.6 1.6 0 0 0 1.4-2.4L13.5 9.5v-6" },
    { d: "M9.6 15.2h.01", part: "dot" },
    { d: "M12.6 17.6h.01", part: "dot" },
    { d: "M11.2 13.4h.01", part: "dot" },
  ],
  /** Dos platos que convergen: la prensa */
  prensar: [
    { d: "M4 4.5h16", part: "plate-top" },
    { d: "M12 4.5v2.5", part: "plate-top" },
    { d: "M4 19.5h16", part: "plate-bottom" },
    { d: "M12 19.5V17", part: "plate-bottom" },
    { d: "M7 9.5h10v5H7z" },
  ],
  /** Calor que sube: el secado */
  secar: [
    { d: "M4 19.5h16" },
    { d: "M8 15.5c0-1.8 2-1.8 2-3.6S8 10.1 8 8.3", part: "heat" },
    { d: "M12 15.5c0-1.8 2-1.8 2-3.6s-2-1.8-2-3.6", part: "heat" },
    { d: "M16 15.5c0-1.8 2-1.8 2-3.6s-2-1.8-2-3.6", part: "heat" },
  ],

  // --- Bloque 5: diferenciales ----------------------------------------------
  ciclo: [
    { d: "M20 12a8 8 0 0 1-14.3 4.9M4 12a8 8 0 0 1 14.3-4.9", part: "spin" },
    { d: "M4 20.5v-4.3h4.3M20 3.5v4.3h-4.3", part: "spin" },
  ],
  diseno: [
    { d: "M4 20l1.2-4.8L15.8 4.6a1.7 1.7 0 0 1 2.4 0l1.2 1.2a1.7 1.7 0 0 1 0 2.4L8.8 18.8z", part: "nudge-up" },
    { d: "M13.5 7l3.5 3.5" },
    { d: "M4 20l4.8-1.2" },
  ],
  capas: [
    { d: "M12 3.5 3.5 8 12 12.5 20.5 8z", part: "layer-1" },
    { d: "M3.5 12 12 16.5 20.5 12", part: "layer-2" },
    { d: "M3.5 16 12 20.5 20.5 16", part: "layer-3" },
  ],
  huella: [
    { d: "M12 4a8 8 0 0 0-8 8v1.5", part: "grow" },
    { d: "M12 4a8 8 0 0 1 8 8v3.5", part: "grow" },
    { d: "M12 8a4 4 0 0 0-4 4v6" },
    { d: "M12 8a4 4 0 0 1 4 4v6" },
    { d: "M12 12v8" },
  ],

  // --- Bloque 8: pie --------------------------------------------------------
  /** Chinche de mapa: la dirección */
  ubicacion: [
    { d: "M12 21.5c4.3-4.6 6.5-8.1 6.5-10.5a6.5 6.5 0 1 0-13 0c0 2.4 2.2 5.9 6.5 10.5z" },
    { d: "M14.2 10.6a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0z", part: "dot" },
  ],
  /** Auricular: el teléfono */
  telefono: [
    {
      d: "M7.6 3.8 10 8.2l-2 1.8a12 12 0 0 0 6 6l1.8-2 4.4 2.4-.6 2.3a1.9 1.9 0 0 1-2.1 1.4C10.4 19.3 4.7 13.6 3.9 6.5a1.9 1.9 0 0 1 1.4-2.1z",
      part: "ring",
    },
  ],
  /** Sobre: el mail */
  mail: [
    { d: "M3.5 6h17v12h-17z" },
    { d: "m4.2 6.8 7.8 5.8 7.8-5.8", part: "flap" },
  ],
  /** Instagram */
  instagram: [
    { d: "M7.5 3.5h9a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4z" },
    { d: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z", part: "dot" },
    { d: "M17.2 6.9v.01" },
  ],
  /** LinkedIn */
  linkedin: [
    { d: "M4.6 9.5v11" },
    { d: "M4.6 4.9v.01" },
    { d: "M10.4 20.5v-11" },
    { d: "M10.4 13.6a4 4 0 0 1 8 0v6.9", part: "dot" },
  ],

  // --- Utilitarios ----------------------------------------------------------
  check: [{ d: "M5.5 12.5 10 17 18.5 8" }],
  flecha: [{ d: "M5 12h14M13 6l6 6-6 6", part: "arrow" }],
  /** Hoja con flecha hacia abajo: descargar un PDF */
  documento: [
    { d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" },
    { d: "M14 3v5h5" },
    { d: "M12 11v6M9.5 14.5 12 17l2.5-2.5", part: "arrow" },
  ],
} as const satisfies Record<string, readonly Glyph[]>;

export type IconName = keyof typeof glyphs;
