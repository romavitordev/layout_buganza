/**
 * Tipos do domínio — versão front-only (sem Prisma).
 * Espelham os enums do schema do repo completo (buganza_imoveis).
 */

export type TipoImovel = "RESIDENCIAL" | "COMERCIAL" | "TERRENO";

export type Transacao = "VENDA" | "LOCACAO" | "VENDA_LOCACAO";
