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
  var reduzido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reais = function (n) { return "R$ " + n.toLocaleString("pt-BR"); };

  // Faixa da conta
  var faixa = document.getElementById("faixa-conta");
  var paga = document.getElementById("faixa-paga");
  var resultado = document.getElementById("faixa-resultado");
  function atualizaFaixa() {
    var conta = parseInt(faixa.value, 10);
    var f = faixaDaConta(conta);
    paga.textContent = reais(conta);
    resultado.innerHTML = "";
    resultado.appendChild(document.createTextNode(reais(f.min) + " e "));
    var em = document.createElement("em");
    em.textContent = reais(f.max);
    resultado.appendChild(em);
    faixa.setAttribute("aria-valuetext", "Conta de " + reais(conta) + ", fica entre " + reais(f.min) + " e " + reais(f.max));
  }
  faixa.addEventListener("input", atualizaFaixa);
  atualizaFaixa();

  // Leva a conta escolhida para o formulário
  document.querySelectorAll("[data-leva-conta]").forEach(function (a) {
    a.addEventListener("click", function () {
      document.getElementById("conta").value = faixa.value;
    });
  });

  // Etapas (abas)
  var abas = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var barra = document.getElementById("trilha-barra");
  function mostraAba(i, foco) {
    abas.forEach(function (aba, j) {
      var ativa = i === j;
      aba.setAttribute("aria-selected", ativa ? "true" : "false");
      aba.tabIndex = ativa ? 0 : -1;
      document.getElementById(aba.getAttribute("aria-controls")).hidden = !ativa;
    });
    barra.style.width = ((i + 1) / abas.length * 100) + "%";
    if (foco) abas[i].focus();
  }
  abas.forEach(function (aba, i) {
    aba.addEventListener("click", function () { mostraAba(i, false); });
    aba.addEventListener("keydown", function (ev) {
      var prox = null;
      if (ev.key === "ArrowRight") prox = (i + 1) % abas.length;
      if (ev.key === "ArrowLeft") prox = (i - 1 + abas.length) % abas.length;
      if (ev.key === "Home") prox = 0;
      if (ev.key === "End") prox = abas.length - 1;
      if (prox !== null) { ev.preventDefault(); mostraAba(prox, true); }
    });
  });
  mostraAba(0, false);

  // Revelar ao rolar e contar os números
  function conta(el) {
    var alvo = parseFloat(el.getAttribute("data-conta"));
    var casas = parseInt(el.getAttribute("data-casas") || "0", 10);
    var fim = alvo.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
    if (reduzido) { el.textContent = fim; return; }
    var t0 = null;
    function passo(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / 1200, 1);
      var v = alvo * (1 - Math.pow(1 - p, 3));
      el.textContent = p < 1 ? v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }) : fim;
      if (p < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }
  var revela = document.querySelectorAll(".revela");
  if (!("IntersectionObserver" in window) || reduzido) {
    revela.forEach(function (el) { el.classList.add("visivel"); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("visivel");
        e.target.querySelectorAll("[data-conta]").forEach(conta);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    revela.forEach(function (el) { obs.observe(el); });
  }
}

// Movimento. Tudo aqui é opcional: sem JS ou com movimento reduzido a página funciona igual.
if (typeof document !== "undefined") {
  (function () {
    var semMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var comMouse = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    var limita = function (x, a, b) { return Math.min(b, Math.max(a, x)); };

    // Barra de progresso de leitura
    var barraProgresso = document.getElementById("progresso-barra");
    // Navbar: reta no topo, vira pílula ao descer
    var navArea = document.getElementById("nav-area");
    function aoRolar() {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      barraProgresso.style.transform = "scaleX(" + (total > 0 ? Math.min(1, window.scrollY / total) : 0) + ")";
      navArea.classList.toggle("rolou", window.scrollY > 24);
    }
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();

    // Navbar: destaca a seção que está na tela
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

    // Perguntas: abre uma e fecha as outras
    var itens = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));
    itens.forEach(function (item) {
      var botao = item.querySelector("button");
      botao.addEventListener("click", function () {
        var abrir = !item.classList.contains("aberto");
        itens.forEach(function (o) {
          o.classList.remove("aberto");
          o.querySelector("button").setAttribute("aria-expanded", "false");
        });
        if (abrir) {
          item.classList.add("aberto");
          botao.setAttribute("aria-expanded", "true");
        }
      });
    });

    if (semMovimento) return;

    // Hero: a conta desce de R$ 780 para R$ 118
    var descida = document.querySelector("[data-de]");
    if (descida) {
      var de = parseFloat(descida.getAttribute("data-de"));
      var ate = parseFloat(descida.getAttribute("data-ate"));
      descida.textContent = String(de);
      var inicio = null;
      var passoDescida = function (t) {
        if (inicio === null) inicio = t;
        var p = limita((t - inicio) / 1700, 0, 1);
        var v = de + (ate - de) * (1 - Math.pow(1 - p, 3));
        descida.textContent = String(p < 1 ? Math.round(v) : ate);
        if (p < 1) requestAnimationFrame(passoDescida);
      };
      setTimeout(function () { requestAnimationFrame(passoDescida); }, 1000);
    }

    if (!comMouse) return;

    // Hero: uma luz quente acompanha o cursor, o marca-texto brilha quando ele chega perto
    // e o reflexo nos painéis segue o cursor sobre a casa.
    var hero = document.getElementById("hero");
    var destaque = hero.querySelector(".destaque");
    var ilustra = hero.querySelector(".ilustra-hero");
    var brilho = hero.querySelector(".brilho-painel");
    var alvoX = 0, alvoY = 0, x = 0, y = 0, ativo = false, rodando = false;

    function quadro() {
      x += (alvoX - x) * 0.14;
      y += (alvoY - y) * 0.14;
      hero.style.setProperty("--mx", x.toFixed(1) + "px");
      hero.style.setProperty("--my", y.toFixed(1) + "px");
      var r = destaque.getBoundingClientRect();
      var h = hero.getBoundingClientRect();
      var cx = r.left - h.left + r.width / 2;
      var cy = r.top - h.top + r.height / 2;
      var d = Math.hypot(x - cx, y - cy);
      hero.style.setProperty("--prox", limita(1 - d / 320, 0, 1).toFixed(3));
      if (ativo || Math.abs(alvoX - x) > 0.5 || Math.abs(alvoY - y) > 0.5) requestAnimationFrame(quadro); else rodando = false;
    }
    hero.addEventListener("pointermove", function (ev) {
      var h = hero.getBoundingClientRect();
      alvoX = ev.clientX - h.left;
      alvoY = ev.clientY - h.top;
      if (!ativo) { ativo = true; hero.classList.add("luz-ativa"); x = alvoX; y = alvoY; }
      if (!rodando) { rodando = true; requestAnimationFrame(quadro); }
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
