// Cena da tempestade guiada pelo scroll: a casa sob chuva forte, protegida pela garantia.
// O modelo (estadoChuva, capituloChuva) é puro e testado por scripts/check.cjs.
// O driver (abaixo) só liga o modelo ao DOM.

var CAPITULOS_CHUVA = [0, 0.3, 0.7];

function limitaC(x, a, b) { return Math.min(b, Math.max(a, x)); }

function degrauC(a, b, x) {
  var t = limitaC((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function pulso(p, centro, largura, amplitude) {
  return Math.max(0, 1 - Math.abs(p - centro) / largura) * amplitude;
}

function capituloChuva(p) {
  var c = 0;
  for (var i = 0; i < CAPITULOS_CHUVA.length; i++) if (p >= CAPITULOS_CHUVA[i]) c = i;
  return c;
}

function estadoChuva(p) {
  p = limitaC(p, 0, 1);
  var nivel = degrauC(0.04, 0.55, p) * (1 - 0.35 * degrauC(0.85, 1, p));
  return {
    capitulo: capituloChuva(p),
    nivel: nivel,
    leve: limitaC(nivel * 3, 0, 1),
    media: limitaC((nivel - 0.25) * 2.5, 0, 1),
    forte: limitaC((nivel - 0.55) * 3, 0, 1),
    ceu: 0.15 + 0.75 * degrauC(0.05, 0.5, p),
    raio: Math.min(1, pulso(p, 0.5, 0.012, 0.55) + pulso(p, 0.56, 0.01, 0.4)),
    janelas: degrauC(0.3, 0.6, p),
    cupula: 0.25 + 0.75 * nivel,
    selo: degrauC(0.74, 0.84, p)
  };
}

if (typeof module !== "undefined") {
  module.exports = { estadoChuva: estadoChuva, capituloChuva: capituloChuva, CAPITULOS_CHUVA: CAPITULOS_CHUVA };
}

if (typeof document !== "undefined" && document.getElementById("chuva-svg")) {
  (function () {
    var pista = document.getElementById("chuva-pista");
    var sec = document.getElementById("chuva");
    var svg = document.getElementById("chuva-svg");
    var $ = function (id) { return document.getElementById(id); };
    var reduzido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var el = {
      ceu: $("chuva-ceu"), l1: $("chuva-l1"), l2: $("chuva-l2"), l3: $("chuva-l3"),
      impactos: $("chuva-impactos"), brilho: $("chuva-cupula-brilho"), janelas: $("chuva-janelas"),
      raio: $("chuva-raio"), selo: $("chuva-selo"), pocas: $("chuva-pocas")
    };
    var itens = pista.querySelectorAll(".ch-passos li");
    var anterior = -1;

    function aplica(p) {
      var s = estadoChuva(p);
      el.ceu.style.opacity = s.ceu.toFixed(3);
      el.l1.style.opacity = s.leve.toFixed(3);
      el.l2.style.opacity = s.media.toFixed(3);
      el.l3.style.opacity = s.forte.toFixed(3);
      el.impactos.style.opacity = s.nivel.toFixed(3);
      el.pocas.style.opacity = s.media.toFixed(3);
      el.brilho.style.opacity = s.cupula.toFixed(3);
      el.janelas.style.opacity = s.janelas.toFixed(3);
      el.raio.style.opacity = s.raio.toFixed(3);
      el.selo.style.opacity = s.selo.toFixed(3);
      el.selo.style.transform = "scale(" + (0.4 + 0.6 * s.selo).toFixed(3) + ")";
      if (s.capitulo !== anterior) {
        anterior = s.capitulo;
        itens.forEach(function (li, i) { li.classList.toggle("ativo", i === s.capitulo); li.classList.toggle("feito", i < s.capitulo); });
        pista.setAttribute("data-capitulo", s.capitulo);
      }
    }

    function enquadra() {
      var estreita = window.innerWidth < 700;
      svg.setAttribute("viewBox", estreita ? "150 -20 980 640" : "0 0 1200 600");
      svg.setAttribute("preserveAspectRatio", estreita ? "xMidYMid meet" : "xMidYMid slice");
    }
    enquadra();
    window.addEventListener("resize", enquadra);

    if (reduzido) { aplica(1); return; }

    // a chuva só corre enquanto a cena está perto da tela
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) { sec.classList.toggle("ativa", e.isIntersecting); });
      }, { rootMargin: "20% 0px 20% 0px" }).observe(sec);
    } else {
      sec.classList.add("ativa");
    }

    document.documentElement.classList.add("scrub2");
    var atual = 0, alvo = 0, rodando = false;
    function progresso() {
      var r = pista.getBoundingClientRect();
      return limitaC(-r.top / (r.height - window.innerHeight), 0, 1);
    }
    function passo() {
      atual += (alvo - atual) * 0.12;
      if (Math.abs(alvo - atual) < 0.0004) atual = alvo;
      aplica(atual);
      if (atual !== alvo) requestAnimationFrame(passo); else rodando = false;
    }
    function aoRolar() {
      alvo = progresso();
      if (!rodando) { rodando = true; requestAnimationFrame(passo); }
    }
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    alvo = progresso(); atual = alvo; aplica(atual);

    itens.forEach(function (li, i) {
      li.addEventListener("click", function () {
        var topo = pista.getBoundingClientRect().top + window.scrollY;
        var total = pista.offsetHeight - window.innerHeight;
        var p = i === 0 ? 0.02 : CAPITULOS_CHUVA[i] + 0.06;
        window.scrollTo({ top: topo + total * p, behavior: "smooth" });
      });
    });
  })();
}
