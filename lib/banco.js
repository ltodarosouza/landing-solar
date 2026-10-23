// Pergunta ao banco (Supabase) se ele responde, com a chave guardada como variável de ambiente do servidor.
// A chave só existe aqui, no servidor: vem de SUPABASE_PUBLISHABLE_KEY (sem NEXT_PUBLIC_, então o navegador
// nunca a recebe) e nunca entra na resposta. Sem a chave, a rota diz o que falta, sem inventar valor.
const TEMPO_MAXIMO_MS = 5000; // a primeira consulta depois de um início a frio pode passar de 3 s

async function verBanco(opc) {
  const o = opc || {};
  const env = o.env || process.env;
  const buscar = o.buscar || fetch;
  const url = env.SUPABASE_URL;
  const chave = env.SUPABASE_PUBLISHABLE_KEY;

  const faltando = [["SUPABASE_URL", url], ["SUPABASE_PUBLISHABLE_KEY", chave]].filter((p) => !p[1]).map((p) => p[0]);
  if (faltando.length) return { status: 503, json: { ok: false, motivo: "sem-configuracao", faltando } };

  const ctl = new AbortController();
  const relogio = setTimeout(() => ctl.abort(), o.tempoMax || TEMPO_MAXIMO_MS);
  try {
    // A tabela leads existe, mas com a chave pública a regra de segurança por linha não deixa ler nenhuma linha.
    const r = await buscar(url.replace(/\/$/, "") + "/rest/v1/leads?select=id&limit=1", { headers: { apikey: chave }, signal: ctl.signal });
    if (r.status === 401 || r.status === 403) return { status: 502, json: { ok: false, motivo: "chave-recusada" } };
    if (r.status >= 500) return { status: 502, json: { ok: false, motivo: "banco-fora" } };
    if (r.status !== 200) return { status: 502, json: { ok: false, motivo: "resposta-inesperada", statusDoBanco: r.status } };
    const linhas = await r.json();
    return { status: 200, json: { ok: true, conectado: true, linhasVisiveis: Array.isArray(linhas) ? linhas.length : null } };
  } catch (e) {
    return ctl.signal.aborted ? { status: 504, json: { ok: false, motivo: "demorou" } } : { status: 502, json: { ok: false, motivo: "banco-fora" } };
  } finally {
    clearTimeout(relogio);
  }
}

module.exports = { verBanco };
