#!/usr/bin/env node
// Check da landing Ravena Solar. Roda: node scripts/check.cjs
// Sai com código 1 se qualquer verificação falhar. Não altera nenhum arquivo.
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const ler = (p) => fs.readFileSync(path.join(raiz, p), "utf8");

const html = ler("index.html");
const css = ler("styles.css");
const logo = ler("assets/logo.svg");
const design = ler("DESIGN.md");
const appPath = path.join(raiz, "app.js");
const app = require(appPath);

let falhas = 0;
let total = 0;
function verifica(nome, ok, detalhe) {
  total++;
  if (ok) {
    console.log("ok    " + nome);
  } else {
    falhas++;
    console.log("FALHA " + nome + (detalhe ? "\n        " + detalhe : ""));
  }
}

// ---------- texto visível ----------
const corpo = html.split("<body>")[1] || html;
const visivel = corpo
  .replace(/<script[\s\S]*?<\/script>/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&rarr;/g, "->")
  .replace(/&[a-z]+;/g, " ")
  .replace(/\s+/g, " ");

// ---------- cores ----------
function token(nome) {
  const m = css.match(new RegExp("--" + nome + ":\\s*(#[0-9A-Fa-f]{6})"));
  return m ? m[1].toUpperCase() : null;
}
const marinho = token("marinho");
const ambar = token("ambar");
const laranja = token("laranja");
const papel = token("papel");
const branco = token("branco");
const suave = token("tinta-suave");
const sol = token("sol");
const logoHex = (logo.match(/#[0-9A-Fa-f]{6}/g) || []).map((h) => h.toUpperCase());

verifica("tokens de marca existem no CSS", !!(marinho && ambar && laranja), [marinho, ambar, laranja].join(" "));
for (const [nome, hex] of [["marinho", marinho], ["ambar", ambar], ["laranja", laranja]]) {
  verifica("--" + nome + " " + hex + " vem de assets/logo.svg", logoHex.includes(hex));
}
verifica("DESIGN.md cita os mesmos três valores", [marinho, ambar, laranja].every((h) => design.toUpperCase().includes(h)));

function lum(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contraste(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
const pares = [
  ["texto marinho sobre branco", marinho, branco],
  ["texto marinho sobre papel", marinho, papel],
  ["texto de apoio sobre branco", suave, branco],
  ["texto de apoio sobre papel", suave, papel],
  ["botão: marinho sobre âmbar", marinho, ambar],
  ["seção escura: branco sobre marinho", branco, marinho],
  ["rótulo da legenda: marinho sobre sol", marinho, sol],
  ["texto de apoio sobre sol", suave, sol],
];
for (const [nome, fg, bg] of pares) {
  const r = contraste(fg, bg);
  verifica("contraste " + nome + " " + r.toFixed(2) + ":1 (mín. 4,5)", r >= 4.5);
}
const usosLaranjaTexto = [...css.matchAll(/([^{}]+)\{[^}]*?(?<![-\w])color:\s*var\(--laranja\)/g)].map((m) => m[1].trim());
const so_grandes = new Set([".resultado .faixa-valor em"]);
verifica("laranja só em texto grande (número de 32 px ou mais sobre o painel branco): " + usosLaranjaTexto.join(" | "), usosLaranjaTexto.length > 0 && usosLaranjaTexto.every((u) => so_grandes.has(u)));
for (const [nome, bg] of [["branco", branco]]) {
  const r = contraste(laranja, bg);
  verifica("contraste laranja sobre " + nome + " " + r.toFixed(2) + ":1 (texto grande, mín. 3)", r >= 3);
}

// ---------- design ----------
const tamanhos = [...css.matchAll(/font-size:\s*([^;]+);/g)].map((m) => m[1].trim());
const tamanhosOk = new Set(["var(--t-corpo)", "var(--t-rotulo)", "var(--t-lead)", "var(--t-h2)", "var(--t-h1)"]);
const fora = tamanhos.filter((t) => !tamanhosOk.has(t));
verifica("só cinco tamanhos de fonte, todos pelos tokens", fora.length === 0, "fora do sistema: " + fora.join(", "));
const gradientes = (css.match(/gradient\(/g) || []).length;
verifica("gradiente só no hero (1 uso) e sem text-shadow", gradientes === 1 && /\.hero\s*{[^}]*linear-gradient/.test(css) && !/text-shadow/.test(css));
verifica("movimento respeita prefers-reduced-motion", /@media \(prefers-reduced-motion: reduce\)/.test(css) && /\.js \.revela\s*{[^}]*opacity: 0/.test(css) && /<script>document\.documentElement\.className \+= " js";<\/script>/.test(html));
const escala = new Set(["0", "8", "16", "24", "48", "96"]);
const espacos = [...css.matchAll(/--e[1-5]:\s*(\d+)px/g)].map((m) => m[1]);
verifica("escala de espaço é 8, 16, 24, 48, 96", espacos.join(",") === "8,16,24,48,96", espacos.join(","));
verifica("alvo de toque: botão, campos, abas e controle com 48 px", (css.match(/min-height:\s*48px/g) || []).length >= 5);

// ---------- estrutura ----------
verifica("tem meta viewport", /<meta name="viewport" content="width=device-width, initial-scale=1">/.test(html));
verifica("tem um h1 só", (html.match(/<h1[\s>]/g) || []).length === 1);
const imgs = html.match(/<img\b[^>]*>/g) || [];
verifica("toda imagem tem alt", imgs.length > 0 && imgs.every((t) => /\balt="[^"]+"/.test(t)), imgs.length + " imagens");
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const ancoras = [...html.matchAll(/href="#([^"]*)"/g)].map((m) => m[1]).filter((a) => a && a !== "#");
const quebradas = ancoras.filter((a) => !ids.has(a));
verifica("toda âncora interna aponta para um id", quebradas.length === 0, "quebradas: " + quebradas.join(", "));
const fors = [...html.matchAll(/<label for="([^"]+)"/g)].map((m) => m[1]);
verifica("todo label aponta para um campo", fors.length === 5 && fors.every((f) => ids.has(f)), fors.join(","));
verifica("lang pt-BR", /<html lang="pt-BR">/.test(html));

// ---------- ação única ----------
const botoes = [...html.matchAll(/<(?:a|button)\b[^>]*class="btn"[^>]*>([^<]+)</g)].map((m) => m[1].trim());
verifica("o botão de ação diz a mesma coisa em todo lugar", botoes.length >= 3 && new Set(botoes).size === 1, JSON.stringify(botoes));
verifica("todo link de ação leva ao formulário", [...html.matchAll(/<a class="btn" href="([^"]+)"/g)].every((m) => m[1] === "#simulacao"));
verifica("não há segundo link de contato concorrente (tel:, mailto:, wa.me no HTML)", !/href="(tel:|mailto:|https?:\/\/wa\.me)/.test(html));

// ---------- o que a página não pode dizer ----------
const proibidos = ["grátis", "gratuit", "revolução", "energia do futuro", "sustentabilidade", "95%", "100%", "garantid", "sem risco"];
const achados = proibidos.filter((p) => visivel.toLowerCase().includes(p));
verifica("nenhuma expressão proibida no texto visível", achados.length === 0, "achei: " + achados.join(", "));

// ---------- fatos do brief ----------
const fatos = [
  ["412 sistemas", /\b412\b/],
  ["nota 4,8", /4,8/],
  ["137 avaliações", /\b137\b/],
  ["caso R$ 780", /R\$ 780/],
  ["caso R$ 118", /R\$ 118/],
  ["6,4 kWp", /6,4 kWp/],
  ["março de 2025", /março de 2025/],
  ["investimento R$ 14 mil a R$ 19 mil", /R\$ 14 mil a R\$ 19 mil/],
  ["5 a 8 kWp", /5 a 8 kWp/],
  ["12 a 20 painéis", /12 a 20 painéis/],
  ["retorno de 3 a 4 anos", /3 a 4 anos/],
  ["75% a 90%", /75% a 90%/],
  ["prazo de 45 a 60 dias", /45 a 60 dias/],
  ["garantia 25 anos", /25 anos/],
  ["garantia 10 anos", /10 anos/],
  ["garantia 5 anos", /5 anos/],
  ["Lei 14.300", /Lei 14\.300/],
  ["CPFL", /CPFL/],
  ["conta mínima R$ 450", /R\$ 450/],
  ["80 km", /80 km/],
  ["as quatro cidades", /Sorocaba.*Votorantim.*Itu.*Salto/],
  ["a conta não zera", /A conta não zera/],
  ["resposta no mesmo dia útil", /mesmo dia útil/],
];
for (const [nome, re] of fatos) verifica("fato do brief presente: " + nome, re.test(visivel));

const numerosDoHtml = [...visivel.matchAll(/R\$\s?\d+(?:\.\d{3})*(?:\s?mil)?/g)].map((m) => m[0].replace(/\s+/g, " "));
// R$ 1.500 é só o topo da escala do controle deslizante, não um dado do cliente.
const permitidos = new Set(["R$ 780", "R$ 118", "R$ 14 mil", "R$ 19 mil", "R$ 450", "R$ 1.500"]);
const estranhos = numerosDoHtml.filter((n) => !permitidos.has(n));
verifica("nenhum valor em reais fora do brief", estranhos.length === 0, "fora do brief: " + estranhos.join(", "));

const caso = (780 - 118) / 780;
verifica("o caso (780 para 118) cai " + (caso * 100).toFixed(1) + "%, dentro da faixa de 75% a 90%", caso >= 0.75 && caso <= 0.9);

// ---------- interação: faixa da conta ----------
const faixaHtml = html.match(/<input id="faixa-conta" type="range" min="(\d+)" max="(\d+)"/);
verifica("controle da conta começa no mínimo da empresa (R$ 450)", !!faixaHtml && +faixaHtml[1] === app.CONTA_MINIMA);
const f780 = app.faixaDaConta(780);
verifica("faixa de R$ 780: " + f780.min + " a " + f780.max + " (75% a 90% de queda)", f780.min === 78 && f780.max === 195);
verifica("o caso real (R$ 118) cai dentro da faixa de R$ 780", 118 >= f780.min && 118 <= f780.max);
const nunca0 = [450, 780, 1500].every((c) => app.faixaDaConta(c).min > 0);
verifica("a faixa nunca chega a zero (a conta não zera)", nunca0);
verifica("a ressalva (não é promessa, a conta não zera) está junto do resultado", /id="faixa-ressalva">[^<]*Não é promessa[^<]*A conta não zera/.test(html));

// ---------- interação: etapas ----------
const abas = [...html.matchAll(/role="tab" id="(aba-\d)" aria-controls="(passo-\d)"/g)];
verifica("seis abas de etapa", abas.length === 6);
verifica("cada aba aponta para um painel existente", abas.every((a) => ids.has(a[2])));
verifica("só a primeira aba começa selecionada", (html.match(/aria-selected="true"/g) || []).length === 1);

// ---------- ilustrações ----------
const ilus = [...html.matchAll(/<div class="ilustra[^"]*" role="img" aria-label="([^"]+)">/g)];
verifica("cinco ilustrações, todas com role=img e descrição", ilus.length === 5, String(ilus.length));
verifica("svgs decorativos escondidos do leitor de tela", (html.match(/<svg [^>]*aria-hidden="true"/g) || []).length === 5);
const hexSvg = [...new Set((html.match(/(?:fill|stroke)="(#[0-9A-Fa-f]{6})"/g) || []).map((m) => m.slice(-8, -1).toUpperCase()))];
const paleta = new Set([marinho, ambar, laranja, sol, papel, branco, suave]);
const forasDaPaleta = hexSvg.filter((h) => !paleta.has(h));
verifica("ilustrações só usam a paleta do DESIGN.md", forasDaPaleta.length === 0, "fora: " + forasDaPaleta.join(", "));

// ---------- formulário ----------
const ok = { nome: "Marta Souza", whatsapp: "15 99876-5432", cidade: "Itu", conta: "620" };
verifica("formulário: dados válidos passam", Object.keys(app.validar(ok)).length === 0);
verifica("formulário: conta de R$ 200 é bloqueada", !!app.validar({ ...ok, conta: "200" }).conta);
verifica("formulário: R$ 449 é bloqueado e R$ 450 passa", !!app.validar({ ...ok, conta: "449" }).conta && !app.validar({ ...ok, conta: "450" }).conta);
verifica("formulário: cidade fora do raio é bloqueada", !!app.validar({ ...ok, cidade: "outra" }).cidade);
verifica("formulário: sem cidade é bloqueado", !!app.validar({ ...ok, cidade: "" }).cidade);
verifica("formulário: WhatsApp curto é bloqueado", !!app.validar({ ...ok, whatsapp: "9876" }).whatsapp);
verifica("formulário: WhatsApp com +55 passa", !app.validar({ ...ok, whatsapp: "+55 15 99876-5432" }).whatsapp);
verifica("formulário: nome vazio é bloqueado", !!app.validar({ ...ok, nome: " " }).nome);
verifica("formulário: aceita 1.200 e 1200,50", app.lerValor("1.200") === 1200 && app.lerValor("1200,50") === 1200.5);
verifica("formulário: conta não numérica é bloqueada", !!app.validar({ ...ok, conta: "abc" }).conta);
const msg = app.montarMensagem(ok);
verifica("mensagem de WhatsApp leva os quatro dados", ["Marta Souza", "15 99876-5432", "Itu", "620"].every((s) => msg.includes(s)));
const url = app.linkWhatsApp(ok);
verifica("link do WhatsApp é wa.me com o texto codificado", /^https:\/\/wa\.me\/\d{12,13}\?text=/.test(url) && !url.includes(" "));
const defs = (ler("app.js").match(/var WHATSAPP\s*=/g) || []).length;
verifica("número de WhatsApp definido em um só lugar e marcado como pendente", defs === 1 && /PENDENTE/.test(ler("app.js")));

console.log("\n" + (total - falhas) + " de " + total + " verificações passaram.");
process.exit(falhas ? 1 : 0);
