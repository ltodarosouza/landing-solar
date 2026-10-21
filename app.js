// Número da Ravena Solar. PENDENTE: o brief não traz o número; este é fictício.
// Trocar aqui antes de qualquer uso real (formato: 55 + DDD + número, só dígitos).
var WHATSAPP = "5515999990000";

var CONTA_MINIMA = 450;
// Faixa média dos clientes da Ravena (brief): a conta cai de 75% a 90%.
var QUEDA_MIN = 0.75;
var QUEDA_MAX = 0.90;

function faixaDaConta(conta) {
  return {
    min: Math.round(conta * (1 - QUEDA_MAX)),
    max: Math.round(conta * (1 - QUEDA_MIN))
  };
}

function lerValor(texto) {
  // aceita "620", "1.200", "1200,50", "R$ 780"
  var limpo = String(texto).replace(/[^\d.,]/g, "");
  if (!limpo) return NaN;
  if (limpo.indexOf(",") !== -1) {
    limpo = limpo.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(limpo)) {
    limpo = limpo.replace(/\./g, "");
  }
  return parseFloat(limpo);
}

function soDigitos(texto) {
  return String(texto).replace(/\D/g, "");
}

function validar(campos) {
  var erros = {};
  if (String(campos.nome).trim().length < 2) {
    erros.nome = "Digite seu nome.";
  }
  var tel = soDigitos(campos.whatsapp);
  if (tel.indexOf("55") === 0 && tel.length > 11) tel = tel.slice(2);
  if (tel.length !== 10 && tel.length !== 11) {
    erros.whatsapp = "Digite o DDD e o número, por exemplo 15 99999-9999.";
  }
  if (!campos.cidade) {
    erros.cidade = "Escolha a cidade.";
  } else if (campos.cidade === "outra") {
    erros.cidade = "Atendemos Sorocaba, Votorantim, Itu e Salto, num raio de 80 km. Fora disso não conseguimos instalar.";
  }
  var conta = lerValor(campos.conta);
  if (isNaN(conta)) {
    erros.conta = "Digite o valor médio da conta, só números.";
  } else if (conta < CONTA_MINIMA) {
    erros.conta = "Abaixo de R$ " + CONTA_MINIMA + " por mês o sistema não se paga em tempo razoável, e nós mesmos desaconselhamos. Não vamos pedir seu contato.";
  }
  return erros;
}

function montarMensagem(campos) {
  var conta = lerValor(campos.conta);
  return [
    "Olá, quero uma simulação de energia solar.",
    "Nome: " + String(campos.nome).trim(),
    "WhatsApp: " + String(campos.whatsapp).trim(),
    "Cidade: " + campos.cidade,
    "Conta de luz média: R$ " + conta.toLocaleString("pt-BR")
  ].join("\n");
}

function linkWhatsApp(campos) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(montarMensagem(campos));
}

if (typeof module !== "undefined") {
  module.exports = { validar: validar, montarMensagem: montarMensagem, linkWhatsApp: linkWhatsApp, lerValor: lerValor, faixaDaConta: faixaDaConta, CONTA_MINIMA: CONTA_MINIMA };
}

if (typeof document !== "undefined") {
  var form = document.getElementById("form-simulacao");
  var depois = document.getElementById("depois-envio");
  var link = document.getElementById("link-whatsapp");
  var nomes = ["nome", "whatsapp", "cidade", "conta"];

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var campos = {};
    nomes.forEach(function (n) { campos[n] = form.elements[n].value; });
    var erros = validar(campos);

    var primeiro = null;
    nomes.forEach(function (n) {
      var caixa = document.getElementById("erro-" + n);
      caixa.textContent = erros[n] || "";
      form.elements[n].setAttribute("aria-invalid", erros[n] ? "true" : "false");
      if (erros[n] && !primeiro) primeiro = form.elements[n];
    });
    if (primeiro) {
      depois.hidden = true;
      primeiro.focus();
      return;
    }

    var url = linkWhatsApp(campos);
    link.href = url;
    link.target = "_blank";
    depois.hidden = false;
    depois.scrollIntoView({ block: "nearest" });
    window.open(url, "_blank", "noopener");
  });
}

if (typeof document !== "undefined") {
  (function () {
    var semMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var comMouse = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    var limita = function (x, a, b) { return Math.min(b, Math.max(a, x)); };

    // ---- Barra de leitura e navbar (reta no topo, pílula ao descer)
    var barraProgresso = document.getElementById("progresso-barra");
    var navArea = document.getElementById("nav-area");
    function aoRolar() {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      barraProgresso.style.transform = "scaleX(" + (total > 0 ? Math.min(1, window.scrollY / total) : 0) + ")";
      navArea.classList.toggle("rolou", window.scrollY > 24);
    }
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();

    // ---- Navbar: destaca a seção que está na tela
    var links = {};
    document.querySelectorAll(".nav ul a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    if ("IntersectionObserver" in window) {
      var vistas = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          var a = links[e.target.id];
          if (!a) return;
          if (e.isIntersecting) {
            Object.keys(links).forEach(function (k) { links[k].classList.remove("ativo"); });
            a.classList.add("ativo");
          } else {
            a.classList.remove("ativo");
          }
        });
      }, { rootMargin: "-45% 0px -45% 0px" });
      Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) vistas.observe(s); });
    }

    // ---- Perguntas: abre uma e fecha as outras
    var itens = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));
    itens.forEach(function (item) {
      var botao = item.querySelector("button");
      botao.addEventListener("click", function () {
        var abrir = !item.classList.contains("aberto");
        itens.forEach(function (o) {
          o.classList.remove("aberto");
          o.querySelector("button").setAttribute("aria-expanded", "false");
        });
        if (abrir) { item.classList.add("aberto"); botao.setAttribute("aria-expanded", "true"); }
      });
    });

    // ---- Números da prova: contam quando aparecem
    function conta(el) {
      var alvo = parseFloat(el.getAttribute("data-conta"));
      var casas = parseInt(el.getAttribute("data-casas") || "0", 10);
      var fmt = function (v) { return v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }); };
      if (semMovimento) { el.textContent = fmt(alvo); return; }
      var t0 = null;
      (function passo(t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / 2200, 1);
        el.textContent = fmt(p < 1 ? alvo * (1 - Math.pow(1 - p, 3)) : alvo);
        if (p < 1) requestAnimationFrame(passo);
      })(performance.now());
    }
    // Revela uma vez só, e só quando o bloco já está bem dentro da tela
    var revela = document.querySelectorAll(".revela");
    if (!("IntersectionObserver" in window) || semMovimento) {
      revela.forEach(function (el) { el.classList.add("visivel"); el.querySelectorAll("[data-conta]").forEach(conta); });
    } else {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("visivel");
          e.target.querySelectorAll("[data-conta]").forEach(conta);
          obs.unobserve(e.target);
        });
      }, { rootMargin: "0px 0px -18% 0px", threshold: 0.2 });
      revela.forEach(function (el) { obs.observe(el); });
    }

    // ---- Números que descem (conta antes e depois): recomeçam sempre que o bloco volta à tela
    var descidas = Array.prototype.slice.call(document.querySelectorAll("[data-de]"));
    var raf = new WeakMap();
    function desce(el, ligar) {
      var de = parseFloat(el.getAttribute("data-de"));
      var ate = parseFloat(el.getAttribute("data-ate"));
      var atraso = el.closest(".hero") ? 900 : 1500;
      var dur = el.closest(".hero") ? 2200 : 1800;
      var antigo = raf.get(el);
      if (antigo) { clearTimeout(antigo.t); cancelAnimationFrame(antigo.r); }
      if (!ligar || semMovimento) { el.textContent = String(ligar ? ate : de); return; }
      el.textContent = String(de);
      var estado = {};
      estado.t = setTimeout(function () {
        var t0 = null;
        (function passo(t) {
          if (t0 === null) t0 = t;
          var p = limita((t - t0) / dur, 0, 1);
          el.textContent = String(p < 1 ? Math.round(de + (ate - de) * (1 - Math.pow(1 - p, 3))) : ate);
          if (p < 1) estado.r = requestAnimationFrame(passo);
        })(performance.now());
      }, atraso);
      raf.set(el, estado);
    }

    // ---- Blocos que repetem a animação toda vez que voltam à tela.
    // A animação só começa quando o bloco está bem dentro da tela (as bordas de cima e de baixo não contam),
    // e recomeça do zero quando a pessoa sai e volta.
    var replay = document.querySelectorAll(".replay");
    if (!("IntersectionObserver" in window) || semMovimento) {
      replay.forEach(function (el) { el.classList.add("visivel"); });
      descidas.forEach(function (el) { desce(el, true); });
    } else {
      var obs2 = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          var dentro = e.isIntersecting && e.intersectionRatio >= 0.3;
          if (dentro && !e.target.classList.contains("visivel")) {
            e.target.classList.add("visivel");
            descidas.forEach(function (el) { if (e.target.contains(el)) desce(el, true); });
          } else if (!e.isIntersecting && e.target.classList.contains("visivel")) {
            e.target.classList.remove("visivel");
            descidas.forEach(function (el) { if (e.target.contains(el)) desce(el, false); });
          }
        });
      }, { rootMargin: "-12% 0px -12% 0px", threshold: [0, 0.3] });
      replay.forEach(function (el) { obs2.observe(el); });
    }

    // ---- Etapas: a bolinha desce com o scroll e acende cada ponto que alcança
    var trilha = document.getElementById("trilha-v");
    if (trilha) {
      var passos = Array.prototype.slice.call(trilha.querySelectorAll(".tv-passo"));
      if (semMovimento) {
        passos.forEach(function (p) { p.classList.add("alcancado"); });
      } else {
        var yAtual = 0, yAlvo = 0, rodando = false;
        var posicoes = function () {
          var base = trilha.getBoundingClientRect().top + window.scrollY;
          return passos.map(function (p) {
            var no = p.querySelector(".tv-no").getBoundingClientRect();
            return no.top + window.scrollY + no.height / 2 - base;
          });
        };
        var alvoDoScroll = function () {
          var pos = posicoes();
          var base = trilha.getBoundingClientRect().top + window.scrollY;
          var ponto = window.scrollY + window.innerHeight * 0.55 - base;
          return limita(ponto, pos[0], pos[pos.length - 1]);
        };
        var desenha = function () {
          var pos = posicoes();
          trilha.style.setProperty("--y", yAtual.toFixed(1) + "px");
          passos.forEach(function (p, i) { p.classList.toggle("alcancado", yAtual >= pos[i] - 6); });
        };
        var quadro = function () {
          yAtual += (yAlvo - yAtual) * 0.1;
          if (Math.abs(yAlvo - yAtual) < 0.5) yAtual = yAlvo;
          desenha();
          if (yAtual !== yAlvo) requestAnimationFrame(quadro); else rodando = false;
        };
        var mover = function () {
          yAlvo = alvoDoScroll();
          if (!rodando) { rodando = true; requestAnimationFrame(quadro); }
        };
        window.addEventListener("scroll", mover, { passive: true });
        window.addEventListener("resize", mover);
        yAlvo = alvoDoScroll(); yAtual = yAlvo; desenha();
      }
    }

    if (semMovimento || !comMouse) return;

    // ---- Hero: uma luz quente acompanha o cursor, o marca-texto brilha quando ele chega perto
    // e o reflexo nos painéis segue o cursor sobre a casa. É a única coisa na página que segue o mouse.
    var hero = document.getElementById("hero");
    var destaque = hero.querySelector(".destaque");
    var ilustra = hero.querySelector(".ilustra-hero");
    var brilho = hero.querySelector(".brilho-painel");
    var alvoX = 0, alvoY = 0, x = 0, y = 0, ativo = false, girando = false;
    function seguir() {
      x += (alvoX - x) * 0.14;
      y += (alvoY - y) * 0.14;
      hero.style.setProperty("--mx", x.toFixed(1) + "px");
      hero.style.setProperty("--my", y.toFixed(1) + "px");
      var r = destaque.getBoundingClientRect();
      var h = hero.getBoundingClientRect();
      var d = Math.hypot(x - (r.left - h.left + r.width / 2), y - (r.top - h.top + r.height / 2));
      hero.style.setProperty("--prox", limita(1 - d / 320, 0, 1).toFixed(3));
      if (ativo || Math.abs(alvoX - x) > 0.5 || Math.abs(alvoY - y) > 0.5) requestAnimationFrame(seguir); else girando = false;
    }
    hero.addEventListener("pointermove", function (ev) {
      var h = hero.getBoundingClientRect();
      alvoX = ev.clientX - h.left;
      alvoY = ev.clientY - h.top;
      if (!ativo) { ativo = true; hero.classList.add("luz-ativa"); x = alvoX; y = alvoY; }
      if (!girando) { girando = true; requestAnimationFrame(seguir); }
      var i = ilustra.getBoundingClientRect();
      if (ev.clientX >= i.left && ev.clientX <= i.right && ev.clientY >= i.top && ev.clientY <= i.bottom) {
        var local = ((ev.clientX - i.left) / i.width) * 560 - 14;
        brilho.classList.add("manual");
        brilho.style.transform = "translateX(" + (local + 30).toFixed(1) + "px)";
      } else {
        brilho.classList.remove("manual");
        brilho.style.transform = "";
      }
    });
    hero.addEventListener("pointerleave", function () {
      ativo = false;
      hero.classList.remove("luz-ativa");
      hero.style.setProperty("--prox", "0");
      brilho.classList.remove("manual");
      brilho.style.transform = "";
    });
  })();
}
