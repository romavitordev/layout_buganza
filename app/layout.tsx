import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Marcelo Imóveis — Especialistas em Imóveis Residenciais e Comerciais",
    template: "%s · Marcelo Imóveis",
  },
  description:
    "Marcelo Imóveis: compra, venda e locação de imóveis residenciais e comerciais em Sorocaba e região. CRECI 118400. Fale conosco pelo WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
