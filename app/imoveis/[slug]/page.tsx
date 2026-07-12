import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  BedSingle,
  Car,
  LandPlot,
  MapPin,
  MessageCircle,
  Ruler,
} from "lucide-react";
import ComodidadesList from "@/components/ComodidadesList";
import Gallery from "@/components/Gallery";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import ShareButton from "@/components/ShareButton";
import WhatsAppLink from "@/components/WhatsAppLink";
import { capaDoImovel } from "@/lib/dto";
import { IMOVEIS, imovelPorSlug } from "@/lib/imoveis-data";
import { linkWhatsAppGeral, linkWhatsAppImovel } from "@/lib/whatsapp";
import { SUBTIPO_LABEL, TIPO_LABEL, TRANSACAO_LABEL } from "@/lib/labels";
import { formatarPreco, precoLocacaoFormatado } from "@/lib/format";

/** Export estático: uma página por imóvel do catálogo de demonstração. */
export const dynamicParams = false;

export function generateStaticParams() {
  return IMOVEIS.map((imovel) => ({ slug: imovel.slug }));
}

interface PageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const imovel = imovelPorSlug(params.slug);
  if (!imovel) return { title: "Imóvel não encontrado" };

  const capa = capaDoImovel(imovel);
  const descricao = `${TIPO_LABEL[imovel.tipo]} para ${TRANSACAO_LABEL[
    imovel.transacao
  ].toLowerCase()} em ${imovel.bairro}, ${imovel.cidade}. ${imovel.descricao
    .replace(/\s+/g, " ")
    .slice(0, 140)}…`;

  return {
    title: imovel.titulo,
    description: descricao,
    openGraph: {
      title: `${imovel.titulo} · Imóveis Buganza`,
      description: descricao,
      ...(capa ? { images: [{ url: capa.url }] } : {}),
    },
  };
}

export default function ImovelPage({ params }: PageProps) {
  const imovel = imovelPorSlug(params.slug);
  if (!imovel) notFound();

  const whatsappHref = linkWhatsAppImovel(imovel.slug);
  const precoVenda = formatarPreco(imovel.precoVenda);
  const precoLocacao = precoLocacaoFormatado(imovel);
  const temPreco = Boolean(precoVenda) || Boolean(precoLocacao);
  const rotuloCta = temPreco
    ? "Tenho interesse — chamar no WhatsApp"
    : "Consultar valor no WhatsApp";

  // Custos recorrentes ficam junto do preço (é a conta que o comprador faz)
  const custos = [
    formatarPreco(imovel.condominioMensal)
      ? `Condomínio ${formatarPreco(imovel.condominioMensal)}/mês`
      : null,
    formatarPreco(imovel.iptuAnual)
      ? `IPTU ${formatarPreco(imovel.iptuAnual)}/ano`
      : null,
  ].filter(Boolean);

  // Só os números do imóvel — tipo/transação/localização vivem no cabeçalho
  const caracteristicas = [
    imovel.quartos !== null
      ? { icone: BedDouble, rotulo: "Quartos", valor: String(imovel.quartos) }
      : null,
    imovel.suites !== null && imovel.suites > 0
      ? { icone: BedSingle, rotulo: "Suítes", valor: String(imovel.suites) }
      : null,
    imovel.banheiros !== null
      ? { icone: Bath, rotulo: "Banheiros", valor: String(imovel.banheiros) }
      : null,
    imovel.vagas !== null
      ? { icone: Car, rotulo: "Vagas", valor: String(imovel.vagas) }
      : null,
    imovel.areaM2 !== null
      ? {
          icone: Ruler,
          rotulo: imovel.areaTerrenoM2 !== null ? "Área útil" : "Área",
          valor: `${imovel.areaM2} m²`,
        }
      : null,
    imovel.areaTerrenoM2 !== null
      ? {
          icone: LandPlot,
          rotulo: "Área do terreno",
          valor: `${imovel.areaTerrenoM2} m²`,
        }
      : null,
  ].filter(
    (c): c is { icone: typeof BedDouble; rotulo: string; valor: string } =>
      c !== null
  );

  return (
    <>
      <SiteNav whatsappHref={linkWhatsAppGeral()} />

      <main className="mx-auto max-w-6xl px-4 pb-44 pt-24 md:px-8 md:pb-20 md:pt-36">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-black/55 transition-colors hover:text-black"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Voltar para o catálogo
          </Link>
          <ShareButton titulo={imovel.titulo} />
        </div>

        {/* Cabeçalho do anúncio — identidade completa antes de tudo */}
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-pill bg-black px-3 py-1 text-[11px] font-medium text-white">
              {imovel.subtipo
                ? SUBTIPO_LABEL[imovel.subtipo]
                : TIPO_LABEL[imovel.tipo]}
            </span>
            <span className="rounded-pill border border-black/15 px-3 py-1 text-[11px] font-medium text-black/70">
              {TRANSACAO_LABEL[imovel.transacao]}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wide text-black/40">
              Cód. {imovel.codigo}
            </span>
          </div>
          <h1 className="max-w-3xl text-3xl leading-tight tracking-tight md:text-4xl">
            {imovel.titulo}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-black/55">
            <MapPin size={14} aria-hidden="true" />
            {imovel.bairro} · {imovel.cidade}
          </p>
        </header>

        {/* Duas colunas: conteúdo largo + card de conversão sticky.
            No mobile, o card de preço vem logo depois da galeria. */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div className="lg:col-start-1 lg:row-start-1">
            <Gallery fotos={imovel.fotos} titulo={imovel.titulo} />
          </div>

          {/* Card de conversão: preço, custos e WhatsApp num lugar só,
              seguindo o scroll no desktop */}
          <aside
            aria-label="Preço e contato"
            className="rounded-2xl border border-black/10 bg-white p-6 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1"
          >
            <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
              {precoVenda && (
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-black/45">
                    Venda
                  </p>
                  <p className="text-3xl font-semibold tracking-tight">
                    {precoVenda}
                  </p>
                </div>
              )}
              {precoLocacao && (
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-black/45">
                    Locação
                  </p>
                  <p className="text-3xl font-semibold tracking-tight">
                    {precoLocacao}
                  </p>
                </div>
              )}
              {!temPreco && (
                <div>
                  <p className="text-3xl font-semibold tracking-tight">
                    Sob consulta
                  </p>
                  <p className="mt-1 text-[12px] text-black/50">
                    Chame no WhatsApp — respondemos rápido
                  </p>
                </div>
              )}
            </div>

            {custos.length > 0 && (
              <p className="mt-3 border-t border-black/8 pt-3 text-[12px] text-black/55">
                {custos.join(" · ")}
              </p>
            )}

            <WhatsAppLink
              href={whatsappHref}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-pill bg-black px-6 py-4 text-sm font-medium text-white transition-transform duration-200 ease-premium hover:-translate-y-0.5"
            >
              <MessageCircle
                size={16}
                strokeWidth={2.5}
                className="text-[#25D366]"
                aria-hidden="true"
              />
              {rotuloCta}
            </WhatsAppLink>
            <p className="mt-2 text-center text-[11px] text-black/40">
              Resposta rápida · atendimento direto com os corretores
            </p>
          </aside>

          {/* Conteúdo: leitura em sequência natural */}
          <div className="flex flex-col gap-10 lg:col-start-1 lg:row-start-2">
            {caracteristicas.length > 0 && (
              <section aria-labelledby="caracteristicas-titulo">
                <h2
                  id="caracteristicas-titulo"
                  className="mb-4 text-lg font-normal tracking-tight"
                >
                  Características
                </h2>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {caracteristicas.map(({ icone: Icone, rotulo, valor }) => (
                    <li
                      key={rotulo}
                      className="rounded-xl border border-black/10 p-4"
                    >
                      <Icone
                        size={18}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="text-black/40"
                      />
                      <p className="mt-2 text-lg font-semibold tracking-tight">
                        {valor}
                      </p>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-black/45">
                        {rotulo}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <ComodidadesList valores={imovel.comodidades} />

            <section aria-labelledby="descricao-titulo">
              <h2
                id="descricao-titulo"
                className="mb-3 text-lg font-normal tracking-tight"
              >
                Sobre este imóvel
              </h2>
              <div className="max-w-2xl space-y-3 text-[15px] leading-relaxed text-black/70">
                {imovel.descricao.split(/\n{2,}/).map((paragrafo, i) => (
                  <p key={i}>{paragrafo}</p>
                ))}
              </div>
            </section>

            {imovel.videoUrl && (
              <section aria-labelledby="video-imovel-titulo">
                <h2
                  id="video-imovel-titulo"
                  className="mb-3 text-lg font-normal tracking-tight"
                >
                  Vídeo do imóvel
                </h2>
                <video
                  src={imovel.videoUrl}
                  controls
                  preload="metadata"
                  playsInline
                  className="aspect-video w-full rounded-2xl bg-black"
                />
              </section>
            )}

            {/* Localização aproximada (bairro) — endereço exato só após contato */}
            <section aria-labelledby="mapa-imovel-titulo">
              <h2
                id="mapa-imovel-titulo"
                className="mb-3 text-lg font-normal tracking-tight"
              >
                Localização
              </h2>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  imovel.enderecoMapa
                    ? `${imovel.enderecoMapa}, ${imovel.cidade}, SP`
                    : `${imovel.bairro}, ${imovel.cidade}, SP`
                )}&z=${imovel.enderecoMapa ? 16 : 14}&output=embed`}
                title={`Mapa de ${imovel.bairro}, ${imovel.cidade}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="aspect-video w-full rounded-2xl border border-black/10 grayscale transition-[filter] duration-500 ease-premium hover:grayscale-0"
              />
              <p className="mt-2 text-[12px] text-black/45">
                {imovel.enderecoMapa
                  ? `${imovel.enderecoMapa} · ${imovel.bairro}, ${imovel.cidade}`
                  : `Localização aproximada (${imovel.bairro}) — passamos o endereço completo no atendimento pelo WhatsApp.`}
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* CTA sticky no mobile — acima da bottom nav */}
      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-black/10 bg-white/95 p-3 backdrop-blur md:hidden">
        <WhatsAppLink
          href={whatsappHref}
          className="flex items-center justify-center gap-2 rounded-pill bg-black px-6 py-4 text-sm font-medium text-white"
        >
          <MessageCircle
            size={16}
            strokeWidth={2.5}
            className="text-[#25D366]"
            aria-hidden="true"
          />
          {rotuloCta}
        </WhatsAppLink>
      </div>

      <SiteFooter />
    </>
  );
}
