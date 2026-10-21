const puppeteer = require("puppeteer-core");
const base = process.argv[2], saida = process.argv[3], falso = process.argv[4]; // falso: base da fonte falsa, ou "-" para a real
const modos = process.argv.slice(5);
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
  async function caso(titulo, modo, prep) {
    if (falso !== "-" && modo) await fetch(falso + "/__modo/" + modo);
    const p = await b.newPage(); await p.setViewport({ width: 1280, height: 900 });
    const erros = []; p.on("pageerror", (e) => erros.push(e.message));
    if (prep) await prep(p);
    await p.goto(base, { waitUntil: "networkidle0" });
    const t0 = Date.now();
    await p.evaluate(() => document.getElementById("faq-b5").scrollIntoView({ block: "center" }));
    await p.click("#faq-b5");
    await p.waitForFunction(() => { const e = document.getElementById("ceu-agora"); return e && !e.hidden && !/^Vendo o céu/.test(e.textContent); }, { timeout: 12000 }).catch(() => {});
    await esperar(700);
    const texto = await p.$eval("#ceu-agora", (e) => e.hidden ? "(escondido)" : e.textContent);
    const botao = await p.$eval("#ceu-agora", (e) => !!e.querySelector(".ceu-de-novo"));
    await (await p.$("#faq-5")).evaluate((e) => e.parentElement.scrollIntoView({ block: "center" }));
    await (await p.$(".faq-item.aberto")).screenshot({ path: `${saida}/${titulo}.png` });
    console.log(JSON.stringify({ caso: titulo, aposSegundos: ((Date.now() - t0) / 1000).toFixed(1), texto, temBotaoTentarDeNovo: botao, errosDePagina: erros }));
    await p.close();
  }
  for (const m of modos) {
    if (m === "rota-cai") await caso("rota-cai", null, async (p) => { await p.setRequestInterception(true); p.on("request", (r) => (r.url().endsWith("/api/ceu") ? r.abort("connectionreset") : r.continue())); });
    else if (m === "rota-demora") await caso("rota-demora", null, async (p) => { await p.setRequestInterception(true); p.on("request", (r) => (r.url().endsWith("/api/ceu") ? setTimeout(() => r.continue().catch(() => {}), 9000) : r.continue())); });
    else await caso(m, m);
  }
  await b.close();
})();
