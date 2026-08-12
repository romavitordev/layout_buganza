import { Suspense } from "react";
import type { Metadata } from "next";
import CatalogoClient from "@/components/CatalogoClient";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { IMOVEIS, cidadesDisponiveis } from "@/lib/imoveis-data";
import { linkWhatsAppGeral } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Imóveis disponíveis",
  description:
    "Catálogo de imóveis residenciais e comerciais da Marcelo Imóveis. Compra, venda e locação em Sorocaba e região.",
};

export default function ImoveisPage() {
  return (
    <>
      <SiteNav whatsappHref={linkWhatsAppGeral()} />

      {/* Fundo levemente azulado: é o que faz o card branco existir
          como objeto, em vez de branco sobre branco. */}
      <div className="min-h-[60svh] bg-fundo">
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 md:px-8 md:pt-36">
        <header className="bz-fade-up mb-10">
          <p className="mb-2 flex items-center gap-2 text-[13px] text-secundario">
            <span className="bz-dot" aria-hidden="true" />
            Catálogo completo
          </p>
          <h1 className="text-4xl tracking-tight md:text-5xl">Imóveis</h1>
        </header>

        {/* Suspense obrigatório: o CatalogoClient usa useSearchParams
            para ler o ?q= que a lupa da navbar manda, e num projeto
            `output: "export"` o Next exige a fronteira — sem ela o
            build falha. O fallback fica vazio de propósito: a espera é
            de um quadro, e um esqueleto piscando ali chamaria mais
            atenção que a própria lista aparecendo. */}
        <Suspense fallback={null}>
          <CatalogoClient imoveis={IMOVEIS} cidades={cidadesDisponiveis()} />
        </Suspense>
      </main>
      </div>

      <SiteFooter />
    </>
  );
}
