"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Draggable as DraggableType } from "gsap/Draggable";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import type { Imagen } from "@/content/landing";
import { Icon } from "@/components/ui/Icon";

/**
 * Galería arrastrable con inercia (Draggable + Inertia, cargados bajo demanda) y
 * swipe en mobile. Sin JS o con movimiento reducido cae a scroll nativo con
 * scroll-snap. Sin reproducción automática.
 */
export function Gallery({ imagenes }: { imagenes: Imagen[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const prev = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const w = wrap.current;
      const t = track.current;
      const bPrev = prev.current;
      const bNext = next.current;
      if (!w || !t || !bPrev || !bNext) return;

      let drag: DraggableType | undefined;
      const slideStarts = () => Array.from(t.children).map((c) => -(c as HTMLElement).offsetLeft);

      const step = (dir: 1 | -1) => {
        if (drag) {
          const x = gsap.getProperty(t, "x") as number;
          const pos = slideStarts();
          const target =
            dir > 0
              ? Math.max(drag.minX, pos.find((p) => p < x - 4) ?? drag.minX)
              : Math.min(0, [...pos].reverse().find((p) => p > x + 4) ?? 0);
          gsap.to(t, { x: target, duration: 0.9, ease: motion.eases.out, onUpdate: () => drag?.update() });
        } else {
          const first = t.children[0] as HTMLElement | undefined;
          const delta = (first?.offsetWidth ?? 320) + 16;
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

      const mm = gsap.matchMedia();
      mm.add(motion.media.ok, () => {
        let ro: ResizeObserver | undefined;
        let vivo = true;

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
            onDragStart: () => w.classList.add("is-dragging"),
            onDragEnd: () => w.classList.remove("is-dragging"),
          });
          ro = new ResizeObserver(() => drag?.applyBounds(w));
          ro.observe(w);
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
          w.classList.remove("is-draggable");
        };
      });

      return () => {
        bPrev.removeEventListener("click", onPrev);
        bNext.removeEventListener("click", onNext);
        w.removeEventListener("keydown", onKey);
      };
    },
    { scope: wrap },
  );

  return (
    <div className="relative">
      <div
        ref={wrap}
        className="gallery rounded-lg"
        tabIndex={0}
        role="region"
        aria-roledescription="galería"
        aria-label="Fotos del material"
      >
        <ul ref={track} className="gallery__track m-0 list-none p-0">
          {/* Todas en 4:3 apaisado (devolución: fotos menos verticales). */}
          {imagenes.map((im, i) => {
            return (
              <li
                key={im.src}
                className="gallery__slide aspect-[4/3] w-[82vw] overflow-hidden rounded-lg sm:w-[56vw] lg:w-[34vw]"
              >
                <Image
                  src={im.src}
                  alt={im.alt}
                  width={im.width}
                  height={im.height}
                  sizes="(min-width: 64rem) 34vw, 82vw"
                  loading={i < 2 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-6 flex gap-3">
        <button
          ref={prev}
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line text-text-strong transition-colors hover:border-text-strong"
          aria-label="Foto anterior"
        >
          <Icon name="flecha" bare draw={false} size={22} className="rotate-180" />
        </button>
        <button
          ref={next}
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line text-text-strong transition-colors hover:border-text-strong"
          aria-label="Foto siguiente"
        >
          <Icon name="flecha" bare draw={false} size={22} />
        </button>
      </div>
    </div>
  );
}
