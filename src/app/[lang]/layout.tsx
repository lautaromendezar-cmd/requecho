import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { fontClassName, fontVariables } from "@/lib/fonts";
import { contenidos, esIdioma, IDIOMAS, rutaIdioma, type Lang } from "@/content";
import { ContenidoProvider } from "@/content/ContenidoProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RevealManager } from "@/components/motion/RevealManager";
import "../globals.css";

const live = process.env.NEXT_PUBLIC_SITE_LIVE?.trim() === "true";

function baseUrl(): URL | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return undefined;
  try {
    return new URL(raw);
  } catch {
    return undefined;
  }
}

// Dos idiomas, los dos estáticos. "/" es el español (rewrite a /es en
// next.config.ts) y /en el inglés; cualquier otro segmento es 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return IDIOMAS.map((lang) => ({ lang }));
}

const idiomaDe = (raw: string): Lang => (esIdioma(raw) ? raw : "es");

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const lang = idiomaDe((await params).lang);
  const { meta, idioma } = contenidos[lang];
  return {
    metadataBase: baseUrl(),
    title: meta.title,
    description: meta.description,
    robots: live ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
    alternates: {
      canonical: rutaIdioma[lang],
      languages: { es: rutaIdioma.es, en: rutaIdioma.en, "x-default": rutaIdioma.es },
    },
    openGraph: {
      type: "website",
      locale: idioma.ogLocale,
      alternateLocale: IDIOMAS.filter((l) => l !== lang).map((l) => contenidos[l].idioma.ogLocale),
      url: rutaIdioma[lang],
      title: meta.title,
      description: meta.description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og.jpg"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f1f1ef",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = idiomaDe((await params).lang);
  return (
    <html lang={contenidos[lang].idioma.htmlLang} className={fontClassName} style={fontVariables} suppressHydrationWarning>
      <body>
        {/* Marca que hay JS antes del primer pintado: el CSS de reveals depende de .js */}
        <Script id="rq-js" strategy="beforeInteractive">{`document.documentElement.classList.add('js')`}</Script>
        <SmoothScroll />
        <RevealManager />
        <ContenidoProvider lang={lang}>{children}</ContenidoProvider>
      </body>
    </html>
  );
}
