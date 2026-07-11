import type { SubtipoImovel, TipoImovel, Transacao } from "@/lib/types";

/**
 * DTO público — mesma forma do repo completo (buganza_imoveis),
 * aqui alimentado por dados estáticos em lib/imoveis-data.ts.
 */

export interface PublicPhotoDTO {
  url: string;
  ordem: number;
  capa: boolean;
}

export interface PublicPropertyDTO {
  id: string;
  codigo: string;
  slug: string;
  titulo: string;
  descricao: string;
  tipo: TipoImovel;
  /** Refino do tipo (Casa, Apartamento, Loja…) — null quando não definido. */
  subtipo: SubtipoImovel | null;
  transacao: Transacao;
  cidade: string;
  bairro: string;
  /** Endereço opcional para o pino do mapa. */
  enderecoMapa: string | null;
  quartos: number | null;
  /** Suítes contam dentro de quartos (3 quartos, sendo 1 suíte). */
  suites: number | null;
  banheiros: number | null;
  vagas: number | null;
  /** Área útil/construída. */
  areaM2: number | null;
  areaTerrenoM2: number | null;
  /** Preços públicos como string decimal ("750000") ou null = sob consulta. */
  precoVenda: string | null;
  precoLocacao: string | null;
  /** Custos recorrentes — exibidos na ficha quando preenchidos. */
  condominioMensal: string | null;
  iptuAnual: string | null;
  /** Comodidades do catálogo (lib/comodidades.ts) — badges no detalhe. */
  comodidades: string[];
  /** Vídeo do imóvel — exibido só no detalhe, nunca como capa. */
  videoUrl: string | null;
  fotos: PublicPhotoDTO[];
}

/** Foto de capa (ou primeira foto) de um DTO público. */
export function capaDoImovel(dto: PublicPropertyDTO): PublicPhotoDTO | null {
  return dto.fotos.find((f) => f.capa) ?? dto.fotos[0] ?? null;
}
