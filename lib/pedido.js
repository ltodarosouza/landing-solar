// Regra do pedido no servidor. Função pura (texto do corpo entra, status e JSON saem), para o check
// poder testá-la sem subir servidor. A regra em si é a da página: public/app.js é a única fonte.
const { validar } = require("../public/app.js");

const CAMPOS = ["nome", "whatsapp", "cidade", "conta"];

function tentarJson(texto) {
  try { return JSON.parse(texto); } catch (e) { return null; }
}

function responder(metodo, corpoTexto) {
  if (metodo !== "POST") return { status: 405, json: { erro: "Use POST." }, headers: { Allow: "POST" } };
  const corpo = tentarJson(corpoTexto || "");
  if (!corpo || typeof corpo !== "object" || Array.isArray(corpo)) {
    return { status: 400, json: { erro: "Corpo inválido." } };
  }
  const campos = {};
  for (const c of CAMPOS) {
    // só texto ou número entra; objeto ou lista viram vazio e caem na validação
    campos[c] = typeof corpo[c] === "string" || typeof corpo[c] === "number" ? String(corpo[c]).slice(0, 200) : "";
  }
  const erros = validar(campos);
  if (Object.keys(erros).length) return { status: 422, json: { ok: false, erros } };
  return { status: 200, json: { ok: true } };
}

module.exports = { responder };
