"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Draggable as DraggableType } from "gsap/Draggable";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import type { Imagen } from "@/content/landing";
import { useContenido } from "@/content/ContenidoProvider";
import { Icon } from "@/components/ui/Icon";

const dos = (n: number) => String(n).padStart(2, "0");

/**
 * Carrusel cuadrado arrastrable con inercia (Draggable + Inertia, cargados bajo
 * demanda) y swipe en mobile. Se corta en el borde del contenedor, con el
 * mismo margen que a la izquierda (antes sangraba hasta el borde de la
 * pantalla). Mientras se mueve, cada foto se desliza dentro de su marco
 * (parallax) y la barra y el contador acompañan. Al entrar, las fotos se
 * descubren en cascada. Sin reproducción automática. Sin JS o con movimiento
 * reducido cae a scroll nativo con scroll-snap.
 */
export function Gallery({ imagenes }: { imagenes: Imagen[] }) {
  const { ui } = useContenido();
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const prev = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const barra = useRef<HTMLSpanElement>(null);
  const contador = useRef<HTMLSpanElement>(null);
  const total = imagenes.length;

  useGSAP(
    (_context, contextSafe) => {
      const w = wrap.current;
      const t = track.current;
      const bPrev = prev.current;
      const bNext = next.current;
      const bar = barra.current;
      const cnt = contador.current;
      if (!w || !t || !bPrev || !bNext || !bar || !cnt) return;

      const slides = Array.from(t.children) as HTMLElement[];
      const fotos = slides.map((s) => s.querySelector<HTMLElement>("[data-parallax]")!);
      let drag: DraggableType | undefined;
      const slideStarts = () => slides.map((c) => -c.offsetLeft);

      // Posición actual (x del track con Draggable, scrollLeft sin él) → barra,
      // contador y parallax. Sólo toca transform/scale: no fuerza layout.
      const pintar = () => {
        const x = drag ? (gsap.getProperty(t, "x") as number) : -w.scrollLeft;
        const min = drag ? drag.minX : -(w.scrollWidth - w.clientWidth);
        const p = min < 0 ? Math.min(Math.max(x / min, 0), 1) : 0;
        gsap.set(bar, { scaleX: 0.08 + p * 0.92 });
        const pos = slideStarts();
        const i = pos.reduce((best, v, k) => (Math.abs(v - x) < Math.abs(pos[best] - x) ? k : best), 0);
        const actual = p > 0.995 ? total : i + 1;
        cnt.textContent = `${dos(actual)} / ${dos(total)}`;
        if (!drag) return;
        const vw = w.clientWidth;
        slides.forEach((s, k) => {
          const centro = s.offsetLeft + x + s.offsetWidth / 2;
          const r = (centro - vw / 2) / vw; // -1..1 aprox.
          gsap.set(fotos[k], { xPercent: gsap.utils.clamp(-9, 9, -r * 9) });
        });
      };

      const step = (dir: 1 | -1) => {
        if (drag) {
          const x = gsap.getProperty(t, "x") as number;
          const pos = slideStarts();
          const target =
            dir > 0
              ? Math.max(drag.minX, pos.find((p) => p < x - 4) ?? drag.minX)
              : Math.min(0, [...pos].reverse().find((p) => p > x + 4) ?? 0);
          gsap.to(t, {
            x: target,
            duration: 0.9,
            ease: motion.eases.out,
            onUpdate: () => {
              drag?.update();
              pintar();
            },
          });
        } else {
          const delta = (slides[0]?.offsetWidth ?? 320) + 16;
          w.scrollBy({ left: dir * delta, behavior: "smooth" });
        }
      };
      const onPrev = () => step(-1);
      const onNext = () => step(1);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          step(1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(-1);
        }
      };
      bPrev.addEventListener("click", onPrev);
      bNext.addEventListener("click", onNext);
      w.addEventListener("keydown", onKey);
      w.addEventListener("scroll", pintar, { passive: true });
      pintar();

      const mm = gsap.matchMedia();
      mm.add(motion.media.ok, () => {
        let ro: ResizeObserver | undefined;
        let vivo = true;

        // Entrada: cada cuadro se descubre de abajo hacia arriba, en cascada,
        // y la foto llega un poco agrandada y se asienta.
        gsap.set(fotos, { scale: 1.2 });
        gsap.fromTo(
          slides,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: w, start: "top 82%", once: true },
          },
        );
        gsap.fromTo(
          fotos,
          { scale: 1.35 },
          {
            scale: 1.2,
            duration: 1.6,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: w, start: "top 82%", once: true },
          },
        );

        const armar = contextSafe!((Draggable: typeof DraggableType) => {
          if (!vivo) return;
          w.classList.add("is-draggable");
          gsap.set(t, { x: 0 });
          [drag] = Draggable.create(t, {
            type: "x",
            bounds: w,
            inertia: true,
            edgeResistance: 0.85,
            dragResistance: 0.02,
            snap: {
              x: (end: number) => {
                const pos = slideStarts();
                const min = drag?.minX ?? -Infinity;
                const candidates = pos.filter((p) => p >= min);
                return candidates.reduce((a, b) => (Math.abs(b - end) < Math.abs(a - end) ? b : a), 0);
              },
            },
            onDrag: pintar,
            onThrowUpdate: pintar,
            onDragStart: () => w.classList.add("is-dragging"),
            onDragEnd: () => w.classList.remove("is-dragging"),
          });
          ro = new ResizeObserver(() => {
            drag?.applyBounds(w);
            pintar();
          });
          ro.observe(w);
          pintar();
        });

        Promise.all([import("gsap/Draggable"), import("gsap/InertiaPlugin")]).then(
          ([{ Draggable }, { InertiaPlugin }]) => {
            gsap.registerPlugin(Draggable, InertiaPlugin);
            armar(Draggable);
          },
        );

        return () => {
          vivo = false;
          ro?.disconnect();
          drag?.kill();
          drag = undefined;
          gsap.set(t, { clearProps: "transform" });
          gsap.set(fotos, { clearProps: "transform" });
          gsap.set(slides, { clearProps: "clipPath" });
          w.classList.remove("is-draggable");
        };
      });

      return () => {
        bPrev.removeEventListener("click", onPrev);
        bNext.removeEventListener("click", onNext);
        w.removeEventListener("keydown", onKey);
        w.removeEventListener("scroll", pintar);
      };
    },
    { scope: wrap },
  );

  const boton =
    "inline-flex h-12 w-12 items-center justify-center rounded-full border border-line text-text-strong transition-colors hover:border-text-strong hover:bg-text-strong hover:text-inverse-text";

  return (
    <div>
      {/* El carrusel se corta en el borde del contenedor, con el mismo margen
          blanco que a la izquierda (devolución final, 7-oct-2026: antes sangraba
          hasta el borde de la pantalla). */}
      <div
        ref={wrap}
        className="gallery"
        tabIndex={0}
        role="region"
        aria-roledescription="carrusel"
        aria-label={ui.galeria}
      >
        <ul ref={track} className="gallery__track m-0 list-none p-0">
          {imagenes.map((im, i) => (
            <li
              key={im.src}
              className="gallery__slide aspect-square w-[78vw] overflow-hidden rounded-lg sm:w-[46vw] lg:w-[min(30vw,30rem)]"
            >
              <div data-parallax className="h-full w-full">
                <Image
                  src={im.src}
                  alt={im.alt}
                  width={im.width}
                  height={im.height}
                  sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 46vw, 78vw"
                  loading={i < 3 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex items-center gap-6">
        <div className="flex gap-3">
          <button ref={prev} type="button" className={boton} aria-label={ui.fotoAnterior}>
            <Icon name="flecha" bare draw={false} size={22} className="rotate-180" />
          </button>
          <button ref={next} type="button" className={boton} aria-label={ui.fotoSiguiente}>
            <Icon name="flecha" bare draw={false} size={22} />
          </button>
        </div>
        <div aria-hidden="true" className="relative h-[2px] flex-1 overflow-hidden bg-line">
          <span ref={barra} className="absolute inset-0 origin-left scale-x-[0.08] bg-accent-line" />
        </div>
        <span ref={contador} aria-hidden="true" className="font-display text-small font-bold tabular-nums text-text-strong">
          {`01 / ${dos(total)}`}
        </span>
      </div>
    </div>
  );
}
