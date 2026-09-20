import { LOGO_PATH, LOGO_VIEWBOX } from "./logo-path";

type Props = {
  /** Alto en px; el ancho sale de la proporción del isologo. */
  height?: number;
  className?: string;
  /** El logo del hero es el nombre de la marca: se anuncia; el resto es decorativo. */
  decorative?: boolean;
};

/**
 * Isologo. Se renderiza inline con currentColor para heredar el color del
 * escenario. El área de protección (la altura de la R) la pone el contenedor.
 */
export function Logo({ height = 22, className = "", decorative = false }: Props) {
  const [, , w, h] = LOGO_VIEWBOX.split(" ").map(Number);
  const width = Math.round((height * w) / h);
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      width={width}
      height={height}
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Requecho"}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      <path d={LOGO_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
