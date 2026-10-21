#!/usr/bin/env node
// Check da landing Ravena Solar. Roda: node scripts/check.cjs
// Sai com código 1 se qualquer verificação falhar. Não altera nenhum arquivo.
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const ler = (p) => fs.readFileSync(path.join(raiz, p), "utf8");

const html = ler("app/conteudo.html");
const layout = ler("app/layout.js");
const css = ler("app/styles.css");
const logo = ler("public/assets/logo.svg");
const design = ler("DESIGN.md");
const appPath = path.join(raiz, "public/app.js");
const app = require(appPath);
const cena = require(path.join(raiz, "public/cena.js"));
const cenaJs = ler("public/cena.js");
const appJs = ler("public/app.js");

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
const noite = token("noite");
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
const so_grandes = new Set([".conta-card .antes"]);
verifica("laranja só em texto grande (número de 32 px ou mais sobre o cartão branco): " + usosLaranjaTexto.join(" | "), usosLaranjaTexto.length > 0 && usosLaranjaTexto.every((u) => so_grandes.has(u)));
for (const [nome, bg] of [["branco", branco]]) {
  const r = contraste(laranja, bg);
  verifica("contraste laranja sobre " + nome + " " + r.toFixed(2) + ":1 (texto grande, mín. 3)", r >= 3);
}

// ---------- design ----------
const tamanhos = [...css.matchAll(/font-size:\s*([^;]+);/g)].map((m) => m[1].trim());
const tamanhosOk = new Set(["var(--t-corpo)", "var(--t-rotulo)", "var(--t-lead)", "var(--t-h2)", "var(--t-h1)"]);
const fora = tamanhos.filter((t) => !tamanhosOk.has(t));
verifica("só cinco tamanhos de fonte, todos pelos tokens", fora.length === 0, "fora do sistema: " + fora.join(", "));
const cssSemComentarios = css.replace(/\/\*[\s\S]*?\*\//g, "");
const usosGradiente = [...cssSemComentarios.matchAll(/([^{}]+)\{[^}]*?gradient\(/g)].map((m) => m[1].trim());
const gradPermitidos = new Set([".hero", ".hero-luz", ".destaque::after"]);
verifica("gradiente só no fundo do hero, na luz do hero e no brilho do marca-texto: " + usosGradiente.join(" | "), usosGradiente.length === 3 && usosGradiente.every((u) => gradPermitidos.has(u)) && !/text-shadow/.test(css));
verifica("movimento respeita prefers-reduced-motion", /@media \(prefers-reduced-motion: reduce\)/.test(css) && /\.js \.revela\s*{[^}]*opacity: 0/.test(css) && /document\.documentElement\.className \+= " js";/.test(layout));
const escala = new Set(["0", "8", "16", "24", "48", "96"]);
const espacos = [...css.matchAll(/--e[1-5]:\s*(\d+)px/g)].map((m) => m[1]);
verifica("escala de espaço é 8, 16, 24, 48, 96", espacos.join(",") === "8,16,24,48,96", espacos.join(","));
verifica("alvo de toque de 48 px no botão, nos campos e nas perguntas", /\.btn \{[^}]*min-height: 48px/.test(css) && /input\[type="text"\], input\[type="tel"\], select \{[^}]*min-height: 48px/.test(css) && /\.faq-item button \{[^}]*min-height: 48px/.test(css));

// ---------- estrutura ----------
verifica("tem meta viewport", /export const viewport = \{ width: "device-width", initialScale: 1 \};/.test(layout));
verifica("tem um h1 só", (html.match(/<h1[\s>]/g) || []).length === 1);
const imgs = html.match(/<img\b[^>]*>/g) || [];
verifica("toda imagem tem alt", imgs.length > 0 && imgs.every((t) => /\balt="[^"]+"/.test(t)), imgs.length + " imagens");
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const ancoras = [...html.matchAll(/href="#([^"]*)"/g)].map((m) => m[1]).filter((a) => a && a !== "#");
const quebradas = ancoras.filter((a) => !ids.has(a));
verifica("toda âncora interna aponta para um id", quebradas.length === 0, "quebradas: " + quebradas.join(", "));
const fors = [...html.matchAll(/<label for="([^"]+)"/g)].map((m) => m[1]);
verifica("todo label aponta para um campo (quatro, do formulário)", fors.length === 4 && fors.every((f) => ids.has(f)), fors.join(","));
verifica("lang pt-BR", /<html lang="pt-BR"/.test(layout));

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
verifica("a conta mínima do formulário é R$ 450", app.CONTA_MINIMA === 450);
const f780 = app.faixaDaConta(780);
verifica("faixa de R$ 780: " + f780.min + " a " + f780.max + " (75% a 90% de queda)", f780.min === 78 && f780.max === 195);
verifica("o caso real (R$ 118) cai dentro da faixa de R$ 780", 118 >= f780.min && 118 <= f780.max);
const nunca0 = [450, 780, 1500].every((c) => app.faixaDaConta(c).min > 0);
verifica("a faixa nunca chega a zero (a conta não zera)", nunca0);
verifica("a conta explica a faixa média e que ela não zera, junto das barras", /<div class="conta-fecho[^"]*">\s*<p class="lead">[^<]*75% a 90%[^<]*não zera/.test(html));

// ---------- interação: etapas ----------
verifica("seis etapas na trilha vertical, cada uma com ícone animado, e a bolinha que desce", (html.match(/<li class="tv-passo">/g) || []).length === 6 && (html.match(/<div class="tv-icone">/g) || []).length === 6 && /id="tv-bola"/.test(html) && /id="tv-feito"/.test(html) && !/role="tab"/.test(html));
verifica("a bolinha acende cada ponto que alcança e apaga quando volta (toggle de .alcancado), e a trilha respeita movimento reduzido", /classList\.toggle\("alcancado", yAtual >= pos\[i\] - 6\)/.test(appJs) && /passos\.forEach\(function \(p\) \{ p\.classList\.add\("alcancado"\); \}\)/.test(appJs) && /\.tv-bola, \.tv-feito \{ display: none; \}/.test(css));

// ---------- ilustrações ----------
const todosSvg = html.match(/<svg\b[^>]*>/g) || [];
const svgCena = todosSvg.filter((t) => /id="cena"/.test(t));
const svgDecor = todosSvg.filter((t) => !/id="cena"/.test(t));
verifica("todo svg é decorativo (aria-hidden), menos a cena, que tem role=img e descrição", svgCena.length === 1 && svgDecor.every((t) => /aria-hidden="true"/.test(t)) && /role="img" aria-label="[^"]{40,}"/.test(svgCena[0]), svgDecor.length + " svgs decorativos");
const rolesImg = [...html.matchAll(/role="img" aria-label="([^"]+)"/g)];
verifica("cada imagem tem descrição própria de verdade (30 caracteres ou mais): " + rolesImg.length + " imagens", rolesImg.length === 6 && rolesImg.every((m) => m[1].length >= 30));
const hexSvg = [...new Set((html.match(/(?:fill|stroke|stop-color)="(#[0-9A-Fa-f]{6})"/g) || []).map((m) => m.slice(-8, -1).toUpperCase()))];
const painelTokens = ["#2A6E9C", "#1A4C72", "#0F3350"];
const paleta = new Set([marinho, ambar, laranja, sol, papel, branco, suave, noite, ...painelTokens]);
const forasDaPaleta = hexSvg.filter((h) => !paleta.has(h));
verifica("ilustrações só usam a paleta do DESIGN.md (inclui o vidro do painel)", forasDaPaleta.length === 0, "fora: " + forasDaPaleta.join(", "));
verifica("DESIGN.md documenta as três cores do vidro do painel", painelTokens.every((h) => design.toUpperCase().includes(h)));
verifica("a casa é desenhada uma vez e reaproveitada (hero, cena do sol e cena da chuva usam o mesmo símbolo)", (html.match(/<symbol id="casa-arte"/g) || []).length === 1 && (html.match(/<use href="#casa-arte"/g) || []).length === 3);
const celulas = (html.match(/<polygon points="[^"]+" fill="url\(#g-painel\)"/g) || []).length;
verifica("oito painéis no telhado, em perspectiva (" + celulas + " polígonos de vidro)", celulas === 8);

// ---------- cena guiada pelo scroll ----------
verifica("--noite " + noite + " existe no CSS, no DESIGN.md e na última parada do céu", !!noite && design.toUpperCase().includes(noite) && cenaJs.toUpperCase().includes('[1.0, "' + noite + '"]'));
verifica("a cena tem role=img e descrição", /<svg id="cena"[^>]*role="img" aria-label="[^"]{40,}"/.test(html));
const ptsCena = (html.match(/<ol class="pontos"[\s\S]*?<\/ol>/) || [""])[0];
verifica("seis capítulos de texto e seis pontos de navegação", (html.match(/<span class="num">0\d<\/span>/g) || []).length === 6 && (ptsCena.match(/<button type="button" aria-label="Capítulo \d/g) || []).length === 6);
verifica("o modo de rolagem (.scrub) só é ligado pelo JavaScript, nunca vem no HTML", !/class="[^"]*\bscrub\b/.test(html) && /classList\.add\("scrub"\)/.test(cenaJs));
verifica("a cena respeita prefers-reduced-motion: parada, com todos os textos abertos e nada escondido fora do modo de rolagem", /prefers-reduced-motion: reduce/.test(cenaJs) && /aplica\(0\.55\)/.test(cenaJs) && /\.cap-corpo \{ display: grid; grid-template-rows: 1fr; \}/.test(css) && /html\.scrub \.cap-corpo \{ grid-template-rows: 0fr;/.test(css) && /html\.scrub \.capitulos li:not\(\.ativo\) \{ display: none; \}/.test(css) && !/^\s*\.capitulos li:not/m.test(css));
const pm = (appJs.match(/addEventListener\("pointermove"/g) || []).length;
verifica("nada segue o mouse fora do hero: cursor, ímã e inclinação foram removidos, e há um só pointermove, no hero", !/\.cursor\b|cursor-ponto/.test(css) && !/class="cursor/.test(html) && pm === 1 && /hero\.addEventListener\("pointermove"/.test(appJs) && !/magnet|perspective\(/.test(appJs));
verifica("a interação do hero só existe com mouse e sem redução de movimento", /\(pointer: fine\)/.test(appJs) && appJs.indexOf("if (semMovimento || !comMouse) return;") > 0 && appJs.indexOf("if (semMovimento || !comMouse) return;") < appJs.indexOf('hero.addEventListener("pointermove"') && /\.hero-luz \{ display: none; \}/.test(css));
verifica("alvo de toque dos pontos laterais tem 48 px", /\.pontos button \{ width: 48px; height: 48px;/.test(css));
const c0 = cena.estadoCena(0), c40 = cena.estadoCena(0.4), c80 = cena.estadoCena(0.8), c100 = cena.estadoCena(1);
verifica("sol: começa no horizonte (y " + c0.solY + "), passa no alto (y " + c40.solY.toFixed(0) + ") e se põe (y " + c80.solY.toFixed(0) + ")", c0.solY >= cena.HORIZONTE && c40.solY < 150 && c80.solY >= cena.HORIZONTE - 1);
verifica("o sol cruza da esquerda para a direita, sem voltar", [0, 0.2, 0.4, 0.6, 0.8].map((p) => cena.estadoCena(p).solX).every((x, i, a) => i === 0 || x > a[i - 1]));
verifica("painéis só acendem com sol: apagados em 0 e em 1, acesos no meio", c0.painel === 0 && c100.painel === 0 && cena.estadoCena(0.5).painel > 0.9);
verifica("o sol some de vista à noite (não aparece através do chão)", c100.solVisivel === 0 && cena.estadoCena(0.5).solVisivel === 1);
verifica("à noite: estrelas e lua aparecem, o painel e o inversor apagam", c100.estrelas > 0.95 && c100.lua > 0.95 && c100.led === 0 && cena.estadoCena(0.5).estrelas === 0);
verifica("a energia só vai para a rede durante o dia, e volta à noite", cena.estadoCena(0.68).redeSai > 0.9 && c100.redeSai === 0 && c100.redeEntra > 0.95 && cena.estadoCena(0.68).redeEntra === 0);
verifica("o crédito cresce de dia (p=0.78 > p=0.6) e nunca zera por completo à noite", cena.estadoCena(0.78).credito > cena.estadoCena(0.6).credito && c100.credito > 0 && cena.estadoCena(0.6).credito === 0);
verifica("capítulos em ordem: 0, 0.2, 0.35, 0.5, 0.7, 0.9 mapeiam para 0 a 5", [0, 0.2, 0.35, 0.5, 0.7, 0.9].map(cena.capituloDe).join("") === "012345");
verifica("capítulo 3 é o do inversor e o texto cita os 10 anos do brief", /<h3>O inversor[^<]*<\/h3><div class="cap-corpo"><p>[^<]*10 anos de garantia/.test(html));
verifica("a cena não promete número que o brief não deu (nenhum R$ nem % nos capítulos)", !/<ol class="capitulos">[\s\S]*?<\/ol>/.exec(html)[0].match(/R\$|%/));
verifica("céu de dia é o token --sol e à noite é --noite", cena.corDoCeu(0).toUpperCase() === sol && cena.corDoCeu(1).toUpperCase() === noite);

// ---------- hero, módulos, navbar, perguntas ----------
const heroTexto = (html.match(/<div class="hero-texto">([\s\S]*?)<\/div>\s*<div class="hero-visual">/) || [, ""])[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const jargao = ["kWp", "kW", "inversor", "homologação", "fotovoltaic", "CPFL", "Lei 14", "integradora", "performance", "injeta"];
verifica("hero sem jargão: nenhuma destas palavras no texto do hero: " + jargao.join(", "), jargao.every((j) => !heroTexto.toLowerCase().includes(j.toLowerCase())), heroTexto);
verifica("hero diz o que é o produto: painéis solares, telhado, conta de luz", ["painéis solares", "telhado", "conta de luz"].every((t) => heroTexto.toLowerCase().includes(t)));
const h1 = (html.match(/<h1>([\s\S]*?)<\/h1>/) || [, ""])[1].replace(/<[^>]+>/g, "");
verifica("o título do hero é curto (" + h1.length + " caracteres, máx. 80) e tem um destaque", h1.length <= 80 && /<span class="destaque">[^<]+<\/span>/.test(html));
verifica("a conta do hero desce de R$ 780 para R$ 118 (valores do brief)", /data-de="780" data-ate="118">118</.test(html) && /class="antes">R\$ 780</.test(html));
const heroTexto2 = heroTexto;
// A revisão 4 tinha 441 caracteres no texto do hero (mais 148 no cartão). Pedido: muito menos informação.
verifica("hero enxuto: menos de um terço dos 441 caracteres da versão anterior (" + heroTexto.length + "), sem nota de rodapé", heroTexto.length < 441 / 3 && !/<p class="apoio">/.test((html.match(/<div class="hero-texto">[\s\S]*?<div class="hero-visual">/) || [""])[0]), heroTexto);
verifica("o cartão da economia fica abaixo da casa, nunca sobre ela (sem position: absolute)", !/\.conta-card \{[^}]*position: absolute/.test(css) && html.indexOf('class="ilustra ilustra-hero"') < html.indexOf('class="conta-card"'));
const queda = Math.round(((780 - 118) / 780) * 100);
verifica("o selo de queda no hero é " + queda + "% (780 para 118)", new RegExp('class="selo-queda">−' + queda + "%<").test(html));
verifica("o efeito do título volta toda vez que o hero reaparece (hero é .replay e o marca-texto só anima em .hero.visivel)", /<section class="hero replay"/.test(html) && /\.js \.hero\.visivel \.destaque::before \{ animation: marca/.test(css) && /\.js \.destaque::before \{ transform: scaleX\(0\); \}/.test(css));
verifica("blocos animados só começam bem dentro da tela e recomeçam ao voltar (margem de 12%, 30% visível, classe tirada ao sair)", /rootMargin: "-12% 0px -12% 0px"/.test(appJs) && /intersectionRatio >= 0\.3/.test(appJs) && /classList\.remove\("visivel"\)/.test(appJs));
verifica("números da prova: contam só quando o bloco chega ao meio da tela (margem de 25% em cima e embaixo), de novo a cada volta, em 1,6 s; a conta do hero desce em 2,2 s", /rootMargin: "-25% 0px -25% 0px", threshold: 0/.test(appJs) && /class="numeros revela meio"/.test(html) && /querySelectorAll\("\.revela:not\(\.meio\)"\)/.test(appJs) && /meio\.classList\.remove\("visivel"\);\s*zera\(\);/.test(appJs) && /\/ 1600, 1\)/.test(appJs) && /var dur = el\.closest\("\.hero"\) \? 2200 : 1800;/.test(appJs));
verifica("os números da prova observam o bloco pai, que não se desloca (observar o bloco que sobe 24 px ao aparecer fazia os valores subirem e descerem em laço)", /\.observe\(meio\.closest\("\.prova"\) \|\| meio\)/.test(appJs) && /<div class="prova">\s*<div class="wrap">\s*<div class="numeros revela meio">/.test(html) && !/\.prova \{[^}]*transform/.test(css));
verifica("conta antes e depois e linha de 25 anos têm uma linha do tempo só: a barra e o número saem da mesma variável, sem transições soltas no CSS", /linhaDoTempo\(contaViz, 3600/.test(appJs) && /--ph", h\.toFixed/.test(appJs) && /de0 \+ \(ate0 - de0\) \* h/.test(appJs) && /linhaDoTempo\(anosViz, 3600/.test(appJs) && !/\.js \.visivel \.(cv|anos)-/.test(css) && /\.cv-depois \{ width: calc\(var\(--w\) \* var\(--ph, 1\)\)/.test(css) && /\.anos-barra \{[^}]*width: calc\(var\(--w\) \* var\(--p, 1\)\)/.test(css));
const cvw = (html.match(/class="cv-barra cv-depois" style="--w:([\d.]+)%"/) || [])[1];
verifica("a barra de hoje tem " + cvw + "% da barra de antes (118/780 = " + ((118 / 780) * 100).toFixed(1) + "%)", Math.abs(+cvw - (118 / 780) * 100) < 0.2);
const fx = html.match(/class="cv-faixa" style="--ini:(\d+)%;--fim:(\d+)%"/);
const f100 = app.faixaDaConta(100);
verifica("a faixa média desenhada nas barras (" + (fx && fx[1]) + "% a " + (fx && fx[2]) + "%) é a que o modelo calcula (" + f100.min + "% a " + f100.max + "%)", !!fx && +fx[1] === f100.min && +fx[2] === f100.max);
verifica("o caso real (6,4 kWp, março de 2025) vem com a média de doze meses junto das barras", /<figcaption>[^<]*6,4 kWp[^<]*março de 2025[^<]*média dos últimos doze meses/.test(html));
const anos = [...html.matchAll(/<div class="anos-barra( [a-z ]+)?" style="--w:(\d+)%"><b>([^<]+)<\/b>/g)].map((m) => [m[1] ? m[1].trim() : "", +m[2], m[3]]);
const garantias = anos.filter((a) => a[0].indexOf("retorno") < 0);
verifica("a linha do tempo de 25 anos é proporcional: garantias de 5, 10 e 25 anos e retorno de 3 a 4 anos", anos.length === 4 && garantias.every(([, w, t]) => Math.abs(w - (parseInt(t, 10) / 25) * 100) < 0.5) && anos.filter((a) => a[0].indexOf("retorno") >= 0).every(([, w]) => w >= (3 / 25) * 100 - 0.5 && w <= (4 / 25) * 100 + 0.5), JSON.stringify(anos));
verifica("o eixo da linha do tempo vai de 0 a 25 anos", /<div class="anos-eixo"[^>]*><span>0<\/span><span>5<\/span><span>10<\/span><span>15<\/span><span>20<\/span><span>25 anos<\/span>/.test(html));
verifica("mapa: Sorocaba no centro e três pinos, com o raio de 80 km e ondas", (html.match(/<circle class="pin"/g) || []).length === 4 && /class="raio-80"/.test(html) && (html.match(/class="onda o\d"/g) || []).length === 3);
const blocoChuva = (html.match(/<div class="chuva-mini replay"[\s\S]*?<\/svg>/) || [""])[0];
verifica("telhado protegido: um bloco pequeno (texto de um lado, animação do outro), sem cena grande nem scroll preso", /<div class="wrap chuva-mini-grade">/.test(html) && !/chuva-pista|chuva-palco|scrub2|chuva\.js|ch-passos/.test(html + css + appJs) && !fs.existsSync(path.join(raiz, "chuva.js")));
// Revisão 8 tinha uma cúpula âmbar sobre a casa que o aluno achou parecer "um arco-íris". Pedido: algo pequeno e sutil.
const pecasMini = (blocoChuva.match(/<(?:rect|circle|ellipse|path|line|polygon|text|g|use)\b/g) || []).length;
// A cena da tempestade tinha 231 peças. Pedido: algo pequeno e sutil; critério: menos de um quarto disso.
verifica("animação sutil: " + pecasMini + " peças (a tempestade tinha 231; máximo 231/4 = 57), nenhum texto no desenho, sem cúpula nem arco", pecasMini < 231 / 4 && !/<text\b/.test(blocoChuva) && !/A400 350|A\d+ \d+ 0 0 1/.test(blocoChuva));
verifica("o desenho reaproveita a mesma casa do hero e tem oito gotas (seis no telhado, duas no chão), um selo de garantia e uma nuvem", /<use href="#casa-arte"\/>/.test(blocoChuva) && (blocoChuva.match(/class="mc-gota"/g) || []).length === 8 && /class="mc-selo"/.test(blocoChuva) && /class="nuvem"/.test(blocoChuva));
verifica("a garantia aparece em texto, em destaque, fora da imagem: 5 anos de garantia contra infiltração", /<div class="cinco"><strong>5 anos<\/strong><span>de garantia contra infiltração<\/span><\/div>/.test(html));
verifica("a página não descreve técnica de vedação, fixação ou manta, porque o brief só traz a garantia de 5 anos contra infiltração causada pela obra", !/vedaç|fixaç|gancho|manta|ripa|caibro/i.test(visivel));
verifica("a chuva só anima enquanto o bloco está na tela e volta a tocar quando a pessoa volta (animação só sob .visivel)", /^\.visivel \.mc-gota \{ animation: mc-cai/m.test(css) && /^\.visivel \.mc-respingo \{ animation: mc-respingo/m.test(css) && !/^\.mc-(gota|respingo)[^{]*\{[^}]*animation:/m.test(css) && /class="chuva-mini replay"/.test(html) && !/^\.visivel\s*$/m.test(css));
verifica("com movimento reduzido a chuva some e o selo e a casa aparecem prontos", /\.onda, \.mc-gota, \.mc-respingo \{ display: none; \}/.test(css) && /\.js \.mc-selo \{ transform: none; animation: none; \}|\.js \.mc-selo \{ transform: none/.test(css.replace(/\.js \.pin, \.js \.pop, \.js \.resp, \.js \.barra, \.js \.carimbo, \.js \.mc-selo \{ transform: none; animation: none; \}/, ".js .mc-selo { transform: none; animation: none; }")));
verifica("a pergunta do cliente e a garantia do brief estão ditas junto da cena: E se chover? e 5 anos contra infiltração causada pela obra", /<h2 id="telhado-titulo">E se chover\?<\/h2>\s*<p class="lead[^"]*">[^<]*5 anos[^<]*infiltração[^<]*obra/.test(html));
verifica("a navbar é reta no topo e vira pílula ao rolar", /\.nav \{[^}]*border-radius: 0;/.test(css) && /\.nav-area\.rolou \.nav \{[^}]*border-radius: 999px;/.test(css) && /classList\.toggle\("rolou", window\.scrollY > 24\)/.test(appJs));
const faqBotoes = [...html.matchAll(/<button type="button" id="(faq-b\d)" aria-expanded="(true|false)" aria-controls="(faq-\d)"/g)];
verifica("seis perguntas animadas, todas fechadas ao carregar, com região ligada ao botão", faqBotoes.length === 6 && faqBotoes.every((m) => ids.has(m[3])) && faqBotoes.every((m) => m[2] === "false") && !/class="faq-item[^"]*aberto/.test(html) && !/<details/.test(html));
const faqTextos = [...html.matchAll(/<button type="button" id="faq-b\d"[^>]*><span>([^<]*)<\/span>/g)].map((m) => m[1]);
const doBrief = ["sumir daqui a dois anos", "estragar meu telhado", "Taxaram o sol", "mudar de casa", "nublado", "bateria"];
verifica("as perguntas são as seis do brief, na ordem em que o cliente as faz (o medo de a empresa sumir vem primeiro)", faqTextos.length === 6 && doBrief.every((t, i) => faqTextos[i].includes(t)), JSON.stringify(faqTextos));
const resp1 = (html.match(/id="faq-1"[^>]*><div><p>([^<]*)<\/p>/) || [, ""])[1];
verifica("a resposta ao medo número um usa as provas do brief: seis anos, onze pessoas, 412 sistemas, equipe própria com carteira assinada, 5 anos de garantia, assistência autorizada e acompanhamento no primeiro ano", ["seis anos", "onze pessoas", "412 sistemas", "carteira assinada", "5 anos de garantia", "assistência técnica autorizada", "primeiro ano"].every((t) => resp1.includes(t)), resp1);
verifica("a resposta sobre o telhado só diz o que o brief diz: garantia de 5 anos contra infiltração causada pela obra e visita técnica", /id="faq-2"[^>]*><div><p>[^<]*5 anos[^<]*infiltração causada pela obra[^<]*visita técnica/.test(html));
verifica("sem JavaScript o conteúdo das perguntas continua visível (só colapsa com .js)", /\.faq-corpo \{ display: grid; grid-template-rows: 1fr; \}/.test(css) && /\.js \.faq-corpo \{ grid-template-rows: 0fr;/.test(css));

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
verifica("formulário: cada recusa diz o motivo — conta abaixo do mínimo e cidade longe demais, com um pedido de desculpas", /abaixo do mínimo de R\$ 450/.test(app.validar({ ...ok, conta: "200" }).conta) && /Sentimos muito/.test(app.validar({ ...ok, conta: "200" }).conta) && /longe demais/.test(app.validar({ ...ok, cidade: "outra" }).cidade) && /Sentimos muito, mas não podemos te atender/.test(app.validar({ ...ok, cidade: "Campinas" }).cidade));
verifica("formulário: cidade fora da lista (não só \"outra\") é bloqueada", !!app.validar({ ...ok, cidade: "Campinas" }).cidade);

// servidor: api/pedido.js repete as regras da página
const { responder } = require("../lib/pedido.js");
const chama = (metodo, corpo) => responder(metodo, corpo === undefined || typeof corpo === "string" ? corpo : JSON.stringify(corpo));
verifica("servidor: pedido válido responde 200", chama("POST", ok).status === 200);
const r200 = chama("POST", { ...ok, conta: "200" });
verifica("servidor: conta de R$ 200 responde 422 com o motivo da conta", r200.status === 422 && !!r200.json.erros.conta);
const rFora = chama("POST", { ...ok, cidade: "Campinas" });
verifica("servidor: cidade fora do raio responde 422 com o motivo da cidade", rFora.status === 422 && !!rFora.json.erros.cidade);
verifica("servidor: corpo vazio, texto solto e lista respondem 400", chama("POST", undefined).status === 400 && chama("POST", "isto não é json").status === 400 && chama("POST", []).status === 400);
verifica("servidor: campo que não é texto nem número cai na validação (422, sem quebrar)", chama("POST", { ...ok, conta: { a: 1 }, nome: ["x"] }).status === 422);
verifica("servidor: GET responde 405", chama("GET").status === 405);
verifica("servidor: usa o validar da página, sem regra copiada", /require\("\.\.\/public\/app\.js"\)/.test(ler("lib/pedido.js")) && !/450/.test(ler("lib/pedido.js")) && !/450/.test(ler("app/api/pedido/route.js")));
verifica("página consulta /api/pedido antes de abrir o WhatsApp e só bloqueia com 422", /fetch\("\/api\/pedido"/.test(ler("public/app.js")) && /r\.status !== 422/.test(ler("public/app.js")));
verifica("rota /api/pedido existe na Next e só repassa para lib/pedido.js (sem regra própria)", /import pedido from "\.\.\/\.\.\/\.\.\/lib\/pedido\.js"/.test(ler("app/api/pedido/route.js")) && /export const POST/.test(ler("app/api/pedido/route.js")));
verifica("uma só cópia do app.js (public/), usada pela página e pelo servidor; nada de app.js solto na raiz", fs.existsSync(path.join(raiz, "public/app.js")) && !fs.existsSync(path.join(raiz, "app.js")) && !fs.existsSync(path.join(raiz, "api")));
verifica("os scripts da página ficam no fim do conteúdo, cena.js antes de app.js, como na página estática", /<script src="cena\.js"><\/script>\s*<script src="app\.js"><\/script>\s*$/.test(html));
verifica("Vercel entende o projeto como Next (vercel.json) e tem next, react e react-dom", /"framework":\s*"nextjs"/.test(ler("vercel.json")) && ["next", "react", "react-dom"].every((d) => JSON.parse(ler("package.json")).dependencies[d]));

// ---------- céu de Sorocaba (rota /api/ceu, Open-Meteo) ----------
const ceuLib = require("../lib/ceu.js");
const bomCeu = { current_units: { temperature_2m: "°C", cloud_cover: "%" }, current: { time: "2026-10-21T17:15", temperature_2m: 22.4, cloud_cover: 100, is_day: 1 } };
verifica("céu: lê o formato da Open-Meteo (°C, %, dia) e arredonda", JSON.stringify(ceuLib.normalizar(bomCeu)) === JSON.stringify({ temperatura: 22, nuvem: 100, dia: true, leitura: "2026-10-21T17:15" }));
verifica("céu: recusa unidade trocada (°F), campo faltando, nuvem fora de 0 a 100 e corpo que não é objeto", ceuLib.normalizar({ ...bomCeu, current_units: { temperature_2m: "°F", cloud_cover: "%" } }) === null && ceuLib.normalizar({ ...bomCeu, current: { time: "x", temperature_2m: 20 } }) === null && ceuLib.normalizar({ ...bomCeu, current: { ...bomCeu.current, cloud_cover: 140 } }) === null && ceuLib.normalizar("texto") === null);
verifica("céu: descreve a nuvem em palavras", ceuLib.descrever(0) === "céu aberto" && ceuLib.descrever(30) === "poucas nuvens" && ceuLib.descrever(70) === "bem nublado" && ceuLib.descrever(100) === "céu coberto");
const falhasCeu = require("child_process").spawnSync(process.execPath, [path.join(raiz, "scripts/falhas-ceu.cjs")], { encoding: "utf8" });
verifica("céu: a fonte que não responde, corta, quebra, limita, recusa ou muda a unidade é tratada (14 falhas provocadas de verdade)", falhasCeu.status === 0 && (falhasCeu.stdout.match(/^ok /gm) || []).length === 14, falhasCeu.stdout.slice(-400));
verifica("céu: o navegador só fala com /api/ceu, com limite de tempo, e nunca com a Open-Meteo", /fetch\("\/api\/ceu"/.test(ler("public/app.js")) && /AbortController/.test(ler("public/app.js")) && !/api\.open-meteo/.test(ler("public/app.js")) && /api\.open-meteo\.com/.test(ler("lib/ceu.js")) && /AbortController/.test(ler("lib/ceu.js")) && /import ceu from "\.\.\/\.\.\/\.\.\/lib\/ceu\.js"/.test(ler("app/api/ceu/route.js")));
verifica("céu: a linha fica escondida sem JavaScript, dentro da resposta da pergunta do dia nublado, e traz a fonte", /id="faq-5"[^>]*><div><p>[^<]*<\/p><p class="ceu-agora" id="ceu-agora" role="status" hidden><\/p><\/div>/.test(html) && /Dados: Open-Meteo/.test(ler("public/app.js")));
const msg = app.montarMensagem(ok);
verifica("mensagem de WhatsApp leva os quatro dados", ["Marta Souza", "15 99876-5432", "Itu", "620"].every((s) => msg.includes(s)));
const url = app.linkWhatsApp(ok);
verifica("link do WhatsApp é wa.me com o texto codificado", /^https:\/\/wa\.me\/\d{12,13}\?text=/.test(url) && !url.includes(" "));
const defs = (ler("public/app.js").match(/var WHATSAPP\s*=/g) || []).length;
verifica("número de WhatsApp definido em um só lugar e marcado como pendente", defs === 1 && /PENDENTE/.test(ler("public/app.js")));

console.log("\n" + (total - falhas) + " de " + total + " verificações passaram.");
process.exit(falhas ? 1 : 0);
