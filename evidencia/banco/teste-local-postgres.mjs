import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs";
const R = "/Users/ltodaro/dev/trabalhos-202/landing-solar/supabase/";
const db = new PGlite();
const roda = async (nome, arq) => { try { const r = await db.exec(fs.readFileSync(R + arq, "utf8")); console.log("ok   ", nome); return r; } catch (e) { console.log("FALHOU", nome, "->", e.message); process.exitCode = 1; } };
await roda("migration", "migrations/20261022150000_cria_leads_e_simulacoes.sql");
await roda("exemplo.sql", "exemplo.sql");
const q = await db.query(`select l.nome, count(s.id)::int as simulacoes, sum(s.conta_mensal) as soma, string_agg(s.cidade || ' (' || s.andamento || ')', ', ' order by s.pedido_em) as cidades from leads l join simulacoes s on s.lead_id = l.id group by l.nome order by l.nome`);
console.table(q.rows);
console.log("recusas:", (await db.query("select motivo, conta_mensal, cidade from recusas order by motivo")).rows);
await roda("testes-de-recusa.sql (o banco barra tudo)", "testes-de-recusa.sql");
// mutação: se o banco aceitasse conta de R$ 200, o teste tem de acusar
await db.exec("alter table simulacoes drop constraint simulacoes_conta_mensal_check");
try { await db.exec(fs.readFileSync(R + "testes-de-recusa.sql", "utf8")); console.log("PROBLEMA: o teste não percebeu a regra removida"); process.exitCode = 1; } catch (e) { console.log("ok    sem a regra de R$ 450 o teste acusa:", e.message); }
