# DESIGN — Ravena Solar

Revisão 8. Regras com valor; cada uma é conferida por `scripts/check.cjs` ou pelas medidas em `evidencia/`.

Direção: editorial e claro. Uma ideia por tela, tipografia grande, muito respiro, números como protagonistas, o produto mostrado em ação, movimento só onde explica algo. Texto nunca fica por cima de imagem. Cada tela diz pouco: o que a pessoa precisa entender, e o resto vira imagem ou animação.

## Cor

Os três tokens de marca vêm de `assets/logo.svg`; o check compara.

| Token | Valor | Origem | Uso |
|---|---|---|---|
| `--marinho` | `#123A55` | RAVENA no logo | Texto, títulos, seção escura |
| `--ambar` | `#F2A03D` | sol no logo | **Botão de ação**, marca-texto do título e o sol das ilustrações |
| `--laranja` | `#E8721C` | SOLAR no logo | Decoração: filetes, telhado de terracota, anéis de destaque. Texto só em número de 32 px ou mais sobre branco |
| `--sol` | `#FFF1DB` | âmbar a 15% sobre branco | Fundo quente do hero e das ilustrações |
| `--noite` | `#0B2638` | marinho escurecido | Céu e chão da cena à noite. Só na cena animada |
| `--papel` | `#F6F8FA` | neutro | Fundo de seção alternada |
| `--branco` | `#FFFFFF` | neutro | Fundo base |
| `--tinta-suave` | `#4A5B68` | neutro derivado do marinho | Texto de apoio |
| vidro do painel | `#2A6E9C`, `#1A4C72`, `#0F3350` | tons de marinho | Só dentro do gradiente `g-painel` das ilustrações (vidro azul do painel solar) |

Regras:
- O botão `.btn` é **âmbar com texto marinho**; é a única coisa âmbar-sólida clicável.
- Na seção escura (marinho), texto é branco e o botão continua âmbar.
- Branco sobre laranja reprova contraste (cerca de 3,3:1) e laranja sobre `--sol` fica abaixo de 3:1: laranja não leva texto pequeno nem fica sobre o hero.
- Contraste mínimo 4,5:1 para texto e botão (o check calcula os pares usados).
- **Gradiente só em três lugares:** fundo do hero (`--sol` para branco), a luz quente do hero (radial, reage ao cursor) e o brilho que passa sobre o marca-texto do título. Sombra só em cartões, na navbar flutuante, no cartão da conta e na bolinha da trilha.

## Tipo

Pilha do sistema, a mesma família da logo: `"Helvetica Neue", Helvetica, Arial, sans-serif`. Nenhum arquivo de fonte para baixar.

Cinco tamanhos, nenhum a mais:

| Papel | Celular | ≥ 768 px | Peso |
|---|---|---|---|
| Rótulo / legenda | 14 px | 14 px | 600 |
| Corpo | 16 px | 16 px | 400 |
| Lead (subtítulo, título de módulo) | 20 px | 20 px | 400 ou 700 |
| Título de seção (h2) e número de destaque | 32 px | 48 px | 700 |
| Título do hero (h1) | 40 px | 72 px | 700 |

Títulos com altura de linha 1,05 e espaçamento de letra -0,02em. Corpo 1,6. Texto corrido até `60ch`.

## Linguagem

O hero e a cena falam como quem explica para um vizinho: sem kWp, inversor, homologação, Lei ou "injetar" no hero. O termo técnico aparece depois, já explicado (o inversor é apresentado como "o que deixa a energia pronta para usar"). O check confere o hero.

## Espaço

Escala de 8: 8, 16, 24, 48, 96 px (`--e1` a `--e5`). Seção: 96 px de respiro vertical em tela larga, 48 px no celular. Nada de valor de espaço fora da escala.

## Forma

Raio 16 px em cartões e imagens, 8 px em botões e campos, pílula na navbar rolada. Borda de 1 px `rgba(18,58,85,.12)` nos cartões.

## Layout

- Largura máxima do conteúdo 1040 px, gutter lateral 24 px.
- Coluna única até 900 px; hero, cena e módulos em duas ou três colunas a partir daí.
- Alvo de toque mínimo 48 px de altura.
- Teste de largura: 390 px sem rolagem horizontal.

## Navbar

No topo é uma barra reta, de ponta a ponta, translúcida, fixa. Depois de 24 px de rolagem ela vira uma pílula flutuante, mais estreita, com sombra, em 500 ms. Sublinha a seção que está na tela.

## Ilustração

SVG inline, na paleta acima. A **casa** é desenhada uma vez (`<symbol id="casa-arte">`) e reaproveitada no hero e na cena: vista de 3/4, telhado de terracota em perspectiva, oito painéis com moldura clara, vidro azul em gradiente e células, beiral com sombra, janelas, porta e inversor na parede lateral. Cada ilustração mostra um mecanismo (mapa de atendimento, corte do telhado com chuva, ícones das etapas), nunca decoração abstrata. A água usa o primeiro tom do vidro do painel. As imagens têm `role="img"` e descrição; os SVGs internos ficam `aria-hidden`.

## Cena do telhado (guiada pelo scroll)

Seção de 700 vh com palco fixo (`position: sticky`) de 100 vh, em **duas colunas**: texto à esquerda, imagem à direita (celular: imagem em cima, texto embaixo). O texto nunca cobre a imagem. O progresso do scroll (0 a 1) é suavizado e alimenta um modelo puro (`cena.js: estadoCena`), testado pelo check. Seis capítulos: sol, geração, inversor, uso na casa, crédito na rede, noite.

- A lista de capítulos à esquerda mostra os seis títulos; o ativo ganha número âmbar, título escuro e o texto se abre. Clicar leva a cena até o capítulo.
- Na imagem, um **anel pulsante** destaca o que o capítulo explica (sol, painéis, inversor, casa, poste, medidor).
- O sol cruza o céu; o céu passa de `--sol` a âmbar e a `--noite`; nuvens derivam de dia; estrelas e lua à noite.
- Painéis acendem, o reflexo percorre o vidro, o fio tracejado corre e inverte à noite.
- Sem JavaScript ou com movimento reduzido: a cena fica parada no meio do dia e os seis textos aparecem abertos, em lista.

## Movimento

**Quando uma animação toca.** Os blocos animados (`.replay`) só começam quando estão bem dentro da tela: as bordas de cima e de baixo (12% de cada lado) não contam, e pelo menos 30% do bloco precisa estar visível. Quando a pessoa sai e volta, a animação recomeça do zero. Textos comuns (`.revela`) entram uma vez só, assim que o bloco aparece na tela. Os **números da prova** (`.meio`) só contam quando o bloco chega ao **meio** da tela (25% de margem em cima e embaixo), nascem em zero, e zeram e contam de novo ao voltar; no desktop de 800 px de altura o bloco já aparece na base da primeira tela, e contar antes de a pessoa descer desperdiçava o efeito. Duração: a conta antes e depois leva 3,6 s numa linha do tempo só (a barra e o número saem da mesma variável, então andam juntos), a linha de 25 anos leva 3,6 s com as quatro barras em sequência, os números da prova contam em 1,6 s e a conta do hero desce em 2,2 s.

- Barra de leitura de 4 px no topo.
- **Hero:** o texto entra em sequência; o marca-texto âmbar desenha embaixo de "bem menor" e um brilho passa por ele, **toda vez que o hero volta à tela**; o cartão mostra a conta descendo de R$ 780 a R$ 118 (também recomeça); reflexo percorre os painéis; nuvens derivam; os raios giram.
- **Única interação com o cursor, só no hero:** uma luz quente acompanha o cursor, o marca-texto brilha mais quando o cursor chega perto e o reflexo nos painéis segue o cursor sobre a casa. Sem cursor customizado, ímã ou inclinação. Desliga com toque ou movimento reduzido.
- **Conta antes e depois:** uma linha do tempo só, guiada por variáveis. A barra de antes cresce, a de hoje cresce a seguir e o número desce junto com ela, até 118. O número acompanha a ponta da barra. Por fim aparece a faixa tracejada da média dos clientes.
- **Linha do tempo de 25 anos:** as quatro barras crescem em sequência, cada uma com seu atraso, e o rótulo de cada uma só aparece quando a barra está quase completa.
- **Mapa:** pinos brotam um a um, o raio de 80 km se abre e três ondas saem de Sorocaba sem parar enquanto o bloco está na tela.
- **"E se chover?": a casa sob a tempestade, guiada pelo scroll.** Em vez de explicar *como* (um corte técnico do telhado foi tentado e descartado: era feio e inventava um detalhe de vedação que o brief não traz), a cena mostra *o que a pessoa sente*. A mesma casa do hero, um céu fechado que escurece, nuvens, três camadas de chuva que entram uma depois da outra, um relâmpago no auge, ondas na **cúpula âmbar que representa a garantia**, janelas que acendem, poças no chão e, no fim, o selo "5 anos". A chuva é recortada para existir só fora da cúpula e acima do chão: dentro, fica seco. Três capítulos legendados fora da imagem (começa a chover; a chuva aperta; o telhado segue protegido, com 5 anos de garantia contra infiltração causada pela obra). Prende o scroll por 280 vh; a imagem tem até 560 px de altura e cabe com os capítulos numa tela de 800 px. No celular a cena aparece inteira (sem recorte) numa caixa 4:3 e só o capítulo ativo fica visível. As linhas de chuva só correm enquanto a cena está perto da tela. Com movimento reduzido: vai direto ao fim, sem chuva.
- **Etapas, em trilha vertical:** uma bolinha desce acompanhando o scroll (fica a 55% da altura da tela) e acende cada ponto que alcança; cada etapa toca uma mini-animação própria (conversa, medição do telhado, três tamanhos, homologação, painéis encaixando, curva de produção com sino). Ao subir de volta, os pontos apagam e tocam de novo ao descer.
- **Cena do telhado:** descrita acima.
- **Perguntas:** o painel abre e fecha por altura, o ícone gira, uma aberta fecha as outras.
- `prefers-reduced-motion`: sem deslocamento, sem contagem, sem giro, sem chuva, sem luz do cursor, sem bolinha; tudo aparece pronto e legível.
- Sem JavaScript o conteúdo continua legível (tudo que esconde só esconde com `.js` no `html`).

## Componentes

- **Botão de ação:** 48 px, texto "Pedir simulação" em todos os lugares.
- **Cartão da economia (hero):** abaixo da casa, nunca sobre ela. "Antes" em laranja riscado (número grande sobre branco), "Hoje" em marinho, selo âmbar de queda. O selo é calculado do caso real (780 para 118 é 85%).
- **Trilha das etapas:** linha pontilhada, trecho já percorrido em laranja, bolinha âmbar com borda marinho.
- **Perguntas:** botões com `aria-expanded` e região ligada.
- **Campo:** rótulo visível, erro abaixo com a palavra "Atenção:", nunca só cor.
