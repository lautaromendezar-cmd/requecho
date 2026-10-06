// =============================================================================
// CONTENIDO EN INGLÉS (/en)
//
// Traducción de landing.ts, misma forma campo por campo (el tipo lo controla
// src/content/index.ts). Es un BORRADOR: lo tienen que validar las clientas antes
// de publicar. Rutas de imágenes, medidas y datos opcionales son los mismos que en
// español: si un dato a confirmar llega, se carga en los dos archivos.
// =============================================================================
import type { Badge, Campo, Cifra, Fundadora, Imagen, Paso, Propiedad } from "./landing";
import type { IconName } from "@/components/ui/icon-glyphs";

export const idioma = {
  htmlLang: "en",
  locale: "en-US",
  ogLocale: "en_US",
  corto: "EN",
  nombre: "English",
};

export const ui = {
  selectorIdioma: "Language",
  galeria: "Photos of the material",
  fotoAnterior: "Previous photo",
  fotoSiguiente: "Next photo",
  datosEjemplo: "Sample details, pending the final ones.",
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
  imagen: {
    src: "/images/hero-paneles.jpg",
    alt: "A hand fans out three Requecho panels in different colors — one light, one speckled grey and one dark — against a pale wall.",
    width: 768,
    height: 1024,
  } satisfies Imagen,
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
  puente:
    "Requecho works right at that intersection: we recover waste from the textile industry and transform it into a new material for architecture and interior design.",
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
  propiedades: [
    {
      id: "acustica",
      titulo: "Acoustic",
      icono: "sonido",
      datoLabel: "Sound absorption:",
      dato: "α = 0.51–0.70",
      texto: "Helps reduce reverberation and improve acoustic comfort in interiors.",
      norma: "ISO 10534-2",
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
      dato: "Requecho — IRAM 11910 standard · RE2 target (testing in Argentina underway)",
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
      nota: "Certification in progress.",
    },
  ] satisfies Propiedad[],
  aplicacionesTitulo: "Applications",
  aplicaciones: ["Interior wall cladding", "Acoustic panels", "Furniture and design objects", "Custom developments"],
  fichaTitulo: "Quick specs",
  fichaTecnica: {
    texto: "Download technical data sheet",
    formato: "PDF",
    // "#" provisorio para que se vea el botón; reemplazar por el link de Drive.
    url: "#" as string | undefined,
  },
  ficha: [
    ["Composition", "Shredded textiles + bio-based binder"],
    ["Size", "20 × 10 × 2.5 cm"],
    ["Use", "Interior, non-structural"],
    ["Coverage", "50 panels = 1 m²"],
    ["Recovered material", "≈ 7.5 kg of textile waste recovered per m²"],
  ] as [string, string][],
  imagenPrincipal: {
    src: "/images/producto-mostaza.jpg",
    alt: "A hand holds two Requecho panels, one light and one speckled grey, against a door painted yellow.",
    width: 768,
    height: 1024,
  } satisfies Imagen,
  textura: {
    src: "/images/textura-macro.jpg",
    alt: "Close-up of a Requecho panel surface: pressed white and grey textile fibers with dark streaks.",
    width: 395,
    height: 206,
  } satisfies Imagen,
  galeria: [
    {
      src: "/images/galeria-01.jpg",
      alt: "Four Requecho panels standing upright — white, peach, dark blue and black — on a white table.",
      width: 768,
      height: 1024,
    },
    {
      src: "/images/galeria-02.jpg",
      alt: "Three stacked Requecho panels, white, peach and black, seen from the edge.",
      width: 768,
      height: 1024,
    },
    {
      src: "/images/galeria-03.jpg",
      alt: "Four Requecho panels standing in a row, from white to speckled grey, on a wooden surface.",
      width: 1024,
      height: 768,
    },
    {
      src: "/images/galeria-04.jpg",
      alt: "Five Requecho panels leaning on their edges at different angles on a wooden board.",
      width: 1024,
      height: 768,
    },
    {
      src: "/images/galeria-05.jpg",
      alt: "Four Requecho panels in a row showing their texture variations, from light to dark.",
      width: 768,
      height: 1024,
    },
    {
      src: "/images/galeria-06.jpg",
      alt: "Three Requecho panels seen from above, each with a different mix of light and dark fibers.",
      width: 768,
      height: 1024,
    },
    {
      src: "/images/galeria-07.jpg",
      alt: "A stack of grey Requecho panels on a white table.",
      width: 768,
      height: 1024,
    },
  ] satisfies Imagen[],
};

// ---------------------------------------------------------------------------
// BLOQUE 4 — CÓMO FUNCIONA
// ---------------------------------------------------------------------------
export const proceso = {
  titulo: "HOW WE DO IT",
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
  remate: "What starts as a textile offcut returns to the production cycle as a new material.",
  imagenRemate: {
    src: "/images/proceso-panel.jpg",
    alt: "Finished Requecho panels standing on a white table: white, peach, dark blue and black.",
    width: 768,
    height: 1024,
  } satisfies Imagen,
};

// ---------------------------------------------------------------------------
// BLOQUE 5 — POR QUÉ REQUECHO
// ---------------------------------------------------------------------------
export const porQue = {
  kicker: "WHY REQUECHO",
  titulo: "Circularity, performance and design",
  bajada:
    "Where a conventional solution needs several layers, Requecho combines acoustic and thermal performance with a visible finish in a single material.",
  diferencialesTitulo: "What sets us apart",
  diferenciales: [
    {
      titulo: "Recovered material",
      texto: "Each m² recovers approximately 7.5 kg of pre-consumer textile waste.",
      icono: "ciclo",
    },
    {
      titulo: "Design for every space",
      texto:
        "We work on colors, combinations and gradients together with architects and designers to integrate the material into the project.",
      icono: "diseno",
    },
    {
      titulo: "Functional properties",
      texto: "The same material provides a visible finish, sound absorption and thermal performance.",
      icono: "capas",
    },
    {
      titulo: "Material identity",
      texto: "The material's own fibers, textures and variations are part of the final expression of each piece.",
      icono: "huella",
    },
  ] satisfies { titulo: string; texto: string; icono: IconName }[],
  comparativa: {
    titulo: "Side by side",
    convencional: {
      titulo: "Conventional solution",
      capas: ["Acoustic/thermal insulation", "structure", "covering", "finish"],
    },
    requecho: {
      titulo: "Requecho",
      texto: "A single visible piece that combines finish + performance",
      imagen: {
        src: "/images/panel-pieza.jpg",
        alt: "A Requecho panel seen from the front: grey and white textile fibers pressed into a single piece.",
        width: 421,
        height: 243,
      } satisfies Imagen,
    },
  },
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
  complementariedad:
    "Today we bring those two experiences together to build Requecho. Luciana leads business, commercial development and communication. Verónica leads product, production and textile recovery.",
  foto: {
    src: "/images/fundadoras.jpg",
    alt: "Luciana Sabsay and Verónica Litvinoff, smiling and back to back, in front of an exposed brick wall.",
    width: 1280,
    height: 1597,
    epigrafe: undefined as string | undefined,
  },
  cards: [
    {
      nombre: "Luciana Sabsay",
      rol: "Co-founder · Business & Sales",
      bio: "Fashion designer (UBA) specialized in Communication and Marketing. More than twenty years of experience in textile production, business development and supplier and workshop management. For twelve years she led production at ADA Collection for international markets. She is also a textile sustainability consultant.",
    },
    {
      nombre: "Verónica Litvinoff",
      rol: "Co-founder · Product & Operations",
      bio: "Fashion designer (UBA) specialized in product, biomaterials and textile innovation, with training in the Sociology of Design. More than twenty years of experience in product development and production, from raw-material selection to working with workshops and industrial processes.",
    },
  ] as Fundadora[],
  impacto: [
    "A women-led project, with a model designed to create jobs focused on women and LGBTQ+ people in vulnerable situations.",
    "Two different paths within the same industry, now converging on one goal: turning textile waste into a resource.",
  ],
};

// ---------------------------------------------------------------------------
// BLOQUE 7 — RECONOCIMIENTOS
// ---------------------------------------------------------------------------
export const reconocimientos = {
  kicker: "RECOGNITION",
  badges: [
    {
      titulo: "Regional Semifinalist 2026 · ClimateLaunchpad",
      texto: "We represent Argentina at the Global Final in Singapore, in October 2026.",
      logo: { src: "/logos/climatelaunchpad-badge.png", alt: "ClimateLaunchpad", width: 352, height: 153 },
    },
    {
      titulo: "Semifinalists · NAVES, IAE Business School",
      texto: "In the IAE Business School startup competition. 2025",
      logo: { src: "/logos/naves-badge.png", alt: "NAVES", width: 506, height: 370 },
      logoSecundario: { src: "/logos/iae-badge.png", alt: "IAE Business School", width: 386, height: 432 },
    },
    {
      titulo: "Winners of “Vos Lo Hacés” · Buenos Aires City Government",
      texto: "Selected from more than 160 applicants. 2025",
      logo: { src: "/logos/vos-lo-haces-badge.png", alt: "Vos Lo Hacés", width: 1874, height: 398 },
      logoSecundario: { src: "/logos/gcba-badge.png", alt: "Buenos Aires City Government", width: 184, height: 64 },
    },
  ] satisfies Badge[],
};

// ---------------------------------------------------------------------------
// BLOQUE 8 — CIERRE Y FORMULARIO
// ---------------------------------------------------------------------------
export const contacto = {
  kicker: "CONTACT",
  titulo: "Let's talk",
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
  redes: undefined as { nombre: string; url: string }[] | undefined,
  datos: {
    ejemplo: true,
    direccion: { titulo: "Office", lineas: ["Av. Ejemplo 1234, 5th floor", "C1000 · Buenos Aires, Argentina"] },
    contacto: {
      titulo: "Contact",
      telefono: { texto: "+54 9 11 0000 0000", href: "tel:+5491100000000" },
      mail: { texto: "hola@requecho.com", href: "mailto:hola@requecho.com" },
    },
    redes: {
      titulo: "Social",
      items: [
        { nombre: "Instagram", url: "https://instagram.com/requecho" },
        { nombre: "LinkedIn", url: "https://linkedin.com/company/requecho" },
      ],
    },
  },
};
