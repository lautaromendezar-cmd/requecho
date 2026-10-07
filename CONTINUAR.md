# Dónde quedamos (7-oct-2026, noche)

**Estado:** llegó la **devolución final** y se está aplicando de a un cambio. **Cambio 1
(hero) hecho y en vivo** (commit 1aa9e3c): segundo párrafo, fotos en fundido en lugar de la
foto fija (las 8 fotos del video `../modificaciones07102026/`, en `public/images/hero/`,
componente `sections/hero/HeroFotos.tsx`, encuadre por foto en `hero.imagenes[].posicion`),
selector ESP / ENG, íconos de mail, WhatsApp, Instagram y LinkedIn en amarillo y los datos
reales del pie (`src/content/canales.ts`). Capturas del hero y el pie con
`node scripts/capturas-hero.mjs` (con `URL=https://requecho.vercel.app` mira el vivo).
**Sigue el cambio 2 de la devolución final.**

## Antes de tocar nada (en cualquier PC)

1. `git pull` (todo está en `main`; el push a `main` deploya solo en Vercel).
2. `npm install` sólo si cambió `package.json`.
3. **Las fotos fuente NO están en el repo** (`.gitignore`): `fotos-nuevas/` (Drive de las
   clientas) y `material-del-cliente/marca-2026-10/` (manual de marca), las dos dentro de
   `landing/`. Están en la PC de la oficina y desde el 7-oct también en la de casa. Sólo hacen
   falta para volver a correr `scripts/preparar-fotos-nuevas.py`, `scripts/extraer-logo.py`
   o `scripts/emparejar-logos.py`; el sitio usa lo procesado en `public/`.
   - Ojo: al correr `preparar-fotos-nuevas.py` en la PC de casa, `productos/manos-hiedra.jpg`
     sale distinta de la publicada (el original del Drive no es el mismo). Se dejó la
     publicada: si el script la toca, `git checkout` de ese archivo.

## Lo que se hizo

- **6-oct (oficina):** manual de marca (logo e isologo oficiales, Montserrat + Archivo
  Condensed en legales, esquinas casi rectas), recorrido más corto, fotos verticales a 4:3,
  versión en inglés en `/en`, y devoluciones de las secciones 1 a 5.
- **6/7-oct (casa):**
  6. Fundadoras: foto de las dos riéndose (4:5) y un retrato 4:3 de cada una.
  7. Reconocimientos: ClimateLaunchpad, IAE y Vos Lo Hacés pasados a positivo (todos sobre
     blanco) y cada badge enlaza a su programa.
  8. Contacto: título a `text-h2` y pop-up con el mismo formulario
     (`contacto/ContactoPopup.tsx`, tiempos en `src/config/popup.ts`).
  - Pie con letra a la escala del sitio.
  - Por cuenta de Lautaro: firma "Diseño web: Lautaro Mendez" bajo el pie, Aplicaciones en
    dos columnas y más aire para el selector de idioma en mobile.

## Pendiente de las clientas

- PDF de la ficha técnica en ES y EN (el botón tiene `href="#"`).
- Cierre de la frase del badge de ClimateLaunchpad.
- Que validen los textos en inglés.
- El resto, en `PENDIENTES.md` (formulario a Sheets antes de publicar, pop-up y SEO, etc.).

## Cómo veníamos trabajando

Lautaro pasa la devolución de a una sección; por cada una: cambio → capturas en escritorio y
mobile → commit → push → verificar en vivo. Con el pop-up activo, para capturar hay que
marcar `rq_popup_cerrado` en localStorage, o tapa la página.
