// Número da Ravena Solar. PENDENTE: o brief não traz o número; este é fictício.
// Trocar aqui antes de qualquer uso real (formato: 55 + DDD + número, só dígitos).
var WHATSAPP = "5515999990000";

var CONTA_MINIMA = 450;

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
  module.exports = { validar: validar, montarMensagem: montarMensagem, linkWhatsApp: linkWhatsApp, lerValor: lerValor, CONTA_MINIMA: CONTA_MINIMA };
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
