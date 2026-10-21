# Evidência de verificação

Revisão 9 (21/10/2026). Acumula as revisões anteriores; as seções 7 a 12 abaixo são as mais recentes e prevalecem sobre o que seções antigas dizem de cursor, abas, controle da conta e blocos de texto (todos removidos). Página servida localmente (`python3 -m http.server 4173`) e aberta no navegador embutido do Claude Code.

## 1. Check executável

`node scripts/check.cjs` → **132 de 132**, código de saída 0 (saída completa em `check.txt`).

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

## 13. Publicação (21/10/2026)

- **Repositório público:** https://github.com/ltodarosouza/landing-solar (branch `main`). Confirmado sem credencial: `GIT_TERMINAL_PROMPT=0 git -c credential.helper= ls-remote https://github.com/ltodarosouza/landing-solar.git` devolveu as referências `HEAD` e `refs/heads/main`.
- **Página no ar:** https://landing-solar-sigma.vercel.app (deploy de produção da Vercel, projeto `landing-solar`). Conferido sem login: a página e os quatro arquivos (`styles.css`, `app.js`, `cena.js`, `assets/logo.svg`) respondem 200 com o tipo certo; o título e o `h1` são os esperados; o console não mostra erro; a conta do hero termina em 118.
- **Defeito achado só depois de publicar:** a 864 px (tablet) a trilha das etapas estourava 3 px na horizontal, porque a palavra "Acompanhamento", a 48 px, é mais larga que a coluna de texto naquele tamanho. Eu tinha testado só 390 e 1280. Corrigido (coluna de texto com `minmax(0, 1fr)`, ícone com `clamp(220px, 28vw, 300px)` e quebra de palavra no título) e medido em **360, 390, 600, 768, 864, 899, 1024, 1280 e 1440 px**: nenhum tem rolagem horizontal.
- **Não verificado na versão publicada:** aparelho físico, Safari e Firefox; desempenho; o número de WhatsApp continua fictício e as fotos reais das obras e os depoimentos em vídeo continuam pendentes (ver SPEC).

## 14. FAQ com as seis perguntas do brief

**Pedido:** responder no FAQ a pergunta número um do cliente ("Como sei que vocês não vão sumir daqui a dois anos?") e as outras que mais aparecem. **Feito:** o FAQ tinha 3 perguntas e agora tem as 6 do brief, na ordem em que o cliente as faz; todas começam fechadas (decisão do aluno: a primeira abria sozinha numa versão anterior). A resposta ao medo número um usa só as provas do brief: seis anos, onze pessoas, 412 sistemas, equipe própria com carteira assinada, 5 anos de garantia da instalação, assistência técnica autorizada e acompanhamento no primeiro ano. A do telhado só diz a garantia de 5 anos contra infiltração causada pela obra e a visita técnica com medição. Nenhuma resposta promete que a empresa "nunca vai sumir".

**Check (131):** seis perguntas, todas fechadas ao carregar, região ligada ao botão; as seis são as do brief na ordem; a resposta 1 contém as sete provas; a resposta 2 só diz o que o brief diz.

**Medido no navegador a 1280 px (com o painel visível):** ao carregar, só a primeira aberta (203 px de altura, as outras em 0); abrir a quinta fecha a primeira (alturas 0, 0, 0, 0, 75, 0); reabrir a primeira fecha a quinta; clicar de novo fecha tudo. Um primeiro teste foi descartado porque o painel estava oculto e a animação não corria; repeti com o painel visível.

**Não verificado:** o FAQ a 390 px (só o CSS, que é o mesmo) e em aparelho físico, Safari e Firefox.

## 15. Números da prova subindo e descendo sem parar

**Relato do aluno (com print):** "tem um pixel que está bugando os valores, eles ficam subindo e descendo toda hora". **Causa:** o observador dos números (zona de ativação com 25% de margem em cima e embaixo) observava o próprio bloco, que ao aparecer sobe 24 px (`translateY(24px)` para nenhum). Com o bloco parado numa faixa de 24 px na borda de cima da zona: aparecer o move para fora da zona, ele "some" e os números zeram, voltar ao lugar o põe de novo dentro da zona, e o laço não acaba. No print, a base do bloco está a cerca de 250 px com a zona começando em 220 px, ou seja, dentro dessa faixa.

**Como confirmei:** não consegui reproduzir no navegador, porque a sessão estava sem janela e o navegador não entregou as notificações de visibilidade (a varredura que tentei devolveu zero trocas e `visivel` falso em todas as posições, o que não prova nada). Simulei a geometria em Node (viewport de 880 px, zona de 220 a 660, bloco de 170 px, deslocamento de 24 px): observando o bloco que se desloca, 24 posições de rolagem oscilam; observando o pai estável, 0.

**Correção:** o observador agora observa o bloco pai (`.prova`), que não se desloca. O check (132) exige isso e foi provado contra uma cópia com o defeito reintroduzido (falha). A mesma checagem de padrão: os outros blocos animados (`.replay`) não têm transformação neles mesmos, e os revelados uma vez (`.revela`) deixam de ser observados depois de aparecer, então não entram em laço.

**Não verificado:** não vi a correção funcionando numa janela de verdade; a confirmação é a simulação, o raciocínio e o check. Peço para você rolar devagar até os números parar na altura do print e me dizer se ainda oscilam.

## 16. Validação no servidor (FALTA.md, item 2)

**Resultado esperado, escrito antes de executar:** um pedido com conta de R$ 200, ou com cidade fora das quatro atendidas, mandado direto ao servidor sem passar pela página, é recusado com 422 e uma explicação; um pedido válido é aceito com 200.

**Feito:** `api/pedido.js` (função da Vercel) recebe o pedido e chama o mesmo `validar` de `app.js`, sem copiar regra. `validar` agora recusa qualquer cidade fora da lista (antes só recusava "outra"; mandar "Campinas" direto passava). A página consulta o servidor antes de abrir o WhatsApp e só bloqueia com 422; se o servidor não responder, o pedido não se perde e segue.

**Evidência:** `evidencia/servidor.txt` guarda as requisições feitas com `curl` contra a função rodando num servidor local que imita o contrato da Vercel: conta R$ 200 → 422 com o motivo da conta; "Campinas" e "outra" → 422 com o motivo da cidade; pedido válido → 200; nome como objeto e conta como lista → 422 sem quebrar; corpo que não é JSON → 400; GET → 405. O check subiu de 132 para 141. Provei o check contra uma cópia com a validação do servidor desligada: três checks falham (138 de 141); restaurada, 141 de 141.

**Mensagens que dizem o motivo:** a recusa de conta diz "Seu gasto com luz está abaixo do mínimo de R$ 450 por mês… Sentimos muito" e a de cidade diz "Sua cidade fica longe demais. Sentimos muito, mas não podemos te atender…" (check, 142). **Publicado:** push e deploy feitos; `evidencia/servidor-publico.txt` repete na URL pública conta R$ 200 → 422, Campinas → 422, válido → 200 e GET → 405, com as mensagens novas.

**Não verificado nesta seção:** o formulário aberto no navegador com a função ligada (isso foi feito depois, na seção 17); aparelho físico; e a validação no servidor hoje não protege nada de fato, porque o servidor ainda não guarda o pedido (item 1 do FALTA.md): ela só passa a valer de verdade quando o pedido passar a ser gravado nele.


## 17. Conversão para Next (a página não pode mudar)

**Combinado:** a página fica idêntica; muda só a estrutura em volta. **Ponto de retorno:** a tag `antes-da-conversao-next` (estado estático, commit anterior ao da conversão); voltar é `git checkout antes-da-conversao-next`.

**O que mudou na estrutura:** `index.html` virou `app/conteudo.html` (o mesmo HTML) entregue por `app/layout.js`, que traz título, descrição, `lang`, viewport e o `js` do `<html>`; `styles.css` virou `app/styles.css`; `app.js`, `cena.js` e a logo foram para `public/` (mesmos arquivos, mesmo endereço); `api/pedido.js` virou a rota `app/api/pedido/route.js`, que chama `lib/pedido.js`, e este usa o `validar` de `public/app.js`, a única fonte da regra (a página e o servidor leem o mesmo arquivo). `vercel.json` diz à Vercel que o projeto é Next. O endereço de produção é o mesmo, `landing-solar-sigma.vercel.app`.

**Uma escolha que vale registrar:** o HTML da página não foi reescrito em componentes; ele entra como está dentro de um invólucro `display: contents` (que não vira caixa). Tentei antes pôr o conteúdo direto no `<body>`, e o React acusou erro de hidratação (#418) e apagou o que o `app.js` tinha feito; o invólucro resolveu. Reescrever em componentes seria outro trabalho, com risco de mudar a página, e não traz nada enquanto os scripts são de JavaScript puro.

**Evidência de antes e depois (três larguras, de cima a baixo):** `evidencia/conversao-next/antes-*.png` e `depois-*.png` (celular 390, tablet 768 e desktop 1280 px). O script `ferramentas/captura.cjs` abre a página no Chrome, com movimento reduzido e as animações paradas no instante zero, para a imagem não depender do tempo; `ferramentas/compara2.cjs` compara. O "antes" saiu da página estática da tag, servida à parte. Resultado, local (`comparacao-local.txt`) e na URL pública (`comparacao-publica.txt`): mesmas alturas (11906, 11793 e 8889 px), **zero pixels com diferença acima de 3/255 nas três larguras** e o HTML do conteúdo igual depois dos scripts rodarem. Há de 1.637 a 15.610 pixels com diferença de **1/255**, todos na faixa da barra de navegação (y de 12 a 71), que não se enxerga. Para saber que a comparação enxerga diferença, mudei o raio dos cantos de 16 para 6 px no "antes": ela acusou cerca de 2.170 pixels diferentes em cada largura. E duas capturas do mesmo "antes" dão zero de diferença entre si.

**Formulário (navegador, `evidencia/form-next.txt` local e `form-next-publico.txt` público, imagens em `formulario/` e `formulario-publico/`):** conta de R$ 200 recusada na página, com "Seu gasto com luz está abaixo do mínimo de R$ 450…", sem chamar o servidor; cidade "outra" recusada com "Sua cidade fica longe demais. Sentimos muito…", sem chamar o servidor; pedido válido: chama `/api/pedido` uma vez, recebe 200 e abre o WhatsApp com a mensagem; e o caso em que o servidor recusa: **aqui a resposta 422 foi simulada** (a página não deixa passar nada que o servidor recuse), e a página mostra a mensagem do servidor e não abre o WhatsApp. Nenhum erro de página nos quatro casos.

**A rota, com `curl` (`servidor-next-local.txt` e `servidor-next-publico.txt`, script `scripts/pedidos.sh`):** conta R$ 200 → 422; "Campinas" e "outra" → 422; válido → 200; nome como objeto e conta como lista → 422; corpo que não é JSON → 400; GET → 405 com `Allow: POST`. Mesmos resultados de antes da conversão.

**Check:** 146 de 146 (eram 142). Os caminhos do check mudaram para os novos arquivos, sem afrouxar nenhuma regra; entraram checks da estrutura (rota só repassa, uma cópia do `app.js`, scripts no fim do conteúdo, `vercel.json` e dependências).

**Não verificado:** a comparação é da página carregada, com movimento reduzido e animações paradas; **não comparei imagem a imagem as animações em movimento nem os estados em que a página fica durante a rolagem**. Só vi, na versão publicada, que os scripts rodam (as classes de revelar aparecem) e que não há erro de página. Aparelho físico, Safari e Firefox continuam não testados. O primeiro `vercel deploy --prod` desta conversão terminou com erro e não investiguei a causa; repeti o mesmo comando e funcionou. O WhatsApp segue fictício e a validação ainda não guarda pedido.

## 18. Rota nova: o céu de Sorocaba agora (API pública sem chave)

**API escolhida:** Open-Meteo (previsão do tempo, sem chave). Faz sentido para a Ravena porque a dúvida do cliente "e em dia nublado?" é a quinta pergunta do FAQ, e o visitante vê como está o céu da cidade dele naquele momento. **Contrato lido antes de escrever código** (aberto no terminal): o pedido vai no endereço, com latitude, longitude, `current=temperature_2m,cloud_cover,is_day` e o fuso, sem chave e sem corpo. A resposta traz `current` (hora, temperatura, nuvem, dia ou noite) e `current_units`, que diz que a temperatura é em °C e a nuvem em %. Com a latitude trocada por `abc` ela responde **400** com `{"error":true,"reason":"Invalid value: Cannot initialize Float from invalid String value abc"}`. O limite é por IP.

**Escopo pedido ao agente (declarado antes):** só uma rota nova (`/api/ceu`, GET) e uma linha dentro da resposta do FAQ do dia nublado; nada de efeito novo, nada fora do que o brief diz (a linha só diz o que a API mediu, mais a frase do brief de que à noite o sistema não produz), sem tirar nada da ação única (o botão "Pedir simulação" não mudou). A rota fala com a Open-Meteo no servidor, com limite de 3 s, confere °C e %, guarda a leitura por 10 minutos e, se a fonte cair, devolve a última de até 3 h marcada como antiga. O desenho do caminho do clique está em `evidencia/caminho-ceu.md`.

**Falha provocada de verdade (`scripts/falhas-ceu.cjs`, 14 verificações, rodado também pelo check):** servidores falsos na porta local imitam a Open-Meteo e fazem cada coisa que uma API faz: não responder nunca (a rota desiste em 3 s e devolve 504 `demorou`), cortar a conexão no meio da resposta (502 `caiu`), quebrar com 500 (502 `caiu`), cortar por excesso de pedidos com 429 (503 `limite`, repassando o `Retry-After`), recusar o pedido com 400 (502 `recusou`), responder com °F no lugar de °C, com HTML e com JSON sem os campos (as três: 502 `inesperado`), e fonte fora do ar (conexão recusada: 502 `caiu`). Mais três de memória: a leitura de cinco minutos atrás é reaproveitada; com a fonte caída aos 25 minutos, sai a última leitura marcada como desatualizada; passadas 4 horas, não vale mais (502). Provei o check contra uma versão com a conferência de unidade removida: falhou (150 de 152); restaurada, 152 de 152.

**Falha vista na tela (`evidencia/ceu-falhas-na-tela.txt` e `evidencia/ceu/*.png`):** com a rota local apontando para a Open-Meteo falsa, abri a pergunta no navegador em cada modo. Fonte muda: depois de cerca de 2,3 s a linha diz "A previsão demorou demais para responder, então não mostro o céu de agora. A resposta acima vale do mesmo jeito." e oferece "Tentar de novo". Fonte que corta, e rota que cai (pedido derrubado no navegador): "Não consegui ver o céu de Sorocaba agora: o serviço de previsão não respondeu…". 429: "O serviço de previsão pediu para esperar um pouco…". Rota que demora mais de 9 s: o navegador desiste em 5 s e mostra a mensagem de demora. Fonte boa: "Agora em Sorocaba: 22 °C, céu coberto (100% de nuvens). Dados: Open-Meteo". Em todos, a pergunta continua respondida e não há erro de página. Um defeito visto na tela e corrigido: o "Tentar de novo" herdava o estilo grande dos botões do FAQ e ficava enorme.

**Na URL pública (`ceu-rota-publica.txt`, `ceu-pagina-publica.txt`, imagens `publico-*.png`):** `/api/ceu` responde 200 com 23 °C, céu coberto, 100% de nuvens (leitura de verdade da Open-Meteo, a partir da Vercel); a página mostra a linha ao abrir a pergunta; e, derrubando a rota no navegador, mostra a mensagem de falha.

**Não verificado:** (1) na URL pública não provoquei a falha da Open-Meteo em si (só a da rota, derrubada no navegador), porque a Vercel guarda a resposta boa por 10 minutos e a fonte real não dá para quebrar; a falha da fonte foi provocada apenas com as fontes falsas, local. (2) A frase da noite ("É noite: o sistema não produz agora…") foi vista só no teste da função (`dia` falso), não na tela. (3) A Open-Meteo gratuita é para uso **não comercial**; o site é comercial, então antes de uso real precisa de plano pago (com chave no servidor) ou outra fonte. Está nas pendências da SPEC. (4) Aparelho físico, Safari e Firefox continuam sem teste.

## 5. (revisão 2) O que NÃO foi verificado

- Não abri em aparelho físico; o celular é emulação de 390 px.
- Não vi a seção de investimento e a faixa de etapas a 390 px, nem o formulário a 390 px nesta revisão.
- Não medi o desempenho nem testei em Safari e Firefox.
- A animação de contagem e de revelar ao rolar foi conferida só pelo estado final; o movimento em si não foi gravado.
- O envio de verdade no WhatsApp não foi testado: o número é fictício (pendente, ver SPEC).
- A URL de produção ainda não existe.
