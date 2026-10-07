# Pendientes

Lo que falta o hay que validar con las clientas antes de publicar, agrupado por bloque.
Regla del documento de estructura: ningún `[DATO A CONFIRMAR]` se publica hasta
resolverse. En el código son campos opcionales de `src/content/landing.ts`: cuando el
dato llega, se completa el campo y el elemento aparece solo. Lo marcado **se publica,
validar** es texto que existe en el documento pero tiene una nota de validación.

## Identidad visual

- [x] **Logo e isologo oficiales** (manual de marca, oct. 2026). Se extraen en vector del
  Guideline con `scripts/extraer-logo.py`: hero (versión principal), pie (negativa),
  favicon, ícono de Apple y OG (isologo / logo).
- [x] **Tipografías del manual**: Montserrat (títulos ExtraBold, subtítulos Bold, párrafos
  Regular) y Archivo Condensed en legales (fuentes de las cifras, privacidad, pie).
- [x] **Paleta.** La principal del manual ya era la del sitio. Los tres secundarios
  aprobados (verde, celeste, violeta) quedaron como tokens, sin uso. El PDF trae errores de
  tipeo en los hex del negro y del claro; se tomaron los valores de las muestras.
- [x] **Esquinas casi rectas** (2–4 px) en fotos, cards, campos, botón y badges, para
  acompañar las escuadras del logo.
- [ ] **Fotos originales en alta.** Las 158 fotos de producto que llegaron por Drive son
  miniaturas exportadas de Fotos (119 de 360×480 y 35 de 768×1024). Se construyó con
  las 35 grandes. Con los originales, reemplazar las fuentes en
  `scripts/preparar-imagenes.py` y volver a correrlo. Afecta hero, producto, galería,
  macro de textura y la pieza del bloque 5.

## Versión en inglés (/en)

- [ ] **Validar la traducción.** `src/content/landing.en.ts` es un borrador hecho por
  nosotros a partir del texto en español; las clientas tienen que revisarlo antes de
  publicar. Puntos a mirar en particular: "personas de la diversidad" se tradujo como
  "LGBTQ+ people"; "Vos Lo Hacés" queda en castellano (es el nombre del programa); la
  fuente "Ministerio de Ambiente PBA" se expandió a "Ministry of Environment, Buenos
  Aires Province".
- [ ] **Regla de los dos archivos:** cualquier dato a confirmar que llegue se carga en
  `landing.ts` y en `landing.en.ts`. El tipo obliga a que tengan los mismos campos.
- [ ] El formulario en inglés arranca el WhatsApp en "+" (sin código de país fijo) y
  manda `idioma: "en"` para que los mensajes de error vuelvan en inglés. El Excel de
  destino no tiene columna de idioma: si la quieren, se suma.

## Metadatos

- [ ] **Descripción (se publica, validar).** El documento trae un error de tipeo
  ("preconsumol") y una frase duplicada ("capacidades acústicas, térmicas y propiedades
  acústicas y térmicas"). Se publica esta versión limpia: *"Transformamos descarte
  textil preconsumo en paneles con propiedades acústicas y térmicas para arquitectura,
  interiorismo y diseño."*

## Bloque 1 — Hero

- [ ] **Foto** `[ASSET pendiente]`: mano sosteniendo paneles de distintos colores sobre
  fondo crema. Se usa la toma sobre pared clara (`B3347103`), con el fondo apenas
  calentado hacia el warm light de la marca. Confirmar o mandar la toma sobre crema.

## Bloque 2 — Problema

- [ ] **Fuentes de las tres cifras.** El copy las trae (UNEP, 2025 · Ministerio de
  Ambiente PBA, 2025 · UNEP / GlobalABC, 2026) pero el microcopy las marca como dato a
  confirmar. Se publican como capción debajo de cada cifra, en ese orden. Confirmar.
  Si alguna se quita del contenido, su cifra deja de mostrarse (no se publican sin fuente).

## Bloque 3 — Producto

- [ ] **Panel sobre fondo mostaza** `[ASSET pendiente]`: se usa la toma contra la puerta
  amarilla (`A3C9D3B0`). Confirmar o mandar la toma de estudio.
- [ ] **Macro de textura**: recorte de la cenital `C5FEFD08` (395 px). La lupa está
  limitada a 1,5×; con el original en alta se puede subir.
- [x] **Carrusel "Nuestro material aplicado a productos"** (devolución oct. 2026): 12 fotos
  cuadradas de `fotos-nuevas/Producto` (recorte con foco por foto en
  `scripts/preparar-carrusel.py`). Se dejaron afuera las casi repetidas; ver el script.
- [ ] **Links a la ficha técnica (PDF en Drive), uno en español y otro en inglés.** El
  botón "Descargar ficha técnica" está debajo de la ficha breve con `url: "#"` provisorio
  (se ve pero no descarga nada): reemplazar `producto.fichaTecnica.url` en `landing.ts` y
  en `landing.en.ts`. El link de
  Drive tiene que estar compartido como "cualquier persona con el enlace".
- [ ] **"dégradés" / "degradés".** El documento acentúa distinto en el bloque 3 y en el 5.
  Se publica cada uno tal cual está. ¿Unificar?

## Bloque 4 — Cómo funciona

- [ ] **Fotos reales de cada etapa** (opcional, `[ASSET pendiente]`). Cada paso tiene el
  campo `foto` listo.
- [x] **Pin con scrub en desktop**: apagado (`pinProcess: false`) por la devolución de
  oct. 2026 (espacio vacío al bajar). La línea y los pasos se activan igual con el scroll.

## Bloque 5 — Por qué Requecho

- [x] **Comparativa de capas: se sacó** (devolución oct. 2026: no se entendía y repetía
  las palabras de la bajada). Los cuatro diferenciales la reemplazan, cada uno con su
  foto de `fotos-nuevas/` (recortes en `scripts/preparar-fotos-nuevas.py`).
- [ ] **Fondo grafito** (el "segundo escenario" de la guía). Si prefieren todo claro,
  quitar la clase `surface-inverse` en `PorQue.tsx`.

## Bloque 6 — Fundadoras

- [ ] **Foto de Lu y Vero con el material en la mano** `[ASSET pendiente]`: no está. Se usa
  la única foto de las dos solas (`Founders/1747138824542.jpeg`), sin material. Las dos
  fotos de eventos incluyen a una tercera persona y no se usan.
- [ ] **Quién es quién en la foto**: sin dato no hay epígrafe (campo `foto.epigrafe`).
- [ ] **Retratos individuales en situación de trabajo** `[ASSET pendiente]`: placeholders
  del sistema (campo `retrato` en cada card).
- [ ] **Citas en primera persona** (una frase, hasta 20 palabras): el slot está en las
  cards y oculto (campo `cita`).

## Bloque 7 — Reconocimientos

- [ ] **Texto del badge 1 cortado** en el documento ("…en octubre de 2026, como una de las
  dos iniciativas de América"). Se publica hasta "en octubre de 2026." con punto final.
  Falta el cierre de la frase.
- [ ] **Logos oficiales**: se usan los archivos de la carpeta (PNG/JPG chicos). Pedir SVG
  o PNG grandes. NAVES e IAE van juntos en el badge 2; "vos lo hacés" y BA en el 3.
  `scripts/emparejar-logos.py` les recorta el margen propio y escribe los `-badge.png`
  que consume el bloque (ClimateLaunchpad, IAE y Vos Lo Hacés venían en bloque de color
  y el script los pasa a positivo, en `-positivo.png`, por la devolución del 6-oct: todos
  sobre blanco); con archivos nuevos, se vuelve a correr y se actualizan las
  medidas en `landing.ts` (las imprime el script). El tamaño con que se ve cada uno lo
  calcula `Reconocimientos.tsx` igualando áreas: no hace falta tocarlo.
- [ ] Después de la Final Global (octubre 2026), actualizar el texto del badge 1.

## Bloque 8 — Cierre y formulario

- [ ] **Pop-up de contacto al entrar** (pedido de las clientas, 7-oct): antes de publicar
  con `NEXT_PUBLIC_SITE_LIVE=true`, ver que no castigue el SEO en mobile (Google penaliza
  las ventanas que tapan el contenido apenas se llega desde el buscador). Si hace falta,
  subir `retrasoMs` o apagarlo en mobile desde `src/config/popup.ts`.

- [ ] **Excel de destino**: archivo, cuenta, responsable y si llega aviso por mail. Las dos
  recetas (Google Sheets y OneDrive) están en `docs/formulario.md`. Hasta definirlo, el
  deploy de revisión apunta a un receptor descartable de webhook.site que **vence el
  27-sep-2026** (ver README): sirve para probar, no para operar. Cuando venza, el
  formulario en vivo responde con el mensaje de falla hasta que se cargue el destino real.
- [ ] **Texto legal de la privacidad (se publica, validar)**: "Usamos tus datos solo para
  responder tu consulta."
- [ ] **Mail de contacto alternativo** para el mensaje de falla (campo `mailAlternativo`).
- [x] **Datos del pie** (7-oct-2026): "Ciudad Autónoma de Buenos Aires", dos WhatsApp,
  info@requecho.com, Instagram y LinkedIn. Viven en `src/content/canales.ts` y los usan el pie
  y los íconos del encabezado del hero. Ya no hay datos de ejemplo ni bandera `ejemplo`.
- [ ] **Muestras físicas** (punto 7 de datos a confirmar, cortado en el documento; se refiere
  a este bloque): si se pueden ofrecer, sumarlas a la bajada y al botón.
- [ ] **Botón**: "Quiero conocer el material". La alternativa del documento ("Hablemos de tu
  proyecto") quedó comentada en `landing.ts`.

## Publicación

- [ ] El sitio se sirve con `noindex` (metadata y cabecera) hasta que `NEXT_PUBLIC_SITE_LIVE`
  sea `true` en Vercel. No publicar con datos pendientes.
- [ ] Dominio y hosting no están incluidos en el alcance.
- [ ] Confirmar que el repo `lautaromendezar-cmd/requecho` sea privado (ya tiene `main`
  pusheado).
- [ ] Lighthouse mobile: rendimiento 86–89 sobre Vercel (objetivo 90). Ver el README para la
  causa y las dos palancas disponibles.
