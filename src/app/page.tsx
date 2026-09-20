import { Hero } from "@/components/sections/Hero";
import { Problema } from "@/components/sections/Problema";
import { Producto } from "@/components/sections/Producto";
import { ComoFunciona } from "@/components/sections/ComoFunciona";
import { PorQue } from "@/components/sections/PorQue";
import { Fundadoras } from "@/components/sections/Fundadoras";
import { Reconocimientos } from "@/components/sections/Reconocimientos";
import { Contacto } from "@/components/sections/Contacto";

// Exactamente 8 bloques, en este orden. No se agrega, quita ni reordena nada.
export default function Page() {
  return (
    <main id="contenido">
      <Hero />
      <Problema />
      <Producto />
      <ComoFunciona />
      <PorQue />
      <Fundadoras />
      <Reconocimientos />
      <Contacto />
    </main>
  );
}
