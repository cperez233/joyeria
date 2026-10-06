// editorial-ui · Cristian Pérez · cristianperez.me
// HTML prerenderizado por idioma (/ italiano, /en/ inglés) y archivos de rastreo, todo desde src/data.ts.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { render, jsonLd, fillHead, site, copy, langs, langPath, navIds } from "../dist-ssr/entry-server.js";

const tpl = readFileSync("dist/index.html", "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

for (const lang of langs) {
  const html = fillHead(tpl, lang)
    .replace("<!--jsonld-->", `<script type="application/ld+json">${JSON.stringify(jsonLd(lang)).replace(/</g, "\\u003c")}</script>`)
    .replace("<!--app-->", render(lang));
  const out = lang === "it" ? "dist/index.html" : "dist/en/index.html";
  mkdirSync(out.replace(/\/[^/]+$/, ""), { recursive: true });
  writeFileSync(out, html);
  console.log("prerender", lang, html.length, "bytes");
}

const css = tpl.match(/href="(\/assets\/[^"]+\.css)"/)?.[1] ?? "";
const it = copy.it.notFound, en = copy.en.notFound;
writeFileSync("dist/404.html", `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${it.title} | ${site.name}</title><meta name="robots" content="noindex, follow">
<link rel="icon" href="/icon.svg" type="image/svg+xml"><meta name="theme-color" content="#17191c">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400&family=Manrope:wght@400;600&display=swap">
<link rel="stylesheet" href="${css}"></head>
<body class="grain dark grid min-h-svh place-items-center bg-graphite px-6 text-center text-frost">
<main><img src="/icon.svg" alt="" width="64" height="64" class="mx-auto rounded-2xl">
<h1 class="mt-8 text-[clamp(2.4rem,6vw,4.2rem)] font-light leading-none">${it.h1}</h1>
<p class="mx-auto mt-4 max-w-[46ch] text-frost/80">${it.p}</p>
<p class="mt-8 flex flex-wrap justify-center gap-4"><a class="inline-flex min-h-[52px] items-center rounded-full bg-gold px-6 font-semibold text-ink" href="/#collezioni">${it.cta}</a>
<a class="inline-flex min-h-[52px] items-center px-2 font-semibold underline decoration-gold underline-offset-4" href="/">${it.home}</a>
<a class="inline-flex min-h-[52px] items-center px-2 font-semibold underline decoration-gold underline-offset-4" href="/en/" lang="en">${en.home} (English)</a></p></main>
</body></html>`);

writeFileSync("dist/robots.txt", `User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${site.url}/sitemap.xml
`);

const alt = langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${site.url}${langPath(l)}"/>`).join("\n");
writeFileSync("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${langs.map((l) => `  <url>
    <loc>${site.url}${langPath(l)}</loc>
${alt}
    <xhtml:link rel="alternate" hreflang="x-default" href="${site.url}/"/>
    <lastmod>${site.lastmod}</lastmod>
  </url>`).join("\n")}
</urlset>
`);

const c = copy.it;
writeFileSync("dist/llms.txt", `# ${site.name}

> ${c.meta.description} Telefono e WhatsApp ${site.phoneLabel}. English version: ${site.url}/en/

## Pagine principali
${navIds.map((n) => `- [${c.footer.links[n]}](${site.url}/#${n})`).join("\n")}
- [English version](${site.url}/en/)

## Dati chiave
- Materiale: acciaio inossidabile
- Personalizzazione: incisione di foto, frasi o canzoni, fatta al momento in negozio
- Collezioni: ${Object.values(c.collections.items).map((i) => i.name).join(", ")}
- Indirizzo: ${site.mall}, ${site.street}, ${site.postal} ${site.city} (${site.region})
- Orari: lunedì-sabato ${site.hours.weekdays.join("-")}, domenica ${site.hours.sunday.join("-")}
`);

rmSync("dist-ssr", { recursive: true, force: true });
