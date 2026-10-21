# O que falta entre a página no ar e a página shippada

A meta da Ravena é passar de cerca de 12 para 25 pedidos de simulação por mês. Hoje a página está no ar e passa nos meus testes, mas ela só mostra a empresa e abre o WhatsApp. Ninguém guarda, mede, vigia ou corrige nada depois que ela sai da minha máquina. A lista abaixo está separada em **operação** (o que mantém a página funcionando e dá para a empresa saber se deu certo) e **funcionalidade** (algo novo que o visitante vê).

## Operação

1. **Guardar o pedido.** O formulário só monta uma mensagem e abre o WhatsApp. Se a pessoa fecha a janela, o pedido some, e a empresa não tem lista de quem pediu nem de quem ficou sem resposta. Falta um lugar que receba e guarde nome, WhatsApp, cidade e conta.
2. **Validar no servidor.** *(feito, ver `evidencia/EVIDENCIA.md` seção 16; falta publicar.)* O filtro de conta abaixo de R$ 450 e o de cidade só valem no navegador. Quem mexer no código ou mandar o pedido direto passa por cima.
3. **Medir.** Não se conta visita, clique no botão nem pedido enviado. Sem isso ninguém sabe se saiu de 12 para 25.
4. **Vigiar.** Se a página cair ou o formulário parar de funcionar, ninguém é avisado. Hoje a etapa de manter só existe quando eu lembro de abrir a página.
5. **Responder.** O número de WhatsApp do código é fictício. Nenhum cliente de verdade chega à Ravena por ela, e também não existe acordo de quem responde e em quanto tempo.
6. **Corrigir.** O check roda só na minha máquina e o deploy é um comando que eu digito. Não há teste automático a cada mudança, nem ambiente separado para testar antes, nem jeito rápido de voltar atrás.
7. **Proteger o dado pessoal.** A página pede nome, telefone e conta, e não tem política de privacidade nem consentimento (LGPD).
8. **Conferir em aparelhos de verdade.** Só testei no navegador do computador. Falta celular real, Safari, Firefox, internet lenta, velocidade e acessibilidade.
9. **Ser achada e compartilhada.** Não tem domínio próprio, nem título e imagem de compartilhamento para o link aparecer bem no WhatsApp, nem cuidado para aparecer no Google.
10. **Deixar o cliente editar.** Para trocar um preço ou número é preciso mexer no HTML. Falta um jeito de o cliente pedir e revisar mudança sem depender de mim.

## Funcionalidade

11. **Fotos das obras e depoimentos em vídeo.** O cliente tem, mas não mandou. Hoje a confiança é feita só de número e ilustração.
12. **Texto das avaliações do Google.** A página mostra só a nota 4,8 e as 137 avaliações.
13. **Estimativa de economia para a casa da pessoa.** O brief não traz tarifa nem irradiação, então hoje a página só mostra o caso real e a média de 75% a 90%.

## O que pesa mais

Os itens 1 e 3. Sem guardar o pedido e sem medir, a empresa não consegue saber se a página trouxe venda.
