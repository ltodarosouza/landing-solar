# Evidência de verificação

Revisão 9 (21/10/2026). Acumula as revisões anteriores; as seções 7 a 12 abaixo são as mais recentes e prevalecem sobre o que seções antigas dizem de cursor, abas, controle da conta e blocos de texto (todos removidos). Página servida localmente (`python3 -m http.server 4173`) e aberta no navegador embutido do Claude Code.

## 1. Check executável

`node scripts/check.cjs` → **128 de 128**, código de saída 0 (saída completa em `check.txt`).

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

## 7. Revisão 4: casa realista, cena em duas colunas, hero claro, módulos, navbar, FAQ

**Atenção sobre o método:** o painel do navegador estava oculto durante parte dos testes, e uma página em painel oculto não desenha animações nem roda `requestAnimationFrame`. Isso fez a contagem do hero e as entradas parecerem "travadas" em alguns quadros. Depois de mostrar o painel (`show_pane`), as medições abaixo foram refeitas e batem. Os números de quadros por segundo (53 e 62) foram medidos com o painel visível.

**O que o check cobre (111 verificações), além do que já cobria:** hero sem jargão (kWp, inversor, homologação, Lei, CPFL, performance, "injeta") e que diz o que é o produto; título do hero com até 80 caracteres e um destaque; a conta do hero cai de R$ 780 para R$ 118; quatro módulos de confiança, cada um com visual; barras do gráfico na proporção 118/780; linha do tempo das garantias proporcional (25, 10 e 5 anos sobre 25); a casa é um só símbolo usado no hero e na cena; oito painéis em perspectiva; gradiente só em três lugares (fundo e luz do hero, brilho do marca-texto); nada segue o mouse fora do hero (um único `pointermove`); a interação do hero só existe com mouse e sem movimento reduzido; navbar reta no topo e pílula ao rolar; três perguntas animadas e legíveis sem JavaScript.

**Defeitos achados olhando e corrigidos:** cartão da conta cobrindo a casa no hero (era o mesmo erro de texto sobre imagem; passou para baixo da ilustração); título do hero com cinco linhas empurrando o botão para fora da primeira tela (coluna alargada e botão antes dos três passos: botão a 697 px de 800 e a 542 px de 844 no celular); gotas de chuva com um azul fora da paleta; seta laranja da conta com contraste no limite; luz âmbar cobrindo as células dos painéis na cena (opacidade reduzida); rótulo "painéis" em cima dos painéis (subiu para a cumeeira); casa pequena na caixa da cena (enquadramento aproximado).

**Medido no navegador a 1280 px (painel visível):**
- Hero: botão em y=697; luz do cursor ativa (`luz-ativa`), `--prox` chega a 1,000 com o cursor sobre "bem menor", reflexo dos painéis passa para modo manual e volta ao automático ao sair.
- Perguntas: altura 0 → 126 px ao abrir; abrir a segunda fecha a primeira (`aria-expanded` troca); fechar volta a 0.
- Cena: 6 capítulos lidos em p=0,02 / 0,36 / 0,7 / 0,97 (capítulos 1, 3, 5 e 6) com anel no elemento certo; noite com lua, estrelas e fluxo invertido.

**Medido a 390 px:** sem rolagem horizontal; título 40 px; cena com imagem em cima e texto embaixo (capítulo 4 visto); fileira de pontos.

**Não verificado:**
- A luz do cursor foi testada com eventos simulados (e uma captura em que o halo no marca-texto é visível), não com mouse real; o movimento suave não foi visto em vídeo.
- Movimento reduzido: não abri a página com a preferência ligada (o check confere o CSS e o JS).
- Os módulos "Telhado protegido" e "Entrada zero" foram vistos a 864 px e em quadro pequeno a 1280 px, não ampliados.
- Aparelho físico, toque, Safari e Firefox (`backdrop-filter`, `position: sticky`, `transform-box`).
- Desempenho (Lighthouse) e peso da página.

## 8. Revisão 5: hero enxuto, replay, módulos novos, trilha vertical

**Medido contra a versão anterior (via git):** o texto do hero tinha 441 caracteres e o cartão 148. Agora o texto tem 125 (inclui o rótulo do botão) e o cartão só traz "Antes", "Hoje", os dois valores e o selo. O check exige menos de um terço de 441 (147).

**Novas verificações no check (123 no total):** hero sem nota de rodapé e curto; cartão da economia abaixo da casa e sem `position: absolute`; selo de queda igual a 85%; hero e marca-texto como `.replay`; blocos animados só com margem de 12% e 30% visível, recomeçando ao sair; contagens a 2,2 s e 1,8 s; barra de hoje com 15,1% da de antes (118/780); faixa média desenhada igual à do modelo (10% a 25%); legenda do caso real junto das barras; linha do tempo de 25 anos proporcional (5, 10 e 25 anos; retorno entre 12% e 16%); eixo de 0 a 25; mapa com 4 pinos e 3 ondas; chuva com 7 gotas em cada painel; lado do medo com fresta, mancha, pingos e alerta, lado da Ravena com escorrimento, selo e teto seco; nenhuma animação de chuva fora de `.visivel`; trilha com 6 etapas, 6 ícones e bolinha que acende e apaga.

**Defeitos achados olhando e corrigidos:** selo de queda caindo sozinho numa segunda linha do cartão (agora fixo no canto, com espaço no topo para não bater no rótulo "Hoje" no celular); "118" em itálico por causa da tag; gotas e mancha de infiltração pequenas e fracas (aumentadas).

**Medido no navegador com o painel visível:**
- Hero a 1280 px: título em y=104 a 406, botão em y=514 a 562, casa em y=104 e cartão logo abaixo; botão e casa na primeira tela. A 390 px a primeira tela mostra título, botão, casa e cartão (cartão termina em 838 de 844). Sem rolagem horizontal nos dois.
- **Replay do hero:** na primeira vez marca-texto em matrix(1,…) e conta em 118; longe do hero a classe sai, o marca-texto volta a 0 e a conta a 780; ao voltar, 1 s depois o marca-texto está em 0,87 e a conta em 710, e 6 s depois está completo e em 118.
- **Trilha:** `--y` da bolinha 190 → 840 → 1340 → 1694 px conforme o scroll; pontos acesos 1, 3, 4 e 6; ao voltar o scroll voltam a 3 (apagam e tocam de novo).
- Conta antes e depois, linha do tempo de 25 anos, mapa e chuva vistos prontos depois de alguns segundos na tela. Chuva e animações só correm com a classe `.visivel` (conferido por `getComputedStyle`: `animationName` = chuva dentro da tela).
- Chuva a 390 px: os dois painéis empilhados, cada um legível.

**Não verificado:**
- Quadros no meio da animação da chuva, do mapa e da trilha: vi os estados finais, não o movimento. A sensação de ritmo (durações de 1,4 a 2,2 s) é escolha minha, não medida em uso real.
- Em tela pequena o bloco da chuva é alto (dois painéis empilhados): confirmei que a animação liga, mas não que cada painel está visível no momento em que os ícones de chuva aparecem.
- Cada ícone das etapas só foi visto parado (etapa 3 com barras e check); as outras cinco foram vistas apenas pela estrutura e pelo check.
- Movimento reduzido ligado: não abri a página assim; o check confere CSS e JavaScript.
- Aparelho físico, toque, Safari e Firefox; `backdrop-filter`, `position: sticky`, `transform-box` e `clip-path` variam.
- Desempenho (Lighthouse) e peso da página, com muitas animações SVG ao mesmo tempo.

## 9. Revisão 6: infiltração em uma animação, números do início, fluidez

**Descoberta ao medir (causa real da queixa dos números):** a 1280×800 o bloco de números já aparece na base da primeira tela, e o contador rodava no carregamento, enquanto a pessoa lia o hero; ao descer, os números já estavam prontos. Corrigido para contar só quando o bloco chega ao meio da tela (margem de 25% em cima e embaixo) e de novo a cada volta; os números nascem em 0.
- Medido depois de sair e voltar: a classe sai e os números zeram (`v=0`); ao voltar, começa em 29 ms, passa da metade em 379 ms e termina em 1479 ms.

**Fluidez, amostrada a cada 350 ms durante a animação "Quanto a conta cai" (1280 px):**
| t (ms) | barra de antes | barra de hoje | número |
|---|---|---|---|
| 358 | 0,06 | 0 | 780 |
| 1058 | 0,93 | 0,005 | 759 |
| 1758 | 1 | 0,083 | 416 |
| 2108 | 1 | 0,130 | 208 |
| 2825 | 1 | 0,151 | 118 (faixa começa a aparecer) |
| 3525 | 1 | 0,151 | 118 (faixa completa) |
O número e a barra saem da mesma variável: com a barra em 0,083 (55% do caminho) o número está em 416, que é 780 − 662 × 0,55.

**Infiltração (uma animação, quatro passos), vista no navegador a 1280 px, passo por passo:** passo 1 só chuva e escoamento no painel; passo 2 gotas entrando pelo gancho; passo 3 pílula "vedação" âmbar, ✕ de bloqueio e anel pulsando no ponto; passo 4 água correndo pela telha, selo "teto seco" e lâmpada acesa. Os botões trocam de passo, e o ciclo automático dura 4,2 s por passo. Vista a 390 px com a cena aproximada na fixação e os quatro passos empilhados, sem rolagem horizontal.

**Defeitos achados olhando e corrigidos:** gotas que entram pelo gancho pequenas demais (aumentadas); pílulas ilegíveis no celular (cena aproximada, pílulas escondidas); números piscando o valor final antes de contar (agora nascem em 0).

**Novas verificações (128 no total):** animação única, quatro passos, 15 gotas, gancho, massa, chapa, caminho bloqueado, selo de teto seco e lâmpada; partes nomeadas na imagem; os passos contam a história na ordem; cada passo com mínimo de 3,5 s, recomeça no passo 1 ao voltar e fica no 4 com movimento reduzido; animação por passo (gancho no 2, rebate e anel no 3, escorrimento e selo no 4); nada anima fora de `.visivel`; barra e número com linha do tempo única, sem transições soltas no CSS; números da prova só no meio da tela e repetindo.

**Não verificado:**
- O movimento da chuva e da água no gancho foi visto em quadros parados de cada passo; não vi a animação correndo continuamente. O ritmo de 4,2 s por passo é escolha minha.
- A linha do tempo de 25 anos teve só as medidas da conta antes e depois amostradas; a de 25 anos foi vista pronta e confere pelo check, mas não foi amostrada quadro a quadro.
- Gotas de "teto seco" e chuva em aparelho físico, Safari e Firefox.
- Movimento reduzido ligado (o check confere CSS e JS; o passo 4 fixo e o ✕ sem animar não foram vistos).
- Desempenho com todas as animações SVG ligadas ao mesmo tempo.

## 10. Revisão 7: infiltração simplificada

**Queixa:** "muita informação nessa animação, não dá para perceber o que é". **Medida contra a versão anterior (via git):** 163 peças, 6 rótulos e 15 gotas; agora 60 peças, 2 rótulos e 6 gotas, e três passos em vez de quatro. O check exige no máximo 80 peças, exatamente 2 rótulos (vedação e teto seco, a 22 px no desenho) e 6 gotas.

**Visto no navegador:** a 1280 px, passo 2 (água chegando dos dois lados, anel e pílula "vedação") e passo 3 (vedação pulsando, água rebatendo, lâmpada acesa, selo "teto seco", cartão 3 destacado); o módulo inteiro, com os três passos, ocupa 700 px e cabe numa tela de 800 px (antes a cena sozinha tinha 651 px e os passos ficavam cortados). A 390 px: cena de 215 px de altura, rótulos legíveis, passos empilhados, sem rolagem horizontal.

**Não verificado:** o movimento (a água correndo e voltando) foi visto em quadros parados de cada passo; o passo 1 e a transição automática entre passos só foram conferidos por estado (`data-etapa`) e pelo check; movimento reduzido, aparelho físico, Safari e Firefox.

## 11. Revisão 8: "E se chover?" refeito (tempestade sobre a casa)

**Queixa:** a animação da infiltração, mesmo simplificada, "continua feia, estética e intuito errados". **Decisão:** trocar o corte técnico por uma cena de sensação (tempestade, cúpula de garantia, janelas acesas, selo de 5 anos). Também removi uma afirmação que eu tinha inventado: a "vedação" do gancho não consta no brief. O check agora proíbe as palavras vedação, fixação, gancho, manta, ripa e caibro em todo o texto visível.

**Defeito grave achado ao medir (e que o check não pegava):** as linhas de chuva estavam **sem animação** (`animationName: none`) porque sobrou um `.visivel ` solto antes do comentário no CSS, transformando a regra em `.visivel .ch-gota`. O que aparecia no topo eram as linhas paradas. O critério do check procurava só o texto da regra; agora exige que ela comece no início da linha e que não sobre seletor solto, e reintroduzi o defeito numa cópia para provar que ele falha (134 de 135). Depois da correção, amostrei 6 linhas: posições espalhadas de −56 a 620 e mudando em 250 ms.

**Vi no navegador:** 1280 px nos capítulos 1 (chuva fraca, cúpula, nuvens), 2 (chuva forte fora da cúpula, ondas sobre a cúpula, janelas acesas, poças) e 3 (selo "5 anos", chuva ainda caindo lá fora); 390 px com a cena inteira, capítulo ativo visível, sem rolagem horizontal. Cena de 530 px de altura a 1280 px, com os capítulos terminando em 749 de 800.

**Defeitos achados olhando e corrigidos:** chuva atravessando a cúpula e a casa (agora recortada com `clip-path` para existir só fora da cúpula e acima do chão); cena cortada no celular com a casa estourando as laterais e o selo fora de vista (agora a cena inteira em 4:3).

**Novas verificações (136 no total):** cena única com três capítulos fora da imagem; o único texto do desenho é "5 anos"; nenhuma técnica de obra no texto; os três capítulos na ordem; modelo da tempestade (nível 0, > 0,95 no meio e entre 0,55 e 0,75 no fim; três camadas de chuva entrando em sequência; relâmpago só no meio e nunca acima de 1; janelas e selo; céu escurecendo sem voltar); capítulos 0, 1, 2; cúpula âmbar e a mesma casa do hero; chuva recortada fora da cúpula; chuva só corre perto da tela; scroll preso só com JavaScript e movimento permitido; altura da cena cabendo na tela.

**Não verificado:**
- O relâmpago (flash branco no meio da tempestade): conferi o modelo por teste e o estado, mas não o vi acontecer na tela.
- O movimento contínuo (chuva, ondas, poças) foi visto em quadros parados.
- Capítulo 1 e a transição suave entre capítulos no celular foram vistos só pelo estado.
- Movimento reduzido ligado, aparelho físico, Safari e Firefox (`clip-path` evenodd e `transform-box` variam).
- Desempenho com 86 linhas de chuva animadas ao mesmo tempo.

## 12. Revisão 9: "E se chover?" pequeno e sutil (a seção 11 ficou obsoleta)

**Queixa:** a cena da tempestade "parece um arco-íris em cima da casa", não se entende cada parte, o usuário espera; pediu algo pequeno e sutil. **Decisão:** removi a cena inteira (cúpula, três camadas de chuva, relâmpago, scroll preso, arquivo `chuva.js`). A cena tinha 231 peças; o bloco novo tem menos de um quarto disso (o check exige menos de 231/4 = 57) e nenhum texto dentro do desenho.

**Verificações novas e removidas:** saíram os testes do modelo da tempestade (agora não existe modelo); entraram bloco pequeno de duas colunas sem scroll preso nem `chuva.js`; peças menos de um quarto da cena anterior, sem cúpula nem arco e sem texto no desenho; oito gotas e o selo e a nuvem; "5 anos" em destaque fora da imagem; a chuva só anima sob `.visivel` e o bloco é `.replay`; sem movimento a chuva some e o selo aparece pronto; a página continua sem técnica de obra. Total: 128.

**Visto no navegador:** a 1280 px, o bloco com a pergunta, a frase da garantia, "5 anos de garantia contra infiltração" e a casa com gotas, nuvem e selo; `animationName` das gotas é `mc-cai` (animando, o defeito da revisão 8 não se repetiu); a 390 px, o mesmo bloco empilhado, sem rolagem horizontal.

**Não verificado:** as gotas e o respingo em movimento contínuo (vistos em quadro parado, com três ou quatro gotas no ar); o brilho que respira nas janelas; movimento reduzido ligado; aparelho físico, Safari e Firefox.

## 5. (revisão 2) O que NÃO foi verificado

- Não abri em aparelho físico; o celular é emulação de 390 px.
- Não vi a seção de investimento e a faixa de etapas a 390 px, nem o formulário a 390 px nesta revisão.
- Não medi o desempenho nem testei em Safari e Firefox.
- A animação de contagem e de revelar ao rolar foi conferida só pelo estado final; o movimento em si não foi gravado.
- O envio de verdade no WhatsApp não foi testado: o número é fictício (pendente, ver SPEC).
- A URL de produção ainda não existe.
