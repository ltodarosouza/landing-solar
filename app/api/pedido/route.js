// Rota /api/pedido: recebe o pedido de simulação e aplica as mesmas regras da página.
// Ainda não guarda nada: só recusa o que a Ravena não atende. Guardar o pedido é outro item (FALTA.md, 1).
import pedido from "../../../lib/pedido.js";

async function tratar(request) {
  const r = pedido.responder(request.method, await request.text());
  return Response.json(r.json, { status: r.status, headers: { "Cache-Control": "no-store", ...(r.headers || {}) } });
}

export const POST = tratar;
// qualquer outro método responde 405 com o mesmo texto de antes
export const GET = tratar;
export const PUT = tratar;
export const PATCH = tratar;
export const DELETE = tratar;
