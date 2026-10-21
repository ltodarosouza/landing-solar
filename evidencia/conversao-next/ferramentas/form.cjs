const puppeteer = require("puppeteer-core");
const base = process.argv[2], saida = process.argv[3];
const preencher = async (p, d) => { for (const [k, v] of Object.entries(d)) { await p.$eval(`[name=${k}]`, (el) => { el.value = ""; }); if (k === "cidade") await p.select(`[name=${k}]`, v); else await p.type(`[name=${k}]`, v); } };
const ler = (p) => p.evaluate(() => ({ nome: document.getElementById("erro-nome").textContent, whatsapp: document.getElementById("erro-whatsapp").textContent, cidade: document.getElementById("erro-cidade").textContent, conta: document.getElementById("erro-conta").textContent, depoisVisivel: !document.getElementById("depois-envio").hidden }));
(async () => {
  const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
  const valido = { nome: "Marta Souza", whatsapp: "15998765432", cidade: "Itu", conta: "620" };
  async function caso(titulo, dados, opc = {}) {
    const p = await b.newPage(); await p.setViewport({ width: 1280, height: 900 });
    const erros = []; p.on("pageerror", (e) => erros.push(e.message));
    const chamadas = []; let aberturas = [];
    await p.setRequestInterception(true);
    p.on("request", (r) => {
      if (r.url().endsWith("/api/pedido")) { chamadas.push({ metodo: r.method(), corpo: r.postData() }); if (opc.forcar422) return r.respond({ status: 422, contentType: "application/json", body: JSON.stringify({ ok: false, erros: { conta: "(resposta do servidor) Seu gasto com luz está abaixo do mínimo." } }) }); }
      r.continue();
    });
    b.on("targetcreated", (t) => { if (t.url().includes("wa.me")) aberturas.push(t.url().slice(0, 80)); });
    await p.goto(base, { waitUntil: "networkidle0" });
    await p.evaluate(() => { window.open = (u) => { window.__aberto = u; return null; }; });
    await preencher(p, dados);
    await p.evaluate(() => document.getElementById("simulacao").scrollIntoView());
    await p.click("#form-simulacao button[type=submit], #form-simulacao .btn");
    await new Promise((r) => setTimeout(r, 900));
    const msgs = await ler(p); const aberto = await p.evaluate(() => window.__aberto || null);
    await (await p.$("#simulacao")).screenshot({ path: `${saida}/${titulo}.png` });
    console.log(JSON.stringify({ caso: titulo, chamadasAoServidor: chamadas.length, corpoEnviado: chamadas[0] && chamadas[0].corpo, mensagens: Object.fromEntries(Object.entries(msgs).filter(([, v]) => v)), whatsappAberto: aberto ? aberto.slice(0, 60) + "…" : null, errosDePagina: erros }, null, 1));
    await p.close();
  }
  await caso("1-conta-200-recusada-no-navegador", { ...valido, conta: "200" });
  await caso("2-cidade-outra-recusada-no-navegador", { ...valido, cidade: "outra" });
  await caso("3-pedido-valido-aceito", valido);
  await caso("4-servidor-recusa-com-422", valido, { forcar422: true });
  await b.close();
})();
