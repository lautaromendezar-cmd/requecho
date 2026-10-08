// =============================================================================
// CONTENIDO EN INGLÉS (/en)
//
// Traducción de landing.ts, misma forma campo por campo (el tipo lo controla
// src/content/index.ts). Es un BORRADOR: lo tienen que validar las clientas antes
// de publicar. Rutas de imágenes, medidas y datos opcionales son los mismos que en
// español: si un dato a confirmar llega, se carga en los dos archivos.
// =============================================================================
import type { Badge, Campo, Cifra, Fundadora, Imagen, ImagenHero, Paso, Propiedad } from "./landing";
import type { IconName } from "@/components/ui/icon-glyphs";

export const idioma = {
  htmlLang: "en",
  locale: "en-US",
  ogLocale: "en_US",
  corto: "ENG",
  nombre: "English",
};

export const ui = {
  selectorIdioma: "Language",
  galeria: "Photos of the material",
  fotoAnterior: "Previous photo",
  fotoSiguiente: "Next photo",
  canales: "Contact and social media",
};

export const meta = {
  title: "Requecho | Panels made from textile waste",
  description:
    "We turn pre-consumer textile waste into panels with acoustic and thermal properties for architecture, interior design and design.",
  ogAlt: "Requecho logo next to a hand holding three textile-waste panels in different colors.",
};

// ---------------------------------------------------------------------------
// BLOQUE 1 — HERO
// ---------------------------------------------------------------------------
export const hero = {
  logo: "REQUECHO",
  titulo: "From waste to material. From material to new spaces.",
  subtitulo:
    "We recover pre-consumer textiles and turn them into wall-cladding panels with a unique identity, acoustic and thermal properties, and fire performance.",
  subtitulo2:
    "Requecho works at that meeting point: we recover waste from the textile industry and turn it into a new material for architecture and interior design.",
  imagenes: [
    { src: "/images/hero/hero-1.jpg", alt: "Three Requecho panels leaning against a pale wall among ivy leaves: one pink, one dark and speckled, one blue.", width: 1280, height: 2276, posicion: "50% 70%" },
    { src: "/images/hero/hero-2.jpg", alt: "A wall clad in blue Requecho panels behind a light sofa and a plant.", width: 1280, height: 2276, posicion: "50% 78%" },
    { src: "/images/hero/hero-3.jpg", alt: "Two grey and blue Requecho panels resting on a wooden floor against a yellow wall.", width: 1280, height: 2276, posicion: "50% 50%" },
    { src: "/images/hero/hero-4.jpg", alt: "An oval piece of grey and white Requecho material hanging from a leather strap.", width: 1280, height: 2276, posicion: "50% 42%" },
    { src: "/images/hero/hero-5.jpg", alt: "A hand holds denim offcuts next to Requecho panel samples.", width: 1280, height: 2276, posicion: "50% 45%" },
    { src: "/images/hero/hero-6.jpg", alt: "A low green table made of Requecho material against a pink background.", width: 1280, height: 2276, posicion: "50% 52%" },
    { src: "/images/hero/hero-7.jpg", alt: "A stack of colorful Requecho panels, fuchsia, light blue, cream and grey, on a wooden table.", width: 1280, height: 2276, posicion: "50% 50%" },
    { src: "/images/hero/hero-8.jpg", alt: "A wall clad in speckled blue Requecho panels with two green stools in front.", width: 1280, height: 2276, posicion: "50% 85%" },
  ] satisfies ImagenHero[],
};

// ---------------------------------------------------------------------------
// BLOQUE 2 — PROBLEMA
// ---------------------------------------------------------------------------
export const problema = {
  kicker: "THE PROBLEM",
  titulo: "The textile industry discards tons of material that could become a resource.",
  bajada:
    "Much of the material left over from textile production loses its value and becomes waste. At the same time, architecture and interior design need materials with a lower impact and new capabilities.",
  cifras: [
    {
      prefijo: "+",
      valor: 92,
      unidad: "million",
      texto: "tons of textile waste every year worldwide.",
      fuente: "UNEP, 2025.",
      icono: "textil",
    },
    {
      prefijo: "≈ ",
      valor: 500000,
      unidad: "tons",
      texto: "every year in Argentina. Most of it ends up in landfills, incinerated or untraced.",
      fuente: "Ministry of Environment, Buenos Aires Province, 2025.",
      icono: "tijera",
    },
    {
      prefijo: "+",
      valor: 40,
      sufijo: "%",
      texto: "of the materials extracted worldwide are consumed by construction.",
      fuente: "UNEP / GlobalABC, 2026.",
      icono: "construccion",
    },
  ] satisfies Cifra[],
};

// ---------------------------------------------------------------------------
// BLOQUE 3 — PRODUCTO
// ---------------------------------------------------------------------------
export const producto = {
  kicker: "THE MATERIAL",
  titulo: "A new material to transform spaces.",
  bajada:
    "Interior cladding panels that combine design, texture and performance. Each piece has its own identity and becomes part of the space's language.",
  cuerpo:
    "We work with color, combinations and gradients for each project. The texture, the fibers and the variations of every piece are part of an aesthetic that seeks character, not uniformity.",
  propiedadesTitulo: "Properties and performance",
  propiedadesNota: "Testing and certifications in progress.",
  propiedades: [
    {
      id: "acustica",
      titulo: "Acoustic",
      icono: "sonido",
      datoLabel: "Sound absorption:",
      dato: "α = 0.51–0.70",
      texto: "Helps reduce reverberation and improve acoustic comfort in interiors.",
      rango: { min: 0.51, max: 0.7, escalaMax: 1 },
    },
    {
      id: "termica",
      titulo: "Thermal",
      icono: "termometro",
      datoLabel: "Thermal conductivity:",
      dato: "λ ≈ 0.085 W/mK",
      texto: "Its low conductivity contributes to insulation and indoor thermal comfort.",
    },
    {
      id: "fuego",
      titulo: "Fire performance",
      icono: "llama",
      dato: "Requecho — IRAM 11910 standard · RE2 target",
      referencias: {
        titulo: "International references for comparable materials:",
        items: ["Europe — C-s1,d0 · EN 13501-1", "France — M2 · NF P92-501", "USA — Class B · ASTM E84-26"],
      },
    },
    {
      id: "emisiones",
      titulo: "Emissions",
      icono: "emisiones",
      texto: "Low volatile organic compound (VOC) emissions.",
    },
  ] satisfies Propiedad[],
  aplicacionesTitulo: "Applications",
  aplicaciones: ["Interior wall cladding", "Acoustic panels", "Furniture and design objects", "Custom developments"],
  fichaTitulo: "Specifications",
  fichaTecnica: {
    texto: "Download technical data sheet",
    formato: "PDF",
    url: "https://drive.google.com/file/d/1y6UN7bzm0ohmzxreHHKRCQYUJKxkjFIw/view" as string | undefined,
  },
  ficha: [
    ["Composition", "Shredded textiles + bio-based binder"],
    ["Size", "20 × 10 × 2.5 cm"],
    ["Use", "Interior, non-structural"],
    ["Coverage", "50 panels = 1 m²"],
    ["Recovered material", "≈ 7.5 kg of textile waste recovered per m²"],
  ] as [string, string][],
  /** Carrusel en cuadrado (scripts/preparar-carrusel.py). */
  galeria: [
    { src: "/images/productos/puerta-amarilla.jpg", alt: "A hand holds two blue-and-white Requecho panels against a door painted yellow.", width: 940, height: 940 },
    { src: "/images/productos/cuadro-indigo.jpg", alt: "Wooden-framed piece made of eight indigo-blue Requecho panels.", width: 940, height: 940 },
    { src: "/images/productos/manos-bloques.jpg", alt: "Two hands show dark-blue Requecho panels and a light one with red and orange fibers.", width: 940, height: 940 },
    { src: "/images/productos/paneles-hiedra.jpg", alt: "Blue, black and light Requecho panels with colored fibers resting next to ivy.", width: 940, height: 940 },
    { src: "/images/productos/discos.jpg", alt: "A pile of Requecho discs with grey, blue and red fibers.", width: 940, height: 940 },
    { src: "/images/productos/paneles-puerta.jpg", alt: "Two speckled-blue Requecho panels leaning against a yellow door.", width: 940, height: 940 },
    { src: "/images/productos/cuadro-mosaico.jpg", alt: "Wooden-framed mosaic of blue and cream Requecho panels.", width: 940, height: 940 },
    { src: "/images/productos/jean-y-muestras.jpg", alt: "Denim offcuts in a glass jar next to Requecho samples: the waste and the finished material.", width: 940, height: 940 },
    { src: "/images/productos/disco-amarillo.jpg", alt: "A black-and-cream Requecho disc on a yellow wall.", width: 940, height: 940 },
    { src: "/images/productos/manos-hiedra.jpg", alt: "Hands fanning out Requecho panels in different shades of blue, in a courtyard with ivy.", width: 940, height: 940 },
    { src: "/images/productos/cuadro-patio.jpg", alt: "A wooden-framed piece of blue and cream Requecho panels, in the sun in a courtyard with plants.", width: 940, height: 940 },
    { src: "/images/productos/muestras.jpg", alt: "Requecho samples from above: a cream-and-black disc, a dark panel and a light one with red fibers.", width: 940, height: 940 },
  ] satisfies Imagen[],
};

// ---------------------------------------------------------------------------
// BLOQUE 4 — CÓMO FUNCIONA
// ---------------------------------------------------------------------------
export const proceso = {
  titulo: "How we do it.",
  bajada:
    "We developed a process that lets us recover waste, preserve its material value and transform it into a new piece.",
  pasos: [
    {
      numero: "01",
      titulo: "We recover",
      texto: "We collect pre-consumer textile waste, mainly from cutting tables.",
      icono: "recuperar",
    },
    {
      numero: "02",
      titulo: "We sort",
      texto: "We separate and organize it by composition, color and material characteristics.",
      icono: "clasificar",
    },
    {
      numero: "03",
      titulo: "We shred and formulate",
      texto: "We break down the fibers and combine them with our bio-based binder system.",
      icono: "triturar",
    },
    {
      numero: "04",
      titulo: "We press",
      texto: "We give each panel its shape, density and thickness.",
      icono: "prensar",
    },
    {
      numero: "05",
      titulo: "We dry",
      texto: "The material completes its drying and stabilization process before becoming a product.",
      icono: "secar",
    },
  ] as Paso[],
};

// ---------------------------------------------------------------------------
// BLOQUE 5 — POR QUÉ REQUECHO
// ---------------------------------------------------------------------------
export const porQue = {
  kicker: "WHY REQUECHO",
  titulo: "Circularity, performance and design.",
  bajada:
    "Where a conventional solution needs several layers, Requecho combines acoustic and thermal performance with a visible finish in a single material.",
  diferenciales: [
    {
      titulo: "Recovered material",
      texto: "Each m² recovers approximately 7.5 kg of pre-consumer textile waste.",
      icono: "ciclo",
      imagen: { src: "/images/diferenciales/material-recuperado.jpg", alt: "A hand holds scraps of denim, the textile waste that becomes panels, with Requecho panels in the background.", width: 960, height: 720 },
    },
    {
      titulo: "Design for every space",
      texto:
        "We work on colors, combinations and gradients together with architects and designers to integrate the material into the project.",
      icono: "diseno",
      imagen: { src: "/images/diferenciales/diseno.jpg", alt: "A hand holds three Requecho panel samples with different finishes against a yellow door.", width: 960, height: 720 },
    },
    {
      titulo: "Functional properties",
      texto: "The same material provides a visible finish, sound absorption and thermal performance.",
      icono: "capas",
      imagen: { src: "/images/diferenciales/propiedades.jpg", alt: "Eight blue and cream Requecho panels in a wooden frame, showing the thickness and density of the fibers.", width: 960, height: 720 },
    },
    {
      titulo: "Material identity",
      texto: "The material's own fibers, textures and variations are part of the final expression of each piece.",
      icono: "huella",
      imagen: { src: "/images/diferenciales/identidad.jpg", alt: "Three Requecho panels in different colors resting next to a plant: each piece has its own texture.", width: 960, height: 720 },
    },
  ] satisfies { titulo: string; texto: string; icono: IconName; imagen: Imagen }[],
};

// ---------------------------------------------------------------------------
// BLOQUE 6 — FUNDADORAS
// ---------------------------------------------------------------------------
export const fundadoras = {
  kicker: "FOUNDERS",
  titulo: "Requecho was born from knowing the industry from the inside.",
  apertura: [
    "We are Luciana Sabsay and Verónica Litvinoff. We met while studying Fashion Design at the University of Buenos Aires (UBA) and have spent more than twenty years working across different areas of the textile industry.",
    "For years we watched the same scene repeat itself: offcuts, leftovers and materials that lost their value as soon as production ended. Requecho was born from a simple question: what if, instead of treating that material as waste, we could design with it again?",
  ],
  foto: {
    src: "/images/fundadoras/juntas-riendo.jpg",
    alt: "Verónica Litvinoff and Luciana Sabsay look at each other and laugh against a white wall: Verónica holds a handful of textile scraps and Luciana two Requecho panels.",
    width: 940,
    height: 1175,
    epigrafe: undefined as string | undefined,
  },
  cards: [
    {
      nombre: "Luciana Sabsay",
      linkedin: "https://www.linkedin.com/in/luciana-sabsay-738aa013",
      rol: "Co-founder · Business & Sales",
      retrato: {
        src: "/images/fundadoras/luciana.jpg",
        alt: "Portrait of Luciana Sabsay, smiling, in a floral shirt against a white wall.",
        width: 960,
        height: 720,
      },
      bio: "Fashion designer (UBA) specialized in Communication and Marketing. More than twenty years of experience in textile production, business development and supplier and workshop management. For twelve years she led production at ADA Collection for international markets. She is also a textile sustainability consultant.",
    },
    {
      nombre: "Verónica Litvinoff",
      linkedin: "https://www.linkedin.com/in/veronica-litvinoff-87007512a",
      rol: "Co-founder · Product & Operations",
      retrato: {
        src: "/images/fundadoras/veronica.jpg",
        alt: "Portrait of Verónica Litvinoff, smiling, in a light blue printed shirt against a white wall.",
        width: 960,
        height: 720,
      },
      bio: "Fashion designer (UBA) specialized in product, biomaterials and textile innovation, with training in the Sociology of Design. More than twenty years of experience in product development and production, from raw-material selection to working with workshops and industrial processes.",
    },
  ] as Fundadora[],
};

// ---------------------------------------------------------------------------
// BLOQUE 7 — RECONOCIMIENTOS
// ---------------------------------------------------------------------------
export const reconocimientos = {
  kicker: "RECOGNITION",
  pestanaNueva: "(opens in a new tab)",
  badges: [
    {
      titulo: "Regional Semifinalist 2026 · ClimateLaunchpad",
      texto: "We represent Argentina at the Global Final in Singapore, in October 2026.",
      logo: { src: "/logos/climatelaunchpad-positivo.png", alt: "ClimateLaunchpad", width: 351, height: 153 },
      url: "https://climatelaunchpad.org/",
    },
    {
      titulo: "Semifinalists · NAVES, IAE Business School",
      texto: "In the IAE Business School startup competition. 2025",
      logo: { src: "/logos/naves-badge.png", alt: "NAVES", width: 506, height: 370 },
      logoSecundario: { src: "/logos/iae-positivo.png", alt: "IAE Business School", width: 382, height: 285 },
      url: "https://www.iae.edu.ar/programas/competencia-naves/",
    },
    {
      titulo: "Winners of “Vos Lo Hacés” · Buenos Aires City Government",
      texto: "Selected from more than 160 applicants. 2025",
      logo: { src: "/logos/vos-lo-haces-positivo.png", alt: "Vos Lo Hacés", width: 1874, height: 396 },
      logoSecundario: { src: "/logos/gcba-badge.png", alt: "Buenos Aires City Government", width: 184, height: 64 },
      url: "https://buenosaires.gob.ar/gcaba_historico/desarrolloeconomico",
    },
  ] satisfies Badge[],
};

// ---------------------------------------------------------------------------
// BLOQUE 8 — CIERRE Y FORMULARIO
// ---------------------------------------------------------------------------
export const contacto = {
  kicker: "CONTACT",
  titulo: "Let's talk.",
  popup: { cerrar: "Close" },
  bajada:
    "Leave your details and we'll get in touch to tell you more about the material and how it can fit into your project.",
  campos: [
    { name: "nombre", label: "First name", placeholder: "Your first name", type: "text", autoComplete: "given-name" },
    { name: "apellido", label: "Last name", placeholder: "Your last name", type: "text", autoComplete: "family-name" },
    { name: "empresa", label: "Company", placeholder: "Studio or company", type: "text", autoComplete: "organization" },
    {
      name: "whatsapp",
      label: "WhatsApp",
      placeholder: "+1 555 123 4567",
      type: "tel",
      autoComplete: "tel",
      inputMode: "tel",
      valorInicial: "+",
    },
    { name: "mail", label: "Email", placeholder: "name@company.com", type: "email", autoComplete: "email", inputMode: "email" },
  ] satisfies Campo[],
  boton: "I want to know the material",
  privacidad: "We only use your details to answer your inquiry.",
  exito: (nombre: string) => `Thank you, ${nombre}! We received your details. We'll be in touch soon.`,
  errores: {
    vacio: "Please fill in this field.",
    whatsapp: "Enter the number with its country code.",
    mail: "Please check the email format.",
    envio: "We couldn't send your details. Please try again in a few minutes.",
  },
  mailAlternativo: undefined as string | undefined,
  pie: "© 2026",
  firma: { texto: "Web design:", nombre: "Lautaro Mendez", url: "https://www.lautaromendez.com.ar" },
  datos: {
    direccion: { titulo: "Office", lineas: ["Autonomous City of Buenos Aires"] },
    contacto: { titulo: "Contact" },
    redes: { titulo: "Social" },
  },
};
