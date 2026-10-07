"""Recorta el aire que traen los logos oficiales.

Los archivos que mandaron las clientas traen cada uno su propio margen: NAVES y
el de la Ciudad casi la mitad del cuadro, IAE apenas nada. Con el margen adentro
del archivo no hay forma de que se vean parejos en el badge.

Esto deja sólo el dibujo, en `<nombre>-badge.png`, sin tocar los originales.

Tres llegaron en versión "bloque" (el dibujo claro sobre un rectángulo de color):
ClimateLaunchpad, IAE y Vos Lo Hacés. Para fondo blanco se pasan a positivo: el
bloque se vuelve transparente y el dibujo toma el color del bloque, con el
antialias convertido en alfa. Salen en `<nombre>-positivo.png`.
Quien los empareja después es Reconocimientos.tsx, que le da a cada uno el ancho
que iguala su área.

    python scripts/emparejar-logos.py
"""

from pathlib import Path

import numpy as np
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
LOGOS = RAIZ / "public" / "logos"

TOLERANCIA = 12  # cuánto puede variar el color de fondo al recortar

FUENTES = ["naves.png", "gcba.jpg"]

# Logos en bloque: (color del bloque, color del dibujo). El dibujo pasa a pintarse
# con el color del bloque.
POSITIVO = {
    "climatelaunchpad.png": ((29, 73, 56), (226, 231, 111)),
    "iae.png": ((30, 34, 170), (254, 254, 254)),
    "vos-lo-haces.png": ((1, 52, 78), (252, 252, 252)),
}


def positivo(img: Image.Image, bloque: tuple, dibujo: tuple) -> Image.Image:
    """El bloque se vuelve transparente y el dibujo toma su color.

    Sólo dentro de la caja del bloque (filas casi enteras opacas): IAE trae
    debajo "UNIVERSIDAD AUSTRAL" ya en positivo y del mismo azul, y eso queda
    como está.
    """
    a = np.asarray(img.convert("RGBA")).astype(np.float64)
    opacas = (a[..., 3] > 250).mean(axis=1) > 0.9
    filas = np.flatnonzero(opacas)
    # Dos filas de más de cada lado: el borde suavizado del bloque, si no, queda
    # como una línea fina.
    arr, aba = max(filas[0] - 2, 0), min(filas[-1] + 3, a.shape[0])

    b, d = np.array(bloque, float), np.array(dibujo, float)
    eje = d - b
    t = ((a[arr:aba, :, :3] - b) @ eje) / (eje @ eje)
    # El bloque no es de un color perfectamente parejo: lo que apenas se aparta
    # es ruido, no dibujo (si no, el recorte toma el cuadro entero).
    t = np.clip((t - 0.06) / 0.94, 0, 1)

    out = a.copy()
    out[arr:aba, :, :3] = b
    out[arr:aba, :, 3] = t * a[arr:aba, :, 3]
    return Image.fromarray(out.round().astype(np.uint8), "RGBA")


def recorte(img: Image.Image) -> Image.Image:
    """Caja del contenido real: por alfa si lo hay, si no por color de borde."""
    rgba = img.convert("RGBA")
    alfa = rgba.getchannel("A")
    if alfa.getextrema()[0] < 250:
        caja = alfa.getbbox()
        return rgba.crop(caja) if caja else rgba

    fondo = rgba.getpixel((0, 0))[:3]
    ancho, alto = rgba.size
    pixel = rgba.load()

    def es_fondo(x: int, y: int) -> bool:
        p = pixel[x, y]
        return all(abs(p[i] - fondo[i]) <= TOLERANCIA for i in range(3))

    izq, der, arr, aba = 0, ancho - 1, 0, alto - 1
    while izq < der and all(es_fondo(izq, y) for y in range(alto)):
        izq += 1
    while der > izq and all(es_fondo(der, y) for y in range(alto)):
        der -= 1
    while arr < aba and all(es_fondo(x, arr) for x in range(ancho)):
        arr += 1
    while aba > arr and all(es_fondo(x, aba) for x in range(ancho)):
        aba -= 1
    return rgba.crop((izq, arr, der + 1, aba + 1))


def emparejar(nombre: str) -> None:
    origen = LOGOS / nombre
    logo = recorte(Image.open(origen))
    ancho, alto = logo.size

    destino = LOGOS / f"{origen.stem}-badge.png"
    logo.save(destino, "PNG", optimize=True)
    original = Image.open(origen).size
    print(f"{nombre}: {original[0]}x{original[1]} -> {ancho}x{alto}  (width: {ancho}, height: {alto})")


# Sin el bloque, el margen de abajo de IAE deja "UNIVERSIDAD AUSTRAL" suelta,
# lejos del resto: los huecos horizontales se acortan a este alto (px).
HUECO_MAXIMO = {"iae.png": 34}


def acortar_huecos(img: Image.Image, maximo: int) -> Image.Image:
    a = np.asarray(img)
    llenas = (a[..., 3] > 8).any(axis=1)
    quedan, vacias = [], 0
    for y, llena in enumerate(llenas):
        vacias = 0 if llena else vacias + 1
        if vacias <= maximo:
            quedan.append(y)
    return Image.fromarray(a[quedan], "RGBA")


def pasar_a_positivo(nombre: str) -> None:
    origen = LOGOS / nombre
    logo = recorte(positivo(Image.open(origen), *POSITIVO[nombre]))
    if nombre in HUECO_MAXIMO:
        logo = acortar_huecos(logo, HUECO_MAXIMO[nombre])
    destino = LOGOS / f"{origen.stem}-positivo.png"
    logo.save(destino, "PNG", optimize=True)
    print(f"{nombre}: positivo {logo.width}x{logo.height}  (width: {logo.width}, height: {logo.height})")


if __name__ == "__main__":
    for nombre in FUENTES:
        emparejar(nombre)
    for nombre in POSITIVO:
        pasar_a_positivo(nombre)
