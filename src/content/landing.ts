// =============================================================================
// CONTENIDO DE LA LANDING
//
// Todo el copy vive acá, tipado y separado de los componentes. Los textos son los
// finales del "Documento de estructura y textos [ESP]" y van literales: no se
// reescriben, resumen ni corrigen. Lo marcado [DATO A CONFIRMAR] en el documento
// se modela como campo opcional: si falta, el elemento no se renderiza.
// Ver PENDIENTES.md para la lista completa de lo que falta o hay que validar.
// =============================================================================
import type { IconName } from "@/components/ui/icon-glyphs";

export type Imagen = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Foto del hero: `posicion` es el object-position dentro del recuadro. */
export type ImagenHero = Imagen & { posicion: string };

export type Cifra = {
  prefijo?: string;
  valor: number;
  sufijo?: string;
  unidad?: string;
  texto: string;
  /** Las cifras no se publican sin su fuente: si falta, la cifra se oculta. */
  fuente?: string;
  icono: IconName;
};

/** Datos del idioma: formato de números, etiqueta del selector y Open Graph. */
export const idioma = {
  htmlLang: "es-AR",
  locale: "es-AR",
  ogLocale: "es_AR",
  /** Cómo se nombra este idioma en el selector ES / EN. */
  corto: "ESP",
  nombre: "Español",
};

/** Textos de interfaz que no están en el documento (accesibilidad y avisos). */
export const ui = {
  selectorIdioma: "Idioma",
  galeria: "Fotos del material",
  fotoAnterior: "Foto anterior",
  fotoSiguiente: "Foto siguiente",
  canales: "Contacto y redes",
};

export const meta = {
  title: "Requecho | Paneles hechos con descarte textil",
  // Versión limpia de la descripción del documento, que traía un error de tipeo
  // ("preconsumol") y una frase duplicada. Pendiente de validación con las clientas.
  description:
    "Transformamos descarte textil preconsumo en paneles con propiedades acústicas y térmicas para arquitectura, interiorismo y diseño.",
  ogAlt:
    "Isologo de Requecho junto a una mano que sostiene tres paneles de descarte textil de distintos colores.",
};

// ---------------------------------------------------------------------------
// BLOQUE 1 — HERO
// ---------------------------------------------------------------------------
export const hero = {
  logo: "REQUECHO",
  titulo: "Del descarte al material. Del material a nuevos espacios.",
  subtitulo:
    "Recuperamos textiles preconsumo y los convertimos en paneles de revestimiento con identidad única y propiedades acústicas y térmicas, y comportamiento frente al fuego.",
  /** Segundo párrafo (devolución final, 7-oct-2026). */
  subtitulo2:
    "Requecho trabaja en ese punto de encuentro: recuperamos descarte de la industria textil y lo transformamos en un nuevo material para arquitectura e interiorismo.",
  /**
   * Fotos que se suceden con un fundido (devolución final, 7-oct-2026: reemplazan
   * a la foto fija). Salen del video de producto de las clientas, que son 8 fotos
   * fijas. `posicion` es el object-position: las fotos son 9:16 y el recuadro no.
   */
  imagenes: [
    { src: "/images/hero/hero-1.jpg", alt: "Tres paneles Requecho apoyados contra una pared clara, entre hojas de hiedra: uno rosado, uno oscuro jaspeado y uno azul.", width: 1280, height: 2276, posicion: "50% 70%" },
    { src: "/images/hero/hero-2.jpg", alt: "Una pared revestida con paneles Requecho azules, detrás de un sillón claro y una planta.", width: 1280, height: 2276, posicion: "50% 78%" },
    { src: "/images/hero/hero-3.jpg", alt: "Dos paneles Requecho grises y azules apoyados sobre un piso de madera, contra una pared amarilla.", width: 1280, height: 2276, posicion: "50% 50%" },
    { src: "/images/hero/hero-4.jpg", alt: "Una pieza ovalada de material Requecho, gris y blanca, colgada de una correa de cuero.", width: 1280, height: 2276, posicion: "50% 42%" },
    { src: "/images/hero/hero-5.jpg", alt: "Una mano sostiene recortes de jean junto a muestras de paneles Requecho.", width: 1280, height: 2276, posicion: "50% 45%" },
    { src: "/images/hero/hero-6.jpg", alt: "Una mesa baja verde hecha con material Requecho sobre un fondo rosado.", width: 1280, height: 2276, posicion: "50% 52%" },
    { src: "/images/hero/hero-7.jpg", alt: "Una pila de paneles Requecho de colores, fucsia, celeste, crema y gris, sobre una mesa de madera.", width: 1280, height: 2276, posicion: "50% 50%" },
    { src: "/images/hero/hero-8.jpg", alt: "Una pared revestida con paneles Requecho azul jaspeado y dos banquetas verdes adelante.", width: 1280, height: 2276, posicion: "50% 85%" },
  ] satisfies ImagenHero[],
};

// ---------------------------------------------------------------------------
// BLOQUE 2 — PROBLEMA
// ---------------------------------------------------------------------------
export const problema = {
  kicker: "EL PROBLEMA",
  titulo: "La industria textil descarta toneladas de material que pueden convertirse en recurso.",
  bajada:
    "Gran parte del material que sobra durante la producción textil pierde su valor y se convierte en descarte. Al mismo tiempo, la arquitectura y el interiorismo necesitan incorporar materiales con menor impacto y nuevas prestaciones.",
  cifras: [
    {
      prefijo: "+",
      valor: 92,
      unidad: "millones",
      texto: "de toneladas de residuos textiles por año en el mundo.",
      fuente: "UNEP, 2025.",
      icono: "textil",
    },
    {
      prefijo: "≈ ",
      valor: 500000,
      unidad: "toneladas",
      texto: "por año en Argentina. La mayor parte termina enterrada, incinerada o sin trazabilidad.",
      fuente: "Ministerio de Ambiente PBA, 2025.",
      icono: "tijera",
    },
    {
      prefijo: "+",
      valor: 40,
      sufijo: "%",
      texto: "de los materiales que se extraen en el mundo los consume la construcción.",
      fuente: "UNEP / GlobalABC, 2026.",
      icono: "construccion",
    },
  ] satisfies Cifra[],
  /** Foto junto a las cifras (devolución final, 7-oct-2026). */
  imagen: { src: "/images/problema-secado.jpg", alt: "Paneles Requecho recién prensados secándose en fila sobre una rejilla de madera: azules de jean y claros con hilos de colores.", width: 1024, height: 1536 } as Imagen | undefined,
};

// ---------------------------------------------------------------------------
// BLOQUE 3 — PRODUCTO
// ---------------------------------------------------------------------------
export type Propiedad = {
  id: string;
  titulo: string;
  icono: IconName;
  datoLabel?: string;
  dato?: string;
  texto?: string;
  norma?: string;
  nota?: string;
  /** Sólo valores del documento. Sirve para la barra de rango de la acústica. */
  rango?: { min: number; max: number; escalaMax: number };
  referencias?: { titulo: string; items: string[] };
};

export const producto = {
  kicker: "EL MATERIAL",
  titulo: "Un nuevo material para transformar los espacios.",
  bajada:
    "Paneles para revestimientos interiores que combinan diseño, textura y desempeño. Cada pieza tiene una identidad propia y se integra al espacio como parte de su lenguaje.",
  cuerpo:
    "Trabajamos el color, las combinaciones y los dégradés según cada proyecto. La textura, las fibras y las variaciones de cada pieza forman parte de una estética que no busca uniformidad, sino carácter.",
  propiedadesTitulo: "Propiedades y desempeño",
  propiedades: [
    {
      id: "acustica",
      titulo: "Acústica",
      icono: "sonido",
      datoLabel: "Absorción sonora:",
      dato: "α = 0,51–0,70",
      texto: "Contribuye a reducir la reverberación y mejorar el confort acústico de los espacios.",
      norma: "ISO 10534-2",
      rango: { min: 0.51, max: 0.7, escalaMax: 1 },
    },
    {
      id: "termica",
      titulo: "Térmica",
      icono: "termometro",
      datoLabel: "Conductividad térmica:",
      dato: "λ ≈ 0,085 W/mK",
      texto: "Su baja conductividad contribuye al aislamiento y al confort térmico interior.",
    },
    {
      id: "fuego",
      titulo: "Comportamiento frente al fuego",
      icono: "llama",
      dato: "Requecho — Norma IRAM 11910 · objetivo RE2 (ensayo en Argentina en proceso)",
      referencias: {
        titulo: "Referencias internacionales en materiales comparables:",
        items: ["Europa — C-s1,d0 · EN 13501-1", "Francia — M2 · NF P92-501", "EE.UU. — Clase B · ASTM E84-26"],
      },
    },
    {
      id: "emisiones",
      titulo: "Emisiones",
      icono: "emisiones",
      texto: "Bajas emisiones de compuestos orgánicos volátiles (VOC).",
      nota: "Certificación en proceso.",
    },
  ] satisfies Propiedad[],
  aplicacionesTitulo: "Aplicaciones",
  aplicaciones: [
    "Revestimientos de muros interiores",
    "Paneles acústicos",
    "Mobiliario y objetos de diseño",
    "Desarrollos especiales",
  ],
  fichaTitulo: "Características",
  /** PDF de la ficha técnica en el Drive de las clientas; el inglés tiene el suyo. Sin url, el botón no se muestra. */
  fichaTecnica: {
    texto: "Descargar ficha técnica",
    formato: "PDF",
    url: "https://drive.google.com/file/d/1vOEZoSydxOj_zLFp_lsWYz45wP09iFVA/view" as string | undefined,
  },
  ficha: [
    ["Composición", "Textiles triturados + aglutinante de base biológica"],
    ["Medida", "20 × 10 × 2,5 cm"],
    ["Uso", "Interior, no estructural"],
    ["Rendimiento", "50 paneles = 1 m²"],
    ["Material recuperado", "≈ 7,5 kg de descarte textil recuperado por m²"],
  ] as [string, string][],
  imagenPrincipal: {
    src: "/images/producto-mostaza.jpg",
    alt: "Una mano sostiene dos paneles Requecho, uno claro y uno gris jaspeado, contra una puerta pintada de amarillo.",
    width: 768,
    height: 1024,
  } satisfies Imagen,
  galeriaTitulo: "Nuestro material aplicado a productos",
  /** Carrusel en cuadrado (scripts/preparar-carrusel.py). */
  galeria: [
    { src: "/images/productos/puerta-amarilla.jpg", alt: "Una mano sostiene dos paneles Requecho en tonos azules y blancos contra una puerta pintada de amarillo.", width: 940, height: 940 },
    { src: "/images/productos/cuadro-indigo.jpg", alt: "Cuadro con marco de madera armado con ocho paneles Requecho en azul índigo.", width: 940, height: 940 },
    { src: "/images/productos/manos-bloques.jpg", alt: "Dos manos muestran paneles Requecho en azul oscuro y uno claro con fibras rojas y naranjas.", width: 940, height: 940 },
    { src: "/images/productos/paneles-hiedra.jpg", alt: "Paneles Requecho azul, negro y claro con fibras de colores apoyados junto a una hiedra.", width: 940, height: 940 },
    { src: "/images/productos/discos.jpg", alt: "Discos de material Requecho con fibras grises, azules y rojas, amontonados.", width: 940, height: 940 },
    { src: "/images/productos/paneles-puerta.jpg", alt: "Dos paneles Requecho azul jaspeado apoyados contra una puerta amarilla.", width: 940, height: 940 },
    { src: "/images/productos/cuadro-mosaico.jpg", alt: "Cuadro con marco de madera con paneles Requecho en mosaico de azul y crema.", width: 940, height: 940 },
    { src: "/images/productos/jean-y-muestras.jpg", alt: "Recortes de jean en un frasco de vidrio junto a muestras Requecho: el descarte y el material terminado.", width: 940, height: 940 },
    { src: "/images/productos/disco-amarillo.jpg", alt: "Disco Requecho en negro y crema sobre una pared amarilla.", width: 940, height: 940 },
    { src: "/images/productos/manos-hiedra.jpg", alt: "Manos que despliegan en abanico paneles Requecho en distintos tonos de azul, en un patio con hiedra.", width: 940, height: 940 },
    { src: "/images/productos/cuadro-patio.jpg", alt: "Cuadro de paneles Requecho azul y crema con marco de madera, al sol en un patio con plantas.", width: 940, height: 940 },
    { src: "/images/productos/muestras.jpg", alt: "Muestras Requecho vistas desde arriba: un disco crema y negro, un panel oscuro y uno claro con fibras rojas.", width: 940, height: 940 },
  ] satisfies Imagen[],
};

// ---------------------------------------------------------------------------
// BLOQUE 4 — CÓMO FUNCIONA
// ---------------------------------------------------------------------------
export type Paso = {
  numero: string;
  titulo: string;
  texto: string;
  icono: IconName;
  /** [ASSET pendiente] foto real de la etapa. Opcional. */
  foto?: Imagen;
};

export const proceso = {
  titulo: "Cómo lo hacemos.",
  bajada:
    "Desarrollamos un proceso que nos permite recuperar el descarte, conservar su valor material y transformarlo en una nueva pieza.",
  pasos: [
    {
      numero: "01",
      titulo: "Recuperamos",
      texto: "Recibimos descartes textiles preconsumo provenientes principalmente de mesas de corte.",
      icono: "recuperar",
    },
    {
      numero: "02",
      titulo: "Clasificamos",
      texto: "Los separamos y organizamos según composición, color y características del material.",
      icono: "clasificar",
    },
    {
      numero: "03",
      titulo: "Trituramos y formulamos",
      texto: "Desmenuzamos las fibras y las combinamos con nuestro sistema aglutinante de base biológica.",
      icono: "triturar",
    },
    {
      numero: "04",
      titulo: "Prensamos",
      texto: "Damos forma, densidad y espesor a cada panel.",
      icono: "prensar",
    },
    {
      numero: "05",
      titulo: "Secamos",
      texto: "El material completa su proceso de secado y estabilización antes de convertirse en producto.",
      icono: "secar",
    },
  ] as Paso[],
};

// ---------------------------------------------------------------------------
// BLOQUE 5 — POR QUÉ REQUECHO
// ---------------------------------------------------------------------------
export const porQue = {
  kicker: "POR QUÉ REQUECHO",
  titulo: "Circularidad, desempeño y diseño.",
  bajada:
    "Donde una solución convencional necesita varias capas, Requecho integra desempeño acústico y térmico con terminación visible en un solo material.",
  diferenciales: [
    {
      titulo: "Material recuperado",
      texto: "Cada m² permite recuperar aproximadamente 7,5 kg de descarte textil preconsumo.",
      icono: "ciclo",
      imagen: { src: "/images/diferenciales/material-recuperado.jpg", alt: "Manos que sostienen un puñado de descarte textil triturado, la materia prima de Requecho.", width: 960, height: 720 },
    },
    {
      titulo: "Diseño para cada espacio",
      texto:
        "Trabajamos colores, combinaciones y degradés junto con arquitectos y diseñadores para integrar el material al proyecto.",
      icono: "diseno",
      imagen: { src: "/images/diferenciales/diseno.jpg", alt: "Pieza circular de Requecho en negro y crema colgada sobre una puerta amarilla.", width: 960, height: 720 },
    },
    {
      titulo: "Propiedades funcionales",
      texto: "El mismo material aporta terminación visible, absorción acústica y comportamiento térmico.",
      icono: "capas",
      imagen: { src: "/images/diferenciales/propiedades.jpg", alt: "Paneles Requecho gruesos secándose sobre una rejilla: se ven el espesor y la densidad de las fibras.", width: 960, height: 720 },
    },
    {
      titulo: "Identidad material",
      texto:
        "Las fibras, texturas y variaciones propias del material forman parte de la expresión final de cada pieza.",
      icono: "huella",
      imagen: { src: "/images/diferenciales/identidad.jpg", alt: "Primer plano de la superficie de una pieza Requecho: fibras claras con hilos de colores y un recorte rosa.", width: 960, height: 720 },
    },
  ] satisfies { titulo: string; texto: string; icono: IconName; imagen: Imagen }[],
};

// ---------------------------------------------------------------------------
// BLOQUE 6 — FUNDADORAS
// ---------------------------------------------------------------------------
export type Fundadora = {
  nombre: string;
  rol: string;
  bio: string;
  /** Cita en primera persona, hasta 20 palabras. Todavía no existe: slot oculto. */
  cita?: string;
  /** Retrato individual, 4:3. Sin retrato, la card muestra un placeholder. */
  retrato?: Imagen;
  /** Perfil de LinkedIn: ícono a la izquierda del nombre. */
  linkedin?: string;
};

export const fundadoras = {
  kicker: "FUNDADORAS",
  titulo: "Requecho nació de conocer la industria desde adentro.",
  apertura: [
    "Somos Luciana Sabsay y Verónica Litvinoff. Nos conocimos estudiando Diseño de Indumentaria en la UBA y llevamos más de veinte años trabajando en diferentes áreas de la industria textil.",
    "Durante años vimos repetirse la misma escena: recortes, sobrantes y materiales que perdían su valor apenas terminaba la producción. Requecho nació de una pregunta concreta: ¿qué pasaría si en lugar de tratar ese material como residuo pudiéramos volver a diseñar con él?",
  ],
  foto: {
    src: "/images/fundadoras/juntas-riendo.jpg",
    alt: "Verónica Litvinoff y Luciana Sabsay se miran y se ríen frente a una pared blanca: Verónica sostiene un puñado de recortes textiles y Luciana dos paneles de Requecho.",
    width: 940,
    height: 1175,
    /** [DATO A CONFIRMAR: quién es quién en la foto]. Sin dato, no hay epígrafe. */
    epigrafe: undefined as string | undefined,
  },
  cards: [
    {
      nombre: "Luciana Sabsay",
      linkedin: "https://www.linkedin.com/in/luciana-sabsay-738aa013",
      rol: "Cofundadora · Negocio y Comercial",
      retrato: {
        src: "/images/fundadoras/luciana.jpg",
        alt: "Retrato de Luciana Sabsay, sonriente, con camisa floral frente a una pared blanca.",
        width: 960,
        height: 720,
      },
      bio: "Diseñadora de Indumentaria (UBA), con especialización en Comunicación y Marketing. Más de veinte años de experiencia en producción textil, desarrollo de negocios y gestión de proveedores y talleres. Durante doce años lideró la producción de ADA Collection para mercados internacionales. Hoy es además consultora en sustentabilidad textil.",
    },
    {
      nombre: "Verónica Litvinoff",
      linkedin: "https://www.linkedin.com/in/veronica-litvinoff-87007512a",
      rol: "Cofundadora · Producto y Operaciones",
      retrato: {
        src: "/images/fundadoras/veronica.jpg",
        alt: "Retrato de Verónica Litvinoff, sonriente, con camisa celeste estampada frente a una pared blanca.",
        width: 960,
        height: 720,
      },
      bio: "Diseñadora de Indumentaria (UBA), especializada en producto, biomateriales e innovación textil, con formación en Sociología del Diseño. Más de veinte años de experiencia en desarrollo de producto y producción, desde la selección de materias primas hasta el trabajo con talleres y procesos industriales.",
    },
  ] as Fundadora[],
};

// ---------------------------------------------------------------------------
// BLOQUE 7 — RECONOCIMIENTOS
// ---------------------------------------------------------------------------
export type Badge = {
  titulo: string;
  texto: string;
  logo: Imagen;
  logoSecundario?: Imagen;
  /** Página del programa. Los atajos de cada organización apuntan a la edición vigente. */
  url: string;
};

export const reconocimientos = {
  kicker: "RECONOCIMIENTOS",
  /** Para lectores de pantalla: el enlace abre otra pestaña. */
  pestanaNueva: "(se abre en una pestaña nueva)",
  badges: [
    {
      titulo: "Semifinalista Regional 2026 · ClimateLaunchpad",
      // El documento trae la frase cortada ("...como una de las dos iniciativas de
      // América"). Se publica hasta "en octubre de 2026"; falta el cierre.
      texto: "Representamos a la Argentina en la Final Global de Singapur, en octubre de 2026.",
      logo: { src: "/logos/climatelaunchpad-positivo.png", alt: "ClimateLaunchpad", width: 351, height: 153 },
      url: "https://climatelaunchpad.org/",
    },
    {
      titulo: "Semifinalistas · NAVES, IAE Business School",
      texto: "En la competencia de emprendimientos del IAE Business School. 2025",
      logo: { src: "/logos/naves-badge.png", alt: "NAVES", width: 506, height: 370 },
      logoSecundario: { src: "/logos/iae-positivo.png", alt: "IAE Business School", width: 382, height: 285 },
      url: "https://www.iae.edu.ar/programas/competencia-naves/",
    },
    {
      titulo: "Ganadoras de “Vos Lo Hacés” · Gobierno de la Ciudad de Buenos Aires",
      texto: "Proyecto elegido entre más de 160 postulantes. 2025",
      logo: { src: "/logos/vos-lo-haces-positivo.png", alt: "Vos Lo Hacés", width: 1874, height: 396 },
      logoSecundario: { src: "/logos/gcba-badge.png", alt: "Gobierno de la Ciudad de Buenos Aires", width: 184, height: 64 },
      url: "https://buenosaires.gob.ar/gcaba_historico/desarrolloeconomico",
    },
  ] satisfies Badge[],
};

// ---------------------------------------------------------------------------
// BLOQUE 8 — CIERRE Y FORMULARIO
// ---------------------------------------------------------------------------
export type Campo = {
  name: "nombre" | "apellido" | "empresa" | "whatsapp" | "mail";
  label: string;
  placeholder: string;
  type: "text" | "tel" | "email";
  autoComplete: string;
  inputMode?: "tel" | "email" | "text";
  valorInicial?: string;
};

export const contacto = {
  kicker: "CONTACTO",
  titulo: "Hablemos.",
  /** Pop-up de contacto: mismo formulario, abre al entrar (src/config/popup.ts). */
  popup: { cerrar: "Cerrar" },
  bajada:
    "Dejanos tus datos y te contactamos para contarte más sobre el material y ver cómo puede sumarse a tu proyecto.",
  campos: [
    { name: "nombre", label: "Nombre", placeholder: "Tu nombre", type: "text", autoComplete: "given-name" },
    { name: "apellido", label: "Apellido", placeholder: "Tu apellido", type: "text", autoComplete: "family-name" },
    { name: "empresa", label: "Empresa", placeholder: "Estudio o empresa", type: "text", autoComplete: "organization" },
    {
      name: "whatsapp",
      label: "WhatsApp",
      placeholder: "+54 9 11 1234 5678",
      type: "tel",
      autoComplete: "tel",
      inputMode: "tel",
      valorInicial: "+54",
    },
    { name: "mail", label: "Mail", placeholder: "nombre@empresa.com", type: "email", autoComplete: "email", inputMode: "email" },
  ] satisfies Campo[],
  boton: "Quiero conocer el material",
  // [SUGERENCIA] del documento, alternativa al botón:
  // boton: "Hablemos de tu proyecto",
  /** [DATO A CONFIRMAR: validar texto legal]. Se publica el texto del documento. */
  privacidad: "Usamos tus datos solo para responder tu consulta.",
  exito: (nombre: string) => `¡Gracias, ${nombre}! Recibimos tus datos. Te vamos a escribir pronto.`,
  errores: {
    vacio: "Completá este campo.",
    whatsapp: "Ingresá el número con código de país.",
    mail: "Revisá el formato del mail.",
    envio: "No pudimos enviar tus datos. Probá de nuevo en unos minutos.",
  },
  /** [DATO A CONFIRMAR: mail de contacto alternativo]. Se sumaría al mensaje de falla. */
  mailAlternativo: undefined as string | undefined,
  pie: "© 2026",
  /** Barra de firma debajo del pie. */
  firma: { texto: "Diseño web:", nombre: "Lautaro Mendez", url: "https://www.lautaromendez.com.ar" },
  /** Datos reales del pie (devolución final, 7-oct-2026). Mail, WhatsApp y redes salen de canales.ts. */
  datos: {
    direccion: { titulo: "Oficina", lineas: ["Ciudad Autónoma de Buenos Aires"] },
    contacto: { titulo: "Contacto" },
    redes: { titulo: "Redes" },
  },
};
