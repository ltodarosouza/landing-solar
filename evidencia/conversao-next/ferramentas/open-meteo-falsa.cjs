// Open-Meteo falsa com modo trocável: GET /__modo/<nome>. Os modos são os de scripts/falhas-ceu.cjs.
const http = require("http");
const BOM = { current_units: { time: "iso8601", interval: "seconds", temperature_2m: "°C", cloud_cover: "%", is_day: "" }, current: { time: "2026-10-21T17:15", interval: 900, temperature_2m: 22.4, cloud_cover: 100, is_day: 1 } };
let modo = "bom";
http.createServer((req, res) => {
  if (req.url.startsWith("/__modo/")) { modo = req.url.slice(8); return res.end("modo " + modo); }
  if (modo === "bom") { res.setHeader("Content-Type", "application/json"); return res.end(JSON.stringify(BOM)); }
  if (modo === "noite") { res.setHeader("Content-Type", "application/json"); return res.end(JSON.stringify({ ...BOM, current: { ...BOM.current, is_day: 0, cloud_cover: 5 } })); }
  if (modo === "mudo") return;
  if (modo === "corta") { res.writeHead(200, { "Content-Length": "500" }); res.write('{"current":'); return setTimeout(() => res.socket.destroy(), 50); }
  if (modo === "quebra") { res.statusCode = 500; return res.end("erro"); }
  if (modo === "limite") { res.statusCode = 429; res.setHeader("Retry-After", "60"); return res.end("{}"); }
  if (modo === "recusa") { res.statusCode = 400; return res.end('{"error":true}'); }
  if (modo === "fahrenheit") { res.setHeader("Content-Type", "application/json"); return res.end(JSON.stringify({ ...BOM, current_units: { ...BOM.current_units, temperature_2m: "°F" } })); }
}).listen(4197);
