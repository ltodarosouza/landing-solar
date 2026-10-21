// uso: node compara2.cjs <pastaAntes> <pastaDepois> <prefixoDepois> [pastaDiff]
// Dois "antes" (antes, antes2) dão a máscara de ruído: só pixels que não mudam entre eles entram na comparação.
const fs = require("fs"); const { PNG } = require("pngjs"); const pixelmatch = require("pixelmatch");
const [pa, pb, fb, pd] = process.argv.slice(2);
let ok = true;
const TOL = 3; // até 3 níveis (de 255) por canal: arredondamento de gradiente, invisível
const ler = (f) => PNG.sync.read(fs.readFileSync(f));
for (const [nome, w] of [["celular", 390], ["tablet", 768], ["desktop", 1280]]) {
  const A = ler(`${pa}/antes-${nome}-${w}.png`), A2 = ler(`${pa}/antes2-${nome}-${w}.png`), B = ler(`${pb}/${fb}-${nome}-${w}.png`);
  const domIgual = fs.readFileSync(`${pa}/antes-${nome}.dom.html`, "utf8").trim() === fs.readFileSync(`${pb}/${fb}-${nome}.dom.html`, "utf8").trim();
  if (A.width !== B.width || A.height !== B.height) { console.log(nome, `TAMANHO DIFERENTE ${A.width}x${A.height} vs ${B.width}x${B.height}`, "DOM igual:", domIgual); ok = false; continue; }
  const dAB = new PNG({ width: A.width, height: A.height }), dAA = new PNG({ width: A.width, height: A.height });
  pixelmatch(A.data, B.data, dAB.data, A.width, A.height, { threshold: 0 });
  pixelmatch(A.data, A2.data, dAA.data, A.width, A.height, { threshold: 0 });
  const vermelho = (d, i) => d.data[i] === 255 && d.data[i + 1] === 0 && d.data[i + 2] === 0;
  let total = 0, ruido = 0, reais = 0, miudo = 0;
  const out = new PNG({ width: A.width, height: A.height });
  for (let i = 0; i < A.data.length; i += 4) {
    const delta = Math.max(Math.abs(A.data[i] - B.data[i]), Math.abs(A.data[i + 1] - B.data[i + 1]), Math.abs(A.data[i + 2] - B.data[i + 2]));
    const dif = vermelho(dAB, i) && delta > TOL, r = vermelho(dAA, i);
    if (vermelho(dAB, i) && delta <= TOL) miudo++;
    if (dif) { total++; if (r) ruido++; else { reais++; out.data[i] = 255; out.data[i + 3] = 255; } }
  }
  if (pd) { fs.mkdirSync(pd, { recursive: true }); fs.writeFileSync(`${pd}/diff-${nome}.png`, PNG.sync.write(out)); }
  console.log(nome, `${A.width}x${A.height}`, `pixels com diferença acima de ${TOL}/255: ${total} (ignorados por serem ≤${TOL}/255: ${miudo}; ruído que já varia entre dois "antes": ${ruido}; diferença real: ${reais})`, "DOM igual:", domIgual);
  if (reais || !domIgual) ok = false;
}
console.log(ok ? "IDÊNTICO" : "DIFERENTE");
