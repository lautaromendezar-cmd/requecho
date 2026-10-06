"""
Imagen de Open Graph (public/og.jpg, 1200x630): fondo claro de la paleta, logo
oficial a la izquierda y la foto del hero a la derecha.

Necesita public/images/hero-paneles.jpg (lo escribe preparar-imagenes.py) y
public/brand/requecho.svg (lo escribe extraer-logo.py). El SVG se rasteriza con
Playwright para no sumar dependencias de dibujo vectorial.

Uso:  python scripts/generar-og.py
"""
from io import BytesIO
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parent.parent
ANCHO, ALTO = 1200, 630
FONDO = (241, 241, 239)
LOGO_ANCHO = 380


def logo_png(ancho):
    svg = (RAIZ / "public/brand/requecho.svg").read_text(encoding="utf-8")
    svg = svg.replace("<svg ", f'<svg width="{ancho}" ', 1)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": ancho, "height": ancho}, device_scale_factor=1)
        pg.set_content(f'<body style="margin:0;background:transparent">{svg}')
        png = pg.locator("svg").screenshot(omit_background=True)
        b.close()
    return Image.open(BytesIO(png)).convert("RGBA")


def main():
    og = Image.new("RGB", (ANCHO, ALTO), FONDO)
    foto = Image.open(RAIZ / "public/images/hero-paneles.jpg")
    foto = foto.resize((int(foto.width * ALTO / foto.height), ALTO), Image.LANCZOS)
    og.paste(foto, (ANCHO - foto.width, 0))

    logo = logo_png(LOGO_ANCHO)
    izquierda = ANCHO - foto.width
    og.paste(logo, ((izquierda - logo.width) // 2, (ALTO - logo.height) // 2), logo)
    og.save(RAIZ / "public/og.jpg", "JPEG", quality=86, optimize=True)
    print(f"og.jpg {ANCHO}x{ALTO}")


if __name__ == "__main__":
    main()
