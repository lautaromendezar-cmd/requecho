"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";
import type { ImagenHero } from "@/content/landing";

/** Cada foto queda quieta este tiempo antes del fundido (segundos). */
const PAUSA = 3.6;
const FUNDIDO = 1.4;

/**
 * Fotos del hero en fundido, en lugar del video de producto de las clientas (son
 * 8 fotos fijas: como imágenes pesan una fracción del video, se ven nítidas en
 * cualquier pantalla y la primera sigue siendo el LCP).
 *
 * Sólo la primera carga con prioridad; el resto se monta después del `load` de
 * la página para no competir con ella. Se avanza sólo a fotos ya cargadas, se
 * frena cuando el hero sale de la pantalla y con movimiento reducido queda la
 * primera, fija.
 */
export function HeroFotos({ fotos }: { fotos: readonly ImagenHero[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [resto, setResto] = useState(false);
  const cargadas = useRef(new Set<number>([0]));

  useEffect(() => {
    const on = () => setResto(true);
    if (document.readyState === "complete") {
      const t = window.setTimeout(on, 0);
      return () => window.clearTimeout(t);
    }
    window.addEventListener("load", on, { once: true });
    return () => window.removeEventListener("load", on);
  }, []);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !resto) return;
      const mm = gsap.matchMedia();
      mm.add(motion.media.ok, () => {
        const capas = gsap.utils.toArray<HTMLElement>("[data-foto]", root);
        let actual = 0;
        const siguiente = () => {
          let n = (actual + 1) % capas.length;
          while (n !== actual && !cargadas.current.has(n)) n = (n + 1) % capas.length;
          if (n !== actual) {
            const sale = capas[actual];
            const entra = capas[n];
            gsap.set(entra, { zIndex: 2, opacity: 0, scale: 1.05 });
            gsap.set(sale, { zIndex: 1 });
            gsap.to(entra, { opacity: 1, duration: FUNDIDO, ease: "power1.inOut" });
            gsap.to(entra, { scale: 1, duration: FUNDIDO + PAUSA, ease: "power1.out" });
            gsap.set(sale, { opacity: 0, zIndex: 0, delay: FUNDIDO });
            entra.removeAttribute("aria-hidden");
            sale.setAttribute("aria-hidden", "true");
            actual = n;
          }
          reloj = gsap.delayedCall(FUNDIDO + PAUSA, siguiente);
        };

        let reloj = gsap.delayedCall(PAUSA, siguiente);
        const st = ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          // Un solo reloj: se mata siempre y se rearma al volver a la pantalla
          // (isActive() de un delayedCall da false durante la espera).
          onToggle: (self) => {
            reloj.kill();
            if (self.isActive) reloj = gsap.delayedCall(PAUSA, siguiente);
          },
        });

        return () => {
          reloj.kill();
          st.kill();
        };
      });
    },
    { scope: ref, dependencies: [resto] },
  );

  return (
    <div ref={ref} className="absolute inset-0">
      {fotos.map((f, i) =>
        i === 0 || resto ? (
          <div
            key={f.src}
            data-foto
            aria-hidden={i === 0 ? undefined : true}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0 }}
          >
            <Image
              src={f.src}
              alt={f.alt}
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : "eager"}
              quality={75}
              sizes="(min-width: 64rem) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: f.posicion }}
              onLoad={() => cargadas.current.add(i)}
            />
          </div>
        ) : null,
      )}
    </div>
  );
}
