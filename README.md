# Requecho — landing

Landing de una sola página, ocho bloques en el orden del documento de estructura:
Hero · Problema · Producto · Cómo funciona · Por qué Requecho · Fundadoras ·
Reconocimientos · Cierre y formulario.

Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + GSAP 3.15 con
`@gsap/react` (ScrollTrigger, SplitText, DrawSVG, Draggable, Inertia) + Lenis + zod.
Deploy en Vercel.

## Correr

```bash
npm install
cp .env.example .env.local      # opcional; sin LEADS_WEBHOOK_URL el formulario loguea a consola
npm run dev                     # http://localhost:3000
npm run build && npm start      # producción local
```

## Cambiar colores

Un solo archivo: `src/styles/tokens.css`. Los colores son variables semánticas
(`--color-bg`, `--color-surface`, `--color-accent`, `--color-accent-line`, `--color-text`,
`--color-text-strong`, `--color-inverse-bg`, `--color-inverse-text` y unas pocas más).
Tailwind las consume vía `@theme` y las expone como utilidades (`bg-accent`, `text-text-strong`).
No hay ningún hex fuera de ese archivo. Al final hay un bloque comentado con la paleta del
documento de estructura: descomentarlo pisa la del manual y sirve para comparar.

## Cambiar tipografías

Un solo archivo: `src/lib/fonts.ts`. Hoy `displayFont` y `bodyFont` son la misma Lato
(300/400/700/900). Para separarlas, declarar otra fuente de `next/font` y asignarla a una
de las dos: el CSS las lee como `--font-display` y `--font-body` y no hay que tocar nada más.
La escala tipográfica (`--text-display`, `--text-h2`, `--text-stat`…) vive en `tokens.css`.

## Movimiento

`src/config/motion.ts` concentra flags y tiempos:

- `smoothScroll`: Lenis. Se apaga solo con `prefers-reduced-motion`.
- `pinProcess`: el bloque 4 se pinea con scrub en desktop. En `false`, la línea se dibuja
  igual pero la sección no se queda quieta.
- `lens`: lupa de textura del bloque 3.

Todo el movimiento respeta `prefers-reduced-motion` con `gsap.matchMedia()` (sin conteos,
sin scrub, sin parallax) y se simplifica en mobile. Sólo se animan `transform`, `opacity`
y `clip-path`. Nada queda oculto si el JS no corre: los reveals tienen un respaldo en CSS
que muestra todo a los 2,5 segundos.

## Contenido

Todo el copy está tipado en `src/content/landing.ts`, literal del documento de estructura.
Los `[DATO A CONFIRMAR]` son campos opcionales: si faltan, el elemento no se renderiza.
La lista de lo que falta está en `PENDIENTES.md`.

## Formulario

Cinco campos, validación con zod compartida entre navegador y servidor, honeypot sin
CAPTCHA, UTM, y `POST /api/lead` que manda la fila como JSON a `LEADS_WEBHOOK_URL`.
Las recetas para Google Sheets (Apps Script) y Excel en OneDrive (Power Automate) están
en `docs/formulario.md`. Sin la variable, en desarrollo loguea a consola y en producción
responde con el mensaje de falla: nunca un éxito falso.

Prueba de punta a punta contra un receptor local:

```bash
node scripts/prueba-formulario.mjs
```

## Imágenes y logo

- `scripts/preparar-imagenes.py` lee `material-del-cliente/` (fuera del repo) y escribe las
  copias optimizadas en `public/images/` y `public/logos/`, más `public/og.jpg`. Cuando
  lleguen los originales en alta, actualizar las fuentes ahí y volver a correrlo.
- `scripts/trazar-logo.py` vectoriza el isologo desde el raster de la portada del folleto.
  Es un trazado fiel, no una recreación tipográfica; se reemplaza cuando llegue el original.
- El sistema de íconos es propio: `src/components/ui/icon-glyphs.ts` (trazos en grilla de 24)
  y `<Icon>` los dibuja con DrawSVG y les da una microanimación al hover/tap.

## Verificación

```bash
node scripts/capturas.mjs        # 375, 768 y 1440 px, con y sin movimiento → capturas/
```

El script levanta `next start`, saca capturas del hero y de la página completa, y avisa si
quedó algún elemento con opacidad 0, overflow horizontal, más de un h1 o errores de consola.

## Estado del deploy de revisión (20-sep-2026)

- **Producción:** https://requecho.vercel.app (proyecto `requecho`, cuenta `lautaromendezar-5992`,
  scope `lautaro-mendez-s-projects`). Con `noindex` en metadata y cabecera.
- **Formulario en vivo:** `LEADS_WEBHOOK_URL` apunta a un receptor descartable de webhook.site
  (`https://webhook.site/#!/view/309d4536-378c-4fb8-8dda-690b4cbe9711`), que **vence el
  27-sep-2026** y acepta hasta 100 envíos. Sirve para que las clientas prueben el formulario
  y vean llegar la fila; antes de publicar hay que reemplazarlo por la receta de Sheets o
  OneDrive de `docs/formulario.md`.
- **Lighthouse mobile sobre Vercel (mediana de 3):** rendimiento 86 (rango 85–89),
  accesibilidad 100, buenas prácticas 100, SEO 63 por el `noindex` (100 con
  `NEXT_PUBLIC_SITE_LIVE=true`, verificado en local). El único freno del rendimiento es el
  LCP simulado (3,2–3,7 s): el LCP observado es de 0,3 a 2,3 s, pero el modelo de red de
  Lighthouse reparte el ancho de banda entre la foto del hero y los ~310 KB de JS que trae el
  stack (React, GSAP con ScrollTrigger y SplitText, Lenis). Draggable e Inertia ya se cargan
  aparte, sólo con la galería. Para llegar a 90 habría que sacar del arranque otros
  60–80 KB: apagar Lenis (`smoothScroll: false`) y diferir SplitText son los dos candidatos.
- **Repo:** `github.com/lautaromendezar-cmd/requecho`, rama `main`, un commit por bloque.
  El deploy automático por push no funciona mientras la cuenta de GitHub siga marcada:
  se publica con `vercel deploy --prod` desde esta carpeta.

## Deploy

Variables de entorno en Vercel:

| Variable | Uso |
|---|---|
| `LEADS_WEBHOOK_URL` | destino de los envíos del formulario |
| `NEXT_PUBLIC_SITE_URL` | URL pública, para Open Graph absoluto |
| `NEXT_PUBLIC_SITE_LIVE` | `true` para quitar el `noindex` |

Publicar con `vercel deploy --prod` desde esta carpeta. Mientras `NEXT_PUBLIC_SITE_LIVE` no
sea `true`, la página lleva `noindex` en metadata y en la cabecera `X-Robots-Tag`.

## Estructura

```
src/app/            layout, page, api/lead, iconos
src/components/     sections/ (los 8 bloques), ui/ (Icon, Kicker, Placeholder), brand/ (Logo), motion/
src/content/        landing.ts (todo el copy)
src/config/         motion.ts (flags y tiempos)
src/lib/            fonts.ts, gsap.ts, leads/ (schema, store)
src/styles/         tokens.css
docs/               formulario.md
scripts/            preparar-imagenes.py, trazar-logo.py, capturas.mjs, prueba-formulario.mjs, webhook-prueba.mjs
```
