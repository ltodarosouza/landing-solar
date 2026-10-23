// Número da Ravena Solar. PENDENTE: o brief não traz o número; este é fictício.
// Trocar aqui antes de qualquer uso real (formato: 55 + DDD + número, só dígitos).
var WHATSAPP = "5515999990000";

var CONTA_MINIMA = 450;
// Cidades atendidas (brief: raio de 80 km). Qualquer outro valor, inclusive "outra", é recusado.
var CIDADES = ["Sorocaba", "Votorantim", "Itu", "Salto"];
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
  } else if (CIDADES.indexOf(campos.cidade) === -1) {
    erros.cidade = "Sua cidade fica longe demais. Sentimos muito, mas não podemos te atender: instalamos só em Sorocaba, Votorantim, Itu e Salto, num raio de 80 km.";
  }
  var conta = lerValor(campos.conta);
  if (isNaN(conta)) {
    erros.conta = "Digite o valor médio da conta, só números.";
  } else if (conta < CONTA_MINIMA) {
    erros.conta = "Seu gasto com luz está abaixo do mínimo de R$ " + CONTA_MINIMA + " por mês. Abaixo disso o sistema não se paga em tempo razoável, e nós mesmos desaconselhamos a compra. Sentimos muito, mas não vamos seguir com o pedido.";
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
  module.exports = { validar: validar, montarMensagem: montarMensagem, linkWhatsApp: linkWhatsApp, lerValor: lerValor, faixaDaConta: faixaDaConta, CONTA_MINIMA: CONTA_MINIMA, CIDADES: CIDADES };
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
    function mostrarErros(erros) {
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
      }
      return !!primeiro;
    }

    function seguirParaWhatsApp() {
      var url = linkWhatsApp(campos);
      link.href = url;
      link.target = "_blank";
      depois.hidden = false;
      depois.scrollIntoView({ block: "nearest" });
      window.open(url, "_blank", "noopener");
    }

    if (mostrarErros(validar(campos))) return;

    // O servidor repete a mesma validação (api/pedido.js). Só uma recusa explícita (422)
    // bloqueia; se o servidor não responder, o pedido não se perde e segue para o WhatsApp.
    fetch("/api/pedido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campos)
    }).then(function (r) {
      if (r.status !== 422) return null;
      return r.json().then(function (j) { return j.erros || {}; });
    }).catch(function () {
      return null;
    }).then(function (errosDoServidor) {
      if (errosDoServidor && mostrarErros(errosDoServidor)) return;
      seguirParaWhatsApp();
    });
  });
}

if (typeof document !== "undefined") {
  (function () {
    var semMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var comMouse = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    var limita = function (x, a, b) { return Math.min(b, Math.max(a, x)); };

    // ---- Navbar (reta no topo, pílula ao descer)
    var navArea = document.getElementById("nav-area");
    function aoRolar() {
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

    // ---- Céu de Sorocaba agora: aparece na pergunta do dia nublado, quando ela é aberta pela primeira vez.
    // O navegador fala só com /api/ceu (o servidor é quem consulta a Open-Meteo). Se o servidor demorar,
    // cortar ou cair, a pergunta continua respondida e a linha do céu diz o que houve, com "Tentar de novo".
    var ceuLinha = document.getElementById("ceu-agora");
    var ceuBotao = document.getElementById("faq-b5");
    if (ceuLinha && ceuBotao && window.fetch) {
      var ceuEmCurso = false, ceuFeito = false;
      var FALHAS = {
        demorou: "A previsão demorou demais para responder, então não mostro o céu de agora.",
        caiu: "Não consegui ver o céu de Sorocaba agora: o serviço de previsão não respondeu.",
        limite: "O serviço de previsão pediu para esperar um pouco antes de uma nova consulta.",
        inesperado: "Não consegui ler a previsão de agora.",
        recusou: "Não consegui ler a previsão de agora."
      };
      var ceuTexto = function (txt, comTentar) {
        ceuLinha.textContent = txt;
        if (comTentar) {
          ceuLinha.appendChild(document.createTextNode(" A resposta acima vale do mesmo jeito. "));
          var b = document.createElement("button");
          b.type = "button"; b.className = "ceu-de-novo"; b.textContent = "Tentar de novo";
          b.addEventListener("click", buscarCeu);
          ceuLinha.appendChild(b);
        }
      };
      var ceuFonte = function () {
        ceuLinha.appendChild(document.createTextNode(" "));
        var a = document.createElement("a");
        a.href = "https://open-meteo.com"; a.rel = "noopener"; a.target = "_blank"; a.className = "ceu-fonte"; a.textContent = "Dados: Open-Meteo";
        ceuLinha.appendChild(a);
      };
      var buscarCeu = function () {
        if (ceuEmCurso) return;
        ceuEmCurso = true;
        ceuLinha.hidden = false;
        ceuTexto("Vendo o céu de Sorocaba agora…", false);
        var ctl = new AbortController();
        var relogio = setTimeout(function () { ctl.abort(); }, 5000);
        fetch("/api/ceu", { signal: ctl.signal }).then(function (r) {
          return r.json().then(function (j) { return { status: r.status, j: j }; });
        }).then(function (res) {
          if (res.j && res.j.ok) {
            var j = res.j;
            var quando = j.leitura ? j.leitura.slice(11, 16) : "";
            var frase = (j.desatualizado ? "Última leitura, de " + quando + ": " : "Agora em Sorocaba: ") + j.temperatura + " °C, " + j.descricao + " (" + j.nuvem + "% de nuvens).";
            if (!j.dia) frase += " É noite: o sistema não produz agora, e é o crédito do mês que paga.";
            if (j.desatualizado) frase += " O serviço de previsão não respondeu agora.";
            ceuTexto(frase, j.desatualizado);
            ceuFonte();
            ceuFeito = !j.desatualizado;
          } else {
            ceuTexto(FALHAS[res.j && res.j.motivo] || FALHAS.caiu, true);
          }
        }).catch(function (e) {
          ceuTexto(e && e.name === "AbortError" ? FALHAS.demorou : FALHAS.caiu, true);
        }).then(function () {
          clearTimeout(relogio);
          ceuEmCurso = false;
        });
      };
      ceuBotao.addEventListener("click", function () { if (!ceuFeito && !ceuEmCurso && ceuBotao.closest(".faq-item").classList.contains("aberto")) buscarCeu(); });
    }

    // ---- Números da prova: contam quando aparecem
    function conta(el) {
      var alvo = parseFloat(el.getAttribute("data-conta"));
      var casas = parseInt(el.getAttribute("data-casas") || "0", 10);
      var fmt = function (v) { return v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }); };
      if (semMovimento) { el.textContent = fmt(alvo); return; }
      var t0 = null;
      (function passo(t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / 1600, 1);
        el.textContent = fmt(p < 1 ? alvo * (1 - Math.pow(1 - p, 3)) : alvo);
        if (p < 1) requestAnimationFrame(passo);
      })(performance.now());
    }
    // Revela uma vez só, assim que o bloco entra na tela (os números começam a contar na hora)
    var revela = document.querySelectorAll(".revela:not(.meio)");
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
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
      revela.forEach(function (el) { obs.observe(el); });
    }

    // ---- Números da prova: só contam quando o bloco chega ao meio da tela, e contam de novo ao voltar
    var meio = document.querySelector(".meio");
    if (meio) {
      var zera = function () {
        meio.querySelectorAll("[data-conta]").forEach(function (el) {
          var casas = parseInt(el.getAttribute("data-casas") || "0", 10);
          el.textContent = (0).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
        });
      };
      if (!("IntersectionObserver" in window) || semMovimento) {
        meio.classList.add("visivel");
        meio.querySelectorAll("[data-conta]").forEach(conta);
      } else {
        zera();
        new IntersectionObserver(function (entradas) {
          entradas.forEach(function (e) {
            if (e.isIntersecting && !meio.classList.contains("visivel")) {
              meio.classList.add("visivel");
              meio.querySelectorAll("[data-conta]").forEach(conta);
            } else if (!e.isIntersecting && meio.classList.contains("visivel")) {
              meio.classList.remove("visivel");
              zera();
            }
          });
        // Observa o bloco pai, que não se mexe. Observar o próprio bloco fazia um laço: ao aparecer ele
        // sobe 24 px, sai da zona, some, desce, volta à zona, e os números ficavam subindo e descendo.
        }, { rootMargin: "-25% 0px -25% 0px", threshold: 0 }).observe(meio.closest(".prova") || meio);
      }
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
            e.target.dispatchEvent(new Event("replay:on"));
          } else if (!e.isIntersecting && e.target.classList.contains("visivel")) {
            e.target.classList.remove("visivel");
            descidas.forEach(function (el) { if (e.target.contains(el)) desce(el, false); });
            e.target.dispatchEvent(new Event("replay:off"));
          }
        });
      }, { rootMargin: "-12% 0px -12% 0px", threshold: [0, 0.3] });
      replay.forEach(function (el) { obs2.observe(el); });
    }

    // ---- Linhas do tempo únicas: a barra e o número andam juntos, quadro a quadro
    var suave = function (x) { x = limita(x, 0, 1); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
    var degrau = function (x) { x = limita(x, 0, 1); return x * x * (3 - 2 * x); };
    function linhaDoTempo(el, duracao, quadro) {
      var id = 0;
      el.addEventListener("replay:on", function () {
        cancelAnimationFrame(id);
        var t0 = null;
        (function f(t) {
          if (t0 === null) t0 = t;
          var ms = Math.min(t - t0, duracao);
          quadro(ms);
          if (ms < duracao) id = requestAnimationFrame(f);
        })(performance.now());
      });
      el.addEventListener("replay:off", function () { cancelAnimationFrame(id); quadro(0); });
      quadro(0);
    }
    var contaViz = document.querySelector(".conta-viz");
    if (contaViz && !semMovimento) {
      var numero = contaViz.querySelector("[data-from]");
      var de0 = parseFloat(numero.getAttribute("data-from"));
      var ate0 = parseFloat(numero.getAttribute("data-to"));
      linhaDoTempo(contaViz, 3600, function (t) {
        var a = suave(t / 1400), h = suave((t - 600) / 2200);
        contaViz.style.setProperty("--pa", a.toFixed(4));
        contaViz.style.setProperty("--ph", h.toFixed(4));
        contaViz.style.setProperty("--pl", degrau((t - 900) / 700).toFixed(3));
        contaViz.style.setProperty("--pf", degrau((t - 2700) / 800).toFixed(3));
        numero.textContent = String(Math.round(de0 + (ate0 - de0) * h));
      });
    }
    var anosViz = document.querySelector(".anos");
    if (anosViz && !semMovimento) {
      var linhasAnos = Array.prototype.slice.call(anosViz.querySelectorAll(".anos-linha"));
      linhaDoTempo(anosViz, 3600, function (t) {
        linhasAnos.forEach(function (linha, i) {
          var p = suave((t - i * 380) / 2100);
          linha.style.setProperty("--p", p.toFixed(4));
          linha.style.setProperty("--l", degrau((p - 0.82) / 0.18).toFixed(3));
        });
      });
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
