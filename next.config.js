/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  output: "export",
  // No GitHub Pages o site fica em /layout_buganza; localmente fica na raiz
  basePath: isPages ? "/layout_buganza" : "",
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_WHATSAPP_NUMBER: "5515991150890",
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
