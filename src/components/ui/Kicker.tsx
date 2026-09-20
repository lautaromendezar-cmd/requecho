type Props = {
  children: string;
  className?: string;
  /** Sin reveal propio (cuando el bloque lo coreografía a mano). */
  manual?: boolean;
};

/** Kicker en mayúsculas con la línea corta amarilla: el gesto de la marca. */
export function Kicker({ children, className = "", manual = false }: Props) {
  return (
    <p className={`kicker ${className}`} data-reveal={manual ? undefined : "fade"}>
      <span>{children}</span>
      <span className="accent-line" data-reveal={manual ? undefined : "line"} data-reveal-delay="180" aria-hidden="true" />
    </p>
  );
}
