// Recibe los contactos del formulario de requecho.com y los agrega a esta hoja.
// Se pega en la hoja: Extensiones → Apps Script (ver docs/formulario.md, receta A).

// Mail que recibe un aviso con cada contacto nuevo. Vacío ("") = sin aviso.
const AVISO_A = "";

// Clave que manda la web → título de la columna en la hoja.
const COLUMNAS = [
  ["fecha_hora", "Fecha y hora"],
  ["nombre", "Nombre"],
  ["apellido", "Apellido"],
  ["empresa", "Empresa / estudio"],
  ["whatsapp", "WhatsApp"],
  ["mail", "Mail"],
  ["utm_source", "utm_source"],
  ["utm_medium", "utm_medium"],
  ["utm_campaign", "utm_campaign"],
  ["utm_content", "utm_content"],
  ["utm_term", "utm_term"],
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(COLUMNAS.map((c) => c[1]));
      hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight("bold");
      hoja.setFrozenRows(1);
    }
    const datos = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    // Un valor que empieza con + = - @ Sheets lo toma como fórmula (el WhatsApp
    // "+54 9 11…" daba #ERROR!): con el apóstrofo se guarda como texto.
    const texto = (v) => {
      const s = v == null ? "" : String(v);
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    };
    hoja.appendRow(COLUMNAS.map((c) => (c[0] === "fecha_hora" ? datos.fecha_hora || "" : texto(datos[c[0]]))));

    if (AVISO_A) {
      const cuerpo = COLUMNAS.slice(0, 6).map((c) => c[1] + ": " + (datos[c[0]] || "")).join("\n");
      MailApp.sendEmail(AVISO_A, "Nuevo contacto desde requecho.com", cuerpo);
    }
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
