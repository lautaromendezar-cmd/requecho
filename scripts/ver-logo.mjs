// Renderiza el SVG trazado del isologo para verificarlo a ojo.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const svg = readFileSync("public/brand/requecho.svg", "utf8");
const icon = readFileSync("src/app/icon.svg", "utf8");
const html = `<body style="margin:0;background:#f1f1ef;padding:24px;font-family:sans-serif">
<div style="color:#151515;width:480px">${svg}</div>
<div style="background:#242424;padding:24px;margin-top:16px;color:#f1f1ef;width:480px">${svg}</div>
<div style="width:96px;margin-top:16px">${icon}</div></body>`;
const browser = await chromium.launch({ channel: "chrome", args: ["--disable-gpu"] });
const page = await browser.newPage({ viewport: { width: 600, height: 420 } });
await page.setContent(html);
await page.screenshot({ path: "capturas/logo-check.png" });
await browser.close();
console.log("capturas/logo-check.png");
