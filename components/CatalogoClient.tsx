"use client";

import { useMemo, useState } from "react";
import { MessageCircle, SearchX } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import type { PublicPropertyDTO } from "@/lib/dto";
import type { TipoImovel, Transacao } from "@/lib/types";
import { linkWhatsAppGeral } from "@/lib/whatsapp";

/**
 * Catálogo com filtros client-side — versão estática (GitHub Pages).
 * No site real os filtros são resolvidos no servidor via searchParams.
 */

interface CatalogoClientProps {
  imoveis: PublicPropertyDTO[];
  cidades: string[];
}

const FILTROS_TIPO: { label: string; valor?: TipoImovel }[] = [
  { label: "Todos" },
  { label: "Residencial", valor: "RESIDENCIAL" },
  { label: "Comercial", valor: "COMERCIAL" },
  { label: "Terreno", valor: "TERRENO" },
];

const FILTROS_TRANSACAO: { label: string; valor?: Transacao }[] = [
  { label: "Todos" },
  { label: "Venda", valor: "VENDA" },
  { label: "Locação", valor: "LOCACAO" },
];

function FilterPill({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`rounded-pill border px-4 py-2 text-[12px] font-medium transition-colors ${
        ativo
          ? "border-black bg-black text-white"
          : "border-black/12 bg-white text-black/70 hover:border-black/40"
      }`}
    >
      {children}
    </button>
  );
}

export default function CatalogoClient({
  imoveis,
  cidades,
}: CatalogoClientProps) {
  const [tipo, setTipo] = useState<TipoImovel | undefined>(undefined);
  const [transacao, setTransacao] = useState<Transacao | undefined>(undefined);
  const [cidade, setCidade] = useState<string | undefined>(undefined);

  const filtrados = useMemo(
    () =>
      imoveis.filter((imovel) => {
        if (tipo && imovel.tipo !== tipo) return false;
        if (
          transacao &&
          imovel.transacao !== transacao &&
          imovel.transacao !== "VENDA_LOCACAO"
        ) {
          return false;
        }
        if (cidade && imovel.cidade !== cidade) return false;
        return true;
      }),
    [imoveis, tipo, transacao, cidade]
  );

  return (
    <>
      {/* Filtros */}
      <div className="mb-12 flex flex-col gap-4">
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filtrar por tipo"
        >
          <span className="mr-1 text-[11px] font-medium uppercase tracking-wide text-black/40">
            Tipo
          </span>
          {FILTROS_TIPO.map(({ label, valor }) => (
            <FilterPill
              key={label}
              ativo={tipo === valor}
              onClick={() => setTipo(valor)}
            >
              {label}
            </FilterPill>
          ))}
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filtrar por transação"
        >
          <span className="mr-1 text-[11px] font-medium uppercase tracking-wide text-black/40">
            Transação
          </span>
          {FILTROS_TRANSACAO.map(({ label, valor }) => (
            <FilterPill
              key={label}
              ativo={transacao === valor}
              onClick={() => setTransacao(valor)}
            >
              {label}
            </FilterPill>
          ))}
        </div>

        {cidades.length > 1 && (
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filtrar por cidade"
          >
            <span className="mr-1 text-[11px] font-medium uppercase tracking-wide text-black/40">
              Cidade
            </span>
            <FilterPill
              ativo={!cidade}
              onClick={() => setCidade(undefined)}
            >
              Todas
            </FilterPill>
            {cidades.map((c) => (
              <FilterPill
                key={c}
                ativo={cidade === c}
                onClick={() => setCidade(c)}
              >
                {c}
              </FilterPill>
            ))}
          </div>
        )}
      </div>

      {/* Resultados */}
      {filtrados.length > 0 ? (
        <>
          <p className="mb-8 text-[13px] text-black/45">
            {filtrados.length} imóve{filtrados.length === 1 ? "l" : "is"}{" "}
            encontrado{filtrados.length === 1 ? "" : "s"}
          </p>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((imovel, i) => (
              <PropertyCard key={imovel.id} imovel={imovel} prioridade={i < 3} />
            ))}
          </div>
        </>
      ) : (
        <div className="bz-fade-up flex flex-col items-center gap-5 rounded-2xl bg-mist px-6 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black/40">
            <SearchX size={24} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div>
            <h2 className="mb-2 text-2xl tracking-tight">
              Nenhum imóvel com esses filtros — por enquanto.
            </h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-black/55">
              Nosso catálogo muda toda semana e nem tudo chega a ser
              publicado. Conte pelo WhatsApp o que você procura e vamos atrás
              do imóvel certo para você.
            </p>
          </div>
          <a
            href={linkWhatsAppGeral()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-pill bg-black px-6 py-3 text-[13px] font-medium text-white transition-transform duration-200 ease-premium hover:-translate-y-0.5"
          >
            <MessageCircle
              size={15}
              strokeWidth={2.5}
              className="text-[#25D366]"
              aria-hidden="true"
            />
            Falar no WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
