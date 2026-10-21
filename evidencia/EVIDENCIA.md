# Evidência de verificação

Data: 2026-10-21. Página servida localmente (`python3 -m http.server 4173`) e aberta no navegador embutido do Claude Code.

## 1. Check executável

`node scripts/check.cjs` → **65 de 65**, código de saída 0 (saída completa em `check.txt`).

O check foi provado em duas direções:
- Na primeira execução, **1 falha**: o próprio check capturava o ponto final da frase junto do valor ("R$ 118."). A falha era do check; corrigi o regex, não a página nem o critério.
- Em uma cópia quebrada de propósito (cor do âmbar trocada em um dígito e a palavra "grátis" no texto), o check falhou em 3 pontos: cor fora do logo, DESIGN.md divergente e expressão proibida. Cópia descartada.

## 2. Medidas no navegador (computed style e geometria, não screenshot)

| Medida | 390 px | 1280 px |
|---|---|---|
| Rolagem horizontal (`scrollWidth > clientWidth`) | não (390 = 390) | não |
| Elementos além da borda direita | nenhum | não medido |
| h1 | 34 px | 52 px |
| h2 | 28 px | 36 px |
| Tamanhos de fonte em uso | 16, 34, 28, 14 px | n/a |
| Botão: fundo / texto / altura | rgb(242,160,61) / rgb(18,58,85) / 48 px | n/a |
| Campo de formulário: altura | 48 px | n/a |
| Padding vertical de seção | n/a | 96 px |
| Grade de 3 colunas | n/a | 336 + 336 + 336 px |

Os valores batem com `DESIGN.md`.

## 3. Formulário, testado no navegador

`window.open` foi substituído por um espião para não abrir o WhatsApp no teste.

| Caso | Resultado observado |
|---|---|
| Conta de R$ 200 | Bloqueou, mostrou o erro "Abaixo de R$ 450…", levou o foco ao campo da conta, não abriu WhatsApp |
| Cidade "Outra cidade", conta R$ 620 | Bloqueou, mostrou o erro do raio de 80 km, não abriu WhatsApp |
| Marta Souza, 15 99876-5432, Itu, R$ 620 | Sem erros, mostrou o passo seguinte, abriu `wa.me` com a mensagem pronta com os quatro dados |

## 4. O que NÃO foi verificado

- Não abri a página em aparelho físico; o celular é emulação de 390 px no navegador.
- Não medi desempenho (Lighthouse).
- Não testei o envio de verdade no WhatsApp: o número é fictício (pendente, ver SPEC).
- Não abri os dois navegadores (Safari e Firefox); só um.
- A URL de produção ainda não existe; as verificações acima são locais.
