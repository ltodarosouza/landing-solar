#!/bin/sh
# Manda os pedidos de teste à rota /api/pedido. Uso: scripts/pedidos.sh <base-url>
U="$1/api/pedido"; H='Content-Type: application/json'
echo "== $1 =="
echo "-- conta R\$ 200 (direto ao servidor)"; curl -s -w "\nHTTP %{http_code}\n" -X POST "$U" -H "$H" -d '{"nome":"Marta Souza","whatsapp":"15 99876-5432","cidade":"Itu","conta":"200"}'
echo "-- cidade Campinas"; curl -s -w "\nHTTP %{http_code}\n" -X POST "$U" -H "$H" -d '{"nome":"Marta Souza","whatsapp":"15 99876-5432","cidade":"Campinas","conta":"620"}'
echo "-- cidade outra"; curl -s -w "\nHTTP %{http_code}\n" -X POST "$U" -H "$H" -d '{"nome":"Marta Souza","whatsapp":"15 99876-5432","cidade":"outra","conta":"620"}'
echo "-- pedido válido"; curl -s -w "\nHTTP %{http_code}\n" -X POST "$U" -H "$H" -d '{"nome":"Marta Souza","whatsapp":"15 99876-5432","cidade":"Itu","conta":"620"}'
echo "-- nome como objeto e conta como lista"; curl -s -w "\nHTTP %{http_code}\n" -X POST "$U" -H "$H" -d '{"nome":{"a":1},"whatsapp":"15 99876-5432","cidade":"Itu","conta":[900]}'
echo "-- corpo que não é JSON"; curl -s -w "\nHTTP %{http_code}\n" -X POST "$U" -H "$H" -d 'isto nao e json'
echo "-- GET"; curl -s -D - -w "\nHTTP %{http_code}\n" "$U" | grep -i -E "^(allow|cache-control|\{|HTTP)"
