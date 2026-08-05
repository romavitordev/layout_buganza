/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_ACTIONS === "true";

// No GitHub Pages o site fica em /layout_buganza; localmente fica na raiz
const basePath = isPages ? "/layout_buganza" : "";

const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  env: {
    // Número oficial da Marcelo Imóveis: +55 15 99829-6767
    NEXT_PUBLIC_WHATSAPP_NUMBER: "5515998296767",
    /**
     * O basePath legível pelo código do cliente. O Next só o aplica
     * sozinho em <Link> e next/image; o logotipo do SiteNav é um <img>
     * comum (para não fixar a proporção do arquivo no código), então
     * ele monta o caminho com este prefixo. Sem isso, /logo.png daria
     * 404 dentro de /layout_buganza.
     */
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

module.exports = nextConfig;
