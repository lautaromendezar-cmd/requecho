"""
Carrusel "Nuestro material aplicado a productos" (bloque 3).

Lee la selección de producto que mandaron las clientas (fotos-nuevas/, fuera del
repo), recorta cada foto a cuadrado alrededor de su punto de interés y escribe
JPG livianos en public/images/productos/. Next/Image genera después los tamaños.

Quedaron afuera las casi repetidas de la carpeta: la 2.ª toma de la mano contra
la puerta amarilla, el disco amarillo apaisado (está el vertical), el par de
marcos azules (está el marco índigo solo), los dos discos en ocho (no entran
en un cuadrado) y el collage de muestras sobre blanco (igual al de fondo gris).

Uso:  python scripts/preparar-carrusel.py
"""
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "fotos-nuevas" / "Producto" / "Producto - Selección"
DESTINO = RAIZ / "public" / "images" / "productos"
# Todas al mismo lado (la más chica de la selección mide 938): el contenido las
# declara 940 x 940.
LADO = 940

# (archivo de origen, nombre de salida, foco x, foco y) — foco en 0..1
SELECCION = [
    ("ChatGPT Image Oct 6, 2026, 01_33_27 AM.png", "puerta-amarilla", 0.47, 0.5),
    ("Framed Indigo Textile Grid.png", "cuadro-indigo", 0.5, 0.5),
    ("Hands Displaying Recycled Fiber Insulation Blocks.png", "manos-bloques", 0.5, 0.45),
    ("Recycled Textile Panels in Sunlit Ivy.png", "paneles-hiedra", 0.5, 0.58),
    ("Recycled Textile Fiber Discs.png", "discos", 0.5, 0.5),
    ("8a6da843-cefd-4fc9-80e5-bd0c1cc88fe4.png", "paneles-puerta", 0.5, 0.5),
    ("Framed Recycled Textile Mosaic.png", "cuadro-mosaico", 0.5, 0.5),
    ("ChatGPT Image Oct 6, 2026, 01_28_46 AM.png", "jean-y-muestras", 0.5, 0.42),
    ("Textured Fiber Disk on Yellow Wall.png", "disco-amarillo", 0.5, 0.5),
    ("Recycled Textile Panels in Ivy Courtyard.png", "manos-hiedra", 0.5, 0.5),
    ("Sunlit Recycled Fiber Art Panel.png", "cuadro-patio", 0.55, 0.5),
    ("Textured Recycled Fiber Swatches.png", "muestras", 0.5, 0.45),
]


def recorte_cuadrado(im: Image.Image, fx: float, fy: float) -> Image.Image:
    lado = min(im.width, im.height)
    x = round(min(max(im.width * fx - lado / 2, 0), im.width - lado))
    y = round(min(max(im.height * fy - lado / 2, 0), im.height - lado))
    return im.crop((x, y, x + lado, y + lado))


def main():
    DESTINO.mkdir(parents=True, exist_ok=True)
    for archivo, nombre, fx, fy in SELECCION:
        im = ImageOps.exif_transpose(Image.open(ORIGEN / archivo)).convert("RGB")
        im = recorte_cuadrado(im, fx, fy)
        im = im.resize((LADO, LADO), Image.LANCZOS)
        salida = DESTINO / f"{nombre}.jpg"
        im.save(salida, "JPEG", quality=84, optimize=True, progressive=True)
        print(f"productos/{nombre}.jpg  {im.width}x{im.height}  {salida.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
