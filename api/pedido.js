// Recebe o pedido de simulação e aplica as mesmas regras da página (app.js é a única fonte).
// Ainda não guarda nada: só recusa o que a Ravena não atende. Guardar o pedido é outro item (FALTA.md, 1).
const { validar } = require("../app.js");

const CAMPOS = ["nome", "whatsapp", "cidade", "conta"];

module.exports = function (req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ erro: "Use POST." });
  }
  const corpo = typeof req.body === "string" ? tentarJson(req.body) : req.body;
  if (!corpo || typeof corpo !== "object" || Array.isArray(corpo)) {
    return res.status(400).json({ erro: "Corpo inválido." });
  }
  const campos = {};
  for (const c of CAMPOS) {
    // só texto ou número entra; objeto ou lista viram vazio e caem na validação
    campos[c] = typeof corpo[c] === "string" || typeof corpo[c] === "number" ? String(corpo[c]).slice(0, 200) : "";
  }
  const erros = validar(campos);
  if (Object.keys(erros).length) return res.status(422).json({ ok: false, erros });
  return res.status(200).json({ ok: true });
};

function tentarJson(texto) {
  try { return JSON.parse(texto); } catch (e) { return null; }
}
