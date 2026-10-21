# SPEC — Landing Ravena Solar

Esta é a spec da página **como ela está hoje**. Foi escrita antes da primeira versão e reescrita no fim, depois de várias rodadas de ajuste; as mudanças de ideia que importam estão em "O que mudou de ideia". Se a página divergir daqui, um dos dois está errado.

## A única coisa que a página precisa fazer acontecer

Uma pessoa com conta de luz a partir de R$ 450 por mês, em Sorocaba, Votorantim, Itu ou Salto, **pede uma simulação**. Meta do cliente: de cerca de 12 para 25 pedidos por mês, com menos pedidos de quem tem conta de R$ 200.

## Para quem

Dono da casa, 35 a 60 anos, família, compara três orçamentos e leva de duas a oito semanas para decidir. Desconfia do setor. O medo número um é a empresa sumir com a obra pela metade; depois vêm o telhado infiltrar e a dúvida se, depois da taxação do sol, ainda vale a pena.

## A promessa

> Seu telhado produz energia. Sua conta de luz fica bem menor.

Prova logo abaixo, no mesmo lugar: uma casa em Sorocaba que pagava R$ 780 e hoje paga R$ 118 (queda de 85%, a conta desse caso). É o único caso com número conferido que o cliente tem. Não prometemos percentual para todo mundo: a média dos clientes é de 75% a 90% de queda, e a conta nunca zera.

O hero fala como quem explica para um vizinho: sem kWp, inversor, homologação ou Lei. O termo técnico aparece depois, já explicado.

## O que a página tem, na ordem

1. **Navbar:** barra reta e fixa no topo; vira pílula flutuante ao rolar. Links "O sistema", "Etapas", "Perguntas" e o botão.
2. **Hero:** título, uma frase, botão, a casa e, colado nela, o cartão da economia (R$ 780 riscado, R$ 118, selo de 85%). Quase nada de texto.
3. **Prova social:** 412 sistemas, 4,8 no Google (137 avaliações), 6 anos, 11 pessoas de equipe própria com carteira assinada. Os números contam quando o bloco chega ao meio da tela.
4. **Do sol à conta de luz:** cena guiada pelo scroll, em duas colunas (texto de um lado, imagem do outro), seis capítulos: o sol bate no telhado, a luz vira energia, o inversor deixa a energia pronta para usar (10 anos de garantia), a casa usa a energia do telhado, o que sobra vira crédito, à noite o crédito paga (e a conta não zera).
5. **Quanto a conta cai:** duas barras, antes e hoje, com a faixa média dos clientes (75% a 90%) desenhada em volta da barra de hoje. Texto único: a média e "ela não zera". Botão.
6. **Quanto custa e quando se paga:** R$ 14 mil a R$ 19 mil para 5 a 8 kWp (12 a 20 painéis); entrada zero é possível, com dois bancos, e a parcela costuma ficar perto da conta de luz de hoje. Uma linha do tempo de 25 anos mostra o retorno (3 a 4 anos) e as garantias (5 anos da instalação, 10 do inversor, 25 do painel).
7. **Quem instala é a nossa equipe:** mapa das quatro cidades num raio de 80 km, equipe própria e assistência autorizada da marca do inversor.
8. **E se chover?:** a pergunta do cliente, a garantia de 5 anos contra infiltração causada pela obra, "5 anos" em destaque e uma animação pequena e sutil (a casa, chuva leve, um selo de certo).
9. **Etapas:** trilha vertical com uma bolinha que desce com o scroll e acende seis etapas (simulação, visita, proposta, homologação na CPFL, instalação, acompanhamento). Prazo: de 45 a 60 dias entre a assinatura e o sistema ligado.
10. **Perguntas:** as seis que o cliente mais faz, na ordem do brief: como sei que vocês não vão sumir (o medo número um, a primeira da lista), isso não vai estragar meu telhado, taxaram o sol, e se eu mudar de casa, nublado e à noite, preciso de bateria. Todas começam fechadas; as respostas usam só o que o brief diz.
11. **Formulário** em seção escura: nome, WhatsApp, cidade e valor médio da conta; antes dele, uma linha de quem a Ravena não atende. O botão repete a mesma ação.
12. **Rodapé:** descrição da empresa, cidades e a CPFL como distribuidora.

## Decisões

| Decisão | Escolha | Motivo |
|---|---|---|
| Ação única | "Pedir simulação", com a mesma frase no menu, no hero, depois das barras e no formulário | Uma coisa só para clicar |
| Filtro de conta baixa | No campo, valor abaixo de R$ 450 bloqueia o envio e explica | O vendedor perde o dia com conta de R$ 200; o cliente mesmo desaconselha |
| Validação no servidor | A rota `/api/pedido` repete as regras de conta e cidade (o `validar` de `public/app.js` é a única fonte, usado pela página e pelo servidor) e devolve 422 com o motivo. A página só bloqueia com 422; se o servidor não responder, o pedido segue para o WhatsApp | O filtro só no navegador se contorna; mas perder um pedido bom por falha do servidor é pior |
| Filtro de região | Cidade em lista com as quatro atendidas e "Outra cidade", que bloqueia e explica o raio de 80 km | Sem atendimento fora do raio |
| Foto da conta | Não há campo de arquivo. Depois do envio, a página pede para mandar a foto ou o PDF na conversa de WhatsApp | A página é estática, sem servidor para receber arquivo; o WhatsApp recebe |
| Envio | O formulário abre o WhatsApp da Ravena com a mensagem pronta | Resposta é por WhatsApp no mesmo dia útil; a única função do servidor é validar (`api/pedido.js`); nenhum dado é guardado por nós |
| Ordem das seções | Primeiro entender o produto (hero e cena), depois o que muda na conta, o que custa, em quem confiar, o que acontece até ligar | Cada seção responde ao que a pessoa pergunta naquele ponto |
| Site de 2021 | Recomeço do zero. Aproveitado: só a logo e as cores dela | O antigo é "quem somos" mais um formulário no rodapé, que é o problema |
| Cor | Tokens tirados de `assets/logo.svg`, conferidos por script | O cliente pede que as cores venham do arquivo |
| Stack | Next (App Router) com a página como era: o HTML, o CSS e os scripts continuam os mesmos, só a estrutura em volta mudou. JavaScript puro nos scripts, sem build deles. Deploy na Vercel | A página ganhou um servidor (`/api/pedido`) e vai ganhar banco e variáveis de ambiente; página e servidor passam a viver no mesmo projeto, com rotas e prévia por PR. Antes era estática com uma função ao lado |
| Movimento | Cada bloco anima só quando está bem dentro da tela e recomeça quando a pessoa volta. Tudo desliga com `prefers-reduced-motion` e a página funciona sem JavaScript | Animação que acaba antes de alguém ver não serve |
| Interação com o cursor | Uma só, no hero: uma luz quente que acompanha o cursor | Cursor customizado, ímã e inclinação foram tirados a pedido do aluno |

## O que fica de fora, e por quê

- **"Quem somos", "missão, visão e valores":** não vendem. O que importa de "quem somos" (seis anos, onze pessoas, equipe própria) virou prova.
- **Depoimentos em vídeo e fotos das 40 obras:** o cliente tem, mas não vieram no material. Não invento depoimento nem uso foto de banco de imagens. As imagens da página são ilustrações próprias, nas cores da marca.
- **Texto das avaliações do Google:** só a nota e a contagem, que são o que o brief dá.
- **Calculadora de economia com tarifa e irradiação:** o brief não dá as premissas. A página só mostra o caso real e a faixa média de 75% a 90%.
- **Técnica de obra** (vedação, fixação, manta, estrutura): o brief só traz a garantia de 5 anos contra infiltração causada pela obra. A página não descreve como a obra é feita.
- **Bateria, indústria, comércio acima de 75 kWp, manutenção de sistema alheio:** aparecem só na linha de quem a Ravena não atende.
- **Slogans do setor:** "energia do futuro", "sustentabilidade", "revolução solar".
- **Blog, redes sociais, chat flutuante, pop-up:** concorrem com a ação.

## Linhas que a copy não cruza

- Nada de "grátis", "economia de 95%", "energia do futuro", "revolução solar", "sustentabilidade".
- Nenhum prazo além de 45 a 60 dias entre a assinatura e a ligação.
- A conta não zera. A página diz isso mais de uma vez.
- Número sem fonte no brief não entra. O 85% do selo é a conta do caso real (780 para 118), nunca uma média.
- O caso de R$ 780 para R$ 118 é sempre apresentado como um caso, nunca como média. A média (75% a 90%) vem rotulada como média dos clientes.
- Sem texto por cima de imagem, e sem jargão no hero.

## O que mudou de ideia

- **Controle deslizante da conta → duas barras.** Arrastar um valor para ver uma faixa não era intuitivo. Mostrar o caso real, com a faixa média em volta, diz a mesma coisa em dois segundos.
- **Quatro cartões de texto → módulos visuais.** Depois da cena, a página era "um monte de blocos iguais, só de texto". Viraram o mapa, a linha do tempo de 25 anos e a pergunta da chuva.
- **Hero com muita informação → hero enxuto.** Tinha 441 caracteres de texto, mais legenda e passos. Agora tem título, uma frase, botão, casa e o cartão da economia.
- **Infiltração em corte técnico → bloco pequeno.** O corte do telhado era feio e, pior, inventava uma vedação que o brief não traz. Uma tempestade com uma cúpula âmbar sobre a casa foi tentada em seguida e descartada porque parecia um arco-íris. Ficou um bloco simples com a garantia em texto e uma animação sutil.
- **Cursor customizado, ímã nos botões, cartões que inclinam → só a luz do hero.**
- **Abas das etapas → trilha vertical com a bolinha que acompanha o scroll.**

## Pendências assumidas

- O número de WhatsApp da Ravena não consta no brief. O código usa um **número fictício marcado como pendente** em um único lugar (`WHATSAPP` em `public/app.js`). Trocar antes de qualquer uso real.
- Depoimentos em vídeo e fotos de obras: entram assim que o cliente enviar os arquivos.

## Como saberemos que está pronto

- `node scripts/check.cjs` passa (cores contra a logo, contraste, fontes, fatos do brief, palavras proibidas, regras do formulário, animações, hero enxuto).
- A página abre a 360, 390, 600, 768, 864, 899, 1024, 1280 e 1440 px sem rolagem horizontal.
- O formulário foi testado com conta de R$ 200 (bloqueia), cidade fora do raio (bloqueia) e dados válidos (monta a mensagem).
- A evidência, com o que foi verificado e o que não foi, está em `evidencia/EVIDENCIA.md`.
