"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, MessageCircle, Send, X } from "lucide-react";
import { BrandMark } from "@/components/SiteNav";
import { EVENTO_ABRIR_SUPORTE } from "@/lib/suporte";
import {
  CATEGORIAS,
  TOPICOS,
  responder,
  respostaDoTopico,
  type Categoria,
} from "@/lib/chatbot";
import { linkWhatsAppGeral, linkWhatsAppImovel } from "@/lib/whatsapp";

/**
 * "Assistente Marcelo" — widget de atendimento flutuante (vitrine estática).
 * Responde a dúvidas frequentes por regras (lib/chatbot.ts); quando não
 * sabe, oferece o WhatsApp. Aqui NÃO há backend de leads: o "Deixar meu
 * contato" leva direto ao WhatsApp (no site real, grava em /api/leads).
 */

interface Bolha {
  de: "bot" | "user";
  texto: ReactNode;
}

/**
 * Que atalhos acompanham uma resposta do bot. A navegação tem dois
 * níveis para não jogar uma parede de opções na cara do visitante:
 * primeiro as CATEGORIAS ("Comprar ou alugar"…), e só dentro delas os
 * assuntos. Cada mensagem guarda os próprios chips — por isso o nível
 * é um parâmetro, e não um estado global.
 */
type Nivel =
  | { tipo: "categorias" }
  | { tipo: "topicos"; categoria: Categoria };

const PREFIXO_CATEGORIA = "cat:";

const SAUDACAO =
  "Olá! Sou o assistente da Marcelo Imóveis 👋 Escreva sua dúvida — ou escolha um assunto abaixo.";

export default function ChatWidget() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Bolha[]>([
    { de: "bot", texto: SAUDACAO },
  ]);
  const [entrada, setEntrada] = useState("");

  // Gatilho externo: no mobile quem abre o chat é o ícone da navbar,
  // que fica noutro ramo da árvore (ver lib/suporte.ts).
  useEffect(() => {
    const abrir = () => setAberto(true);
    window.addEventListener(EVENTO_ABRIR_SUPORTE, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_SUPORTE, abrir);
  }, []);

  const fimRef = useRef<HTMLDivElement>(null);

  const slugImovel = pathname?.startsWith("/imoveis/")
    ? pathname.split("/")[2] || undefined
    : undefined;
  const hrefWhats = slugImovel
    ? linkWhatsAppImovel(slugImovel)
    : linkWhatsAppGeral();

  useEffect(() => {
    if (aberto) fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, aberto]);

  // Trava a rolagem do site enquanto o chat está aberto em tela cheia,
  // senão a PÁGINA atrás rola junto ao fim da conversa.
  useEffect(() => {
    if (!aberto) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAberto(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aberto]);

  function empurrar(bolha: Bolha) {
    setMensagens((atual) => [...atual, bolha]);
  }

  function acoesBot(
    nivel: Nivel = { tipo: "categorias" },
    topicoRespondidoId?: string
  ): ReactNode {
    const dentroDeCategoria = nivel.tipo === "topicos";

    // Nível 1 = categorias; nível 2 = assuntos daquela categoria
    const opcoes = dentroDeCategoria
      ? TOPICOS.filter(
          (t) => t.categoria === nivel.categoria && t.id !== topicoRespondidoId
        ).map((t) => ({ id: t.id, titulo: t.titulo }))
      : CATEGORIAS.map((c) => ({ id: `${PREFIXO_CATEGORIA}${c}`, titulo: c }));

    const chip =
      "rounded-pill border border-black/15 bg-white px-2.5 py-1 text-[11px] font-medium text-black/70 transition-colors hover:border-black hover:text-black";

    return (
      <div className="mt-3 flex flex-col gap-2">
        <a
          href={hrefWhats}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-pill bg-black px-4 py-2.5 text-[12px] font-medium text-white transition-transform duration-200 ease-premium hover:-translate-y-0.5"
        >
          <MessageCircle
            size={13}
            strokeWidth={2.5}
            aria-hidden="true"
          />
          Falar no WhatsApp
        </a>

        {opcoes.length > 0 && (
          <div className="mt-1 border-t border-black/8 pt-2.5">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-black/70">
              {dentroDeCategoria
                ? "Escolha o assunto"
                : "Posso ajudar em mais algo?"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {opcoes.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => onChip(o.id)}
                  className={chip}
                >
                  {o.titulo}
                </button>
              ))}
              {dentroDeCategoria && (
                <button
                  type="button"
                  onClick={voltarAosAssuntos}
                  className="rounded-pill px-2.5 py-1 text-[11px] font-medium text-black/70 underline underline-offset-2 transition-colors hover:text-black"
                >
                  ← Outros assuntos
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  function responderTexto(texto: string, resposta: ReturnType<typeof responder>) {
    empurrar({ de: "user", texto });
    // Depois de responder, o visitante fica DENTRO da categoria do
    // assunto — os vizinhos são o que ele provavelmente quer a seguir.
    const topico = TOPICOS.find((t) => t.id === resposta.topicoId);
    const nivel: Nivel = topico
      ? { tipo: "topicos", categoria: topico.categoria }
      : { tipo: "categorias" };
    empurrar({
      de: "bot",
      texto: (
        <>
          {resposta.texto}
          {acoesBot(nivel, resposta.topicoId)}
        </>
      ),
    });
  }

  /** Volta do nível 2 (assuntos) para o nível 1 (categorias). */
  function voltarAosAssuntos() {
    empurrar({
      de: "bot",
      texto: (
        <>
          Claro! Sobre o que você quer saber?
          {acoesBot({ tipo: "categorias" })}
        </>
      ),
    });
  }

  function onChip(id: string) {
    // Categoria: abre o 2º nível com os assuntos dela
    if (id.startsWith(PREFIXO_CATEGORIA)) {
      const categoria = id.slice(PREFIXO_CATEGORIA.length) as Categoria;
      empurrar({ de: "user", texto: categoria });
      empurrar({
        de: "bot",
        texto: (
          <>
            Sobre <strong>{categoria.toLowerCase()}</strong>, posso ajudar
            com:
            {acoesBot({ tipo: "topicos", categoria })}
          </>
        ),
      });
      return;
    }
    const topico = TOPICOS.find((t) => t.id === id);
    if (!topico) return;
    responderTexto(topico.titulo, respostaDoTopico(id));
  }

  function onEnviarTexto(e: FormEvent) {
    e.preventDefault();
    const texto = entrada.trim();
    if (!texto) return;
    setEntrada("");
    responderTexto(texto, responder(texto));
  }

  return (
    <>
      {!aberto && (
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-label="Abrir atendimento Assistente Marcelo"
          className="fixed right-5 bottom-5 z-[70] hidden items-center gap-2.5 rounded-pill bg-black px-6 py-4 text-[15px] font-medium text-white shadow-[0_10px_36px_rgba(0,0,0,0.28)] transition-transform duration-200 ease-premium hover:-translate-y-0.5 md:inline-flex"
        >
          <MessageCircle size={22} strokeWidth={2} aria-hidden="true" />
          Suporte
        </button>
      )}

      {aberto && (
        <div
          role="dialog"
          aria-label="Assistente Marcelo"
          /* No mobile ocupa a tela inteira, como um app de conversa.
             100dvh (e não 100vh) porque no iOS a barra do navegador entra
             na conta do vh e cortava o campo de digitação. */
          className="fixed inset-0 z-[70] flex h-[100dvh] w-full flex-col overflow-hidden border-black/10 bg-white md:inset-auto md:right-6 md:bottom-6 md:h-[560px] md:max-h-[80vh] md:w-[380px] md:rounded-2xl md:border md:shadow-[0_16px_56px_rgba(0,0,0,0.24)]"
        >
          <header className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:pt-3">
            <div className="flex items-center gap-2.5">
              {/* Seta de voltar — só no mobile, onde o chat é a tela
                  inteira e é ela que devolve o visitante ao site. */}
              <button
                type="button"
                onClick={() => setAberto(false)}
                aria-label="Voltar ao site"
                className="-ml-1.5 rounded-full p-1.5 text-black/70 transition-colors hover:bg-mist hover:text-black md:hidden"
              >
                <ArrowLeft size={20} aria-hidden="true" />
              </button>
              {/* 24px dentro do círculo de 36: com o logotipo real, o
                  tamanho padrão (30) encostava na borda e o desenho
                  ficava sem ar em volta. */}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mist">
                <BrandMark size={24} />
              </span>
              <div>
                <p className="text-sm font-semibold tracking-tight">
                  Assistente Marcelo
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-black/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                  Online agora
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar atendimento"
              className="hidden rounded-full p-1.5 text-black/70 transition-colors hover:bg-mist hover:text-black md:block"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {mensagens.map((m, i) => (
              <div
                key={i}
                className={m.de === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.de === "user"
                      ? "bg-black text-white"
                      : "bg-mist text-black/80"
                  }`}
                >
                  {m.texto}
                </div>
              </div>
            ))}

            {/* Abertura enxuta: só as 3 categorias, nunca a lista inteira
                de assuntos — os assuntos aparecem dentro da categoria. */}
            {mensagens.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {CATEGORIAS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onChip(`${PREFIXO_CATEGORIA}${c}`)}
                    className="rounded-pill border border-black/15 bg-white px-3 py-1.5 text-[12px] font-medium text-black/70 transition-colors hover:border-black hover:text-black"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            <div ref={fimRef} />
          </div>

          <form
            onSubmit={onEnviarTexto}
            // pb com safe-area: em tela cheia o campo encosta na barra
              // de gestos do celular sem essa folga.
              className="flex items-center gap-2 border-t border-black/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-3"
          >
            <input
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              placeholder="Escreva sua dúvida…"
              aria-label="Sua mensagem"
              className="flex-1 rounded-pill border border-black/15 px-4 py-2.5 text-sm outline-none transition-colors focus:border-black"
            />
            <button
              type="submit"
              aria-label="Enviar"
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-black text-white transition-transform duration-200 ease-premium hover:-translate-y-0.5"
            >
              <Send size={15} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
