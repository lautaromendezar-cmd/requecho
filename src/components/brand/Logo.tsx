import {
  ISO_ESCUADRAS,
  ISO_LETRA,
  ISO_VIEWBOX,
  LOGO_ESCUADRAS,
  LOGO_LETRAS,
  LOGO_VIEWBOX,
} from "./logo-path";

type Props = {
  /** Alto en px, escuadras incluidas; el ancho sale de la proporción del logo. */
  height?: number;
  className?: string;
  /**
   * "color": letras en currentColor y escuadras en amarillo (versión principal
   * sobre claro, negativa sobre oscuro: lo decide el color del contenedor).
   * "mono": todo en currentColor (versión blanco y negro, p. ej. sobre amarillo).
   */
  variant?: "color" | "mono";
  /** El logo del hero es el nombre de la marca: se anuncia; el resto es decorativo. */
  decorative?: boolean;
};

function Marca({
  viewBox,
  letras,
  escuadras,
  height,
  className,
  variant,
  decorative,
}: Required<Omit<Props, "className">> & { className: string; viewBox: string; letras: string; escuadras: string }) {
  const [, , w, h] = viewBox.split(" ").map(Number);
  const width = Math.round((height * w) / h);
  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Requecho"}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      <path d={letras} fill="currentColor" />
      <path d={escuadras} fill={variant === "color" ? "var(--color-accent)" : "currentColor"} />
    </svg>
  );
}

/**
 * Logotipo oficial (guía de marca, oct. 2026). El área de exclusión del manual es
 * media altura de letra por lado: la pone el contenedor. No aplicarle sombras,
 * deformaciones ni rotaciones (ver la sección "Usos incorrectos" del manual).
 */
export function Logo({ height = 40, className = "", variant = "color", decorative = false }: Props) {
  return (
    <Marca
      viewBox={LOGO_VIEWBOX}
      letras={LOGO_LETRAS}
      escuadras={LOGO_ESCUADRAS}
      {...{ height, className, variant, decorative }}
    />
  );
}

/** Isologo: la R entre escuadras. Para espacios chicos o cuadrados. */
export function Isologo({ height = 40, className = "", variant = "color", decorative = false }: Props) {
  return (
    <Marca
      viewBox={ISO_VIEWBOX}
      letras={ISO_LETRA}
      escuadras={ISO_ESCUADRAS}
      {...{ height, className, variant, decorative }}
    />
  );
}
