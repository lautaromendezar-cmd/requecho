# Vectoriza el isologo a partir del mejor raster disponible.
#
# Uso:  python scripts/trazar-logo.py
#
# No existe archivo original del isologo y el folleto es 100 % imagen, así que el SVG
# se obtiene trazando (potrace) el recorte de la portada, ampliado 4x. Es una
# vectorización fiel del dibujo del cliente, no una recreación tipográfica. Cuando
# llegue el original, reemplazar public/brand/requecho.svg, src/app/icon.svg y
# src/components/brand/logo-path.ts (o volver a correr esto con el nuevo archivo).
#
# Requiere: pip install potracer numpy pillow

from pathlib import Path

import numpy as np
import potrace
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
FUENTE = RAIZ / "_plan" / "logo-cover-crop.png"
ESCALA = 4


def xy(p) -> tuple[float, float]:
    return (float(p.x), float(p.y))


def trazar(mascara: np.ndarray):
    bmp = potrace.Bitmap(mascara)
    return bmp.trace(turdsize=6, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
                     alphamax=1.0, opticurve=True, opttolerance=0.2)


def a_path(curvas, escala: float, dx: float = 0, dy: float = 0) -> str:
    partes = []
    for curva in curvas:
        sx, sy = xy(curva.start_point)
        partes.append(f"M{(sx - dx) / escala:.2f} {(sy - dy) / escala:.2f}")
        for seg in curva:
            ex, ey = xy(seg.end_point)
            if seg.is_corner:
                cx, cy = xy(seg.c)
                partes.append(f"L{(cx - dx) / escala:.2f} {(cy - dy) / escala:.2f}")
                partes.append(f"L{(ex - dx) / escala:.2f} {(ey - dy) / escala:.2f}")
            else:
                c1x, c1y = xy(seg.c1)
                c2x, c2y = xy(seg.c2)
                partes.append(
                    f"C{(c1x - dx) / escala:.2f} {(c1y - dy) / escala:.2f} "
                    f"{(c2x - dx) / escala:.2f} {(c2y - dy) / escala:.2f} "
                    f"{(ex - dx) / escala:.2f} {(ey - dy) / escala:.2f}"
                )
        partes.append("Z")
    return "".join(partes)


def puntos(curvas):
    xs, ys = [], []
    for curva in curvas:
        for seg in curva:
            x, y = xy(seg.end_point)
            xs.append(x)
            ys.append(y)
    return xs, ys


def main() -> None:
    im = Image.open(FUENTE).convert("L")
    im = im.resize((im.width * ESCALA, im.height * ESCALA), Image.LANCZOS)
    mascara = np.asarray(im) >= 128  # potracer traza los píxeles en False: la tinta oscura

    path = trazar(mascara)
    curvas = list(path)
    xs, ys = puntos(curvas)
    x0, y0, x1, y1 = min(xs), min(ys), max(xs), max(ys)
    ancho = (x1 - x0) / ESCALA
    alto = (y1 - y0) / ESCALA
    d = a_path(curvas, ESCALA, dx=x0, dy=y0)
    viewbox = f"0 0 {ancho:.2f} {alto:.2f}"

    salida = RAIZ / "public" / "brand"
    salida.mkdir(parents=True, exist_ok=True)
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img" aria-label="Requecho">'
        f'<path fill="currentColor" fill-rule="evenodd" d="{d}"/></svg>'
    )
    (salida / "requecho.svg").write_text(svg, encoding="utf-8")
    print(f"requecho.svg  viewBox {viewbox}  ({len(svg) // 1024} KB, {len(curvas)} curvas)")

    # La R sola (las curvas cuyo centro cae en el primer 13 % del ancho) para el favicon.
    limite = x0 + (x1 - x0) * 0.13
    curvas_r = [c for c in curvas if np.mean([xy(s.end_point)[0] for s in c]) < limite]
    rxs, rys = puntos(curvas_r)
    rx0, ry0, rx1, ry1 = min(rxs), min(rys), max(rxs), max(rys)
    rw, rh = (rx1 - rx0) / ESCALA, (ry1 - ry0) / ESCALA
    lado = max(rw, rh) * 1.7
    ox = (lado - rw) / 2
    oy = (lado - rh) / 2
    d_r = a_path(curvas_r, ESCALA, dx=rx0 - ox * ESCALA, dy=ry0 - oy * ESCALA)
    icono = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {lado:.2f} {lado:.2f}">'
        f'<rect width="{lado:.2f}" height="{lado:.2f}" rx="{lado * 0.18:.2f}" fill="#EFB821"/>'
        f'<path fill="#242424" fill-rule="evenodd" d="{d_r}"/></svg>'
    )
    (RAIZ / "src" / "app" / "icon.svg").write_text(icono, encoding="utf-8")
    print(f"icon.svg  R sola, {len(curvas_r)} curvas")

    # El path también como módulo TS, para renderizar el isologo inline con currentColor.
    ts = (
        "// Generado por scripts/trazar-logo.py a partir del raster de la portada del folleto.\n"
        "// Reemplazar cuando llegue el archivo original del isologo (ver PENDIENTES.md).\n"
        f'export const LOGO_VIEWBOX = "{viewbox}";\n'
        f"export const LOGO_RATIO = {ancho / alto:.4f};\n"
        f'export const LOGO_PATH =\n  "{d}";\n'
    )
    destino_ts = RAIZ / "src" / "components" / "brand"
    destino_ts.mkdir(parents=True, exist_ok=True)
    (destino_ts / "logo-path.ts").write_text(ts, encoding="utf-8")
    print("logo-path.ts")

    # apple-icon.png a partir del raster (PIL no rasteriza SVG)
    r_crop = Image.open(FUENTE).convert("L").crop(
        (int(rx0 / ESCALA), int(ry0 / ESCALA), int(rx1 / ESCALA) + 1, int(ry1 / ESCALA) + 1)
    )
    for nombre, tam in (("apple-icon.png", 180),):
        fondo = Image.new("RGB", (tam, tam), (239, 184, 33))
        escala = tam / 1.7 / max(r_crop.width, r_crop.height)
        r_big = r_crop.resize(
            (max(1, int(r_crop.width * escala)), max(1, int(r_crop.height * escala))), Image.LANCZOS
        )
        alpha = r_big.point(lambda v: 255 - v)  # tinta oscura = opaco
        tinta = Image.new("RGB", r_big.size, (36, 36, 36))
        fondo.paste(tinta, ((tam - r_big.width) // 2, (tam - r_big.height) // 2), alpha)
        fondo.save(RAIZ / "src" / "app" / nombre, "PNG", optimize=True)
        print(nombre, tam)


if __name__ == "__main__":
    main()
