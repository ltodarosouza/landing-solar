import "./styles.css";
import fs from "node:fs";
import path from "node:path";

// A página é o mesmo HTML de antes (app/conteudo.html), entregue como está. Os scripts
// (cena.js e app.js, em public/) ficam no fim dele, como na página estática.
const conteudo = fs.readFileSync(path.join(process.cwd(), "app", "conteudo.html"), "utf8");

export const metadata = {
  title: "Ravena Solar | Energia solar residencial em Sorocaba, Votorantim, Itu e Salto",
  description: "Painéis solares no seu telhado e uma conta de luz bem menor. Uma casa em Sorocaba pagava R$ 780 por mês e hoje paga R$ 118. Peça uma simulação, resposta no mesmo dia útil por WhatsApp.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout() {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='10' fill='%23F2A03D'/%3E%3C/svg%3E" />
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.className += " js";' }} />
      </head>
      <body>
        {/* display: contents: o invólucro não vira caixa; a Next acrescenta os próprios scripts ao body,
            e o React não pode comparar o conteúdo que o app.js altera depois de carregar. */}
        <div id="conteudo" style={{ display: "contents" }} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: conteudo }} />
      </body>
    </html>
  );
}
