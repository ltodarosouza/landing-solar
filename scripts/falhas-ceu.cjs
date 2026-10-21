#!/usr/bin/env node
// Provoca, de verdade, cada jeito de a Open-Meteo falhar (servidores falsos na porta local) e confere o que
// lib/ceu.js devolve. Sai com código 1 se algo não bater. Roda sozinho ou pelo scripts/check.cjs.
const http = require("http");
const ceu = require("../lib/ceu.js");

const BOM = { latitude: -23.5, longitude: -47.46, current_units: { time: "iso8601", interval: "seconds", temperature_2m: "°C", cloud_cover: "%", is_day: "" }, current: { time: "2026-10-21T17:15", interval: 900, temperature_2m: 22.4, cloud_cover: 100, is_day: 1 } };
const MODOS = {
  bom: (req, res) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(BOM)); },
  noite: (req, res) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ ...BOM, current: { ...BOM.current, is_day: 0, cloud_cover: 5 } })); },
  mudo: () => {}, // aceita a conexão e nunca responde
  corta: (req, res) => { res.writeHead(200, { "Content-Type": "application/json", "Content-Length": "500" }); res.write('{"current":'); setTimeout(() => res.socket.destroy(), 50); },
  quebra: (req, res) => { res.statusCode = 500; res.end("erro interno"); },
  limite: (req, res) => { res.statusCode = 429; res.setHeader("Retry-After", "60"); res.end('{"error":true,"reason":"Too many requests"}'); },
  recusa: (req, res) => { res.statusCode = 400; res.end('{"error":true,"reason":"Invalid value: Cannot initialize Float from invalid String value abc"}'); },
  fahrenheit: (req, res) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ ...BOM, current_units: { ...BOM.current_units, temperature_2m: "°F" } })); },
  lixo: (req, res) => { res.setHeader("Content-Type", "text/html"); res.end("<html>manutenção</html>"); },
  faltaCampo: (req, res) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify({ ...BOM, current: { time: "x", temperature_2m: 20 } })); }
};

let falhas = 0;
const confere = (nome, ok, detalhe) => { console.log((ok ? "ok    " : "FALHA ") + nome + (ok ? "" : "  " + detalhe)); if (!ok) falhas++; };

(async () => {
  let modo = "bom";
  const srv = http.createServer((req, res) => MODOS[modo](req, res));
  await new Promise((r) => srv.listen(0, "127.0.0.1", r));
  const url = "http://127.0.0.1:" + srv.address().port + "/v1/forecast";
  const roda = async (m, extra) => { modo = m; ceu.zerarMemoria(); const t0 = Date.now(); const r = await ceu.consultarCeu({ url, tempoMax: 600, ...(extra || {}) }); r.ms = Date.now() - t0; return r; };

  let r = await roda("bom");
  confere("fonte ok: 200 com 22 °C, 100% de nuvens, dia, céu coberto", r.status === 200 && r.json.temperatura === 22 && r.json.nuvem === 100 && r.json.dia === true && r.json.descricao === "céu coberto" && r.json.desatualizado === false, JSON.stringify(r.json));
  r = await roda("noite");
  confere("fonte ok à noite: dia falso, céu aberto", r.json.dia === false && r.json.descricao === "céu aberto");
  r = await roda("mudo");
  confere("fonte que nunca responde: desiste no tempo e devolve 504 demorou", r.status === 504 && r.json.motivo === "demorou" && r.ms >= 550 && r.ms < 1500, r.status + " " + JSON.stringify(r.json) + " " + r.ms + "ms");
  r = await roda("corta");
  confere("fonte que corta a conexão no meio da resposta: 502 caiu", r.status === 502 && r.json.motivo === "caiu", r.status + " " + JSON.stringify(r.json));
  r = await roda("quebra");
  confere("fonte que quebra (500): 502 caiu", r.status === 502 && r.json.motivo === "caiu");
  r = await roda("limite");
  confere("fonte que corta por excesso de pedidos (429): 503 limite, repassando o Retry-After", r.status === 503 && r.json.motivo === "limite" && r.headers["Retry-After"] === "60", JSON.stringify(r.headers));
  r = await roda("recusa");
  confere("fonte que recusa o pedido (400): 502 recusou, não acusa o visitante", r.status === 502 && r.json.motivo === "recusou");
  r = await roda("fahrenheit");
  confere("unidade trocada (°F no lugar de °C): não aceita, 502 inesperado", r.status === 502 && r.json.motivo === "inesperado");
  r = await roda("lixo");
  confere("resposta que não é JSON: 502 inesperado", r.status === 502 && r.json.motivo === "inesperado");
  r = await roda("faltaCampo");
  confere("JSON sem os campos esperados: 502 inesperado", r.status === 502 && r.json.motivo === "inesperado");
  srv.close();
  ceu.zerarMemoria();
  r = await ceu.consultarCeu({ url, tempoMax: 600 });
  confere("fonte fora do ar (conexão recusada): 502 caiu", r.status === 502 && r.json.motivo === "caiu", r.status + " " + JSON.stringify(r.json));

  // memória: lê uma vez, não repete dentro de 10 min, e se a fonte cair usa a última leitura dizendo que é antiga
  const srv2 = http.createServer((req, res) => MODOS[modo](req, res));
  await new Promise((r2) => srv2.listen(0, "127.0.0.1", r2));
  const url2 = "http://127.0.0.1:" + srv2.address().port + "/v1/forecast";
  let hora = 1000000; const agora = () => hora;
  modo = "bom"; ceu.zerarMemoria();
  r = await ceu.consultarCeu({ url: url2, tempoMax: 600, agora });
  modo = "quebra"; hora += 5 * 60 * 1000;
  r = await ceu.consultarCeu({ url: url2, tempoMax: 600, agora });
  confere("cinco minutos depois, a mesma leitura é reaproveitada sem perguntar de novo", r.status === 200 && r.json.desatualizado === false && r.json.temperatura === 22);
  hora += 20 * 60 * 1000;
  r = await ceu.consultarCeu({ url: url2, tempoMax: 600, agora });
  confere("passados 25 min com a fonte caída: devolve a última leitura marcada como desatualizada", r.status === 200 && r.json.desatualizado === true && r.json.temperatura === 22, JSON.stringify(r.json));
  hora += 4 * 60 * 60 * 1000;
  r = await ceu.consultarCeu({ url: url2, tempoMax: 600, agora });
  confere("passadas 4 h com a fonte caída: a leitura velha não vale mais, 502 caiu", r.status === 502 && r.json.motivo === "caiu");
  srv2.close();

  console.log(falhas ? "\n" + falhas + " falha(s)." : "\nTodas as falhas da fonte foram provocadas e tratadas.");
  process.exit(falhas ? 1 : 0);
})();
