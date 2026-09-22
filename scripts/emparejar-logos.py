"""Recorta el aire que traen los logos oficiales.

Los archivos que mandaron las clientas traen cada uno su propio margen: NAVES y
el de la Ciudad casi la mitad del cuadro, IAE apenas nada. Con el margen adentro
del archivo no hay forma de que se vean parejos en el badge.

Esto deja sólo el dibujo, en `<nombre>-badge.png`, sin tocar los originales.
Quien los empareja después es Reconocimientos.tsx, que le da a cada uno el ancho
que iguala su área.

    python scripts/emparejar-logos.py
"""

from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
LOGOS = RAIZ / "public" / "logos"

TOLERANCIA = 12  # cuánto puede variar el color de fondo al recortar

FUENTES = ["climatelaunchpad.png", "naves.png", "iae.png", "vos-lo-haces.png", "gcba.jpg"]


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


if __name__ == "__main__":
    for nombre in FUENTES:
        emparejar(nombre)
