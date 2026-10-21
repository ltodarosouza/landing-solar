# O caminho do clique até o servidor e de volta (rota /api/ceu)

`║` é a fronteira: à esquerda roda no **navegador do visitante** (código que ele baixou e pode ler e mudar); à direita roda no **servidor** (na Vercel, código que só eu vejo).

```
NAVEGADOR (máquina do visitante)           ║   SERVIDOR (Vercel, projeto landing-solar)       ║   OUTRA PONTA
                                           ║                                                  ║
1. Clica em "E em dia nublado?"            ║                                                  ║
2. public/app.js abre a resposta e         ║                                                  ║
   pergunta: fetch("/api/ceu")             ║                                                  ║
   (desiste sozinho em 5 s)  ─────────────────►  3. app/api/ceu/route.js chama lib/ceu.js      ║
                                           ║        Tem uma leitura de menos de 10 min        ║
                                           ║        guardada? Se tem, pula para o passo 6.    ║
                                           ║     4. Pergunta à Open-Meteo, com limite de 3 s ─────►  Open-Meteo (API pública,
                                           ║                                                  ║      sem chave):
                                           ║                                  ◄───────────────────   devolve o JSON, ou 429
                                           ║                                                  ║      (muitos pedidos), ou
                                           ║                                                  ║      500, ou não responde,
                                           ║                                                  ║      ou corta no meio
                                           ║     5. Confere o formato e a unidade (°C e %).   ║
                                           ║        Se deu errado, traduz o motivo:           ║
                                           ║        demorou, caiu, limite, inesperado.        ║
                                           ║        Se havia leitura de até 3 h, devolve      ║
                                           ║        ela marcada como antiga.                  ║
              ◄───────────────────────────────  6. Responde um resumo pequeno:               ║
                                           ║        { ok, temperatura, nuvem, dia, descricao }║
                                           ║        ou { ok: false, motivo } (502, 503, 504)  ║
7. public/app.js escreve a linha:          ║                                                  ║
   "Agora em Sorocaba: 22 °C, céu coberto" ║                                                  ║
   ou a frase da falha + "Tentar de novo"  ║                                                  ║
```

**O que cruza a fronteira:** só um pedido sem dados (`GET /api/ceu`) e, na volta, um resumo de quatro campos ou o motivo da falha. O endereço da Open-Meteo, o limite de tempo, a conferência de unidade e a memória de 10 minutos ficam do lado do servidor. Se amanhã a API mudar ou virar paga (com chave), só o lado do servidor muda, e a chave nunca chegaria ao navegador.
