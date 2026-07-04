# Buganza Imóveis — Layout (front)

Versão **estática, somente front-end**, do site da [Imóveis Buganza](https://github.com/romavitordev/buganza_imoveis) — catálogo imobiliário de Sorocaba/SP (CRECI 118400).

- **Demo (GitHub Pages):** https://romavitordev.github.io/layout_buganza/
- **Repo completo (banco + admin + APIs):** [buganza_imoveis](https://github.com/romavitordev/buganza_imoveis)

## O que tem aqui

- Hero com cena SVG de prédios (janelas piscando + parallax por scroll)
- Catálogo com filtros client-side (tipo / transação / cidade)
- Página de detalhe com galeria + lightbox
- Seção Quem Somos
- Dados de demonstração em [lib/imoveis-data.ts](lib/imoveis-data.ts) — no site real vêm do Postgres via Prisma, gerenciados pelo painel admin

Nenhum preço é exibido: toda conversão acontece via WhatsApp com mensagem pré-preenchida por imóvel.

## Rodando

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # export estático em out/
```

O deploy no GitHub Pages é automático a cada push na `main` (workflow em `.github/workflows/deploy.yml`).

## Stack

Next.js 14 (App Router, `output: "export"`) · TypeScript · Tailwind CSS · lucide-react
