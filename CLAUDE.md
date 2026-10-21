# Landing Ravena Solar

Página única de venda de energia solar residencial para a Ravena Solar (cliente fictício da trilha 202). A única ação: **Pedir simulação**.

## Antes de mexer

1. Leia `SPEC.md` (o que a página decide, o que deixa de fora, as linhas que a copy não cruza) e `DESIGN.md` (tokens e regras com valor).
2. Mudança de conteúdo que contradiz a SPEC: atualize a SPEC primeiro, depois a página.
3. Os números vêm do brief do cliente. Número que não está no brief não entra na página.

## Comandos

- `node scripts/check.cjs` roda as verificações (cores contra o logo, contraste, só 4 tamanhos de fonte, fatos do brief, palavras proibidas, regras do formulário). Tem de terminar com todas as verificações passando e código 0. **Se um check falhar, descubra se o check ou a página está errado antes de mudar qualquer um dos dois. Nunca afrouxe o check para passar.**
- `npm run dev` serve a página e a rota `/api/pedido` em `http://localhost:4173`. `npm run build` e `npm start` rodam a versão de produção.

## Estrutura

- Projeto Next (App Router), com a página igual à que era estática: `app/conteudo.html` é o HTML da página (entregue pelo `app/layout.js`, que também traz título, descrição e o `js` do `<html>`); `app/styles.css` é o CSS; `public/app.js` e `public/cena.js` são os scripts (sem build, JavaScript puro, servidos como estão); `public/assets/logo.svg` é a logo. `cena.js` guarda o modelo puro da cena do sol (testado pelo check) e o driver do scroll.
- `public/assets/logo.svg`: fonte das cores da marca. Não copie hex de cabeça; os três tokens de marca estão no topo do CSS e o check os compara com o SVG.
- `app/api/pedido/route.js` e `lib/pedido.js`: a rota `/api/pedido`. A regra é a do `validar` de `public/app.js`, que é a única fonte: a página e o servidor usam o mesmo arquivo. Não copie a regra para o servidor.
- `material/`: entrega do cliente (logo e site de 2021). Só leitura.
- `evidencia/`: saídas do check e medidas feitas no navegador.

## Regras da página

- Texto nunca fica por cima de imagem. A cena do telhado tem texto numa coluna e imagem noutra.
- Nada segue o mouse, exceto a luz do hero. Sem cursor customizado, ímã ou inclinação.
- O hero não usa jargão (kWp, inversor, homologação, Lei) e é curto: menos de um terço do texto da revisão 4. O check confere.
- A página não descreve técnica de obra (vedação, fixação, manta, ripa, caibro): o brief só traz a garantia de 5 anos contra infiltração causada pela obra. O check proíbe.
- Animação só toca quando o bloco está bem dentro da tela e recomeça quando a pessoa volta (classe `.replay`). Nada de animação que acaba antes de alguém ver.
- Toda animação desliga com `prefers-reduced-motion` e a página funciona sem JavaScript.

- Um só botão de ação, com o mesmo texto ("Pedir simulação") no menu, na primeira dobra e no formulário.
- Botão âmbar com texto marinho. Laranja nunca é texto de corpo (contraste).
- Nunca escrever: grátis, revolução solar, energia do futuro, sustentabilidade, economia de 95%. Nenhum prazo além de 45 a 60 dias. A conta não zera, e a página diz isso.
- Abaixo de R$ 450 de conta ou cidade fora das quatro atendidas, o formulário não envia e explica por quê.
- `WHATSAPP` em `public/app.js` é um número **fictício e pendente**; o brief não traz o real.

## Verificar antes de dizer que terminou

Rode o check, abra a página a 390 px e a 1280 px, confira que não há rolagem horizontal e teste o formulário com conta de R$ 200, cidade fora do raio e dados válidos. Diga o que foi aberto e o que não foi.

## Git

Mensagem de commit em português, no imperativo. Não dê push sem pedido explícito.
