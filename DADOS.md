# O que a página precisa guardar

Isto vem antes de qualquer tabela. É o que a landing da Ravena precisa lembrar para que "pedir simulação" funcione de verdade, e como as coisas se ligam. Não tem código aqui de propósito.

## As coisas

**O lead.** É a pessoa que pediu a simulação. A Ravena precisa do nome dela e do WhatsApp, que é por onde responde. Uma pessoa é um lead só: se ela pedir de novo meses depois, é o mesmo lead com um pedido a mais, não um lead novo.

**A simulação.** É cada vez que alguém pede. Ela conta sobre a conta de luz da pessoa: quanto paga por mês, em que cidade mora e quando pediu. Fica separada do lead, porque um lead pode ter duas simulações (casa e sítio, ou a conta mudou), e cada uma tem a sua conta e a sua cidade.

**As cidades atendidas.** Sorocaba, Votorantim, Itu e Salto, num raio de 80 km. É uma lista fechada. Toda simulação aponta para uma delas, e ninguém escreve a cidade à mão.

**O andamento da simulação.** Em que pé ela está, e só pode ser um destes seis: novo (acabou de chegar), respondido, visita técnica marcada, proposta enviada, fechou, desistiu. Também guardamos quando a Ravena respondeu, porque o cliente prometeu resposta no mesmo dia útil e a gente precisa saber se cumpre.

**O pedido recusado.** Quem tem conta abaixo de R$ 450 ou mora fora das quatro cidades não vira lead. A página diz isso e não pede o contato da pessoa, então **não guardamos nome nem WhatsApp de quem foi recusado**. Guardamos só o valor, a cidade (ou "fora do raio"), o motivo e quando foi. Serve para o cliente ver quanta gente a página atrai sem poder atender, que é justamente o que ele quer diminuir.

## Como se ligam

Um lead tem uma ou mais simulações. Cada simulação é de uma cidade da lista, tem uma conta e um andamento. O pedido recusado não se liga a ninguém.

## O que o banco precisa impor sozinho

- A conta é um número, e numa simulação aceita é de no mínimo R$ 450. Texto como "uns 500 reais" não entra.
- A cidade é uma das quatro, nunca outra.
- O andamento é um dos seis valores, escritos sempre do mesmo jeito.
- O WhatsApp tem DDD e só dígitos, e o mesmo número não gera dois leads.
- Toda simulação pertence a um lead; não existe simulação solta.

## O que a Ravena precisa conseguir perguntar

Quantos pedidos chegaram por mês, quantos viraram venda, quantos foram recusados e por qual motivo, e quanto tempo leva até a primeira resposta.

## O que fica para depois

A foto ou o PDF da conta de luz (hoje a pessoa manda pelo WhatsApp), quem da equipe atende cada simulação e quem pode ver a lista (isso é a aula de autenticação).
