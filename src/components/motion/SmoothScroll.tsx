"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motion } from "@/config/motion";
import { registrarLenis } from "@/lib/scroll";

/**
 * Scroll suavizado con Lenis, sincronizado con el ticker de GSAP para que
 * ScrollTrigger lea la posición correcta. Un solo flag lo apaga (motion.ts) y
 * con prefers-reduced-motion no se crea.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!motion.smoothScroll) return;
    if (window.matchMedia(motion.media.reduce).matches) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    registrarLenis(lenis);
    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      registrarLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
