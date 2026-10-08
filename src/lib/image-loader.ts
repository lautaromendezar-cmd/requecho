// Loader de next/image para el HTML estático (sólo con NEXT_PUBLIC_EXPORTAR=1).
// No hay optimizador en el hosting: scripts/exportar-html.mjs deja, al lado de cada
// .jpg/.png, una copia .webp por ancho (foto.jpg → foto-640.webp, foto-960.webp…).
// Los anchos son los de ANCHOS_EXPORTACION en next.config.ts.
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const m = src.match(/^(.+)\.(jpe?g|png)$/i);
  return m ? `${m[1]}-${width}.webp` : src;
}
