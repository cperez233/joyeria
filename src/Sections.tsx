// editorial-ui · Cristian Pérez · cristianperez.me
// Lavori veri (muro con colonne a velocità diverse), recensioni Google e mappa in bianco e nero.
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import { foto, reviews, site, works, type Copy, type Lang } from "./data";
import { useDesktop } from "./Collections";
import { MapPin } from "lucide-react";
import { LineLink, Reveal, TouchSheen, Words, ease } from "./ui";

/* ---------------------------------------------------------------- lavori */

type Work = (typeof works)[number] & { caption: string };

function Tile({ w, i, row }: { w: Work; i: number; row?: RefObject<HTMLDivElement> }) {
  // celular: come le collezioni, la foto al centro a piena misura e le vicine più piccole, inclinate e spente
  const ref = useRef<HTMLElement>(null);
  const { scrollXProgress } = useScroll({ container: row, target: ref, axis: "x", offset: ["start end", "end start"] });
  const scale = useTransform(scrollXProgress, [0.1, 0.5, 0.9], [0.88, 1, 0.88]);
  const rotate = useTransform(scrollXProgress, [0.1, 0.5, 0.9], [-3, 0, 3]);
  const dim = useTransform(scrollXProgress, [0.1, 0.5, 0.9], [0.5, 1, 0.5]);
  return (
    <motion.figure ref={ref} style={row ? { scale, rotate, opacity: dim } : undefined} className={`group ${row ? "w-[74%] shrink-0 snap-center" : ""}`}>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease }}>
      <motion.div className="relative overflow-hidden rounded-[22px] bg-steel shadow-[var(--shadow-raised)] transition-shadow duration-500 [@media(hover:hover)]:group-hover:shadow-[var(--shadow-float)]"
        initial={{ clipPath: "inset(18% 0% 0% 0% round 22px)" }} whileInView={{ clipPath: "inset(0% 0% 0% 0% round 22px)" }}
        viewport={{ once: true, margin: "-40px" }} transition={{ duration: 1.1, ease }}>
        <img src={`/foto/${w.src}-560.webp`} srcSet={`/foto/${w.src}-560.webp 560w, /foto/${w.src}-900.webp 900w`} sizes="(min-width:1024px) 400px, 50vw"
          width={w.w} height={w.h} alt={w.caption} loading="lazy" decoding="async"
          className={`block w-full transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] [@media(hover:hover)]:group-hover:scale-[1.05] ${row ? "aspect-[4/5] object-cover" : "h-auto"}`} />
        <TouchSheen className="via-white/30" />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-[60%] w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-[left,opacity] duration-[1.1s] ease-[var(--ease-out-soft)] [@media(hover:hover)]:group-hover:left-[120%] [@media(hover:hover)]:group-hover:opacity-100" />
      </motion.div>
      <figcaption className="mt-3 px-1 text-[15px] leading-snug text-ink-2">{w.caption}</figcaption>
      </motion.div>
    </motion.figure>
  );
}

function Column({ items, y, className = "" }: { items: Work[]; y: MotionValue<number>; className?: string }) {
  return (
    <motion.div style={{ y }} className={`flex flex-col gap-6 sm:gap-8 ${className}`}>
      {items.map((w, i) => <Tile key={w.src} w={w} i={i} />)}
    </motion.div>
  );
}

export function Works({ t }: { t: Copy["works"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useDesktop();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const k = reduce ? 0 : desktop ? 1 : 0.5;
  // tre colonne che scorrono a velocità diverse: il muro sembra avere profondità
  const y1 = useTransform(scrollYProgress, [0, 1], [60 * k, -80 * k]);
  const y2 = useTransform(scrollYProgress, [0, 1], [140 * k, -140 * k]);
  const y3 = useTransform(scrollYProgress, [0, 1], [30 * k, -40 * k]);
  const all: Work[] = works.map((w, i) => ({ ...w, caption: t.items[i] }));
  const cols = desktop ? [[all[0], all[2]], [all[1], all[3]], [all[4], all[5]]] : [[all[0], all[2], all[4]], [all[1], all[3], all[5]]];

  return (
    <section id="lavori" aria-labelledby="h-lav" className="grain relative bg-pearl pb-24 pt-6 sm:pb-36">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Reveal><p className="eyebrow">{t.eyebrow}</p></Reveal>
            <h2 id="h-lav" className="mt-4 text-[clamp(2.6rem,5.4vw,4.8rem)] leading-[0.96]">
              <Words text={t.h2a} inView /><br /><Words text={t.h2b} inView delay={0.12} className="text-mist" />
            </h2>
          </div>
          <Reveal delay={0.1} className="max-w-[38ch] lg:pb-2">
            <p className="text-ink-2">{t.lede}</p>
            <LineLink href={site.instagram} track="instagram_lavori" className="mt-2">{t.more}</LineLink>
          </Reveal>
        </div>
        {desktop ? (
          <div ref={ref} className="mt-14 grid grid-cols-3 gap-8">
            {cols.map((c, i) => <Column key={i} items={c} y={[y1, y2, y3][i]} className={i === 1 ? "pt-16" : ""} />)}
          </div>
        ) : (
          // celular: una fila deslizable, così il muro non allunga la pagina
          <div ref={ref} data-lenis-prevent-touch className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-[13%] gap-2 overflow-x-auto px-[13%] pb-4 [scrollbar-width:none] sm:-mx-8">
            {all.map((w, i) => <Tile key={w.src} w={w} i={i} row={ref} />)}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- recensioni */

function Stars({ value, play }: { value: number; play: boolean }) {
  return (
    <span className="relative inline-flex gap-1.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative h-7 w-7 sm:h-8 sm:w-8">
            <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full text-ink/12"><path fill="currentColor" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" /></svg>
            <motion.span className="absolute inset-0" initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={play ? { clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` } : undefined} transition={{ duration: 0.5, delay: 0.3 + i * 0.14, ease }}>
              <svg viewBox="0 0 24 24" className="h-full w-full"><defs><linearGradient id={`st${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e7cb98" /><stop offset="1" stopColor="#a97c45" /></linearGradient></defs>
                <path fill={`url(#st${i})`} d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" /></svg>
            </motion.span>
          </span>
        );
      })}
      {/* un riflesso passa sulle stelle quando sono piene */}
      <span className="star-sheen pointer-events-none absolute inset-0 overflow-hidden"><span /></span>
    </span>
  );
}

export function Reviews({ t, lang }: { t: Copy["reviews"]; lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [[i, dir], setI] = useState<[number, number]>([0, 1]);
  const [auto, setAuto] = useState(true);
  const resume = useRef<ReturnType<typeof setTimeout>>();
  const n = reviews.length;
  const go = (to: number, user = false) => {
    setI([((to % n) + n) % n, to > i ? 1 : -1]);
    if (user) { setAuto(false); clearTimeout(resume.current); resume.current = setTimeout(() => setAuto(true), 12000); }
  };
  useEffect(() => {
    if (!auto || !inView || reduce) return;
    const id = setTimeout(() => go(i + 1), 7000);
    return () => clearTimeout(id);
  }, [auto, inView, reduce, i]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => clearTimeout(resume.current), []);
  const r = reviews[i];
  const score = site.rating.value.toLocaleString(lang === "it" ? "it-IT" : "en-GB", { minimumFractionDigits: 1 });

  return (
    <section id="recensioni" aria-labelledby="h-rec" className="grain relative z-10 -mt-10 rounded-t-[36px] bg-pearl pb-24 pt-20 shadow-[var(--shadow-sheet)] sm:-mt-14 sm:rounded-t-[56px] sm:pb-32 sm:pt-28">
      <div ref={ref} className="mx-auto grid max-w-[1280px] gap-12 px-4 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <div>
          <Reveal><p className="eyebrow">{t.eyebrow}</p></Reveal>
          <h2 id="h-rec" className="mt-4 text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.98]">
            <Words text={t.h2a} inView /> <Words text={t.h2b} inView delay={0.12} className="text-mist" />
          </h2>
          <div className="mt-10 flex items-end gap-5">
            <motion.span className="font-display text-[clamp(5.5rem,11vw,8.5rem)] font-medium leading-[.78] tracking-[-0.03em]"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease }}>{score}</motion.span>
            <span className="pb-1">
              <Stars value={site.rating.value} play={inView || !!reduce} />
              <span className="mt-2 block text-[15px] font-semibold text-ink-2">{t.score} · {t.count(site.rating.count)}</span>
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-7">
            <LineLink href={site.googleMaps} track="google_recensioni">{t.read}</LineLink>
            <LineLink href={site.googleMaps} track="google_scrivi_recensione" className="text-gold-ink">{t.write}</LineLink>
          </div>
        </div>

        <div className="relative lg:pt-6" role="region" aria-roledescription="carousel" aria-label={t.eyebrow}>
          <span aria-hidden className="absolute -top-6 left-0 select-none font-display text-[150px] leading-none text-gold/30 sm:-top-10 sm:text-[200px]">“</span>
          <div className="relative grid min-h-[320px] pt-12 sm:min-h-[300px] sm:pt-14">
            <AnimatePresence initial={false} custom={dir}>
              <motion.figure key={i} custom={dir} className="col-start-1 row-start-1 touch-pan-y"
                variants={{ enter: (d: number) => ({ opacity: 0, x: d * 60 }), center: { opacity: 1, x: 0 }, exit: (d: number) => ({ opacity: 0, x: d * -60 }) }}
                initial="enter" animate="center" exit="exit" transition={{ duration: 0.55, ease }}
                drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
                onDragEnd={(_, info) => (info.offset.x < -60 ? go(i + 1, true) : info.offset.x > 60 && go(i - 1, true))}>
                <blockquote className="font-display text-[clamp(1.75rem,3vw,2.6rem)] font-medium leading-[1.18] tracking-[-0.01em]">
                  {lang === "it" ? r.it : r.en}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 text-[15px]">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-graphite font-brand text-[15px] text-gold-soft">{r.author[0]}</span>
                  <span><span className="block font-semibold text-ink">{r.author}</span><span className="block text-mist">{t.source}</span></span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-2" aria-hidden>
              {reviews.map((_, d) => (
                <span key={d} className="relative h-1 overflow-hidden rounded-full bg-ink/12 transition-[width] duration-500" style={{ width: d === i ? 40 : 10 }}>
                  {d === i && auto && inView && !reduce && <motion.span key={`${i}-${auto}`} className="absolute inset-y-0 left-0 bg-gold" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 7, ease: "linear" }} />}
                </span>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              {[[-1, t.prev, "←"], [1, t.next, "→"]].map(([d, label, a]) => (
                <motion.button key={String(d)} type="button" aria-label={String(label)} onClick={() => go(i + Number(d), true)} whileTap={{ scale: 0.92 }}
                  className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-ink/20 transition-colors hover:bg-ink hover:text-frost">{a}</motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- mappa */

const MAP_KEY = (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_GOOGLE_MAPS_KEY;
// Mappa notturna: nero, grigi e un filo di bronzo, come la pagina.
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#151316" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8d8780" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#151316" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a272b" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#353136" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4a3f33" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0c0b0d" }] },
  { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: "#1c1a1d" }] },
];
const pin = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="44" height="56" viewBox="0 0 44 56"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0d9ab"/><stop offset="1" stop-color="#a97c45"/></linearGradient></defs><path d="M22 55C22 55 42 33 42 21A20 20 0 0 0 2 21C2 33 22 55 22 55Z" fill="url(#g)"/><circle cx="22" cy="21" r="12" fill="#110f12"/><path d="M22 21c-2-2.6-4-3.4-5.8-3.4-2 0-3.2 1.6-3.2 3.4s1.2 3.4 3.2 3.4c1.8 0 3.8-.8 5.8-3.4 2-2.6 4-3.4 5.8-3.4 2 0 3.2 1.6 3.2 3.4s-1.2 3.4-3.2 3.4c-1.8 0-3.8-.8-5.8-3.4Z" fill="none" stroke="#dcbf8f" stroke-width="1.6"/></svg>')}`;

type GMaps = { maps: { Map: new (el: HTMLElement, o: object) => unknown; Marker: new (o: object) => unknown; Size: new (w: number, h: number) => unknown; Point: new (x: number, y: number) => unknown } };

/** Puntero fino (mouse/trackpad). En pantallas táctiles el mapa no se maneja dentro de la página:
 *  un iframe o un mapa "cooperative" en un celular pelea con el scroll y no se deja mover bien. */
function useFinePointer() {
  const [fine, setFine] = useState(true);
  useEffect(() => {
    const mq = matchMedia("(hover: hover) and (pointer: fine)");
    const on = () => setFine(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return fine;
}

export function StoreMap({ t }: { t: Copy["store"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "300px 0px" });
  const fine = useFinePointer();
  const [active, setActive] = useState(false); // la mappa non ruba lo scroll finché non la tocchi

  useEffect(() => {
    if (!inView || !MAP_KEY || !canvas.current) return;
    const w = window as unknown as { google?: GMaps; __jovisMap?: () => void };
    const draw = () => {
      const g = w.google!;
      const center = { lat: site.geo.lat, lng: site.geo.lng };
      const map = new g.maps.Map(canvas.current!, { center, zoom: 16, styles: mapStyle, disableDefaultUI: true, zoomControl: fine, gestureHandling: fine ? "cooperative" : "none", backgroundColor: "#151316" });
      new g.maps.Marker({ position: center, map, title: site.name, icon: { url: pin, scaledSize: new g.maps.Size(44, 56), anchor: new g.maps.Point(22, 55) } });
    };
    if (w.google?.maps) { draw(); return; }
    w.__jovisMap = draw;
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&callback=__jovisMap&loading=async`;
    s.async = true;
    document.head.appendChild(s);
  }, [inView, fine]);

  return (
    <Reveal className="mt-16 sm:mt-20">
      <div ref={ref} className="relative overflow-hidden rounded-[28px] bg-[#151316] shadow-[var(--shadow-float)] ring-1 ring-white/10">
        <div className="relative aspect-[5/4] sm:aspect-[21/9]">
          {MAP_KEY ? (
            <div ref={canvas} className={`absolute inset-0 ${fine ? "" : "pointer-events-none"}`} role="region" aria-label={t.mapTitle} />
          ) : inView && (
            // Senza chiave API: la mappa incorporata di Google, portata al bianco e nero della pagina
            <iframe title={t.mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={fine ? undefined : -1}
              src={`https://maps.google.com/maps?q=${encodeURIComponent("Jovi's_gioielleria e Incisioni Pordenone")}&ll=${site.geo.lat},${site.geo.lng}&z=16&hl=it&output=embed`}
              className={`absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(.92)_contrast(1.08)_brightness(.95)] ${fine ? "" : "pointer-events-none"}`} />
          )}
          {fine ? (!MAP_KEY && !active && (
            <button type="button" onClick={() => setActive(true)} aria-label={t.openMap}
              className="group absolute inset-0 z-10 cursor-pointer bg-transparent" />
          )) : (
            // al tocco: la app de mapas del teléfono, donde sí se mueve con un dedo
            <a href={site.googleMaps} target="_blank" rel="noopener" data-track="maps_mappa" aria-label={t.openMap}
              className="absolute inset-0 z-10 flex items-start justify-end p-3">
              <motion.span initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5, ease }}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-graphite/85 px-4 text-[14px] font-semibold text-frost shadow-[0_8px_20px_-8px_rgb(0_0_0/.8)] ring-1 ring-white/15 backdrop-blur-md">
                <MapPin className="h-4 w-4 text-gold-soft" />{t.openMap}
              </motion.span>
            </a>
          )}
          {/* bordo sfumato: la mappa si scioglie nel nero della sezione */}
          <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_36px_10px_#110f12] sm:shadow-[inset_0_0_80px_30px_#110f12]" />
        </div>
        {/* biglietto da vetrina: sotto la mappa sul telefono (non la copre), sopra la mappa da sm in su */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3, ease }}
          className="relative z-20 m-3 -mt-6 rounded-[22px] bg-pearl p-5 text-ink shadow-[var(--shadow-float)] sm:absolute sm:bottom-6 sm:left-6 sm:m-0 sm:w-[360px]">
          <p className="font-brand text-[18px] tracking-[0.2em]">JOVI'S</p>
          <p className="mt-1 text-[15px] leading-snug text-ink-2">{site.mall}<br />{site.street}, {site.postal} {site.city}</p>
          <LineLink href={site.googleMaps} track="maps_scheda" className="mt-1 text-[15px]">{t.openMap}</LineLink>
        </motion.div>
      </div>
    </Reveal>
  );
}
