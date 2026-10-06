"""
Extrae el logo y el isologo oficiales, en vector, del Guideline de marca (PDF).

El PDF trae cada letra y cada escuadra como un trazado relleno: la pág. 4 tiene el
logotipo principal y la 14 el isologo. Se separan por color (grafito = letras,
amarillo = escuadras), se llevan al origen y se escriben:

  - src/components/brand/logo-path.ts  (lo que consume <Logo /> e <Isologo />)
  - public/brand/requecho.svg          (logo principal, para usar fuera del sitio)
  - public/brand/requecho-isologo.svg
  - src/app/icon.svg                   (favicon: isologo)

Uso:  python scripts/extraer-logo.py
"""
from pathlib import Path

import fitz  # PyMuPDF

RAIZ = Path(__file__).resolve().parent.parent
PDF = RAIZ / "material-del-cliente/marca-2026-10/Guideline - Requecho (2026).pdf"
PAG_LOGO, PAG_ISO = 4, 14
AMARILLO = "#efb821"
GRAFITO = "#242424"


def es_amarillo(fill):
    return fill and fill[0] > 0.9 and fill[2] < 0.1


def es_grafito(fill):
    return fill and max(fill) < 0.3


def trazados(pagina):
    """Devuelve (letras, escuadras) como listas de dibujos de PyMuPDF."""
    dibujos = pagina.get_drawings()
    letras = [d for d in dibujos if es_grafito(d.get("fill"))]
    escuadras = [d for d in dibujos if es_amarillo(d.get("fill"))]
    return letras, escuadras


def a_path(dibujos, dx, dy):
    """Convierte dibujos en un atributo d de SVG, corriendo el origen a (dx, dy)."""
    f = lambda p: f"{p.x - dx:.2f} {p.y - dy:.2f}"
    partes = []
    for d in dibujos:
        actual = None
        for item in d["items"]:
            op, inicio = item[0], item[1]
            if actual is None or abs(inicio.x - actual.x) > 0.01 or abs(inicio.y - actual.y) > 0.01:
                if actual is not None:
                    partes.append("Z")
                partes.append("M" + f(inicio))
            if op == "l":
                partes.append("L" + f(item[2]))
                actual = item[2]
            elif op == "c":
                partes.append("C" + " ".join(f(p) for p in item[2:5]))
                actual = item[4]
            else:
                raise ValueError(f"operación no prevista: {op}")
        partes.append("Z")
    return "".join(partes)


def caja(dibujos):
    r = fitz.Rect(dibujos[0]["rect"])
    for d in dibujos[1:]:
        r |= d["rect"]
    return r


def extraer(pagina):
    letras, escuadras = trazados(pagina)
    r = caja(letras + escuadras)
    return {
        "w": round(r.width, 2),
        "h": round(r.height, 2),
        "letras": a_path(letras, r.x0, r.y0),
        "escuadras": a_path(escuadras, r.x0, r.y0),
    }


def svg(m, letras=GRAFITO, escuadras=AMARILLO):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {m["w"]} {m["h"]}">'
        f'<path fill="{letras}" d="{m["letras"]}"/>'
        f'<path fill="{escuadras}" d="{m["escuadras"]}"/></svg>\n'
    )


def main():
    doc = fitz.open(PDF)
    logo = extraer(doc[PAG_LOGO - 1])
    iso = extraer(doc[PAG_ISO - 1])

    ts = [
        "// Generado por scripts/extraer-logo.py desde el Guideline de marca (oct. 2026).",
        "// No editar a mano: volver a correr el script.",
        "",
        f'export const LOGO_VIEWBOX = "0 0 {logo["w"]} {logo["h"]}";',
        f'export const LOGO_LETRAS = "{logo["letras"]}";',
        f'export const LOGO_ESCUADRAS = "{logo["escuadras"]}";',
        "",
        f'export const ISO_VIEWBOX = "0 0 {iso["w"]} {iso["h"]}";',
        f'export const ISO_LETRA = "{iso["letras"]}";',
        f'export const ISO_ESCUADRAS = "{iso["escuadras"]}";',
        "",
    ]
    (RAIZ / "src/components/brand/logo-path.ts").write_text("\n".join(ts), encoding="utf-8")
    (RAIZ / "public/brand/requecho.svg").write_text(svg(logo), encoding="utf-8")
    (RAIZ / "public/brand/requecho-isologo.svg").write_text(svg(iso), encoding="utf-8")

    # Favicon: isologo negativo sobre grafito, cuadrado y con aire alrededor.
    lado = max(iso["w"], iso["h"]) * 1.35
    ox, oy = (lado - iso["w"]) / 2, (lado - iso["h"]) / 2
    icon = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {lado:.2f} {lado:.2f}">'
        f'<rect width="100%" height="100%" rx="{lado * 0.18:.2f}" fill="{GRAFITO}"/>'
        f'<g transform="translate({ox:.2f} {oy:.2f})">'
        f'<path fill="#ffffff" d="{iso["letras"]}"/>'
        f'<path fill="{AMARILLO}" d="{iso["escuadras"]}"/></g></svg>\n'
    )
    (RAIZ / "src/app/icon.svg").write_text(icon, encoding="utf-8")
    print("logo", logo["w"], "x", logo["h"], "· isologo", iso["w"], "x", iso["h"])


if __name__ == "__main__":
    main()
