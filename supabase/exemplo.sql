-- Passo 3: dados de exemplo e uma consulta. Roda no SQL Editor do Supabase (que fala como administrador, por isso passa pela segurança).

-- Três leads; a Marta tem duas simulações (casa em Itu e sítio em Salto)
with novos as (
  insert into leads (nome, whatsapp) values
    ('Marta Souza', '15998765432'),
    ('Carlos Lima', '15991234567'),
    ('Renata Alves', '15987654321')
  returning id, nome
)
insert into simulacoes (lead_id, cidade, conta_mensal, andamento, pedido_em, respondido_em)
select id, cidade, conta, andamento::andamento, pedido, resposta from (
  select (select id from novos where nome = 'Marta Souza') as id, 'Itu' as cidade, 620.00 as conta, 'respondido' as andamento, now() - interval '3 hours' as pedido, now() - interval '2 hours' as resposta
  union all
  select (select id from novos where nome = 'Marta Souza'), 'Salto', 980.50, 'novo', now() - interval '10 minutes', null
  union all
  select (select id from novos where nome = 'Carlos Lima'), 'Sorocaba', 780.00, 'proposta_enviada', now() - interval '2 days', now() - interval '2 days' + interval '1 hour'
  union all
  select (select id from novos where nome = 'Renata Alves'), 'Votorantim', 450.00, 'desistiu', now() - interval '5 days', now() - interval '5 days' + interval '3 hours'
) t;

-- Dois pedidos recusados, sem nome nem WhatsApp
insert into recusas (motivo, conta_mensal, cidade) values
  ('conta_abaixo_do_minimo', 200.00, 'Itu'),
  ('cidade_fora_do_raio', 800.00, null);

-- Consulta esperada: 3 leads, e a Marta aparece com 2 simulações (total de contas 1.600,50), os outros com 1
select l.nome, count(s.id) as simulacoes, sum(s.conta_mensal) as soma_das_contas,
       string_agg(s.cidade || ' (' || s.andamento || ')', ', ' order by s.pedido_em) as cidades_e_andamento
from leads l join simulacoes s on s.lead_id = l.id
group by l.nome order by l.nome;
