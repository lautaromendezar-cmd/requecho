"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { useContenido } from "@/content/ContenidoProvider";
import { Logo } from "@/components/brand/Logo";
import { SelectorIdioma } from "@/components/ui/SelectorIdioma";
import { IconoMarca } from "@/components/ui/IconoMarca";
import { instagram, linkedin, mail, whatsapp } from "@/content/canales";
import { HeroFotos } from "./hero/HeroFotos";

/**
 * BLOQUE 1 — HERO
 * Secuencia de carga corta: logo, H1 por líneas con máscara, subtítulo,
 * fotos con máscara clip-path (desktop) o leve escala (mobile, para no demorar el
 * LCP), que después se suceden en fundido. Parallax al scroll y tilt con el
 * puntero. Arriba, los canales de contacto en amarillo y el selector de idioma.
 */
export function Hero() {
  const { hero, ui } = useContenido();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const pieces = q<HTMLElement>("[data-reveal]");
      const media = q<HTMLElement>("[data-hero-media]")[0];
      const img = q<HTMLElement>("[data-hero-img]")[0];
      const h1 = q<HTMLElement>("h1")[0];
      const mm = gsap.matchMedia();

      mm.add(motion.media.reduce, () => {
        gsap.set(pieces, { opacity: 1 });
        gsap.set(media, { clipPath: "none" });
      });

      mm.add({ ok: motion.media.ok, wide: motion.media.wide, fine: motion.media.fine }, (ctx) => {
        const { ok, wide, fine } = ctx.conditions as { ok: boolean; wide: boolean; fine: boolean };
        // matchMedia dispara si cualquiera de las condiciones coincide: sin `ok`
        // (movimiento reducido) no se anima nada.
        if (!ok) return;

        // Estado inicial en el mismo frame en que RevealManager quita el CSS de
        // respaldo: nada parpadea.
        gsap.set(pieces, { opacity: 0 });
        gsap.set(img, { scale: wide ? 1.12 : 1.06, transformOrigin: "50% 50%" });
        if (wide) gsap.set(media, { clipPath: "inset(0% 0% 0% 100%)" });

        let split: SplitText | undefined;

        const start = contextSafe!(() => {
          const tl = gsap.timeline({ defaults: { ease: motion.eases.out } });
          tl.fromTo(q("[data-hero='logo']"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9 }, 0);

          if (wide) {
            tl.to(media, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" }, 0.1);
          }
          tl.to(img, { scale: 1, duration: wide ? 2 : 1.6 }, 0.1);

          gsap.set(h1, { opacity: 1 });
          split = SplitText.create(h1, {
            type: "lines",
            mask: "lines",
            linesClass: "hero-line",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.1,
                stagger: 0.09,
                ease: motion.eases.out,
                delay: 0.35,
              }),
          });

          tl.fromTo(q("[data-hero='sub']"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1 }, 0.95)
            .fromTo(q("[data-hero='cue']"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.35);
        });

        document.fonts.ready.then(start);

        // Parallax: la foto se mueve más lento que el texto
        gsap.to(media, {
          yPercent: wide ? -10 : -5,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });

        // Tilt leve con el puntero (sólo puntero fino)
        let offMove: (() => void) | undefined;
        if (wide && fine) {
          gsap.set(media, { transformPerspective: 1400 });
          const rY = gsap.quickTo(media, "rotationY", { duration: 0.9, ease: "power3.out" });
          const rX = gsap.quickTo(media, "rotationX", { duration: 0.9, ease: "power3.out" });
          const pX = gsap.quickTo(img, "xPercent", { duration: 1.1, ease: "power3.out" });
          const pY = gsap.quickTo(img, "yPercent", { duration: 1.1, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = root.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5;
            const ny = (e.clientY - r.top) / r.height - 0.5;
            rY(nx * 5);
            rX(-ny * 4);
            pX(nx * -2.5);
            pY(ny * -2.5);
          };
          const leave = () => {
            rY(0);
            rX(0);
            pX(0);
            pY(0);
          };
          root.addEventListener("pointermove", move);
          root.addEventListener("pointerleave", leave);
          offMove = () => {
            root.removeEventListener("pointermove", move);
            root.removeEventListener("pointerleave", leave);
          };
        }

        return () => {
          offMove?.();
          split?.revert();
        };
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="surface-soft relative flex min-h-[100svh] items-center overflow-hidden"
      aria-labelledby="hero-titulo"
      data-reveal-scope="manual"
    >
      <div className="container-x absolute inset-x-0 top-0 z-10 flex items-center justify-end gap-5 pt-3 sm:gap-7 lg:pt-6">
        <nav aria-label={ui.canales}>
          <ul className="m-0 flex list-none items-center p-0">
            {[
              { href: mail.href, label: `Mail: ${mail.texto}`, icono: "mail" as const, externo: false },
              { href: whatsapp[0].href, label: "WhatsApp", icono: "whatsapp" as const, externo: true },
              { href: instagram.url, label: instagram.nombre, icono: "instagram" as const, externo: true },
              { href: linkedin.url, label: linkedin.nombre, icono: "linkedin" as const, externo: true },
            ].map((c) => (
              <li key={c.icono}>
                <a
                  href={c.href}
                  aria-label={c.label}
                  title={c.label}
                  {...(c.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="canal-header"
                >
                  <IconoMarca name={c.icono} size={20} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <SelectorIdioma />
      </div>
      <div className="container-x grid w-full items-center gap-10 pb-10 pt-16 lg:grid-cols-12 lg:gap-12 lg:pb-10 lg:pt-16">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <div data-reveal data-hero="logo" className="text-text-strong">
            <Logo height={64} />
          </div>
          <h1 id="hero-titulo" data-reveal className="mt-10 max-w-[17ch] text-display text-text-strong lg:mt-8">
            {hero.titulo}
          </h1>
          <p data-reveal data-hero="sub" className="mt-8 max-w-[52ch] lg:mt-6 text-lead text-text">
            {hero.subtitulo}
          </p>
          <p data-reveal data-hero="sub" className="mt-5 max-w-[52ch] text-lead text-text">
            {hero.subtitulo2}
          </p>
          <div data-reveal data-hero="cue" className="mt-8 hidden lg:block">
            <span className="scroll-cue" aria-hidden="true" />
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
          <div
            data-hero-media
            className="relative aspect-[4/3] w-full overflow-hidden rounded-lg lg:aspect-auto lg:h-[min(62svh,44vw)]"
          >
            <div data-hero-img className="absolute inset-0">
              <HeroFotos fotos={hero.imagenes} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
