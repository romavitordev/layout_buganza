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
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5515998036636";
}

function link(mensagem: string): string {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(mensagem)}`;
}

const MENSAGEM_GERAL =
  "Olá! Vim pelo site e gostaria de saber mais sobre os imóveis disponíveis.";

const MENSAGEM_ANUNCIAR =
  "Olá! Tenho um imóvel e gostaria de anunciá-lo com a Marcelo Imóveis. Podemos conversar?";

export function linkWhatsAppGeral(): string {
  return link(MENSAGEM_GERAL);
}

export function linkWhatsAppAnunciar(): string {
  return link(MENSAGEM_ANUNCIAR);
}

export function linkWhatsAppImovel(slug: string): string {
  const imovel = imovelPorSlug(slug);
  // A mensagem acompanha o rótulo do botão: ele diz "Agendar uma
  // visita", então ela pede a visita. Sem preço público o convite é
  // outro — ali o que trava a conversa é não saber quanto custa.
  const temPreco = Boolean(imovel?.precoVenda || imovel?.precoLocacao);
  const mensagem = imovel
    ? temPreco
      ? `Olá! Vi o imóvel "${imovel.titulo}" (cód. ${imovel.codigo}) no site e gostaria de agendar uma visita.`
      : `Olá! Vi o imóvel "${imovel.titulo}" (cód. ${imovel.codigo}) no site e gostaria de saber o valor.`
    : MENSAGEM_GERAL;
  return link(mensagem);
}
