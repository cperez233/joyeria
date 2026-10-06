// JSON-LD generado desde data.ts, por idioma.
import { collIds, copy, site, type Lang, langPath } from "./data";

const id = (h: string) => `${site.url}/#${h}`;

export const jsonLd = (lang: Lang) => {
  const c = copy[lang];
  const [wo, wc] = site.hours.weekdays, [so, sc] = site.hours.sunday;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": id("organization"), name: site.name, url: `${site.url}/`, slogan: "Your Style",
        logo: { "@type": "ImageObject", url: `${site.url}/logo-512.png`, width: 512, height: 512 },
        telephone: site.phone, sameAs: [site.instagram, site.facebook, site.googleMaps] },
      { "@type": "WebSite", "@id": id("website"), url: `${site.url}/`, name: site.name, inLanguage: ["it-IT", "en"], publisher: { "@id": id("organization") } },
      { "@type": "WebPage", "@id": `${site.url}${langPath(lang)}#webpage`, url: `${site.url}${langPath(lang)}`, name: c.meta.title, description: c.meta.description,
        inLanguage: lang === "it" ? "it-IT" : "en", isPartOf: { "@id": id("website") }, about: { "@id": id("store") } },
      { "@type": "JewelryStore", "@id": id("store"), name: site.name, url: `${site.url}/`, image: `${site.url}/og-image.jpg`, logo: `${site.url}/logo-512.png`,
        telephone: site.phone, parentOrganization: { "@id": id("organization") }, sameAs: [site.instagram, site.facebook, site.googleMaps],
        hasMap: site.googleMaps, geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        description: c.meta.description,
        address: { "@type": "PostalAddress", streetAddress: `${site.street} (${site.mall})`, postalCode: site.postal, addressLocality: site.city, addressRegion: site.region, addressCountry: "IT" },
        containedInPlace: { "@type": "ShoppingCenter", name: site.mall, address: { "@type": "PostalAddress", streetAddress: "Via Musile, 9/32", postalCode: site.postal, addressLocality: site.city, addressCountry: "IT" } },
        openingHoursSpecification: [
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: wo, closes: wc },
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday"], opens: so, closes: sc },
        ],
        areaServed: { "@type": "City", name: site.city },
        hasOfferCatalog: { "@type": "OfferCatalog", name: c.collections.eyebrow,
          itemListElement: collIds.map((k) => ({ "@type": "OfferCatalog", name: c.collections.items[k].name, description: c.collections.items[k].what })) } },
      { "@type": "FAQPage", inLanguage: lang === "it" ? "it-IT" : "en", mainEntity: c.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
};

/** Rellena i segnaposto di index.html (%TITLE%, %DESC%…) per una lingua. Lo usano il prerender e il server di sviluppo,
 *  così il titolo della scheda non resta mai "%TITLE%". */
export const fillHead = (tpl: string, lang: Lang) => {
  const c = copy[lang], canon = site.url + langPath(lang);
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return tpl
    .replace("%LANG%", lang)
    .replace("%TITLE%", esc(c.meta.title))
    .replace("%DESC%", esc(c.meta.description))
    .split("%CANON%").join(canon)
    .split("%SITE%").join(site.url)
    .replace("%OGLOCALE%", c.locale)
    .replace("%OGLOCALEALT%", copy[lang === "it" ? "en" : "it"].locale)
    .replace("%OGTITLE%", esc(c.meta.ogTitle))
    .replace("%OGDESC%", esc(c.meta.ogDescription))
    .replace("%OGALT%", esc(c.meta.ogAlt));
};
