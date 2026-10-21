// Cena do telhado guiada pelo scroll.
// O modelo (estadoCena, capituloDe) é puro e testado por scripts/check.cjs.
// O driver (abaixo) só liga o modelo ao DOM.

var CAPITULOS = [0, 0.14, 0.3, 0.46, 0.62, 0.8];
var HORIZONTE = 560;
var CREDITO_MAX = 58;
// Qual anel de destaque acompanha cada capítulo: sol, painéis, inversor, casa, poste, medidor.
var ANEL_DO_CAPITULO = [0, 1, 2, 3, 5, 4];

// Paradas do céu: dia, entardecer, noite. Cores da marca e a noite do DESIGN.md.
var CEU = [
  [0.0, "#FFF1DB"],
  [0.7, "#FFF1DB"],
  [0.78, "#F2A03D"],
  [0.88, "#123A55"],
  [1.0, "#0B2638"]
];

function limita(x, a, b) { return Math.min(b, Math.max(a, x)); }

function degrau(a, b, x) {
  var t = limita((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function misturaCor(c1, c2, t) {
  var a = [1, 3, 5].map(function (i) { return parseInt(c1.slice(i, i + 2), 16); });
  var b = [1, 3, 5].map(function (i) { return parseInt(c2.slice(i, i + 2), 16); });
  return "#" + a.map(function (v, i) {
    var m = Math.round(v + (b[i] - v) * t).toString(16);
    return m.length < 2 ? "0" + m : m;
  }).join("");
}

function corDoCeu(p) {
  for (var i = 1; i < CEU.length; i++) {
    if (p <= CEU[i][0]) {
      var t = (p - CEU[i - 1][0]) / (CEU[i][0] - CEU[i - 1][0]);
      return misturaCor(CEU[i - 1][1], CEU[i][1], limita(t, 0, 1));
    }
  }
  return CEU[CEU.length - 1][1];
}

function capituloDe(p) {
  var c = 0;
  for (var i = 0; i < CAPITULOS.length; i++) if (p >= CAPITULOS[i]) c = i;
  return c;
}

function estadoCena(p) {
  p = limita(p, 0, 1);
  var t = limita(p / 0.8, 0, 1);
  var noiteLuz = p < 0.8 ? 0.75 * degrau(0.46, 0.56, p) : 0.75 + 0.25 * degrau(0.8, 0.9, p);
  return {
    capitulo: capituloDe(p),
    solX: 140 + 920 * t,
    solY: HORIZONTE - 440 * Math.sin(Math.PI * t),
    solVisivel: 1 - degrau(0.76, 0.82, p),
    nuvens: 1 - degrau(0.7, 0.86, p),
    ceu: corDoCeu(p),
    estrelas: degrau(0.82, 0.95, p),
    lua: degrau(0.84, 0.96, p),
    chao: 0.12 + 0.78 * degrau(0.7, 0.9, p),
    feixes: degrau(0.02, 0.1, p) * (1 - degrau(0.7, 0.78, p)) * 0.55,
    painel: degrau(0.1, 0.25, p) * (1 - degrau(0.7, 0.8, p)),
    led: degrau(0.3, 0.36, p) * (1 - degrau(0.76, 0.8, p)),
    cc: degrau(0.2, 0.28, p) * (1 - degrau(0.72, 0.8, p)),
    ca: Math.max(degrau(0.34, 0.42, p) * (1 - degrau(0.72, 0.8, p)), degrau(0.84, 0.9, p)),
    redeSai: degrau(0.6, 0.66, p) * (1 - degrau(0.74, 0.8, p)),
    redeEntra: degrau(0.84, 0.9, p),
    janelas: noiteLuz,
    credito: CREDITO_MAX * (0.9 * degrau(0.6, 0.78, p)) * (1 - 0.35 * degrau(0.86, 1, p))
  };
}

if (typeof module !== "undefined") {
  module.exports = { estadoCena: estadoCena, capituloDe: capituloDe, degrau: degrau, corDoCeu: corDoCeu, CAPITULOS: CAPITULOS, HORIZONTE: HORIZONTE, ANEL_DO_CAPITULO: ANEL_DO_CAPITULO };
}

if (typeof document !== "undefined" && document.getElementById("cena")) {
  (function () {
    var secao = document.getElementById("como-funciona");
    var cena = document.getElementById("cena");
    var $ = function (id) { return document.getElementById(id); };
    var reduzido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var el = {
      ceu: $("cena-ceu"), sol: $("cena-sol"), estrelas: $("cena-estrelas"), lua: $("cena-lua"), nuvens: $("cena-nuvens"),
      chao: $("cena-chao"), feixes: $("cena-feixes"), painel: $("cena-painel"), led: $("cena-led"),
      cc: $("cena-cc"), ca: $("cena-ca"), rede: $("cena-rede"), janelas: $("cena-janelas"), credito: $("cena-credito")
    };
    var feixeLinhas = el.feixes.querySelectorAll("line");
    var alvos = [[497, 356], [583, 356], [668, 356]];
    var capitulos = secao.querySelectorAll(".capitulos li");
    var pontos = secao.querySelectorAll(".pontos li");
    var aneis = [0, 1, 2, 3, 4, 5].map(function (i) { return $("anel-" + i); });
    var anterior = -1;

    function aplica(p) {
      var s = estadoCena(p);
      el.ceu.setAttribute("fill", s.ceu);
      el.sol.setAttribute("transform", "translate(" + s.solX.toFixed(1) + " " + s.solY.toFixed(1) + ")");
      el.sol.style.opacity = s.solVisivel;
      el.nuvens.style.opacity = s.nuvens;
      el.estrelas.style.opacity = s.estrelas;
      el.lua.style.opacity = s.lua;
      el.chao.style.opacity = s.chao;
      el.feixes.style.opacity = s.feixes;
      feixeLinhas.forEach(function (l, i) {
        l.setAttribute("x1", s.solX.toFixed(1)); l.setAttribute("y1", s.solY.toFixed(1));
        l.setAttribute("x2", alvos[i][0]); l.setAttribute("y2", alvos[i][1]);
      });
      el.painel.style.opacity = (s.painel * 0.6).toFixed(3);
      el.led.style.opacity = s.led;
      el.cc.style.opacity = s.cc;
      el.ca.style.opacity = s.ca;
      el.janelas.style.opacity = s.janelas;
      // a rede sai de dia e entra à noite: o fluxo inverte o sentido
      el.rede.style.opacity = Math.max(s.redeSai, s.redeEntra);
      el.rede.classList.toggle("inverso", s.redeEntra > s.redeSai);
      el.credito.setAttribute("y", (376 - s.credito).toFixed(1));
      el.credito.setAttribute("height", s.credito.toFixed(1));
      if (s.capitulo !== anterior) {
        anterior = s.capitulo;
        capitulos.forEach(function (li, i) { li.classList.toggle("ativo", i === s.capitulo); });
        pontos.forEach(function (li, i) { li.classList.toggle("ativo", i === s.capitulo); li.classList.toggle("feito", i < s.capitulo); });
        aneis.forEach(function (a, i) { a.classList.toggle("ativo", i === ANEL_DO_CAPITULO[s.capitulo]); });
        secao.setAttribute("data-capitulo", s.capitulo);
      }
    }

    function ajustaEnquadramento() {
      cena.setAttribute("viewBox", window.innerWidth < 900 ? "290 60 800 560" : "300 40 780 600");
    }
    ajustaEnquadramento();
    window.addEventListener("resize", ajustaEnquadramento);

    if (reduzido) { aplica(0.55); return; }

    document.documentElement.classList.add("scrub");
    var atual = 0, alvo = 0, rodando = false;
    function progressoDoScroll() {
      var r = secao.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      return limita(-r.top / total, 0, 1);
    }
    function passo() {
      atual += (alvo - atual) * 0.12;
      if (Math.abs(alvo - atual) < 0.0004) atual = alvo;
      aplica(atual);
      if (atual !== alvo) requestAnimationFrame(passo); else rodando = false;
    }
    function aoRolar() {
      alvo = progressoDoScroll();
      if (!rodando) { rodando = true; requestAnimationFrame(passo); }
    }
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    alvo = progressoDoScroll();
    atual = alvo;
    aplica(atual);

    // clicar num capítulo (lista ou pontos) leva a cena até ele
    function vaiPara(i) {
      var topo = secao.getBoundingClientRect().top + window.scrollY;
      var total = secao.offsetHeight - window.innerHeight;
      var p = i === 0 ? 0.02 : CAPITULOS[i] + 0.04;
      window.scrollTo({ top: topo + total * p, behavior: "smooth" });
    }
    capitulos.forEach(function (li, i) { li.addEventListener("click", function () { vaiPara(i); }); });
    pontos.forEach(function (li, i) { li.addEventListener("click", function () { vaiPara(i); }); });
  })();
}
