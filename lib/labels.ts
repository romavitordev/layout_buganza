import type { TipoImovel, Transacao } from "@/lib/types";

/** Rótulos em português para os tipos do domínio. */

export const TIPO_LABEL: Record<TipoImovel, string> = {
  RESIDENCIAL: "Residencial",
  COMERCIAL: "Comercial",
  TERRENO: "Terreno",
};

export const TRANSACAO_LABEL: Record<Transacao, string> = {
  VENDA: "Venda",
  LOCACAO: "Locação",
  VENDA_LOCACAO: "Venda ou Locação",
};
