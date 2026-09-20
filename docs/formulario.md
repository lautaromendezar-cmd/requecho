# Formulario de contacto: cómo se guardan los envíos

Cada envío válido del formulario del bloque 8 hace un `POST /api/lead`. El servidor
vuelve a validar los cinco campos con el mismo esquema que el navegador, arma una fila
y se la pasa a un `LeadStore`. Hoy hay una sola implementación real: **webhook**. La
API manda la fila como JSON a la URL que esté en `LEADS_WEBHOOK_URL` y considera el
envío exitoso sólo si el webhook responde 2xx (siguiendo redirecciones).

Si la variable no está:

- en desarrollo, la fila se imprime en la consola del servidor;
- en producción, la API responde 503 con el mensaje "No pudimos enviar tus datos…".
  Nunca un éxito falso.

## La fila

```json
{
  "fecha_hora": "20/09/2026 19:05:33",
  "nombre": "Ana",
  "apellido": "Pérez",
  "empresa": "Estudio AP",
  "whatsapp": "+54 9 11 1234 5678",
  "mail": "ana@estudioap.com",
  "utm_source": "instagram",
  "utm_medium": "social",
  "utm_campaign": "lanzamiento",
  "utm_content": "",
  "utm_term": ""
}
```

- `fecha_hora` va en hora de Buenos Aires (`America/Argentina/Buenos_Aires`).
- Las UTM se capturan al cargar la página (y se recuerdan en la sesión del navegador);
  llegan vacías si la visita no traía parámetros.
- Los campos se recortan a 200 caracteres.
- Los envíos con el campo trampa completo (bots) reciben `ok: true` pero no se guardan.

## Receta A: Google Sheets con Apps Script

1. Crear una hoja de cálculo nueva. En la fila 1 poner los encabezados, en este orden:
   `fecha_hora | nombre | apellido | empresa | whatsapp | mail | utm_source | utm_medium | utm_campaign | utm_content | utm_term`.
2. Menú **Extensiones → Apps Script**. Borrar lo que haya y pegar:

   ```js
   const COLUMNAS = [
     "fecha_hora", "nombre", "apellido", "empresa", "whatsapp", "mail",
     "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
   ];

   function doPost(e) {
     const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
     const datos = JSON.parse(e.postData.contents || "{}");
     hoja.appendRow(COLUMNAS.map((c) => datos[c] ?? ""));
     return ContentService
       .createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Implementar → Nueva implementación → Aplicación web.** Ejecutar como: *Yo*.
   Quién tiene acceso: *Cualquier usuario*. Autorizar cuando lo pida.
4. Copiar la URL que termina en `/exec` y cargarla en Vercel como `LEADS_WEBHOOK_URL`
   (Production). Redeployar o esperar el próximo deploy.
5. Probar con un envío real y verificar que la fila aparezca completa.

Notas: Apps Script responde al POST con una redirección 302; la API la sigue y da por
bueno el 200 final. Si se cambia el script hay que crear una **nueva versión** de la
implementación, si no sigue corriendo la anterior. Para recibir un aviso por mail en
cada envío, agregar dentro de `doPost`, antes del `return`:
`MailApp.sendEmail("hola@ejemplo.com", "Nuevo contacto Requecho", JSON.stringify(datos, null, 2));`

## Receta B: Excel en OneDrive con Power Automate

1. Crear un Excel en OneDrive (o SharePoint) y, dentro, **una tabla** (Insertar → Tabla)
   con los mismos 11 encabezados de la receta A. Nombrarla, por ejemplo, `Contactos`.
2. En [make.powerautomate.com](https://make.powerautomate.com): **Crear → Flujo de nube
   instantáneo**, desencadenador **"Cuando se recibe una solicitud HTTP"** (requiere
   licencia que incluya conectores premium; la de Microsoft 365 Business suele
   alcanzar para este conector, verificar en la cuenta).
3. En el desencadenador, pegar este esquema JSON del cuerpo:

   ```json
   {
     "type": "object",
     "properties": {
       "fecha_hora": { "type": "string" },
       "nombre": { "type": "string" },
       "apellido": { "type": "string" },
       "empresa": { "type": "string" },
       "whatsapp": { "type": "string" },
       "mail": { "type": "string" },
       "utm_source": { "type": "string" },
       "utm_medium": { "type": "string" },
       "utm_campaign": { "type": "string" },
       "utm_content": { "type": "string" },
       "utm_term": { "type": "string" }
     }
   }
   ```

4. Agregar la acción **Excel Online (Business) → Agregar una fila a una tabla**, elegir
   el archivo y la tabla, y mapear cada columna con el contenido dinámico del mismo
   nombre.
5. Agregar la acción **Respuesta** con código 200 y cuerpo `{"ok":true}`.
6. Guardar. El desencadenador muestra la **URL de HTTP POST**: cargarla en Vercel como
   `LEADS_WEBHOOK_URL` (Production).
7. Probar con un envío real y verificar la fila.

Para el aviso por mail, sumar la acción **Outlook → Enviar un correo** después de la
fila.

## Probar en local

```bash
cp .env.example .env.local        # sin LEADS_WEBHOOK_URL: loguea a consola
npm run dev
```

Para probar contra un receptor real sin tocar la hoja, `scripts/webhook-prueba.mjs`
levanta un receptor local en el puerto 8787 e imprime lo que llega:

```bash
node scripts/webhook-prueba.mjs
# en otra terminal
LEADS_WEBHOOK_URL=http://localhost:8787/lead npm run dev
```

## Cambiar de destino más adelante

Todo lo que sabe de destinos está en `src/lib/leads/store.ts`. Para agregar otro
(por ejemplo una base de datos), implementar la interfaz `LeadStore` y elegirla en
`crearLeadStore()`. Los componentes y la API no cambian.
