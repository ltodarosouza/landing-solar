# Evidência de verificação

Revisão 2 (21/10/2026). Página servida localmente (`python3 -m http.server 4173`) e aberta no navegador embutido do Claude Code.

## 1. Check executável

`node scripts/check.cjs` → **79 de 79**, código de saída 0 (saída completa em `check.txt`).

Falhas que o check pegou durante esta revisão, e o que foi corrigido:
- **Contraste do "+" das perguntas:** laranja sobre fundo claro dava 2,88:1, abaixo de 3:1. Corrigi a página (símbolo em marinho), não o critério. A regra agora é: laranja só em número grande sobre o painel branco.
- **Rótulos do formulário:** o check esperava 4 `label`; o controle da conta virou o quinto. Falha do check, corrigido para 5.
- Na versão anterior, o check também falhou uma vez por bug dele (ponto final entrando no valor) e foi provado contra uma cópia quebrada de propósito (3 falhas pegas).

Novos checks desta revisão: ilustrações só com a paleta do DESIGN.md, cinco ilustrações com `role=img`, faixa da conta (R$ 780 dá R$ 78 a R$ 195, o caso real de R$ 118 cai dentro, nunca chega a zero), seis abas com painel, gradiente só no hero, `prefers-reduced-motion` presente.

## 2. Medidas no navegador (computed style, não screenshot)

| Medida | 390 px | 1280 px |
|---|---|---|
| Rolagem horizontal | não | não |
| Elementos além da borda (fora de abas rolável e SVG) | nenhum | n/a |
| h1 / h2 | 40 px / 32 px | 72 px / 48 px (conferido no CSS, tela vista) |
| Tamanhos de fonte em uso | 14, 16, 20, 32, 40 px | n/a |
| Botão da navbar | 48 px de altura, uma linha (antes quebrava em duas e foi corrigido) | n/a |

## 3. Interações, testadas no navegador

| Caso | Resultado observado |
|---|---|
| Controle em R$ 1.200 | "R$ 120 e R$ 300" |
| Controle em R$ 450 (mínimo) | "R$ 45 e R$ 113" |
| Botão sob o controle com R$ 900 | Levou 900 ao campo de conta do formulário |
| Aba 4 clicada | Só ela selecionada, painel "Projeto e homologação na CPFL", barra em 66,7% |
| Seta direita na aba 4 | Foi para a aba 5 |
| Números da prova | 412, 4,8, 6, 11 (valores finais) |
| Console | Sem erros |
| Formulário (revisão 1, mesmo código) | R$ 200 bloqueia, cidade fora do raio bloqueia, dados válidos montam o link do WhatsApp |

## 4. Visto por tela

Hero, faixa da conta, quatro blocos com ilustração, investimento, etapas, garantias, perguntas, formulário e rodapé foram vistos a 1280 px; hero, faixa da conta, bloco do telhado, garantias e perguntas a 390 px. Um erro foi achado e corrigido olhando: a ilustração do financiamento tinha "Entrada zero" escrito dentro da barra da parcela, o que sugeria parcela zero.

## 5. O que NÃO foi verificado

- Não abri em aparelho físico; o celular é emulação de 390 px.
- Não vi a seção de investimento e a faixa de etapas a 390 px, nem o formulário a 390 px nesta revisão.
- Não medi o desempenho nem testei em Safari e Firefox.
- A animação de contagem e de revelar ao rolar foi conferida só pelo estado final; o movimento em si não foi gravado.
- O envio de verdade no WhatsApp não foi testado: o número é fictício (pendente, ver SPEC).
- A URL de produção ainda não existe.
