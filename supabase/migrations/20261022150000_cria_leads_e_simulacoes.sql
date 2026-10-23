-- Landing Ravena Solar: o que a página guarda (ver DADOS.md).
-- Lead = a pessoa. Simulação = cada pedido dela. Cidades = lista fechada. Recusa = pedido barrado, sem dado da pessoa.

-- Andamento: só estes seis valores, escritos sempre assim.
create type andamento as enum ('novo', 'respondido', 'visita_marcada', 'proposta_enviada', 'fechou', 'desistiu');

create table cidades (
  nome text primary key
);
insert into cidades (nome) values ('Sorocaba'), ('Votorantim'), ('Itu'), ('Salto');

create table leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(btrim(nome)) >= 2),
  -- só dígitos, com DDD (10 ou 11 dígitos), sem o 55; o mesmo número é o mesmo lead
  whatsapp text not null unique check (whatsapp ~ '^[0-9]{10,11}$'),
  criado_em timestamptz not null default now()
);

create table simulacoes (
  id uuid primary key default gen_random_uuid(),
  -- não existe simulação solta; e um lead com simulações não pode ser apagado por engano
  lead_id uuid not null references leads (id) on delete restrict,
  cidade text not null references cidades (nome),
  -- número, não texto: dá para somar, tirar média e filtrar. Mínimo de R$ 450 (brief do cliente).
  conta_mensal numeric(10, 2) not null check (conta_mensal >= 450),
  andamento andamento not null default 'novo',
  pedido_em timestamptz not null default now(),
  respondido_em timestamptz check (respondido_em is null or respondido_em >= pedido_em)
);
create index simulacoes_lead_idx on simulacoes (lead_id);
create index simulacoes_pedido_em_idx on simulacoes (pedido_em);

-- Pedido barrado: nada da pessoa (a página diz que não vai pedir o contato de quem é recusado).
create table recusas (
  id uuid primary key default gen_random_uuid(),
  motivo text not null check (motivo in ('conta_abaixo_do_minimo', 'cidade_fora_do_raio')),
  conta_mensal numeric(10, 2) check (conta_mensal >= 0),
  cidade text, -- só para quando a pessoa escolheu uma das atendidas e foi barrada pela conta; fora do raio fica vazio
  recusado_em timestamptz not null default now()
);

-- Segurança ligada desde já. Sem nenhuma regra de acesso por enquanto: ninguém, com a chave pública, lê nem grava.
-- Quem pode ver e quem pode inserir é a aula de autenticação (quem não tem regra não passa).
alter table cidades enable row level security;
alter table leads enable row level security;
alter table simulacoes enable row level security;
alter table recusas enable row level security;
