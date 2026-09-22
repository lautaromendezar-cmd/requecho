"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { hero } from "@/content/landing";
import { Logo } from "@/components/brand/Logo";

/**
 * BLOQUE 1 — HERO
 * Secuencia de carga corta: isologo, línea, H1 por líneas con máscara, subtítulo,
 * foto con máscara clip-path (desktop) o leve escala (mobile, para no demorar el
 * LCP). Parallax de la foto al scroll y tilt con el puntero. Sin botón.
 */
export function Hero() {
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
          tl.fromTo(q("[data-hero='logo']"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9 }, 0)
            .fromTo(q("[data-hero='line']"), { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.9 }, 0.15);

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
      <div className="container-x grid w-full items-center gap-10 py-10 lg:grid-cols-12 lg:gap-8 lg:py-24">
        <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-5">
          <div data-reveal data-hero="logo" className="text-text-strong">
            <Logo height={44} />
          </div>
          <span className="accent-line mt-5" data-reveal data-hero="line" aria-hidden="true" />
          <h1 id="hero-titulo" data-reveal className="mt-10 max-w-[17ch] text-display text-text-strong">
            {hero.titulo}
          </h1>
          <p data-reveal data-hero="sub" className="mt-8 max-w-[52ch] text-lead text-text">
            {hero.subtitulo}
          </p>
          <div data-reveal data-hero="cue" className="mt-12 hidden lg:block">
            <span className="scroll-cue" aria-hidden="true" />
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
          <div
            data-hero-media
            className="relative h-[min(70svh,120vw)] w-full overflow-hidden rounded-lg lg:h-[min(82svh,56vw)]"
          >
            <Image
              data-hero-img
              src={hero.imagen.src}
              alt={hero.imagen.alt}
              fill
              priority
              quality={75}
              sizes="(min-width: 64rem) 50vw, 100vw"
              className="object-cover object-[55%_45%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
