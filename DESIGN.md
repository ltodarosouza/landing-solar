# DESIGN — Ravena Solar

Revisão 2. Regras com valor; cada uma é conferida por `scripts/check.cjs` ou pelas medidas em `evidencia/`.

Direção: editorial e técnico. Uma ideia por tela, tipografia grande, muito respiro, números como protagonistas, ilustração vetorial nas cores da logo, movimento só quando explica algo.

## Cor

Os três tokens de marca vêm de `assets/logo.svg`; o check compara.

| Token | Valor | Origem | Uso |
|---|---|---|---|
| `--marinho` | `#123A55` | RAVENA no logo | Texto, títulos, seção escura |
| `--ambar` | `#F2A03D` | sol no logo | **Botão de ação** e o sol das ilustrações |
| `--laranja` | `#E8721C` | SOLAR no logo | Decoração: filetes, seta, destaques em número grande. Nunca texto pequeno |
| `--sol` | `#FFF1DB` | âmbar a 15% sobre branco | Fundo quente do hero e das ilustrações |
| `--papel` | `#F6F8FA` | neutro | Fundo de seção alternada |
| `--branco` | `#FFFFFF` | neutro | Fundo base |
| `--tinta-suave` | `#4A5B68` | neutro derivado do marinho | Texto de apoio |

Regras:
- O botão `.btn` é **âmbar com texto marinho**; é a única coisa âmbar-sólida clicável.
- Na seção escura (marinho), texto é branco e o botão continua âmbar.
- Branco sobre laranja reprova contraste (cerca de 3,3:1): laranja não leva texto.
- Contraste mínimo 4,5:1 para texto e botão (o check calcula os pares usados).
- Gradiente só no fundo do hero (de `--sol` a `--branco`). Sombra só em cartões e na navbar: `0 12px 40px rgba(18,58,85,.12)`.

## Tipo

Pilha do sistema, a mesma família da logo: `"Helvetica Neue", Helvetica, Arial, sans-serif`. Nenhum arquivo de fonte para baixar.

Cinco tamanhos, nenhum a mais:

| Papel | Celular | ≥ 768 px | Peso |
|---|---|---|---|
| Rótulo / legenda | 14 px | 14 px | 600 |
| Corpo | 16 px | 16 px | 400 |
| Lead (subtítulo, frase de apoio) | 20 px | 20 px | 400 |
| Título de seção (h2) e número de destaque | 32 px | 48 px | 700 |
| Título do hero (h1) | 40 px | 72 px | 700 |

Títulos com altura de linha 1,05 e espaçamento de letra -0,02em. Corpo 1,6. Texto corrido até `60ch`.

## Espaço

Escala de 8: 8, 16, 24, 48, 96 px (`--e1` a `--e5`). Seção: 96 px de respiro vertical em tela larga, 48 px no celular. Nada de valor de espaço fora da escala.

## Forma

Raio 16 px em cartões e ilustrações, 8 px em botões e campos, pílula na navbar. Borda de 1 px `rgba(18,58,85,.12)` nos cartões sem sombra.

## Layout

- Largura máxima do conteúdo 1040 px, gutter lateral 24 px.
- Coluna única até 768 px; hero e blocos de objeção em duas colunas a partir de 900 px, alternando o lado da imagem.
- Alvo de toque mínimo 48 px de altura.
- Teste de largura: 390 px sem rolagem horizontal.

## Ilustração

SVG inline, sem arquivo externo, na paleta acima. Motivo repetido: o trapézio de painel da logo (marinho com linhas brancas). Cada ilustração mostra o mecanismo do bloco (mapa de atendimento, corte do telhado, dia e noite, conta e parcela), nunca decoração abstrata. Todas têm `role="img"` e `aria-label`.

## Movimento

- Revelar ao rolar: 20 px de deslocamento e opacidade, 600 ms, uma vez.
- Números da prova contam de 0 ao valor, uma vez, 1,2 s.
- Raios do sol giram devagar (60 s por volta).
- Hover do botão: 150 ms.
- `prefers-reduced-motion`: sem deslocamento, sem contagem, sem giro; o conteúdo aparece pronto.
- Sem JavaScript o conteúdo continua legível (elementos "revelar" só escondem quando o script marca `.js` no `html`).

## Componentes

- **Navbar** em pílula flutuante, fixa no topo, com botão "Pedir simulação".
- **Botão de ação:** 48 px, texto "Pedir simulação" em todos os lugares.
- **Faixa da conta:** controle deslizante de R$ 450 a R$ 1.500, resultado em número grande, ressalva sempre visível.
- **Etapas:** seis abas (`role="tablist"`), setas do teclado trocam de aba.
- **Perguntas:** `<details>`.
- **Campo:** rótulo visível, erro abaixo com a palavra "Atenção:", nunca só cor.
