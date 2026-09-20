"use client";

import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/config/motion";

/**
 * Reveal genérico para todo lo marcado con data-reveal:
 *   data-reveal="up" (default) sube y aparece · "fade" sólo aparece ·
 *   "line" crece desde la izquierda (líneas de acento).
 *   data-reveal-delay="180" retrasa en ms (para escalonar hermanos).
 * Lo que está dentro de [data-reveal-scope="manual"] lo coreografía su bloque.
 * Con movimiento reducido, todo queda visible sin animar.
 */
export function RevealManager() {
  useGSAP(() => {
    const all = gsap.utils
      .toArray<HTMLElement>("[data-reveal]")
      .filter((el) => !el.closest('[data-reveal-scope="manual"]'));

    const mm = gsap.matchMedia();

    mm.add(motion.media.reduce, () => {
      gsap.set(all, { opacity: 1, clearProps: "transform" });
    });

    mm.add(motion.media.ok, () => {
      all.forEach((el) => {
        const kind = el.dataset.reveal || "up";
        const delay = Number(el.dataset.revealDelay || 0) / 1000;
        const trigger = { trigger: el, start: "top 90%", once: true };

        if (kind === "line") {
          gsap.fromTo(
            el,
            { scaleX: 0, opacity: 1 },
            { scaleX: 1, duration: 1, ease: motion.eases.out, delay, scrollTrigger: trigger },
          );
        } else if (kind === "fade") {
          gsap.fromTo(
            el,
            { opacity: 0 },
            { opacity: 1, duration: motion.durations.base, ease: "power1.out", delay, scrollTrigger: trigger },
          );
        } else {
          gsap.fromTo(
            el,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 1.1, ease: motion.eases.out, delay, scrollTrigger: trigger },
          );
        }
      });
    });

    document.documentElement.classList.add("gsap-ready");
  });

  return null;
}
