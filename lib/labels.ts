import type { SubtipoImovel, TipoImovel, Transacao } from "@/lib/types";

/** Rótulos em português para os tipos do domínio. */

export const TIPO_LABEL: Record<TipoImovel, string> = {
  RESIDENCIAL: "Residencial",
  COMERCIAL: "Comercial",
  TERRENO: "Terreno",
};

export const SUBTIPO_LABEL: Record<SubtipoImovel, string> = {
  CASA: "Casa",
  SOBRADO: "Sobrado",
  APARTAMENTO: "Apartamento",
  KITNET: "Kitnet",
  CHACARA: "Chácara",
  SALA_COMERCIAL: "Sala comercial",
  LOJA: "Loja",
  GALPAO: "Galpão",
  TERRENO_URBANO: "Terreno",
  TERRENO_CONDOMINIO: "Terreno em condomínio",
};

export const TRANSACAO_LABEL: Record<Transacao, string> = {
  VENDA: "Venda",
  LOCACAO: "Locação",
  VENDA_LOCACAO: "Venda ou Locação",
};
