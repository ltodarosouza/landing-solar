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

## Revisão 2 (21/10/2026): menos texto, mais demonstração

Pedido do aluno: seguir a estrutura do guia de landing pages do Julian Shapiro (navbar, hero com título, subtítulo e imagem, prova social, CTA, 3 a 6 blocos de funcionalidade e objeção com imagem, CTA repetido, rodapé) e o estilo das referências Entoa, Aparo, ReadingStone e Vale do Silício: uma ideia por tela, tipografia grande, respiro, interação, hierarquia clara. Pouca informação por tela.

## Revisão 4 (21/10/2026): produto claro, cena sem texto sobre a imagem, módulos no lugar de blocos de texto

Pedido do aluno, em resumo:
- Tirar tudo que acompanha o mouse (cursor, ímã, inclinação). Depois, liberou uma interação com o cursor só no estilo do hero do Entoa.
- Casa mais realista (o painel no teto estava feio) e cena mais fluida, com o texto fora da imagem e hierarquia clara.
- Hero mais claro sobre o produto, sem termo técnico.
- Depois da cena havia "um monte de blocos iguais, só de texto": trocar por módulos que tragam informação e interação, com animações espalhadas e não lotadas.
- Navbar reta e fixa no topo, que vira pílula curvada ao rolar. FAQ com movimento ao abrir e fechar.

Decisões:
- **Hero:** o título fala o que é e o que muda ("Seu telhado produz energia. Sua conta de luz fica bem menor."), com um marca-texto animado em "bem menor". Embaixo, três passos em linguagem simples e o cartão com a conta descendo de R$ 780 para R$ 118. kWp só na legenda pequena do cartão.
- **Cena:** duas colunas, texto de um lado, imagem do outro. Casa nova em perspectiva e um anel de destaque que mostra de que parte do sistema o capítulo fala.
- **Os quatro blocos de texto viraram quatro módulos com visual:** mapa animado com as quatro cidades, telhado com selo de 5 anos, barras de conta e parcela, e linha do tempo proporcional das garantias (25, 10 e 5 anos). O custo ganhou um gráfico de barras com o caso de Sorocaba (R$ 780 e R$ 118, proporcional).
- **Cursor:** uma só interação, no hero (luz quente que acompanha o cursor, marca-texto que brilha, reflexo nos painéis). Nada mais segue o mouse.
- **Navbar e perguntas:** como pedido.
- **Texto:** o termo técnico fica fora do hero e volta explicado ("inversor: deixa a energia pronta para usar").

## Revisão 3 (21/10/2026): o produto em ação

Pedido do aluno: mostrar o uso das placas ao rolar, no espírito do Vale do Silício (cena que muda com o scroll), com mais interações e uma prova social legível (no print dele, o número ficou minúsculo ao lado de rótulos grandes: bug de CSS, corrigido).

- **Nova seção "Do sol à conta de luz"**, logo depois da prova social: cena de casa com painéis guiada pelo scroll, seis capítulos. Os textos só descrevem o mecanismo (sol, painel, inversor, uso, crédito, noite) e reaproveitam o que o brief diz: 10 anos de garantia do inversor, crédito acumulado ao longo do mês, a conta não zera. Nenhum número novo.
- **Interações:** cursor com rótulos, barra de leitura, navbar que marca a seção, hero que segue o mouse, botões com ímã, cartões que inclinam.
- **Acessibilidade:** tudo isso desliga com `prefers-reduced-motion`; a cena vira lista de textos com imagem parada; o cursor só existe com mouse.

## O que entra, na ordem

1. **Navbar** em pílula flutuante: logo, âncoras "Como funciona" e "Perguntas", botão "Pedir simulação".
2. **Hero:** título com o caso R$ 780 para R$ 118, subtítulo de uma frase, botão, ilustração de casa com painéis. Para quem é, numa linha.
3. **Prova social:** 412 sistemas, 4,8 no Google (137 avaliações), 6 anos, 11 pessoas de equipe própria. Números grandes que contam ao rolar.
3b. **Cena do telhado guiada pelo scroll (revisão 3):** o sistema funcionando, do sol à conta, em seis capítulos.
4. **Interação "Veja a faixa da sua conta":** o visitante move um controle de R$ 450 a R$ 1.500 e vê a faixa em que a conta tende a ficar (queda de 75% a 90%, a média dos clientes). Diz que não é promessa e que a conta não zera. Leva o valor para o formulário. É a demonstração do produto e também o filtro de conta baixa.
5. **Quatro blocos de objeção, cada um com título curto, duas frases e ilustração:** quem instala (mapa das quatro cidades, equipe própria, seis anos), telhado (garantia de infiltração), nublado e noite (crédito do mês), financiamento (entrada zero, parcela perto da conta).
6. **Números do investimento numa faixa só:** R$ 14 mil a R$ 19 mil, 5 a 8 kWp, retorno de 3 a 4 anos.
7. **Etapas interativas:** seis passos clicáveis, do pedido à ligação, com o prazo de 45 a 60 dias e a parte que não depende de nós.
8. **Garantias:** 25, 10 e 5 anos.
9. **Perguntas curtas:** Lei 14.300, mudar de casa, bateria.
10. **Formulário em seção escura**, com o botão repetido. Antes dele, uma linha de quem não atendemos.
11. **Rodapé.**

## Mudanças de decisão

- A **calculadora**, que eu tinha deixado de fora, volta numa forma limitada: ela só aplica a faixa de 75% a 90% que o brief dá, sem tarifa nem irradiação, e diz que é média. Motivo: o aluno pediu interação, e esta é verdadeira com os dados que temos.
- **Imagens:** ilustrações vetoriais próprias, nas cores da marca, nítidas em qualquer tela. Não há foto de obra no material; foto de banco de imagens seria fingir obra que não é da Ravena. As 40 fotos próprias do cliente entram assim que ele enviar, no lugar das ilustrações dos blocos.
- **Menos texto:** o custo em cartões, a lista longa de etapas e a seção "quando não somos a empresa certa" viraram uma faixa, seis passos clicáveis e uma linha.

## O que fica de fora, e por quê

- **"Quem somos", "missão, visão e valores":** não vendem; o que importa de "quem somos" (seis anos, 11 pessoas, equipe própria) vira prova.
- **Depoimentos em vídeo e fotos das 40 obras:** o cliente tem, mas não estão no material entregue. Não invento depoimento nem uso foto de banco. Pendência para o cliente enviar; a seção entra quando houver arquivo.
- **Texto das avaliações do Google:** só a nota e a contagem, que são o que o brief dá.
- **Calculadora de economia com tarifa e irradiação:** o brief não dá as premissas. A interação da página só aplica a faixa média de 75% a 90%.
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
