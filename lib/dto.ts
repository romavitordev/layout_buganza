import type { TipoImovel, Transacao } from "@/lib/types";

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
  transacao: Transacao;
  cidade: string;
  bairro: string;
  quartos: number | null;
  banheiros: number | null;
  vagas: number | null;
  areaM2: number | null;
  fotos: PublicPhotoDTO[];
}

/** Foto de capa (ou primeira foto) de um DTO público. */
export function capaDoImovel(dto: PublicPropertyDTO): PublicPhotoDTO | null {
  return dto.fotos.find((f) => f.capa) ?? dto.fotos[0] ?? null;
}
