#!/usr/bin/env node
// Confere lib/banco.js com um banco falso: o que a rota responde em cada caso e, principalmente, que a chave
// nunca aparece na resposta. Sai com código 1 se algo não bater. Roda sozinho ou pelo scripts/check.cjs.
const { verBanco } = require("../lib/banco.js");
const CHAVE = "sb_publishable_CHAVE_DE_TESTE_1234567890";
const env = { SUPABASE_URL: "https://banco-falso.exemplo", SUPABASE_PUBLISHABLE_KEY: CHAVE };
let falhas = 0;
const confere = (n, ok, d) => { console.log((ok ? "ok    " : "FALHA ") + n + (ok ? "" : "  " + d)); if (!ok) falhas++; };
const resposta = (status, corpo) => async () => ({ status, json: async () => corpo });

(async () => {
  let r = await verBanco({ env, buscar: resposta(200, []) });
  confere("banco responde e a regra de segurança não deixa ler linha nenhuma: 200, linhasVisiveis 0", r.status === 200 && r.json.conectado === true && r.json.linhasVisiveis === 0, JSON.stringify(r));
  let visto;
  r = await verBanco({ env, buscar: async (u, init) => { visto = { u, h: init.headers }; return { status: 200, json: async () => [] }; } });
  confere("a chave vai ao banco no cabeçalho apikey, não na URL", visto.h.apikey === CHAVE && !visto.u.includes(CHAVE), JSON.stringify(visto));
  r = await verBanco({ env: {}, buscar: resposta(200, []) });
  confere("sem as variáveis: 503 dizendo só os NOMES que faltam", r.status === 503 && r.json.motivo === "sem-configuracao" && r.json.faltando.length === 2, JSON.stringify(r));
  r = await verBanco({ env, buscar: resposta(401, {}) });
  confere("banco recusa a chave: 502 chave-recusada", r.status === 502 && r.json.motivo === "chave-recusada");
  r = await verBanco({ env, buscar: resposta(500, {}) });
  confere("banco quebra: 502 banco-fora", r.status === 502 && r.json.motivo === "banco-fora");
  r = await verBanco({ env, buscar: (u, init) => new Promise((_, rejeita) => init.signal.addEventListener("abort", () => rejeita(new Error("abortado")))), tempoMax: 200 });
  confere("banco não responde: 504 demorou", r.status === 504 && r.json.motivo === "demorou");
  r = await verBanco({ env, buscar: async () => { throw new Error("conexão recusada com " + CHAVE); } });
  confere("conexão derrubada: 502 banco-fora, sem repetir a mensagem de erro do sistema", r.status === 502 && r.json.motivo === "banco-fora");
  const todas = [200, 401, 500].map((s) => verBanco({ env, buscar: resposta(s, { erro: CHAVE }) }));
  const textos = JSON.stringify(await Promise.all(todas)) + JSON.stringify(await verBanco({ env: {}, buscar: resposta(200, []) }));
  confere("a chave NUNCA aparece em nenhuma resposta, nem quando o banco a repete no erro", !textos.includes(CHAVE) && !textos.includes("CHAVE_DE_TESTE"));
  console.log(falhas ? "\n" + falhas + " falha(s)." : "\nA chave fica no servidor em todos os casos.");
  process.exit(falhas ? 1 : 0);
})();
