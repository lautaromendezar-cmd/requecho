import type { NextConfig } from "next";

// Mientras NEXT_PUBLIC_SITE_LIVE no sea "true", la página se sirve con noindex
// (metadata y cabecera): es un deploy de revisión con datos pendientes.
const live = process.env.NEXT_PUBLIC_SITE_LIVE?.trim() === "true";

// HTML estático para el hosting de las clientas (DUPLIKA, Apache + PHP). Lo arma
// `node scripts/exportar-html.mjs`; sin esta variable, todo sigue como en Vercel.
const exportar = process.env.NEXT_PUBLIC_EXPORTAR === "1";

// Anchos que genera el script de exportación para cada imagen (en .webp, al lado de
// la original). El loader de src/lib/image-loader.ts arma la ruta de cada uno.
export const ANCHOS_EXPORTACION = { deviceSizes: [640, 960, 1280, 1920], imageSizes: [256, 384] };

const configExportacion: NextConfig = {
  poweredByHeader: false,
  experimental: { globalNotFound: true },
  output: "export",
  // /en/ → en/index.html: Apache lo sirve sin reglas extra. "/" sale de copiar es/.
  trailingSlash: true,
  images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts", ...ANCHOS_EXPORTACION },
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // El layout raíz está en app/[lang] (ver app/global-not-found.tsx).
  experimental: { globalNotFound: true },
  // Español en la raíz, inglés en /en. /es existe sólo por dentro: se sirve como
  // "/" y, si alguien entra a /es, se lo manda a "/" para no duplicar la página.
  async rewrites() {
    return [{ source: "/", destination: "/es" }];
  },
  async redirects() {
    return [{ source: "/es", destination: "/", permanent: true }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [96, 128, 192, 256, 384, 512],
  },
  async headers() {
    if (live) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default exportar ? configExportacion : nextConfig;
