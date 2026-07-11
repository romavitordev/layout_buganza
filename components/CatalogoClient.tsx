"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  MessageCircle,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import type { PublicPropertyDTO } from "@/lib/dto";
import type { TipoImovel, Transacao } from "@/lib/types";
import { linkWhatsAppGeral } from "@/lib/whatsapp";
import { TIPO_LABEL } from "@/lib/labels";
import { normalizarPreco, previewPreco } from "@/lib/preco";

/**
 * Catálogo com filtros client-side — versão estática (GitHub Pages).
 * No site real os filtros são resolvidos no servidor via searchParams.
 */

interface CatalogoClientProps {
  imoveis: PublicPropertyDTO[];
  cidades: string[];
}

type Ordem = "recentes" | "preco-asc" | "preco-desc";

const ORDENS: { valor: Ordem; label: string }[] = [
  { valor: "recentes", label: "Mais recentes" },
  { valor: "preco-asc", label: "Menor preço" },
  { valor: "preco-desc", label: "Maior preço" },
];

/** Preço de referência para ordenar/filtrar: venda, senão locação. */
function precoDeReferencia(imovel: PublicPropertyDTO): number | null {
  const valor = Number(imovel.precoVenda ?? imovel.precoLocacao);
  return Number.isFinite(valor) && valor > 0 ? valor : null;
}

function precoDigitado(texto: string): number | undefined {
  const n = normalizarPreco(texto);
  return n !== null && !Number.isNaN(n) && n > 0 ? n : undefined;
}

const selectCls =
  "w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-black md:w-auto";
const campoCls = "flex flex-col gap-1";
const rotuloCls =
  "text-[11px] font-medium uppercase tracking-wide text-black/40";

export default function CatalogoClient({
  imoveis,
  cidades,
}: CatalogoClientProps) {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState<TipoImovel | "">("");
  const [transacao, setTransacao] = useState<Transacao | "">("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [quartosMin, setQuartosMin] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [ordem, setOrdem] = useState<Ordem>("recentes");
  const [aberto, setAberto] = useState(false);

  const bairros = useMemo(
    () =>
      Array.from(
        new Set(
          imoveis
            .filter((i) => !cidade || i.cidade === cidade)
            .map((i) => i.bairro)
        )
      ).sort(),
    [imoveis, cidade]
  );

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const min = precoDigitado(precoMin);
    const max = precoDigitado(precoMax);
    const quartos = Number(quartosMin) || undefined;

    const base = imoveis.filter((imovel) => {
      if (tipo && imovel.tipo !== tipo) return false;
      if (
        transacao &&
        imovel.transacao !== transacao &&
        imovel.transacao !== "VENDA_LOCACAO"
      ) {
        return false;
      }
      if (cidade && imovel.cidade !== cidade) return false;
      if (bairro && imovel.bairro !== bairro) return false;
      if (quartos && (imovel.quartos ?? 0) < quartos) return false;
      if (min !== undefined || max !== undefined) {
        // Faixa olha o preço da transação escolhida; sem transação, vale
        // se qualquer um dos preços cair na faixa
        const candidatos = (
          transacao === "LOCACAO"
            ? [imovel.precoLocacao]
            : transacao === "VENDA"
              ? [imovel.precoVenda]
              : [imovel.precoVenda, imovel.precoLocacao]
        )
          .map((p) => Number(p))
          .filter((p) => Number.isFinite(p) && p > 0);
        const naFaixa = candidatos.some(
          (p) =>
            (min === undefined || p >= min) && (max === undefined || p <= max)
        );
        if (!naFaixa) return false;
      }
      if (
        termo &&
        ![
          imovel.titulo,
          imovel.descricao,
          imovel.bairro,
          imovel.cidade,
          imovel.codigo,
        ].some((campo) => campo.toLowerCase().includes(termo))
      ) {
        return false;
      }
      return true;
    });

    if (ordem === "recentes") return base;
    // "Sob consulta" (sem preço) vai sempre para o fim da lista
    return base.slice().sort((a, b) => {
      const pa = precoDeReferencia(a);
      const pb = precoDeReferencia(b);
      if (pa === null && pb === null) return 0;
      if (pa === null) return 1;
      if (pb === null) return -1;
      return ordem === "preco-asc" ? pa - pb : pb - pa;
    });
  }, [
    imoveis,
    busca,
    tipo,
    transacao,
    cidade,
    bairro,
    quartosMin,
    precoMin,
    precoMax,
    ordem,
  ]);

  // Chips dos filtros ativos — cada um com o X que remove
  const chips: { chave: string; rotulo: string; limpar: () => void }[] = [];
  if (busca.trim()) {
    chips.push({
      chave: "q",
      rotulo: `“${busca.trim()}”`,
      limpar: () => setBusca(""),
    });
  }
  if (tipo) {
    chips.push({
      chave: "tipo",
      rotulo: TIPO_LABEL[tipo],
      limpar: () => setTipo(""),
    });
  }
  if (transacao) {
    chips.push({
      chave: "transacao",
      rotulo: transacao === "VENDA" ? "Venda" : "Locação",
      limpar: () => setTransacao(""),
    });
  }
  if (cidade) {
    chips.push({ chave: "cidade", rotulo: cidade, limpar: () => setCidade("") });
  }
  if (bairro) {
    chips.push({ chave: "bairro", rotulo: bairro, limpar: () => setBairro("") });
  }
  if (quartosMin) {
    chips.push({
      chave: "quartos",
      rotulo: `${quartosMin}+ quartos`,
      limpar: () => setQuartosMin(""),
    });
  }
  if (precoDigitado(precoMin)) {
    chips.push({
      chave: "precoMin",
      rotulo: `de ${previewPreco(precoMin)}`,
      limpar: () => setPrecoMin(""),
    });
  }
  if (precoDigitado(precoMax)) {
    chips.push({
      chave: "precoMax",
      rotulo: `até ${previewPreco(precoMax)}`,
      limpar: () => setPrecoMax(""),
    });
  }

  function limparTudo() {
    setBusca("");
    setTipo("");
    setTransacao("");
    setCidade("");
    setBairro("");
    setQuartosMin("");
    setPrecoMin("");
    setPrecoMax("");
  }

  return (
    <>
      <div className="mb-10 flex flex-col gap-4">
        {/* Busca + botão de filtros (mobile) */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:max-w-md" role="search">
            <Search
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              aria-hidden="true"
            />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por bairro, título ou código…"
              aria-label="Buscar imóveis por texto"
              className="w-full rounded-pill border border-black/15 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-black"
            />
          </div>
          <button
            type="button"
            onClick={() => setAberto((a) => !a)}
            aria-expanded={aberto}
            aria-controls="painel-filtros"
            className={`inline-flex items-center gap-2 rounded-pill border px-4 py-2.5 text-[13px] font-medium transition-colors md:hidden ${
              chips.length > 0
                ? "border-black bg-black text-white"
                : "border-black/15 text-black/70"
            }`}
          >
            <SlidersHorizontal size={14} aria-hidden="true" />
            Filtros
            {chips.length > 0 && ` (${chips.length})`}
          </button>
        </div>

        {/* Painel de filtros: linha no desktop, painel expansível no mobile */}
        <div
          id="painel-filtros"
          className={`${
            aberto ? "grid" : "hidden"
          } grid-cols-2 gap-3 rounded-2xl border border-black/10 bg-white p-4 md:flex md:flex-wrap md:items-end md:rounded-none md:border-0 md:bg-transparent md:p-0`}
        >
          <div className={campoCls}>
            <span className={rotuloCls}>Tipo</span>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoImovel | "")}
              className={selectCls}
              aria-label="Filtrar por tipo"
            >
              <option value="">Todos</option>
              {Object.entries(TIPO_LABEL).map(([valor, rotulo]) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>
          </div>

          <div className={campoCls}>
            <span className={rotuloCls}>Transação</span>
            <select
              value={transacao}
              onChange={(e) =>
                setTransacao(e.target.value as Transacao | "")
              }
              className={selectCls}
              aria-label="Filtrar por transação"
            >
              <option value="">Todas</option>
              <option value="VENDA">Venda</option>
              <option value="LOCACAO">Locação</option>
            </select>
          </div>

          {cidades.length > 1 && (
            <div className={campoCls}>
              <span className={rotuloCls}>Cidade</span>
              <select
                value={cidade}
                onChange={(e) => {
                  setCidade(e.target.value);
                  setBairro("");
                }}
                className={selectCls}
                aria-label="Filtrar por cidade"
              >
                <option value="">Todas</option>
                {cidades.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {bairros.length > 1 && (
            <div className={campoCls}>
              <span className={rotuloCls}>Bairro</span>
              <select
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className={selectCls}
                aria-label="Filtrar por bairro"
              >
                <option value="">Todos</option>
                {bairros.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={campoCls}>
            <span className={rotuloCls}>Quartos</span>
            <select
              value={quartosMin}
              onChange={(e) => setQuartosMin(e.target.value)}
              className={selectCls}
              aria-label="Mínimo de quartos"
            >
              <option value="">Qualquer</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </select>
          </div>

          <div className={campoCls}>
            <span className={rotuloCls}>Preço mín. (R$)</span>
            <input
              inputMode="numeric"
              value={precoMin}
              onChange={(e) => setPrecoMin(e.target.value)}
              placeholder="0"
              className={`${selectCls} md:w-28`}
              aria-label="Preço mínimo"
            />
          </div>

          <div className={campoCls}>
            <span className={rotuloCls}>Preço máx. (R$)</span>
            <input
              inputMode="numeric"
              value={precoMax}
              onChange={(e) => setPrecoMax(e.target.value)}
              placeholder="Sem limite"
              className={`${selectCls} md:w-28`}
              aria-label="Preço máximo"
            />
          </div>

          <button
            type="button"
            onClick={() => setAberto(false)}
            className="col-span-2 rounded-pill bg-black px-6 py-2.5 text-[13px] font-medium text-white md:hidden"
          >
            Ver {filtrados.length} imóve{filtrados.length === 1 ? "l" : "is"}
          </button>
        </div>

        {/* Chips dos filtros ativos */}
        {chips.length > 0 && (
          <div
            className="flex flex-wrap items-center gap-2"
            aria-label="Filtros ativos"
          >
            {chips.map(({ chave, rotulo, limpar }) => (
              <button
                key={chave}
                type="button"
                onClick={limpar}
                className="inline-flex items-center gap-1.5 rounded-pill bg-black px-3.5 py-1.5 text-[12px] font-medium text-white transition-opacity hover:opacity-80"
              >
                {rotulo}
                <X size={12} aria-hidden="true" />
                <span className="sr-only">— remover filtro</span>
              </button>
            ))}
            <button
              type="button"
              onClick={limparTudo}
              className="text-[12px] font-medium text-black/50 underline-offset-2 hover:underline"
            >
              Limpar tudo
            </button>
          </div>
        )}

        {/* Contagem + ordenação */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-black/45">
            {filtrados.length} imóve{filtrados.length === 1 ? "l" : "is"}{" "}
            encontrado{filtrados.length === 1 ? "" : "s"}
          </p>
          <label className="flex items-center gap-2 text-[12px] text-black/50">
            <ArrowUpDown size={13} aria-hidden="true" />
            Ordenar
            <select
              value={ordem}
              onChange={(e) => setOrdem(e.target.value as Ordem)}
              className="rounded-pill border border-black/15 bg-white px-3 py-1.5 text-[12px] font-medium text-black outline-none transition-colors focus:border-black"
              aria-label="Ordenar resultados"
            >
              {ORDENS.map(({ valor, label }) => (
                <option key={valor} value={valor}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Resultados */}
      {filtrados.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((imovel, i) => (
            <PropertyCard key={imovel.id} imovel={imovel} prioridade={i < 3} />
          ))}
        </div>
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
