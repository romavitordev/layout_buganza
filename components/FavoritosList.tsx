"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import type { PublicPropertyDTO } from "@/lib/dto";
import { IMOVEIS } from "@/lib/imoveis-data";
import { lerFavoritos, EVENTO_FAVORITOS } from "@/lib/favoritos";

/**
 * Lista de favoritos — versão estática (GitHub Pages): filtra os dados
 * locais pelos ids do localStorage. No site real, a busca é via API.
 */
export default function FavoritosList() {
  // null = ainda não hidratou (evita mismatch entre SSG e navegador)
  const [imoveis, setImoveis] = useState<PublicPropertyDTO[] | null>(null);

  useEffect(() => {
    function carregar() {
      const ids = lerFavoritos();
      const porId = new Map(IMOVEIS.map((p) => [p.id, p]));
      setImoveis(
        ids
          .map((id) => porId.get(id))
          .filter((p): p is PublicPropertyDTO => Boolean(p))
      );
    }
    carregar();
    window.addEventListener(EVENTO_FAVORITOS, carregar);
    return () => window.removeEventListener(EVENTO_FAVORITOS, carregar);
  }, []);

  if (imoveis === null) {
    return (
      <div
        className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
        aria-label="Carregando favoritos"
      >
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="aspect-[4/3] animate-pulse rounded-2xl bg-mist" />
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-mist" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-mist" />
          </div>
        ))}
      </div>
    );
  }

  if (imoveis.length === 0) {
    return (
      <div className="bz-fade-up flex flex-col items-center gap-5 rounded-2xl bg-mist px-6 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black/40">
          <Heart size={24} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div>
          <h2 className="mb-2 text-2xl tracking-tight">
            Nenhum favorito ainda.
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-black/55">
            Toque no coração de qualquer imóvel para guardá-lo aqui — a lista
            fica salva neste dispositivo, sem precisar de cadastro.
          </p>
        </div>
        <Link
          href="/imoveis"
          className="inline-flex items-center gap-2 rounded-pill bg-black px-6 py-3 text-[13px] font-medium text-white transition-transform duration-200 ease-premium hover:-translate-y-0.5"
        >
          Explorar o catálogo
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mb-8 text-[13px] text-black/45">
        {imoveis.length} imóve{imoveis.length === 1 ? "l" : "is"} salvo
        {imoveis.length === 1 ? "" : "s"} neste dispositivo
      </p>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {imoveis.map((imovel, i) => (
          <PropertyCard key={imovel.id} imovel={imovel} prioridade={i < 3} />
        ))}
      </div>
    </>
  );
}
