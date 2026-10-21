// Rota /api/ceu: o céu de Sorocaba agora. Só repassa para lib/ceu.js, que fala com a Open-Meteo.
import ceu from "../../../lib/ceu.js";

export async function GET() {
  const r = await ceu.consultarCeu();
  return Response.json(r.json, { status: r.status, headers: r.headers });
}
