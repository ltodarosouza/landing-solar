// uso: node captura.cjs <url> <prefixo> <pastaSaida>
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const [url, prefixo, saida] = process.argv.slice(2);
const LARGURAS = { celular: [390, 844], tablet: [768, 1024], desktop: [1280, 800] };
(async () => {
  const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
  fs.mkdirSync(saida, { recursive: true });
  for (const [nome, [w, h]] of Object.entries(LARGURAS)) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await p.goto(url, { waitUntil: "networkidle0" });
    await p.addStyleTag({ content: "*,*::before,*::after{animation-play-state:paused!important;animation-delay:0s!important;transition:none!important}" }); await new Promise((r) => setTimeout(r, 800)); await p.evaluate(() => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = 0; })); await new Promise((r) => setTimeout(r, 200));
    const info = await p.evaluate(() => ({ altura: document.documentElement.scrollHeight, larguraRolavel: document.documentElement.scrollWidth, innerWidth }));
    await p.screenshot({ path: `${saida}/${prefixo}-${nome}-${w}.png`, fullPage: true });
    // marcação da página sem scripts, para comparar o DOM
    const dom = await p.evaluate(() => { const w = document.getElementById("conteudo"); const c = (w || document.body).cloneNode(true); c.querySelectorAll("script, next-route-announcer").forEach((s) => s.remove()); return c.innerHTML; });
    fs.writeFileSync(`${saida}/${prefixo}-${nome}.dom.html`, dom);
    console.log(nome, w, JSON.stringify(info));
    await p.close();
  }
  await b.close();
})();
