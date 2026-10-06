// editorial-ui · Cristian Pérez · cristianperez.me
// Una sola fuente: contenido en italiano (predeterminado) e inglés, JSON-LD, sitemap, robots y llms.txt.
// Fuente de los datos: jovis-gioielli.it y centromeduna.it (consultados 2026-10-06).

export type Lang = "it" | "en";
export const langs: Lang[] = ["it", "en"];
export const langPath = (l: Lang) => (l === "it" ? "/" : "/en/");

export const site = {
  url: "https://www.jovis-gioielli.it",
  name: "Jovi's Gioielli",
  phone: "+393516300926", // [DA CONFERMARE: che sia anche WhatsApp]
  phoneLabel: "+39 351 630 0926",
  street: "Via Musile, 9/32",
  mall: "Centro Commerciale Meduna",
  postal: "33170",
  city: "Pordenone",
  region: "PN",
  instagram: "https://www.instagram.com/jovis_gioielleria/",
  instagramLabel: "@jovis_gioielleria",
  facebook: "https://www.facebook.com/profile.php?id=61570551456655",
  // Orari dalla scheda Google Business (consultata 2026-10-06): lun-sab 9:30-20, dom 9:30-14
  hours: { weekdays: ["09:30", "20:00"], sunday: ["09:30", "14:00"] },
  geo: { lat: 45.951169, lng: 12.6914915 },
  // Scheda Google Maps "Jovi's_gioielleria e Incisioni Pordenone"
  googleMaps: "https://www.google.com/maps/place/Jovi%27s_gioielleria+e+Incisioni+Pordenone/@45.951169,12.6914915,17z/data=!4m6!3m5!1s0x47796300014ec31b:0x5b467254b061bbc!8m2!3d45.951169!4d12.6914915!16s%2Fg%2F11y8rj11vj",
  // Valutazione Google al 2026-10-06. Si mostra come testo, senza aggregateRating (Google non lo ammette per recensioni di terzi).
  rating: { value: 4.9, count: 28, checked: "2026-10-06" },
  lastmod: "2026-10-06",
};

export const wa = (text: string) => `https://wa.me/${site.phone.replace("+", "")}?text=${encodeURIComponent(text)}`;
export const maps = `https://www.google.com/maps/dir/?api=1&destination=${site.geo.lat},${site.geo.lng}`;

/* Recensioni vere dalla scheda Google (2026-10-06), estratti testuali con nome abbreviato. [DA CONFERMARE con Jovi's prima di pubblicare] */
export const reviews = [
  { author: "Alessia B.", it: "Temevo di dover aspettare giorni per avere il prodotto finito, invece il tempo di bere un caffè e la collana da me scelta era pronta! Esattamente come l'avevo immaginata!", en: "I was afraid I'd have to wait days for the finished piece; instead, in the time it took to drink a coffee, the necklace I chose was ready. Exactly as I had imagined it!" },
  { author: "Jessica L.", it: "Ottima accoglienza, molto gentili e cordiali. Incisioni fatte al momento, qualità prezzo ottima! Ho acquistato dei regali di natale davvero molto graziosi.", en: "A warm welcome, very kind and friendly. Engravings done on the spot, great value for money! I bought some really lovely Christmas presents." },
  { author: "Gio", it: "Bellissimo negozietto all'interno del centro commerciale. Ci sono moltissime idee per regali personalizzati e anche per oggetti personali che vogliono essere esclusivi.", en: "A lovely little shop inside the shopping centre. Lots of ideas for personalised gifts, and for personal pieces meant to be one of a kind." },
  { author: "Michele M.", it: "Sono stati fantastici! Hanno svolto bene le loro attività e sono stati molto veloci. Ci hanno trattato molto bene.", en: "They were fantastic! They did a good job and were very quick. They treated us really well." },
];

/* Lavori veri dal profilo Instagram di Jovi's, ritagliati senza filigrana. */
export const works = [
  { src: "lavoro-foto-famiglia", w: 900, h: 1270 },
  { src: "lavoro-disegno-cuore", w: 900, h: 640 },
  { src: "lavoro-charm", w: 900, h: 696 },
  { src: "lavoro-nonno", w: 740, h: 1298 },
  { src: "lavoro-festa-papa", w: 900, h: 1212 },
  { src: "lavoro-bracciale-mare", w: 900, h: 874 },
] as const;

export const img = (id: string, w: number, h?: number, q = 72) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=${q}`;

export type CollId = "bracciali" | "collane" | "anelli" | "uomo" | "fedi" | "estate";

/* Fotos reales de Jovi's (jovis-gioielli.it), recortadas 4:5 sin la marca de agua, en public/foto a 640 y 1000 px. */
export const foto = (name: string, w: 640 | 1000 = 640) => `/foto/${name}-${w}.webp`;
export const collPhotos: Record<CollId, { src: string; pos?: string }> = {
  bracciali: { src: "bracciale" },
  collane: { src: "collana-ala" },
  anelli: { src: "anello-blu" },
  uomo: { src: "anello-uomo" },
  fedi: { src: "fedi" },
  estate: { src: "anello-estate", pos: "50% 35%" },
};
export const photos = {
  portrait: "photo-1529634597503-139d3726fed5", // foto di esempio per l'incisione (Unsplash)
  store: "anello-blu",
};

export const navIds = ["collezioni", "incisione", "domande", "negozio"] as const;

const it = {
  lang: "it" as Lang,
  locale: "it_IT",
  meta: {
    title: "Gioielli in acciaio personalizzati a Pordenone | Jovi's Gioielli",
    description: "Bracciali, collane, anelli e fedi nuziali in acciaio inossidabile, incisi al momento con foto, frasi o canzoni. Centro Commerciale Meduna, Pordenone.",
    ogTitle: "Jovi's Gioielli · Gioielli in acciaio incisi come vuoi tu",
    ogDescription: "Bracciali, collane, anelli e fedi nuziali in acciaio, personalizzati con l'incisione di una foto, una frase o una canzone. Pordenone.",
    ogAlt: "Jovi's Gioielli, gioielli in acciaio personalizzati a Pordenone",
  },
  ui: {
    skip: "Vai alle collezioni", home: "Jovi's Gioielli, inizio", menu: "Menu", close: "Chiudi",
    nav: { collezioni: "Collezioni", incisione: "Incisione", domande: "Domande", negozio: "Negozio" },
    langSwitch: "English", langSwitchShort: "EN", langLabel: "Read in English",
    whatsapp: "WhatsApp", waHello: "Ciao! Vorrei informazioni su un gioiello.",
  },
  hero: {
    slogan: "Your Style",
    h1a: "Gioielli in acciaio,", h1b: "incisi come vuoi tu.",
    h1sub: "Bracciali, collane, anelli e fedi nuziali personalizzati a Pordenone",
    lede: "Acciaio inossidabile, eleganza resistente nel tempo. Nel nostro negozio al Centro Commerciale Meduna li personalizziamo al momento con l'incisione di una foto, di una frase o di una canzone.",
    cta: "Scrivici su WhatsApp", link: "Vedi le collezioni",
  },
  engraver: {
    title: "Prova l'incisione",
    pieces: { piastrina: "Piastrina", collana: "Collana", bracciale: "Bracciale", fede: "Fede" },
    pieceArticle: { piastrina: "una piastrina", collana: "una collana", bracciale: "un bracciale", fede: "una fede" },
    modes: { frase: "Frase", canzone: "Canzone", foto: "Foto" },
    textLabel: "La tua frase", textPh: "Scrivi qui la tua frase",
    songLabel: "Titolo della canzone", songPh: "Il titolo della vostra canzone",
    photoNote: "La foto ce la mandi su WhatsApp o la porti in negozio. Qui vedi un esempio.",
    fontLabel: "Carattere", fonts: { corsivo: "Corsivo", stampatello: "Stampatello", macchina: "Macchina" },
    counter: (n: number, max: number) => `${n} di ${max}`,
    cta: "Chiedi questa incisione",
    note: "Anteprima indicativa: in negozio vedi la prova sul gioiello vero.",
    preview: (what: string, piece: string) => `Anteprima: ${what} incisa su ${piece}`,
    photoWhat: "una foto", songWhat: (s: string) => `la canzone «${s}»`,
    message: (what: string, piece: string, font?: string) => `Ciao! Vorrei incidere ${what} su ${piece}${font ? `, con carattere ${font.toLowerCase()}` : ""}. Si può fare?`,
    examples: [
      { piece: "piastrina", mode: "frase", text: "Per sempre noi", font: "corsivo" },
      { piece: "collana", mode: "frase", text: "Sofia", font: "corsivo" },
      { piece: "bracciale", mode: "frase", text: "TI PORTO CON ME", font: "stampatello" },
      { piece: "fede", mode: "frase", text: "07 · 06 · 2025", font: "macchina" },
      { piece: "piastrina", mode: "canzone", text: "La nostra canzone", font: "stampatello" },
      { piece: "collana", mode: "foto", text: "", font: "corsivo" },
    ],
    song: "canzone",
  },
  collections: {
    eyebrow: "Collezioni",
    h2a: "Che gioielli trovo", h2b: "da Jovi's?",
    lede: "Sei collezioni in acciaio inossidabile, quasi tutte personalizzabili. Tocca una collezione per vedere cosa puoi incidere.",
    open: "Scopri", tag: "Si può incidere",
    what: "Cosa trovi", engrave: "Cosa puoi incidere", cta: "Chiedi modelli e prezzi",
    ask: (name: string) => `Ciao! Vorrei vedere i modelli e i prezzi della collezione ${name}.`,
    priceNote: "I prezzi cambiano secondo il modello e l'incisione: te li diciamo in negozio o su WhatsApp.",
    doorCaption: "Le collezioni complete sono sui nostri social",
    doorCount: "6", doorCountLabel: "collezioni", scrollHint: "Scorri per vedere la vetrina",
    items: {
      bracciali: { name: "Bracciali", short: "Rigidi con piastrina, catene e maglie.", what: "Bracciali rigidi con piastrina, catene sottili e maglie più importanti, per lei e per lui.", engrave: "Nome, data, coordinate o una frase sulla piastrina.", alt: "Bracciale rigido in acciaio con quattro dischi smaltati, tra petali gialli" },
      collane: { name: "Collane", short: "Medaglie, piastrine e ciondoli.", what: "Catenine con medaglia, piastrina o ciondolo, da portare da sole o a strati.", engrave: "Una frase sul retro, oppure una foto sulla medaglia.", alt: "Collana color oro rosa con ciondolo a forma di ala e brillantini" },
      anelli: { name: "Anelli", short: "Fasce, intrecci e piccoli dettagli.", what: "Fasce lisce, intrecci e anelli con piccoli dettagli, in diverse misure.", engrave: "Iniziali, una data o una parola, dentro o fuori.", alt: "Anello in acciaio con pietre blu, riflesso su uno specchio" },
      uomo: { name: "Collezioni uomo", short: "Catene, maglie e anelli, lucidi o neri.", what: "Catene, bracciali a maglia e anelli in acciaio lucido o nero.", engrave: "Iniziali, una data importante o coordinate sulla piastrina.", alt: "Anello in acciaio a maglia grumetta su un legno" },
      fedi: { name: "Fedi nuziali con incisione", short: "Nomi, data del matrimonio o una frase.", what: "Fedi in acciaio, una coppia per gli sposi o per un anniversario.", engrave: "I vostri nomi, la data del matrimonio o una frase all'interno.", alt: "Due fedi nuziali color oro su sabbia e polvere" },
      estate: { name: "Primavera ed estate", short: "I pezzi colorati della stagione.", what: "Pietre colorate, forme leggere e i pezzi nuovi della stagione.", engrave: "Dipende dal pezzo: chiedici quali si possono incidere.", alt: "Anello a fasce aperte nella sabbia, tra le conchiglie" },
    } as Record<CollId, { name: string; short: string; what: string; engrave: string; alt: string }>,
  },
  works: {
    eyebrow: "Lavori",
    h2a: "Cosa abbiamo", h2b: "inciso di recente?",
    lede: "Alcuni pezzi fatti in negozio per i nostri clienti, dal nostro Instagram.",
    items: [
      "Una foto di famiglia incisa su una piastrina portachiavi",
      "Il disegno di un bambino inciso su un ciondolo a cuore",
      "I charm da aggiungere a bracciali e collane",
      "Portachiavi con foto e dedica per il nonno",
      "Portachiavi per la festa del papà, nella sua scatola",
      "Bracciale con charm marini",
    ],
    more: "Altri lavori su Instagram",
  },
  reviews: {
    eyebrow: "Recensioni",
    h2a: "Cosa dicono", h2b: "i clienti?",
    score: "su 5 su Google", count: (n: number) => `${n} recensioni`,
    source: "Recensione Google", read: "Leggi tutte su Google", write: "Lascia una recensione",
    prev: "Recensione precedente", next: "Recensione successiva",
  },
  statement: "Eleganza resistente nel tempo. L'acciaio inossidabile non si ossida e non annerisce: quello che incidi oggi resta leggibile.",
  engraving: {
    eyebrow: "Incisione",
    h2a: "Come funziona", h2b: "l'incisione?",
    lede: "Si fa in negozio, al momento. Se vuoi, mandaci prima la foto o la frase su WhatsApp: ti diciamo quale gioiello è più adatto.",
    steps: [
      { t: "Scegli il gioiello", d: "In negozio o dalle foto sui nostri social. Ti diciamo quanto spazio c'è per l'incisione." },
      { t: "Porta foto, frase o canzone", d: "Una foto dal telefono, un nome, una data, il titolo della vostra canzone." },
      { t: "La incidiamo al momento", d: "Vedi la prova, confermi, e il gioiello è pronto da portare via." },
    ],
    typesTitle: "Cosa si può incidere",
    types: [
      { t: "Foto", d: "Un ritratto, il tuo animale, un posto che conta." },
      { t: "Frase", d: "Nomi, date, coordinate, una dedica." },
      { t: "Canzone", d: "Il titolo e l'onda sonora della vostra canzone." },
    ],
    script: "Per sempre",
    cta: "Chiedi un'incisione", ask: "Ciao! Vorrei far incidere un gioiello. Vi mando la foto/frase qui.",
  },
  faq: {
    eyebrow: "Domande",
    h2a: "Prima di", h2b: "venire in negozio",
    aside: "La tua domanda non c'è?", asideText: "Scrivici su WhatsApp e ti rispondiamo in orario di negozio.", asideCta: "Chiedi su WhatsApp",
    ask: "Ciao! Ho una domanda sui vostri gioielli.",
    items: [
      { q: "Di che materiale sono i gioielli?", a: "Acciaio inossidabile. Non si ossida e non annerisce, quindi va bene da portare tutti i giorni." },
      { q: "Quanto tempo serve per l'incisione?", a: "La facciamo al momento, in negozio. Per foto o incisioni particolari ti diciamo i tempi prima di iniziare." },
      { q: "Posso mandare la foto o la frase prima?", a: "Sì, scrivici su WhatsApp: guardiamo la foto o la frase e ti consigliamo il gioiello con lo spazio giusto." },
      { q: "Incidete anche le fedi nuziali?", a: "Sì. Di solito si incidono all'interno: i vostri nomi, la data del matrimonio o una frase breve." },
      { q: "Quanto costano?", a: "Dipende dal modello e dall'incisione. Trovi i prezzi in negozio, oppure mandaci su WhatsApp la foto del gioiello che ti piace." },
      { q: "Come si pulisce un gioiello in acciaio?", a: "Acqua tiepida, sapone neutro e un panno morbido. Evita i prodotti abrasivi, che graffiano la superficie." },
    ],
  },
  store: {
    eyebrow: "Negozio",
    h2a: "Dove siamo e", h2b: "quando siamo aperti?",
    lede: "Siamo dentro il Centro Commerciale Meduna, a Pordenone. Puoi passare senza appuntamento; per un'incisione particolare, scrivici prima.",
    address: "Indirizzo", hours: "Orari", bus: "Autobus", busText: "Linee urbane 2 e R", contact: "Telefono e WhatsApp", social: "Social",
    days: ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"],
    today: "Oggi", openUntil: (h: string) => `aperti fino alle ${h}`, closedNow: "ora chiuso, riapriamo alle 9:30",
    closed: "Chiuso il 1° gennaio, il 25 aprile, il 1° maggio, il 25 e il 26 dicembre.",
    directions: "Indicazioni stradali", cta: "Scrivici su WhatsApp", ask: "Ciao! Vorrei passare in negozio.",
    mapTitle: "Mappa: Jovi's al Centro Commerciale Meduna, Pordenone", openMap: "Apri in Google Maps", mapHint: "Clicca per muovere la mappa",
    photoAlt: "Anello in acciaio a maglia grumetta su un legno, foto di Jovi's",
  },
  footer: {
    links: { collezioni: "Collezioni in acciaio", incisione: "Incisione personalizzata", domande: "Domande frequenti", negozio: "Orari e indirizzo" },
    rights: "Tutti i diritti riservati", credit: "Inciso con pazienza da",
  },
  notFound: { title: "Pagina non trovata", h1: "Questa pagina non è incisa da nessuna parte.", p: "Non esiste o ha cambiato indirizzo. Le collezioni sono ancora al loro posto.", cta: "Vedi le collezioni", home: "Torna all'inizio" },
};

type Copy = typeof it;

const en: Copy = {
  lang: "en",
  locale: "en_GB",
  meta: {
    title: "Engraved stainless steel jewellery in Pordenone | Jovi's Gioielli",
    description: "Stainless steel bracelets, necklaces, rings and wedding bands, engraved on the spot with a photo, a phrase or a song. Centro Commerciale Meduna, Pordenone.",
    ogTitle: "Jovi's Gioielli · Steel jewellery, engraved your way",
    ogDescription: "Stainless steel bracelets, necklaces, rings and wedding bands, personalised with an engraved photo, phrase or song. Pordenone, Italy.",
    ogAlt: "Jovi's Gioielli, personalised steel jewellery in Pordenone",
  },
  ui: {
    skip: "Skip to the collections", home: "Jovi's Gioielli, home", menu: "Menu", close: "Close",
    nav: { collezioni: "Collections", incisione: "Engraving", domande: "FAQ", negozio: "Store" },
    langSwitch: "Italiano", langSwitchShort: "IT", langLabel: "Leggi in italiano",
    whatsapp: "WhatsApp", waHello: "Hello! I'd like some information about a piece.",
  },
  hero: {
    slogan: "Your Style",
    h1a: "Steel jewellery,", h1b: "engraved your way.",
    h1sub: "Personalised bracelets, necklaces, rings and wedding bands in Pordenone",
    lede: "Stainless steel: elegance that lasts. In our shop at Centro Commerciale Meduna we personalise each piece on the spot, engraving a photo, a phrase or a song.",
    cta: "Message us on WhatsApp", link: "See the collections",
  },
  engraver: {
    title: "Try an engraving",
    pieces: { piastrina: "Tag", collana: "Necklace", bracciale: "Bracelet", fede: "Band" },
    pieceArticle: { piastrina: "a tag", collana: "a necklace", bracciale: "a bracelet", fede: "a band" },
    modes: { frase: "Phrase", canzone: "Song", foto: "Photo" },
    textLabel: "Your phrase", textPh: "Type your phrase here",
    songLabel: "Song title", songPh: "The title of your song",
    photoNote: "Send us the photo on WhatsApp or bring it to the shop. Here you see an example.",
    fontLabel: "Lettering", fonts: { corsivo: "Script", stampatello: "Capitals", macchina: "Typewriter" },
    counter: (n: number, max: number) => `${n} of ${max}`,
    cta: "Ask for this engraving",
    note: "Approximate preview: in store you see the proof on the real piece.",
    preview: (what: string, piece: string) => `Preview: ${what} engraved on ${piece}`,
    photoWhat: "a photo", songWhat: (s: string) => `the song “${s}”`,
    message: (what: string, piece: string, font?: string) => `Hello! I'd like to engrave ${what} on ${piece}${font ? `, in ${font.toLowerCase()} lettering` : ""}. Is that possible?`,
    examples: [
      { piece: "piastrina", mode: "frase", text: "Always us", font: "corsivo" },
      { piece: "collana", mode: "frase", text: "Sofia", font: "corsivo" },
      { piece: "bracciale", mode: "frase", text: "I CARRY YOU WITH ME", font: "stampatello" },
      { piece: "fede", mode: "frase", text: "07 · 06 · 2025", font: "macchina" },
      { piece: "piastrina", mode: "canzone", text: "Our song", font: "stampatello" },
      { piece: "collana", mode: "foto", text: "", font: "corsivo" },
    ],
    song: "song",
  },
  collections: {
    eyebrow: "Collections",
    h2a: "What jewellery", h2b: "do we sell?",
    lede: "Six stainless steel collections, almost all of them can be personalised. Tap a collection to see what you can engrave.",
    open: "Explore", tag: "Can be engraved",
    what: "What you'll find", engrave: "What you can engrave", cta: "Ask for models and prices",
    ask: (name: string) => `Hello! I'd like to see the models and prices of the ${name} collection.`,
    priceNote: "Prices depend on the model and the engraving: we'll tell you in store or on WhatsApp.",
    doorCaption: "The full collections are on our social pages",
    doorCount: "6", doorCountLabel: "collections", scrollHint: "Scroll to move along the window",
    items: {
      bracciali: { name: "Bracelets", short: "Bangles with a tag, chains and links.", what: "Bangles with a tag, fine chains and bolder links, for her and for him.", engrave: "A name, a date, coordinates or a phrase on the tag.", alt: "Steel bangle with four enamelled discs among yellow petals" },
      collane: { name: "Necklaces", short: "Medallions, tags and pendants.", what: "Chains with a medallion, a tag or a pendant, to wear alone or layered.", engrave: "A phrase on the back, or a photo on the medallion.", alt: "Rose-gold tone necklace with a wing pendant set with crystals" },
      anelli: { name: "Rings", short: "Bands, twists and small details.", what: "Plain bands, twists and rings with small details, in several sizes.", engrave: "Initials, a date or a word, inside or outside.", alt: "Steel ring with blue stones, reflected in a mirror" },
      uomo: { name: "Men's collections", short: "Chains, links and rings, polished or black.", what: "Chains, link bracelets and rings in polished or black steel.", engrave: "Initials, an important date or coordinates on the tag.", alt: "Steel curb-link ring on a piece of driftwood" },
      fedi: { name: "Engraved wedding bands", short: "Names, wedding date or a phrase.", what: "Steel wedding bands, as a pair for a wedding or an anniversary.", engrave: "Your names, the wedding date or a phrase on the inside.", alt: "Two gold-tone wedding bands on sand and powder" },
      estate: { name: "Spring and summer", short: "The colourful pieces of the season.", what: "Coloured stones, light shapes and the new pieces of the season.", engrave: "It depends on the piece: ask us which ones can be engraved.", alt: "Open banded ring in the sand among seashells" },
    },
  },
  works: {
    eyebrow: "Our work",
    h2a: "What have we", h2b: "engraved lately?",
    lede: "A few pieces made in the shop for our customers, from our Instagram.",
    items: [
      "A family photo engraved on a keyring tag",
      "A child's drawing engraved on a heart pendant",
      "Charms to add to bracelets and necklaces",
      "A keyring with a photo and a message for grandad",
      "A Father's Day keyring in its gift box",
      "A bracelet with sea charms",
    ],
    more: "More work on Instagram",
  },
  reviews: {
    eyebrow: "Reviews",
    h2a: "What do", h2b: "customers say?",
    score: "out of 5 on Google", count: (n: number) => `${n} reviews`,
    source: "Google review, translated from Italian", read: "Read them all on Google", write: "Leave a review",
    prev: "Previous review", next: "Next review",
  },
  statement: "Elegance that lasts. Stainless steel doesn't rust or tarnish, so what you engrave today stays readable.",
  engraving: {
    eyebrow: "Engraving",
    h2a: "How does", h2b: "engraving work?",
    lede: "It's done in the shop, on the spot. If you like, send us the photo or the phrase on WhatsApp first and we'll suggest the right piece.",
    steps: [
      { t: "Choose the piece", d: "In store or from the photos on our social pages. We'll tell you how much room there is for the engraving." },
      { t: "Bring a photo, phrase or song", d: "A photo from your phone, a name, a date, the title of your song." },
      { t: "We engrave it on the spot", d: "You see the proof, you confirm, and the piece is ready to take home." },
    ],
    typesTitle: "What can be engraved",
    types: [
      { t: "Photo", d: "A portrait, your pet, a place that matters." },
      { t: "Phrase", d: "Names, dates, coordinates, a dedication." },
      { t: "Song", d: "The title and the sound wave of your song." },
    ],
    script: "Always",
    cta: "Ask about an engraving", ask: "Hello! I'd like to have a piece engraved. I'll send you the photo/phrase here.",
  },
  faq: {
    eyebrow: "FAQ",
    h2a: "Before you", h2b: "visit the shop",
    aside: "Question not here?", asideText: "Message us on WhatsApp and we'll answer during shop hours.", asideCta: "Ask on WhatsApp",
    ask: "Hello! I have a question about your jewellery.",
    items: [
      { q: "What is the jewellery made of?", a: "Stainless steel. It doesn't rust or tarnish, so it's fine to wear every day." },
      { q: "How long does the engraving take?", a: "We do it on the spot, in the shop. For photos or special engravings we tell you the time before we start." },
      { q: "Can I send the photo or the phrase in advance?", a: "Yes, message us on WhatsApp: we'll look at the photo or phrase and suggest a piece with the right space." },
      { q: "Do you engrave wedding bands too?", a: "Yes. They're usually engraved on the inside: your names, the wedding date or a short phrase." },
      { q: "How much do they cost?", a: "It depends on the model and the engraving. You'll find prices in store, or send us a photo of the piece you like on WhatsApp." },
      { q: "How do I clean steel jewellery?", a: "Warm water, mild soap and a soft cloth. Avoid abrasive products, they scratch the surface." },
    ],
  },
  store: {
    eyebrow: "Store",
    h2a: "Where are we and", h2b: "when are we open?",
    lede: "We're inside Centro Commerciale Meduna, in Pordenone. No appointment needed; for a special engraving, message us first.",
    address: "Address", hours: "Opening hours", bus: "Bus", busText: "City lines 2 and R", contact: "Phone and WhatsApp", social: "Social",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    today: "Today", openUntil: (h: string) => `open until ${h}`, closedNow: "closed now, we reopen at 9:30",
    closed: "Closed on 1 January, 25 April, 1 May, 25 and 26 December.",
    directions: "Get directions", cta: "Message us on WhatsApp", ask: "Hello! I'd like to visit the shop.",
    mapTitle: "Map: Jovi's at Centro Commerciale Meduna, Pordenone", openMap: "Open in Google Maps", mapHint: "Click to move the map",
    photoAlt: "Steel curb-link ring on driftwood, photo by Jovi's",
  },
  footer: {
    links: { collezioni: "Steel collections", incisione: "Personalised engraving", domande: "Frequently asked questions", negozio: "Opening hours and address" },
    rights: "All rights reserved", credit: "Engraved with patience by",
  },
  notFound: { title: "Page not found", h1: "This page isn't engraved anywhere.", p: "It doesn't exist or it has moved. The collections are still where they were.", cta: "See the collections", home: "Back to home" },
};

export const copy: Record<Lang, Copy> = { it, en };
export type { Copy };
export const collIds: CollId[] = ["bracciali", "collane", "anelli", "uomo", "fedi", "estate"];
