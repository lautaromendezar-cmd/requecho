<?php
// Recibe el formulario de contacto en el HTML estático (hosting DUPLIKA) y hace lo
// mismo que src/app/api/lead/route.ts en Vercel: valida los cinco campos, arma la
// fila y la manda como JSON al webhook (Apps Script de la hoja de Google, ver
// docs/formulario.md). El webhook se configura en lead-config.php, al lado de este
// archivo; si no está, responde con el mensaje de falla (nunca un éxito falso).
//
// Los mensajes son los de contacto.errores en src/content/landing.ts y landing.en.ts:
// si cambian allá, cambiarlos acá.

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

const MENSAJES = [
  'es' => [
    'vacio' => 'Completá este campo.',
    'whatsapp' => 'Ingresá el número con código de país.',
    'mail' => 'Revisá el formato del mail.',
    'envio' => 'No pudimos enviar tus datos. Probá de nuevo en unos minutos.',
  ],
  'en' => [
    'vacio' => 'Please fill in this field.',
    'whatsapp' => 'Enter the number with its country code.',
    'mail' => 'Please check the email format.',
    'envio' => "We couldn't send your details. Please try again in a few minutes.",
  ],
];
const CAMPOS = ['nombre', 'apellido', 'empresa', 'whatsapp', 'mail'];
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const MAX = 200;

function responder(int $status, array $cuerpo): void {
  http_response_code($status);
  echo json_encode($cuerpo, JSON_UNESCAPED_UNICODE);
  exit;
}

function recortar($v): string {
  return is_string($v) ? mb_substr(trim($v), 0, MAX) : '';
}

function whatsapp_valido(string $v): bool {
  $s = trim($v);
  if (!preg_match('/^\+\d[\d ]*$/', $s)) return false;
  return strlen(preg_replace('/\D/', '', $s)) >= 10;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  header('Allow: POST');
  responder(405, ['ok' => false]);
}

$body = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($body)) responder(400, ['ok' => false, 'message' => MENSAJES['es']['envio']]);

$lang = (($body['idioma'] ?? '') === 'en') ? 'en' : 'es';
$m = MENSAJES[$lang];
$falla = fn(int $status) => responder($status, ['ok' => false, 'message' => $m['envio']]);

// Campo trampa: los bots lo completan. Se responde éxito sin guardar nada.
if (is_string($body['website'] ?? null) && trim($body['website']) !== '') {
  responder(200, ['ok' => true]);
}

$d = [];
$errores = [];
foreach (CAMPOS as $c) {
  $d[$c] = recortar($body[$c] ?? '');
  if ($d[$c] === '') $errores[$c] = $m['vacio'];
}
if (!isset($errores['whatsapp']) && !whatsapp_valido($d['whatsapp'])) $errores['whatsapp'] = $m['whatsapp'];
if (!isset($errores['mail']) && !preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u', $d['mail'])) $errores['mail'] = $m['mail'];
if ($errores) responder(400, ['ok' => false, 'errors' => $errores]);

$config = is_file(__DIR__ . '/lead-config.php') ? include __DIR__ . '/lead-config.php' : [];
$webhook = is_array($config) ? trim((string) ($config['webhook'] ?? '')) : '';
if ($webhook === '') {
  error_log('[lead] Falta el webhook en lead-config.php: el envío no se guardó.');
  $falla(503);
}

$fecha = new DateTimeImmutable('now', new DateTimeZone('America/Argentina/Buenos_Aires'));
$utm = is_array($body['utm'] ?? null) ? $body['utm'] : [];
$fila = ['fecha_hora' => $fecha->format('d/m/Y H:i:s')] + $d;
foreach (UTM_KEYS as $k) $fila[$k] = recortar($utm[$k] ?? '');

// Apps Script contesta el POST con un 302: se sigue (como GET) y vale el 2xx final.
$ch = curl_init($webhook);
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => json_encode($fila, JSON_UNESCAPED_UNICODE),
  CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_MAXREDIRS => 5,
  CURLOPT_CONNECTTIMEOUT => 10,
  CURLOPT_TIMEOUT => 20,
]);
curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($status >= 200 && $status < 300) responder(200, ['ok' => true]);
error_log("[lead] El webhook respondió $status $error");
$falla(502);
