-- O banco tem que recusar sozinho o que a descrição proíbe. Cada tentativa abaixo DEVE falhar;
-- se alguma passar, o bloco para com "DEVERIA TER FALHADO". Rodar depois de exemplo.sql. "Success" = o banco barrou tudo.
do $$
declare
  marta uuid := (select id from leads where nome = 'Marta Souza');
  tentativa record;
begin
  for tentativa in
    select * from (values
      ('conta de R$ 200 numa simulação',          $q$insert into simulacoes (lead_id, cidade, conta_mensal) values ('%s', 'Itu', 200)$q$),
      ('cidade fora da lista (Campinas)',         $q$insert into simulacoes (lead_id, cidade, conta_mensal) values ('%s', 'Campinas', 700)$q$),
      ('andamento com espaço sobrando',           $q$insert into simulacoes (lead_id, cidade, conta_mensal, andamento) values ('%s', 'Itu', 700, 'respondido ')$q$),
      ('andamento com maiúscula',                 $q$insert into simulacoes (lead_id, cidade, conta_mensal, andamento) values ('%s', 'Itu', 700, 'Respondido')$q$),
      ('simulação solta, sem lead',               $q$insert into simulacoes (lead_id, cidade, conta_mensal) values (gen_random_uuid(), 'Itu', 700)$q$),
      ('mesmo WhatsApp gerando outro lead',       $q$insert into leads (nome, whatsapp) values ('Outra Marta', '15998765432')$q$),
      ('WhatsApp com letras e sem DDD',           $q$insert into leads (nome, whatsapp) values ('Fulano', '9987abc')$q$),
      ('nome vazio',                              $q$insert into leads (nome, whatsapp) values ('  ', '15990000000')$q$),
      ('resposta antes do pedido',                $q$insert into simulacoes (lead_id, cidade, conta_mensal, pedido_em, respondido_em) values ('%s', 'Itu', 700, now(), now() - interval '1 day')$q$),
      ('apagar um lead que tem simulações',       $q$delete from leads where id = '%s'$q$),
      ('recusa com motivo inventado',             $q$insert into recusas (motivo, conta_mensal) values ('porque sim', 100)$q$)
    ) as t(nome, comando)
  loop
    begin
      execute format(tentativa.comando, marta);
      raise exception 'DEVERIA TER FALHADO: %', tentativa.nome;
    exception
      when check_violation or foreign_key_violation or restrict_violation or unique_violation or invalid_text_representation or not_null_violation then
        null; -- o banco barrou, que é o esperado
    end;
  end loop;
end $$;
