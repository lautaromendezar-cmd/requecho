# Prepara las imágenes del cliente para public/.
#
# Uso:  python scripts/preparar-imagenes.py
#
# Lee de material-del-cliente/imagenes-drive/ (carpeta ignorada por git) y escribe
# copias limpias (sin EXIF, orientadas, recomprimidas) en public/images/, los logos de
# los reconocimientos en public/logos/. La imagen de Open Graph sale de generar-og.py.
# Cuando lleguen los originales en alta, alcanza con reemplazar los archivos fuente en
# el diccionario FUENTES y volver a correr el script.

import os
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
DRIVE = RAIZ / "material-del-cliente" / "imagenes-drive"
PROD = DRIVE / "Producto"
SALIDA = RAIZ / "public" / "images"
LOGOS = RAIZ / "public" / "logos"
SALIDA.mkdir(parents=True, exist_ok=True)
LOGOS.mkdir(parents=True, exist_ok=True)

# nombre público -> archivo fuente (prefijo suficiente para identificarlo)
FUENTES = {
    "hero-paneles.jpg": "B3347103",        # #118 mano con abanico de tres paneles
    "producto-mostaza.jpg": "A3C9D3B0",    # #107 paneles contra la puerta amarilla
    "galeria-01.jpg": "3883F1FD",          # #044 blanco, durazno, azul, negro de pie
    "galeria-02.jpg": "4B0D653F",          # #053 tres paneles apilados
    "galeria-03.jpg": "AB183DEC",          # #113 cuatro paneles de pie (apaisada)
    "galeria-04.jpg": "CD9D485C",          # #139 cinco paneles de canto (apaisada)
    "galeria-05.jpg": "FD686BE2",          # #164 cuatro paneles en fila
    "galeria-06.jpg": "C5FEFD08",          # #128 cenital de tres paneles
    "galeria-07.jpg": "E571B72E",          # #152 pila sobre mesa blanca
}
FUNDADORAS = DRIVE / "Founders" / "1747138824542.jpeg"
CENITAL = "C5FEFD08"  # de acá salen la macro de textura y la pieza del bloque 5


def abrir(prefijo: str) -> Image.Image:
    candidatos = sorted(PROD.glob(prefijo + "*"))
    if not candidatos:
        sys.exit(f"No encontré la fuente {prefijo} en {PROD}")
    im = Image.open(candidatos[0])
    return ImageOps.exif_transpose(im).convert("RGB")


def guardar(im: Image.Image, nombre: str, calidad: int = 86) -> None:
    destino = SALIDA / nombre
    im.save(destino, "JPEG", quality=calidad, optimize=True, progressive=True)
    print(f"{nombre:24s} {im.width}x{im.height}  {destino.stat().st_size // 1024} KB")


def calentar(im: Image.Image) -> Image.Image:
    """Lleva el gris frío de la pared hacia el warm light de la marca.

    Retoque leve y global: un poco más de rojo, un poco menos de azul, apenas más de
    contraste. Las manos y los paneles se mueven en la misma dirección y no se nota.
    """
    a = np.asarray(im).astype(np.float32)
    a[..., 0] *= 1.025
    a[..., 1] *= 1.006
    a[..., 2] *= 0.962
    a = (a - 128) * 1.04 + 128
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def cajas_paneles(im: Image.Image, umbral: int = 165) -> list[tuple[int, int, int, int]]:
    """Encuentra las cajas de los paneles oscuros sobre fondo claro (cenital)."""
    g = np.asarray(im.convert("L"))
    oscuro = g < umbral
    filas = oscuro.mean(axis=1) > 0.12
    cajas = []
    y = 0
    while y < len(filas):
        if filas[y]:
            y0 = y
            while y < len(filas) and filas[y]:
                y += 1
            y1 = y
            if y1 - y0 > 60:
                cols = oscuro[y0:y1].mean(axis=0) > 0.3
                xs = np.where(cols)[0]
                cajas.append((int(xs.min()), y0, int(xs.max()), y1))
        y += 1
    return cajas


def main() -> None:
    for nombre, prefijo in FUENTES.items():
        im = abrir(prefijo)
        if nombre == "hero-paneles.jpg":
            im = calentar(im)
        guardar(im, nombre, 88 if nombre.startswith("hero") else 84)

    # Fundadoras
    f = ImageOps.exif_transpose(Image.open(FUNDADORAS)).convert("RGB")
    guardar(f, "fundadoras.jpg", 84)

    # Recortes de la cenital: textura macro (panel del medio) y pieza (panel de abajo)
    cen = abrir(CENITAL)
    cajas = cajas_paneles(cen)
    print("cajas cenital:", cajas)
    if len(cajas) >= 3:
        x0, y0, x1, y1 = cajas[1]
        m = 6
        guardar(cen.crop((x0 + m, y0 + m, x1 - m, y1 - m)), "textura-macro.jpg", 90)
        # (panel-pieza.jpg ya no se usa: la comparativa del bloque 5 se sacó)
    else:
        print("ATENCIÓN: no encontré los tres paneles en la cenital, revisar umbral")

    # Logos de reconocimientos (solo copia, sin retocar)
    iso = DRIVE / "Isologos - Reconocimientos"
    copias = {
        "climatelaunchpad.png": "logo climate lunchpad .png",
        "naves.png": "Logo Naves .png",
        "iae.png": "logo.png",
        "vos-lo-haces.png": "Vos los haces.png",
        "gcba.jpg": "logo-gcba.jpg",
    }
    for destino, fuente in copias.items():
        im = Image.open(iso / fuente)
        if destino.endswith(".png"):
            im.save(LOGOS / destino, "PNG", optimize=True)
        else:
            im.convert("RGB").save(LOGOS / destino, "JPEG", quality=90)
        print(f"logos/{destino:22s} {im.width}x{im.height}")

    # La imagen de Open Graph la arma scripts/generar-og.py (usa hero-paneles.jpg).
    print("ahora: python scripts/generar-og.py")


if __name__ == "__main__":
    main()
