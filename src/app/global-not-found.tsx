import type { Metadata } from "next";
import { fontClassName, fontVariables } from "@/lib/fonts";
import { Logo } from "@/components/brand/Logo";
import "./globals.css";

// El layout raíz vive en app/[lang]: esta página cubre cualquier ruta que no
// exista, en los dos idiomas a la vez.
export const metadata: Metadata = {
  title: "Requecho | 404",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="es-AR" className={fontClassName} style={fontVariables}>
      <body className="surface-soft">
        <main className="container-x flex min-h-[100svh] flex-col justify-center gap-8 py-section">
          <Logo height={56} className="text-text-strong" />
          <h1 className="text-h2">Esta página no existe.</h1>
          <p lang="en" className="text-lead text-text-muted">This page doesn’t exist.</p>
          {/* <a> y no <Link>: esta página está fuera del layout de cada idioma y
              volver a uno de ellos es, de todos modos, una carga completa. */}
          {/* eslint-disable @next/next/no-html-link-for-pages */}
          <p className="flex gap-6 font-display font-bold">
            <a href="/" className="underline underline-offset-4">Ir al inicio</a>
            <a href="/en" lang="en" className="underline underline-offset-4">Go to home</a>
          </p>
          {/* eslint-enable @next/next/no-html-link-for-pages */}
        </main>
      </body>
    </html>
  );
}
