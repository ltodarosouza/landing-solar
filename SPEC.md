# SPEC — Landing Ravena Solar

Escrita antes da página. Se a página divergir daqui, um dos dois está errado.

## A única coisa que a página precisa fazer acontecer

Uma pessoa com conta de luz a partir de R$ 450 por mês, em Sorocaba, Votorantim, Itu ou Salto, **pede uma simulação**. Meta do cliente: de ~12 para 25 pedidos por mês, com menos pedidos de quem tem conta de R$ 200.

## Para quem

Dono da casa, 35 a 60 anos, família, compara três orçamentos e leva de duas a oito semanas para decidir. Desconfia do setor. O medo número um é a empresa sumir com a obra pela metade.

## A promessa

> Uma conta de R$ 780 que virou R$ 118, numa casa de Sorocaba, instalada por equipe própria.

Por quê: é o único caso com número conferido que o cliente tem, e responde ao medo número um e à pergunta "vale a pena?" com a mesma frase. Não prometemos percentual (a faixa real é 75% a 90%, e a conta não zera).

## Decisões

| Decisão | Escolha | Motivo |
|---|---|---|
| Ação única | "Pedir simulação", mesma frase no menu, na primeira dobra e no fim | Uma coisa só para clicar |
| Filtro de conta baixa | Antes do formulário, uma linha diz que abaixo de R$ 450 a conta não fecha. No campo, valor abaixo de 450 bloqueia o envio e explica | O vendedor perde o dia com conta de R$ 200; o cliente mesmo desaconselha |
| Filtro de região | Cidade em lista com as quatro atendidas, mais "Outra cidade", que bloqueia e explica o raio de 80 km | Sem atendimento fora do raio |
| Foto da conta | Não há campo de arquivo. Depois do envio, a página pede para mandar a foto ou o PDF na conversa de WhatsApp | A página é estática, sem servidor para receber arquivo; o WhatsApp recebe |
| Envio | O formulário abre o WhatsApp da Ravena com a mensagem pronta | Resposta é por WhatsApp no mesmo dia útil; sem back-end, sem dado guardado por nós |
| Ordem das seções | Pela ordem das objeções que o cliente ouve | Cada seção responde ao medo que a pessoa tem naquele ponto |
| Stack | HTML, CSS e JavaScript puros, sem build, deploy na Vercel | Página de uma tela de rolagem; nada justifica framework |
| Site de 2021 | Recomeço do zero. Aproveitado: só a logo e as cores dela | O antigo é "quem somos" + formulário no rodapé, que é o problema |
| Cor | Tokens tirados de `assets/logo.svg`, conferidos por script | O cliente pede que as cores venham do arquivo |

## O que entra, na ordem

1. **Topo:** logo, link "Pedir simulação".
2. **Primeira dobra:** o caso de R$ 780 para R$ 118; para quem é (conta a partir de R$ 450, quatro cidades); ação.
3. **Prova em números:** 412 sistemas, nota 4,8 no Google (137 avaliações), seis anos, equipe própria com carteira assinada.
4. **Quanto custa e quando se paga:** R$ 14 mil a R$ 19 mil, 5 a 8 kWp, retorno de três a quatro anos, o que a conta não zera.
5. **Perguntas que os clientes fazem**, na ordem do brief: sumir, telhado, taxação do sol, mudar de casa, nublado e noite, bateria.
6. **Garantias:** 25, 10 e 5 anos, com o que cada uma cobre.
7. **Do pedido ao sistema ligado:** etapas e prazo de 45 a 60 dias, com a parte que não depende de nós dita.
8. **Para quem não é:** conta baixa, comércio acima de 75 kWp, bateria, manutenção de sistema alheio.
9. **Formulário:** nome, WhatsApp, cidade, conta média; o que acontece depois (resposta no mesmo dia útil, visita sem custo e sem compromisso).
10. **Rodapé:** razão da empresa, cidades, CPFL como distribuidora. Sem ação concorrente.

## O que fica de fora, e por quê

- **"Quem somos", "missão, visão e valores":** não vendem; o que importa de "quem somos" (seis anos, 11 pessoas, equipe própria) vira prova.
- **Depoimentos em vídeo e fotos das 40 obras:** o cliente tem, mas não estão no material entregue. Não invento depoimento nem uso foto de banco. Pendência para o cliente enviar; a seção entra quando houver arquivo.
- **Texto das avaliações do Google:** só a nota e a contagem, que são o que o brief dá.
- **Calculadora de economia na página:** exigiria premissas que o brief não dá (tarifa, irradiação). A simulação é o produto do vendedor.
- **Bateria, indústria, comércio:** só aparecem na seção "para quem não é".
- **Slogans do setor:** "energia do futuro", "sustentabilidade", "revolução solar".
- **Blog, redes sociais, chat flutuante, pop-up:** concorrem com a ação.

## Linhas que a copy não cruza

- Nada de "grátis", "economia de 95%", "energia do futuro", "revolução solar", "sustentabilidade".
- Nenhum prazo além de 45 a 60 dias da assinatura até a ligação.
- A conta não zera. Sempre diz.
- Número sem fonte no brief não entra.
- O caso de R$ 780 para R$ 118 é sempre apresentado como um caso, nunca como média.

## Pendências assumidas

- O número de WhatsApp da Ravena não consta no brief. O código usa um **número fictício marcado como pendente** em um único lugar (`WHATSAPP` em `app.js`). Trocar antes de qualquer uso real.
- Depoimentos em vídeo e fotos de obras (ver acima).

## Como saberemos que está pronto

`node scripts/check.cjs` passa; a página foi aberta a 390 px e a 1280 px sem rolagem horizontal; o formulário foi testado com conta de R$ 200 (bloqueia), cidade fora do raio (bloqueia) e dados válidos (monta a mensagem). Evidência em `evidencia/`.
