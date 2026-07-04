import type { Metadata } from "next";
import CatalogoClient from "@/components/CatalogoClient";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { IMOVEIS, cidadesDisponiveis } from "@/lib/imoveis-data";
import { linkWhatsAppGeral } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Imóveis disponíveis",
  description:
    "Catálogo de imóveis residenciais e comerciais da Imóveis Buganza. Compra, venda e locação em Sorocaba e região.",
};

export default function ImoveisPage() {
  return (
    <>
      <SiteNav whatsappHref={linkWhatsAppGeral()} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 md:px-8 md:pt-36">
        <header className="bz-fade-up mb-10">
          <p className="mb-2 flex items-center gap-2 text-[13px] text-black/55">
            <span className="bz-dot" aria-hidden="true" />
            Catálogo completo
          </p>
          <h1 className="text-4xl tracking-tight md:text-5xl">Imóveis</h1>
        </header>

        <CatalogoClient imoveis={IMOVEIS} cidades={cidadesDisponiveis()} />
      </main>

      <SiteFooter />
    </>
  );
}
