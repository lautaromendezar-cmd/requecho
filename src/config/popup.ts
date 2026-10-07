// =============================================================================
// POP-UP DE CONTACTO: el mismo formulario del bloque 8, en una ventana que se
// abre al entrar (pedido de las clientas, oct. 2026).
// =============================================================================
export const popup = {
  activo: true,
  /** Espera antes de abrirse: deja ver la portada y no compite con su carga. */
  retrasoMs: 4000,
  /** Si la persona lo cierra, no vuelve a aparecer en estos días. */
  diasSinRepetir: 7,
} as const;

/** Claves de localStorage. */
export const POPUP_CERRADO = "rq_popup_cerrado";
export const LEAD_ENVIADO = "rq_lead_enviado";
