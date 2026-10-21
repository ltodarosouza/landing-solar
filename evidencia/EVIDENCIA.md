# Evidência de verificação

Revisão 3 (21/10/2026), que acrescenta a cena guiada pelo scroll, o cursor e a prova social redesenhada sobre a revisão 2. Página servida localmente (`python3 -m http.server 4173`) e aberta no navegador embutido do Claude Code.

## 1. Check executável

`node scripts/check.cjs` → **97 de 97**, código de saída 0 (saída completa em `check.txt`).

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

## 6. Revisão 3: cena guiada pelo scroll, cursor, prova social

**Bug achado pelo aluno (print):** os números da prova social ficaram minúsculos ao lado de rótulos grandes. Causa: a regra `.numero span` (14 px, cinza) pegava também o `span` do número que conta. Corrigido com `.numero > span`; medido depois: número em 72 px a 1280 px.

**Modelo da cena testado pelo check (`cena.js`, funções puras):** sol começa no horizonte (y 560), passa no alto (y 120) e se põe; cruza da esquerda para a direita sem voltar; painéis só acendem com sol; o sol some à noite; a energia sai para a rede de dia e volta à noite; o crédito cresce de dia e não zera; seis capítulos em ordem; o texto do inversor cita os 10 anos do brief; os capítulos não têm R$ nem % (nenhum número novo).

**Visto no navegador (desktop 1280 px), rolando o scroll a 20%, 38%, 52%, 70% e 97% da cena:**
- 20%: painéis começam a acender, feixes de luz do sol ao telhado.
- 38% (capítulo 3): painéis âmbar, fio tracejado correndo até o inversor, LED aceso.
- 52% (capítulo 4): janelas acesas.
- 70% (capítulo 5): sol sobre o poste, fluxo indo para a rede, barra de crédito enchendo.
- 97% (capítulo 6): noite, lua, estrelas, janelas acesas, fluxo invertido (da rede para a casa), sol fora de vista.
Defeitos achados olhando e corrigidos: cartão do capítulo cobria a casa no desktop (enquadramento deslocado); sol aparecia desbotado atrás do chão à noite; poste e pontos laterais sumiam no escuro (contorno branco).

**Visto a 390 px:** a cena inteira cabe na metade de cima, cartão do capítulo embaixo, dia (52%) e noite (97%), sem rolagem horizontal. O primeiro enquadramento ampliava demais e foi refeito; os pontos de capítulo viraram uma fileira horizontal porque caíam sobre o medidor.

**Interações medidas por script (desktop):**
| Sobre | Rótulo do cursor |
|---|---|
| botão "Pedir simulação" | Pedir |
| pergunta | Abrir |
| aba de etapa | Ver |
| controle da conta | Arraste |
| cena no capítulo 1 | Role |
| texto comum | sem rótulo |
Barra de progresso em scaleX(0,04) perto do topo; navbar marca "O sistema" ao estar na cena; título do hero dividido em 11 palavras com `aria-label` do texto inteiro; 62 quadros por segundo no painel.

**Não verificado nesta revisão:**
- Movimento reduzido: o código desliga cena, cursor, contagem e hero, e o check confere o CSS e o JavaScript, mas não abri a página com a preferência ligada.
- Aparelho físico, toque e rolagem com o dedo; Safari e Firefox (`backdrop-filter`, `position: sticky` e `transform-box` variam).
- O cursor foi testado com eventos simulados, não com um mouse real: o movimento suave do anel e o efeito de mistura (`mix-blend-mode`) não foram vistos em movimento.
- Os quadros intermediários do scroll (transições entre capítulos) só foram vistos parados. Em um quadro, textos de capítulos se sobrepunham durante a transição; confirmei por script que depois de assentar só o capítulo ativo fica com opacidade 1.
- Desempenho (Lighthouse) e peso da página.

## 5. (revisão 2) O que NÃO foi verificado

- Não abri em aparelho físico; o celular é emulação de 390 px.
- Não vi a seção de investimento e a faixa de etapas a 390 px, nem o formulário a 390 px nesta revisão.
- Não medi o desempenho nem testei em Safari e Firefox.
- A animação de contagem e de revelar ao rolar foi conferida só pelo estado final; o movimento em si não foi gravado.
- O envio de verdade no WhatsApp não foi testado: o número é fictício (pendente, ver SPEC).
- A URL de produção ainda não existe.
