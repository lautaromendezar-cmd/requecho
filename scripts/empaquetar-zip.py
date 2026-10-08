"""Empaqueta out/ en un zip para extraer con el cPanel de DUPLIKA.

Rutas con "/" y permisos Unix normales (carpetas 755, archivos 644). Con los zips de
Windows (Compress-Archive o tar) el cPanel extraía carpetas sin permiso de escritura o
archivos 666, que algunos servidores se niegan a ejecutar (lead.php).

Uso: python scripts/empaquetar-zip.py out requecho-html.zip
"""
import os
import sys
import zipfile

origen, destino = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for raiz, dirs, archivos in os.walk(origen):
        dirs.sort()
        rel = os.path.relpath(raiz, origen).replace("\\", "/")
        if rel != ".":
            info = zipfile.ZipInfo(rel + "/")
            info.external_attr = (0o40755 << 16) | 0x10
            info.create_system = 3
            z.writestr(info, b"")
        for nombre in sorted(archivos):
            ruta = os.path.join(raiz, nombre)
            arc = nombre if rel == "." else f"{rel}/{nombre}"
            info = zipfile.ZipInfo.from_file(ruta, arc)
            info.external_attr = 0o100644 << 16
            info.create_system = 3
            info.compress_type = zipfile.ZIP_DEFLATED
            with open(ruta, "rb") as f:
                z.writestr(info, f.read())
