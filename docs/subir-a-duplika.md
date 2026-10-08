# Subir el sitio al hosting de las clientas (DUPLIKA)

El sitio de Vercel (requecho.vercel.app) sigue siendo la copia de revisión: el push a
`main` lo actualiza como siempre. Para el hosting de las clientas se arma una versión
HTML estática (Apache + PHP) con un comando.

## 1. Armar el paquete

```bash
node scripts/exportar-html.mjs
```

Deja todo en `out/` y lo empaqueta en `requecho-html.zip` (los dos fuera de git).
Respecto de Vercel, esto es lo que cambia:

- **El formulario** lo recibe `lead.php` en lugar de la API de Next: valida lo mismo y
  manda la misma fila al mismo tipo de webhook (`docs/formulario.md`). El destino lo
  toma de `lead-config.php` (paso 4).
- **Las imágenes** no tienen optimizador: el script deja una copia `.webp` por ancho al
  lado de cada foto (`foto-640.webp`, `foto-960.webp`…) y el navegador elige.
- **Sale indexable**: sin `noindex`, con canonical, Open Graph, `robots.txt` y
  `sitemap.xml` apuntando a `https://requecho.com`. Si el dominio fuera otro, cambiar
  `SITE` en el script y la regla de www/https del `.htaccess`.
- `/es/` redirige a `/`, y las rutas que no existen muestran `404.html`.

## 2. Subirlo

Por el **Administrador de archivos** del cPanel de DUPLIKA (lo más rápido): entrar a
`public_html` del dominio, borrar lo que haya (antes, mirar qué es), subir
`requecho-html.zip` y usar **Extraer**. Después, borrar el zip del servidor.

Por **FTP**: subir el *contenido* de `out/` (no la carpeta) a `public_html`. Activar
"mostrar archivos ocultos" en el cliente FTP para que suba el `.htaccess`.

En cPanel → **Seleccionar versión de PHP**: tiene que ser 7.4 o más nueva, con la
extensión `curl` (viene activada casi siempre).

## 3. Dominio y SSL

Hoy `requecho.com` está estacionado en el registrador (redirige a una página `/lander`).
Hay que apuntarlo a DUPLIKA: cambiar los DNS (o el registro A) a los que dé DUPLIKA en
el mail de alta del hosting.

Cuando el dominio ya resuelva a DUPLIKA, emitir el certificado (cPanel → **SSL/TLS
Status** o **Let's Encrypt** → emitir para `requecho.com` y `www.requecho.com`). Con
el certificado andando, **descomentar las tres líneas de www/https** en el `.htaccess`
del servidor (y en `hosting/.htaccess`, para que la próxima exportación ya las traiga).
Antes no: el sitio daría error de certificado.

## 4. Conectar el formulario a la hoja de Google

Se puede hacer con el sitio ya subido: mientras tanto, el formulario responde con el
mensaje "No pudimos enviar tus datos…" (no simula un envío).

1. Hoja + Apps Script con la receta A de `docs/formulario.md`, hasta la URL que termina
   en `/exec`.
2. En `public_html`, crear el archivo `lead-config.php` con:

   ```php
   <?php
   return ['webhook' => 'https://script.google.com/macros/s/XXXX/exec'];
   ```

3. Hacer un envío real desde el sitio (en español y en inglés) y comprobar que la fila
   aparece completa en la hoja.

`lead-config.php` no viene en el zip, así que una subida nueva no lo pisa. Si se prefiere
que venga, exportar con `LEADS_WEBHOOK_URL=https://…/exec node scripts/exportar-html.mjs`.
El `.htaccess` impide que se pueda leer desde afuera.

## 5. Comprobar en vivo

- `/` y `/en/` cargan con fotos, fuentes y animaciones.
- `/es/` lleva a `/`; `/cualquier-cosa` muestra la página 404 del sitio.
- Abrir `/lead.php` en el navegador da `{"ok":false}` (sólo acepta envíos del formulario).
- El selector ESP / ENG y los íconos de contacto funcionan.

## Cambios después de publicar

Se hacen en el repo, se pushean (Vercel se actualiza para revisar) y, con el OK, se
vuelve a correr el paso 1 y se sube de nuevo. Al extraer el zip encima del anterior,
los archivos viejos de `_next/` quedan sin usar: no molestan, pero conviene borrar
`_next/` antes de extraer para no juntar basura.
