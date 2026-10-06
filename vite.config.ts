import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fillHead } from "./src/seo";

// In sviluppo index.html non passa dal prerender: si riempiono qui titolo e meta, nella lingua dell'URL.
const devHead = (): Plugin => ({
  name: "dev-head",
  apply: "serve",
  transformIndexHtml: (html, ctx) => fillHead(html, ctx.originalUrl?.startsWith("/en") ? "en" : "it"),
});

export default defineConfig({ plugins: [react(), tailwindcss(), devHead()] });
