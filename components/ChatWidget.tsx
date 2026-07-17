"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, X } from "lucide-react";
import { BrandMark } from "@/components/SiteNav";
import {
  TOPICOS,
  responder,
  respostaDoTopico,
  topicosPorCategoria,
} from "@/lib/chatbot";
import { linkWhatsAppGeral, linkWhatsAppImovel } from "@/lib/whatsapp";

/**
 * "Buganza Suporte" — widget de atendimento flutuante (vitrine estática).
 * Responde a dúvidas frequentes por regras (lib/chatbot.ts); quando não
 * sabe, oferece o WhatsApp. Aqui NÃO há backend de leads: o "Deixar meu
 * contato" leva direto ao WhatsApp (no site real, grava em /api/leads).
 */

interface Bolha {
  de: "bot" | "user";
  texto: ReactNode;
}

const SAUDACAO =
  "Olá! Sou o assistente da Imóveis Buganza 👋 Como posso ajudar? Escolha um assunto abaixo ou escreva sua dúvida.";

export default function ChatWidget() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Bolha[]>([
    { de: "bot", texto: SAUDACAO },
  ]);
  const [entrada, setEntrada] = useState("");

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

  function acoesBot(topicoRespondidoId?: string): ReactNode {
    const outros = TOPICOS.filter((t) => t.id !== topicoRespondidoId);
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
            className="text-[#25D366]"
            aria-hidden="true"
          />
          Falar no WhatsApp
        </a>

        {outros.length > 0 && (
          <div className="mt-1 border-t border-black/8 pt-2.5">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-black/35">
              Posso ajudar em mais algo?
            </p>
            <div className="flex flex-wrap gap-1.5">
              {outros.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onChip(t.id)}
                  className="rounded-pill border border-black/15 bg-white px-2.5 py-1 text-[11px] font-medium text-black/70 transition-colors hover:border-black hover:text-black"
                >
                  {t.titulo}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  function responderTexto(texto: string, resposta: ReturnType<typeof responder>) {
    empurrar({ de: "user", texto });
    empurrar({
      de: "bot",
      texto: (
        <>
          {resposta.texto}
          {acoesBot(resposta.topicoId)}
        </>
      ),
    });
  }

  function onChip(id: string) {
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
          aria-label="Abrir atendimento Buganza Suporte"
          className="fixed right-4 bottom-[5.5rem] z-[70] inline-flex items-center gap-2.5 rounded-pill bg-black px-6 py-4 text-[15px] font-medium text-white shadow-[0_10px_36px_rgba(0,0,0,0.28)] transition-transform duration-200 ease-premium hover:-translate-y-0.5 md:bottom-5 md:right-5"
        >
          <MessageCircle size={22} strokeWidth={2} aria-hidden="true" />
          Suporte
        </button>
      )}

      {aberto && (
        <div
          role="dialog"
          aria-label="Buganza Suporte"
          className="fixed inset-x-4 bottom-4 z-[70] flex max-h-[80vh] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_16px_56px_rgba(0,0,0,0.24)] md:inset-x-auto md:right-6 md:bottom-6 md:h-[560px] md:max-h-[80vh] md:w-[380px]"
        >
          <header className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mist">
                <BrandMark />
              </span>
              <div>
                <p className="text-sm font-semibold tracking-tight">
                  Buganza Suporte
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-black/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                  Online agora
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar atendimento"
              className="rounded-full p-1.5 text-black/50 transition-colors hover:bg-mist hover:text-black"
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

            {mensagens.length === 1 && (
              <div className="flex flex-col gap-3 pt-1">
                {topicosPorCategoria().map(({ categoria, topicos }) => (
                  <div key={categoria}>
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-black/35">
                      {categoria}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {topicos.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => onChip(t.id)}
                          className="rounded-pill border border-black/15 bg-white px-3 py-1.5 text-[12px] font-medium text-black/70 transition-colors hover:border-black hover:text-black"
                        >
                          {t.titulo}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div ref={fimRef} />
          </div>

          <form
            onSubmit={onEnviarTexto}
            className="flex items-center gap-2 border-t border-black/10 p-3"
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
