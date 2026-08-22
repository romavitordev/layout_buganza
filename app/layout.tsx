import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";
import { MARCA } from "@/lib/marca";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${MARCA.nome} — Especialistas em Negociações Imobiliárias`,
    template: `%s · ${MARCA.nome}`,
  },
  description:
    `${MARCA.nome}: compra, venda e locação de imóveis residenciais e comerciais em ${MARCA.regiao}. CRECI ${MARCA.creci}. Fale conosco pelo WhatsApp.`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: o script abaixo escreve data-theme no
    // <html> antes de o React montar, então o atributo que veio do
    // servidor e o que está no DOM divergem — de propósito.
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/*
          Tema aplicado ANTES da primeira pintura. Se fosse um useEffect,
          quem escolheu o modo escuro veria a página piscar branca a cada
          navegação. Sem preferência salva, segue o sistema operacional.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("bz-tema");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
