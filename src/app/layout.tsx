import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { fontClassName, fontVariables } from "@/lib/fonts";
import { meta } from "@/content/landing";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RevealManager } from "@/components/motion/RevealManager";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: baseUrl(),
  title: meta.title,
  description: meta.description,
  robots: live ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
  openGraph: {
    type: "website",
    locale: "es_AR",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f1f1ef",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={fontClassName} style={fontVariables} suppressHydrationWarning>
      <body>
        {/* Marca que hay JS antes del primer pintado: el CSS de reveals depende de .js */}
        <Script id="rq-js" strategy="beforeInteractive">{`document.documentElement.classList.add('js')`}</Script>
        <SmoothScroll />
        <RevealManager />
        {children}
      </body>
    </html>
  );
}
