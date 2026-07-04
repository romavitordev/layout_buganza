import type { PublicPropertyDTO } from "@/lib/dto";

/**
 * Catálogo estático de demonstração — no site real (repo buganza_imoveis)
 * estes dados vêm do banco via Prisma e são gerenciados pelo painel admin.
 */

function fotos(seedBase: string, quantidade: number) {
  return Array.from({ length: quantidade }, (_, i) => ({
    url: `https://picsum.photos/seed/${seedBase}-${i + 1}/1280/960`,
    ordem: i,
    capa: i === 0,
  }));
}

export const IMOVEIS: PublicPropertyDTO[] = [
  {
    id: "bz-0001",
    codigo: "BZ-0001",
    slug: "casa-terrea-3-quartos-jardim-europa",
    titulo: "Casa térrea de 3 quartos no Jardim Europa",
    descricao:
      "Casa térrea impecável em rua tranquila do Jardim Europa. São 3 quartos (1 suíte), sala ampla com pé-direito alto, cozinha planejada, área gourmet com churrasqueira e quintal com espaço para jardim. Garagem coberta para 2 carros. Documentação em dia, pronta para morar.\n\nAgende uma visita pelo WhatsApp — teremos prazer em apresentar cada detalhe pessoalmente.",
    tipo: "RESIDENCIAL",
    transacao: "VENDA",
    cidade: "Sorocaba",
    bairro: "Jardim Europa",
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    areaM2: 180,
    fotos: fotos("bz-casa", 3),
  },
  {
    id: "bz-0002",
    codigo: "BZ-0002",
    slug: "sala-comercial-centro-40m2",
    titulo: "Sala comercial de 40 m² no Centro",
    descricao:
      "Sala comercial em edifício com portaria, elevador e localização estratégica no Centro de Sorocaba. Ideal para escritórios, consultórios e prestadores de serviço. Banheiro privativo, boa iluminação natural e fácil acesso a transporte público.\n\nDisponível para locação imediata. Fale conosco pelo WhatsApp para agendar uma visita.",
    tipo: "COMERCIAL",
    transacao: "LOCACAO",
    cidade: "Sorocaba",
    bairro: "Centro",
    quartos: null,
    banheiros: 1,
    vagas: 1,
    areaM2: 40,
    fotos: fotos("bz-sala", 2),
  },
  {
    id: "bz-0003",
    codigo: "BZ-0003",
    slug: "apartamento-2-quartos-campolim",
    titulo: "Apartamento de 2 quartos no Campolim",
    descricao:
      "Apartamento moderno no Parque Campolim, uma das regiões mais valorizadas de Sorocaba. São 2 quartos (1 suíte), varanda gourmet, sala integrada e cozinha americana. Condomínio com piscina, academia e salão de festas. Disponível para venda ou locação.\n\nConsulte condições pelo WhatsApp — respondemos rápido!",
    tipo: "RESIDENCIAL",
    transacao: "VENDA_LOCACAO",
    cidade: "Sorocaba",
    bairro: "Parque Campolim",
    quartos: 2,
    banheiros: 2,
    vagas: 1,
    areaM2: 68,
    fotos: fotos("bz-apto", 3),
  },
  {
    id: "bz-0004",
    codigo: "BZ-0004",
    slug: "terreno-300m2-condominio-ibiti",
    titulo: "Terreno de 300 m² em condomínio no Ibiti",
    descricao:
      "Terreno plano de 300 m² em condomínio fechado na região do Ibiti, pronto para construir. Infraestrutura completa: portaria 24h, áreas de lazer, ruas asfaltadas e projeto aprovado facilitado. Excelente oportunidade para quem quer construir do zero a casa dos sonhos.\n\nChame no WhatsApp e saiba mais sobre o condomínio.",
    tipo: "TERRENO",
    transacao: "VENDA",
    cidade: "Sorocaba",
    bairro: "Jardim Ibiti do Paço",
    quartos: null,
    banheiros: null,
    vagas: null,
    areaM2: 300,
    fotos: fotos("bz-terreno", 2),
  },
  {
    id: "bz-0005",
    codigo: "BZ-0005",
    slug: "casa-4-quartos-piscina-votorantim",
    titulo: "Casa de 4 quartos com piscina em Votorantim",
    descricao:
      "Casa espaçosa em bairro residencial de Votorantim: 4 quartos (2 suítes), piscina, área gourmet completa e edícula com quarto de hóspedes. Terreno de 400 m² com paisagismo pronto. Perfeita para famílias grandes que gostam de receber.\n\nAgende sua visita pelo WhatsApp.",
    tipo: "RESIDENCIAL",
    transacao: "VENDA",
    cidade: "Votorantim",
    bairro: "Parque Bela Vista",
    quartos: 4,
    banheiros: 3,
    vagas: 3,
    areaM2: 260,
    fotos: fotos("bz-casavot", 3),
  },
  {
    id: "bz-0006",
    codigo: "BZ-0006",
    slug: "loja-terrea-80m2-avenida-ipanema",
    titulo: "Loja térrea de 80 m² na Av. Ipanema",
    descricao:
      "Ponto comercial de esquina na Avenida Ipanema, com 80 m², vitrine ampla, copa e 2 banheiros. Grande fluxo de veículos e pedestres — ideal para varejo, serviços ou franquias. Fachada recém-reformada.\n\nConsulte condições de locação pelo WhatsApp.",
    tipo: "COMERCIAL",
    transacao: "LOCACAO",
    cidade: "Sorocaba",
    bairro: "Jardim Ipanema",
    quartos: null,
    banheiros: 2,
    vagas: 2,
    areaM2: 80,
    fotos: fotos("bz-loja", 2),
  },
];

export const DESTAQUES = IMOVEIS.slice(0, 3);

export function imovelPorSlug(slug: string): PublicPropertyDTO | undefined {
  return IMOVEIS.find((i) => i.slug === slug);
}

export function cidadesDisponiveis(): string[] {
  return Array.from(new Set(IMOVEIS.map((i) => i.cidade))).sort();
}
