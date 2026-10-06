"""
Fotos nuevas de las clientas (fotos-nuevas/, fuera del repo), recortadas con un
punto de interés por foto y guardadas como JPG livianos. Next/Image genera
después los tamaños.

  - Carrusel "Nuestro material aplicado a productos" (bloque 3): cuadradas, en
    public/images/productos/.
  - Diferenciales (bloque 5): 4:3, una por tema, en public/images/diferenciales/.
  - Fundadoras (bloque 6): juntas y una de cada una, 4:3, en public/images/fundadoras/.

Quedaron afuera las casi repetidas de la carpeta: la 2.ª toma de la mano contra
la puerta amarilla, el disco amarillo apaisado (está el vertical), el par de
marcos azules (está el marco índigo solo), los dos discos en ocho (no entran
en un cuadrado) y el collage de muestras sobre blanco (igual al de fondo gris).

Uso:  python scripts/preparar-fotos-nuevas.py
"""
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
FOTOS = RAIZ / "fotos-nuevas"
ORIGEN = FOTOS / "Producto" / "Producto - Selección"
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


# Diferenciales: (ruta dentro de fotos-nuevas, salida, foco x, foco y, zoom).
# zoom > 1 recorta más cerca del foco (p. ej. las manos y no el retrato entero).
DIFERENCIALES = [
    ("Veronica/Veronica (Selección)/Vero con desperdicio textil.png", "material-recuperado", 0.4, 0.62, 1.55),
    ("Producto/Producto - Selección/Textured Black and Cream Disk on Yellow Door.png", "diseno", 0.5, 0.5, 1.0),
    ("Secado/Secado - Selección/secado seleccion.png", "propiedades", 0.5, 0.55, 1.0),
    ("Secado/Secado - Selección/Copia de 20260925_105321.jpg", "identidad", 0.5, 0.27, 1.0),
]
DIF_DESTINO = RAIZ / "public" / "images" / "diferenciales"
DIF_ANCHO, DIF_ALTO = 960, 720

# Fundadoras (bloque 6): la foto juntas y un retrato de cada una (las de las
# carpetas "Principales"), todas 4:3. (ruta, salida, foco x, foco y, ancho)
FUNDADORAS = [
    ("Juntas/Juntas - Selección/Lu y vero con muestras.png", "juntas", 0.5, 0.5, 1280),
    ("Luciana/Luciana - Selección/Luciana - Principales/Lu Portrait i.png", "luciana", 0.5, 0.36, 960),
    ("Veronica/Veronica (Selección)/Veronica - Principales/VERO  Portrait.png", "veronica", 0.5, 0.24, 960),
]
FUN_DESTINO = RAIZ / "public" / "images" / "fundadoras"


def recorte(im: Image.Image, fx: float, fy: float, ratio: float = 1.0, zoom: float = 1.0) -> Image.Image:
    """Recorte de proporción ancho/alto `ratio`, lo más grande posible (÷ zoom)."""
    w = min(im.width, im.height * ratio) / zoom
    h = w / ratio
    x = min(max(im.width * fx - w / 2, 0), im.width - w)
    y = min(max(im.height * fy - h / 2, 0), im.height - h)
    return im.crop((round(x), round(y), round(x + w), round(y + h)))


def recorte_cuadrado(im: Image.Image, fx: float, fy: float) -> Image.Image:
    return recorte(im, fx, fy)


def main():
    DESTINO.mkdir(parents=True, exist_ok=True)
    for archivo, nombre, fx, fy in SELECCION:
        im = ImageOps.exif_transpose(Image.open(ORIGEN / archivo)).convert("RGB")
        im = recorte_cuadrado(im, fx, fy)
        im = im.resize((LADO, LADO), Image.LANCZOS)
        salida = DESTINO / f"{nombre}.jpg"
        im.save(salida, "JPEG", quality=84, optimize=True, progressive=True)
        print(f"productos/{nombre}.jpg  {im.width}x{im.height}  {salida.stat().st_size // 1024} KB")

    DIF_DESTINO.mkdir(parents=True, exist_ok=True)
    for ruta, nombre, fx, fy, zoom in DIFERENCIALES:
        im = ImageOps.exif_transpose(Image.open(FOTOS / ruta)).convert("RGB")
        im = recorte(im, fx, fy, DIF_ANCHO / DIF_ALTO, zoom).resize((DIF_ANCHO, DIF_ALTO), Image.LANCZOS)
        salida = DIF_DESTINO / f"{nombre}.jpg"
        im.save(salida, "JPEG", quality=84, optimize=True, progressive=True)
        print(f"diferenciales/{nombre}.jpg  {im.width}x{im.height}  {salida.stat().st_size // 1024} KB")

    FUN_DESTINO.mkdir(parents=True, exist_ok=True)
    for ruta, nombre, fx, fy, ancho in FUNDADORAS:
        im = ImageOps.exif_transpose(Image.open(FOTOS / ruta)).convert("RGB")
        im = recorte(im, fx, fy, 4 / 3).resize((ancho, ancho * 3 // 4), Image.LANCZOS)
        salida = FUN_DESTINO / f"{nombre}.jpg"
        im.save(salida, "JPEG", quality=84, optimize=True, progressive=True)
        print(f"fundadoras/{nombre}.jpg  {im.width}x{im.height}  {salida.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
