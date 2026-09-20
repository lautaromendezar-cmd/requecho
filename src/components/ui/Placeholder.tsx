type Props = {
  /** Relación de aspecto CSS, por ejemplo "3 / 4". */
  ratio?: string;
  className?: string;
};

/**
 * Placeholder sobrio del sistema para un [ASSET pendiente]: bloque de color con
 * textura y la línea corta de la marca. Nunca stock ni imágenes generadas.
 */
export function Placeholder({ ratio = "3 / 4", className = "" }: Props) {
  return <div className={`grain rounded-lg ${className}`} style={{ aspectRatio: ratio }} aria-hidden="true" />;
}
