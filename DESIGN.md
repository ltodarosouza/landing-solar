# DESIGN — Ravena Solar

Regras com valor. Cada uma é conferida por `scripts/check.cjs` ou pelas medidas em `evidencia/`.

## Cor

Os três tokens de marca vêm de `assets/logo.svg`; o check compara.

| Token | Valor | Origem | Uso |
|---|---|---|---|
| `--marinho` | `#123A55` | RAVENA no logo | Texto, títulos, fundos escuros |
| `--ambar` | `#F2A03D` | sol no logo | **Só o botão de ação** e filetes |
| `--laranja` | `#E8721C` | SOLAR no logo | Só decoração (números grandes, filete). Nunca texto pequeno |
| `--papel` | `#F6F8FA` | neutro | Fundo de seção alternada |
| `--branco` | `#FFFFFF` | neutro | Fundo base |
| `--tinta-suave` | `#4A5B68` | neutro derivado do marinho | Texto de apoio |

Regras:
- O botão `.btn` é **âmbar com texto marinho**. É a única coisa âmbar-sólida clicável da página.
- Branco sobre laranja reprova contraste (cerca de 3,3:1). Laranja não leva texto de corpo.
- Contraste mínimo 4,5:1 para texto de corpo e botão (check calcula).

## Tipo

Pilha do sistema (sem arquivo de fonte para baixar): `"Helvetica Neue", Helvetica, Arial, sans-serif`, a mesma da logo.

Quatro tamanhos, nenhum a mais:

| Papel | Tamanho | Peso |
|---|---|---|
| Corpo / apoio | 16 px | 400 |
| Rótulo / legenda | 14 px | 600 |
| Título de seção (h2) | 28 px (celular) a 36 px (≥ 768 px) | 700 |
| Título da primeira dobra (h1) | 34 px (celular) a 52 px (≥ 768 px) | 700 |

Números de destaque usam o tamanho do h2 em peso 700. Altura de linha 1,6 no corpo, 1,15 nos títulos. Largura de texto corrido máx. 62 caracteres (`62ch`).

## Espaço

Escala de 8: 8, 16, 24, 48, 96 px (`--e1` a `--e5`). Seção: 96 px de respiro vertical em tela larga, 48 px no celular. Nada de valor fora da escala.

## Forma e profundidade

Raio 8 px em cartões e campos. Sem sombra, sem gradiente: borda de 1 px `rgba(18,58,85,.16)`. A página é de leitura técnica; decoração concorre com o número.

## Layout

- Conteúdo em coluna única até 768 px; a partir daí, grades de 2 a 3 colunas.
- Largura máxima do conteúdo 1040 px, gutter lateral 24 px.
- Alvo de toque mínimo 48 px de altura (botão e campos).
- Teste de largura: 390 px (celular) sem rolagem horizontal.

## Componentes

- **Botão de ação** `.btn`: 48 px de altura, texto "Pedir simulação" em todos os lugares (menu, primeira dobra, fim).
- **Números de prova**: número grande em marinho, legenda abaixo em 14 px.
- **Pergunta e resposta**: `<details>`; pergunta em 16 px peso 700, resposta em 16 px normal.
- **Campo**: rótulo visível acima (14 px), erro abaixo em marinho com ícone de texto "Atenção:", nunca só cor.

## Movimento

Nenhum além de transição de 150 ms no foco e no hover do botão. Respeita `prefers-reduced-motion`.
