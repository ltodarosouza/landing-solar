// Céu de Sorocaba agora, da Open-Meteo (API pública, sem chave). O navegador nunca fala com ela:
// fala com /api/ceu, e é esta função que consulta, confere o formato, limita o tempo e traduz as falhas.
// Contrato lido na API real (ver evidencia/EVIDENCIA.md, seção 18):
//   pedido:  GET /v1/forecast?latitude=-23.50&longitude=-47.46&current=temperature_2m,cloud_cover,is_day&timezone=America/Sao_Paulo
//   volta:   { current: { time, temperature_2m, cloud_cover, is_day }, current_units: { temperature_2m: "°C", cloud_cover: "%" } }
//   erro:    400 com { error: true, reason: "..." }; 429 quando passa do limite.
const PEDIDO = "latitude=-23.50&longitude=-47.46&current=temperature_2m,cloud_cover,is_day&timezone=America%2FSao_Paulo";
const FRESCO_MS = 10 * 60 * 1000;   // a Open-Meteo atualiza a cada 15 min; não há por que perguntar mais que isso
const VELHO_MS = 3 * 60 * 60 * 1000; // se a fonte cair, a última leitura vale por até 3 h (e a página diz que é antiga)

let ultimo = null; // { quando, dados }

// Confere o formato e a unidade. Quem lê só o exemplo da documentação erra aqui: °F no lugar de °C, por exemplo.
function normalizar(j) {
  if (!j || typeof j !== "object" || !j.current || !j.current_units) return null;
  const c = j.current, u = j.current_units;
  if (u.temperature_2m !== "°C" || u.cloud_cover !== "%") return null;
  if (typeof c.temperature_2m !== "number" || typeof c.cloud_cover !== "number" || (c.is_day !== 0 && c.is_day !== 1)) return null;
  if (c.cloud_cover < 0 || c.cloud_cover > 100 || typeof c.time !== "string") return null;
  return { temperatura: Math.round(c.temperature_2m), nuvem: Math.round(c.cloud_cover), dia: c.is_day === 1, leitura: c.time };
}

function descrever(nuvem) {
  if (nuvem <= 10) return "céu aberto";
  if (nuvem <= 50) return "poucas nuvens";
  if (nuvem < 90) return "bem nublado";
  return "céu coberto";
}

function erro(status, motivo, extra) {
  return { status, json: { ok: false, motivo }, headers: Object.assign({ "Cache-Control": "no-store" }, extra || {}) };
}

async function consultarCeu(opc) {
  const o = opc || {};
  const buscar = o.buscar || fetch;
  const base = o.url || process.env.OPEN_METEO_URL || "https://api.open-meteo.com/v1/forecast";
  const tempoMax = o.tempoMax || Number(process.env.CEU_TIMEOUT_MS) || 3000;
  const agora = o.agora ? o.agora() : Date.now();

  if (ultimo && agora - ultimo.quando < FRESCO_MS) return sucesso(ultimo.dados, false);

  const falha = (status, motivo, extra) => {
    // a fonte falhou: uma leitura de até 3 h ainda ajuda, desde que a página diga que é antiga
    if (ultimo && agora - ultimo.quando < VELHO_MS) return sucesso(ultimo.dados, true);
    return erro(status, motivo, extra);
  };

  const ctl = new AbortController();
  const relogio = setTimeout(() => ctl.abort(), tempoMax);
  try {
    const r = await buscar(base + "?" + PEDIDO, { signal: ctl.signal, headers: { Accept: "application/json" } });
    if (r.status === 429) return falha(503, "limite", r.headers && r.headers.get && r.headers.get("retry-after") ? { "Retry-After": r.headers.get("retry-after") } : {});
    if (r.status >= 500) return falha(502, "caiu");
    if (r.status !== 200) return falha(502, "recusou"); // 4xx: o pedido é nosso e está errado; não é culpa do visitante
    let corpo;
    try { corpo = await r.json(); } catch (e) { if (ctl.signal.aborted) throw e; return e && e.name === "SyntaxError" ? falha(502, "inesperado") : falha(502, "caiu"); } // cortou no meio, ou veio algo que não é JSON
    const dados = normalizar(corpo);
    if (!dados) return falha(502, "inesperado");
    dados.descricao = descrever(dados.nuvem);
    ultimo = { quando: agora, dados };
    return sucesso(dados, false);
  } catch (e) {
    if (ctl.signal.aborted) return falha(504, "demorou"); // não respondeu, ou cortou no meio, dentro do tempo
    return falha(502, "caiu"); // conexão recusada ou derrubada
  } finally {
    clearTimeout(relogio);
  }
}

function sucesso(dados, desatualizado) {
  return {
    status: 200,
    json: Object.assign({ ok: true, fonte: "Open-Meteo", desatualizado }, dados),
    headers: { "Cache-Control": desatualizado ? "no-store" : "public, s-maxage=600" }
  };
}

function zerarMemoria() { ultimo = null; }

module.exports = { consultarCeu, normalizar, descrever, zerarMemoria };
