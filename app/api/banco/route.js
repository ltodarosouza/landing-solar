// Rota /api/banco: o banco responde, com a chave guardada no ambiente do servidor? Só repassa para lib/banco.js.
import banco from "../../../lib/banco.js";

export async function GET() {
  const r = await banco.verBanco();
  return Response.json(r.json, { status: r.status, headers: { "Cache-Control": "no-store" } });
}
