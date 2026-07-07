/**
 * Contato via WhatsApp — versão do LAYOUT estático (GitHub Pages).
 *
 * Diferente do site real (buganza_imoveis), aqui NÃO há backend, então os
 * links vão direto para wa.me. No site real, o contato passa por
 * /api/contato, que monta o número no servidor e o mantém fora do
 * "inspecionar". Esta é apenas a vitrine de demonstração.
 */

import { imovelPorSlug } from "@/lib/imoveis-data";

function whatsappNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5515998296767";
}

function link(mensagem: string): string {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(mensagem)}`;
}

const MENSAGEM_GERAL =
  "Olá! Vim pelo site e gostaria de saber mais sobre os imóveis disponíveis.";

const MENSAGEM_ANUNCIAR =
  "Olá! Tenho um imóvel e gostaria de anunciá-lo com a Imóveis Buganza. Podemos conversar?";

export function linkWhatsAppGeral(): string {
  return link(MENSAGEM_GERAL);
}

export function linkWhatsAppAnunciar(): string {
  return link(MENSAGEM_ANUNCIAR);
}

export function linkWhatsAppImovel(slug: string): string {
  const imovel = imovelPorSlug(slug);
  const mensagem = imovel
    ? `Olá! Tenho interesse no imóvel "${imovel.titulo}" (cód. ${imovel.codigo}). Poderia me passar mais informações e valores?`
    : MENSAGEM_GERAL;
  return link(mensagem);
}
