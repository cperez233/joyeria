// editorial-ui · Cristian Pérez · cristianperez.me
import {
  AnimatePresence, MotionConfig, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import Lenis from "lenis";
import { Gem, CircleHelp, MapPin, PenLine, Plus } from "lucide-react";
import { collPhotos, copy, foto, langPath, maps, navIds, photos, site, wa, type Copy, type Lang } from "./data";
import { Engraver, Laser } from "./Engraver";
import { Collections } from "./Collections";
import { Reviews, StoreMap, Works } from "./Sections";
import { Button, InfinityMark, LineLink, Logo, Reveal, WaIcon, Words, ease, goTo, lid, smooth, soft, spring } from "./ui";

type Switch = (to: Lang, e?: MouseEvent<HTMLAnchorElement>) => void;
const other = (l: Lang): Lang => (l === "it" ? "en" : "it");

/* ---------------------------------------------------------------- navegación */

type NavId = (typeof navIds)[number];
const isNav = (id: string): id is NavId => (navIds as readonly string[]).includes(id);

/** Sección en pantalla y, para el dock, el botón que le toca: las secciones sin botón propio
 *  (lavori, recensioni) quedan bajo el último botón que tienen encima en la página. */
function useActive() {
  const [active, setActive] = useState("");
  const [owner, setOwner] = useState<NavId | null>(null);
  useEffect(() => {
    const all = [...document.querySelectorAll<HTMLElement>("main section[id]")];
    const ownerOf = (id: string) => {
      let o: NavId | null = null;
      for (const el of all) { if (isNav(el.id)) o = el.id; if (el.id === id) break; }
      return o;
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      setActive(e.target.id);
      setOwner(ownerOf(e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    all.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return { active: isNav(active) ? active : "", owner };
}

function LangLink({ lang, onSwitch, className = "" }: { lang: Lang; onSwitch: Switch; className?: string }) {
  const to = other(lang), c = copy[lang].ui;
  return (
    <a href={langPath(to)} hrefLang={to} lang={to} aria-label={c.langLabel} onClick={(e) => onSwitch(to, e)}
      className={`group relative inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold text-frost ring-1 ring-frost/20 transition-colors hover:ring-frost/60 ${className}`}>
      <span className="text-frost/55">{lang.toUpperCase()}</span>
      <span aria-hidden className="text-gold transition-transform duration-300 group-hover:rotate-180">⇄</span>
      <span>{c.langSwitchShort}</span>
    </a>
  );
}

function Nav({ t, lang, onSwitch }: { t: Copy; lang: Lang; onSwitch: Switch }) {
  const { active, owner } = useActive();
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [dock, setDock] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => { setCompact(v > 40); setDock(v > window.innerHeight * 0.5); });
  const waHello = wa(t.ui.waHello);
  const icons = { collezioni: Gem, incisione: PenLine, domande: CircleHelp, negozio: MapPin } as const;

  /* Dock: el indicador nunca se desmonta (si se desmonta, layoutId no tiene de dónde deslizarse y
     aparece de golpe). Al tocar un botón queda fijado en el destino hasta llegar, así va directo
     en vez de saltar por cada sección intermedia mientras la página se desplaza. */
  const [pinned, setPinned] = useState<NavId | null>(null);
  useEffect(() => { if (pinned && owner === pinned) setPinned(null); }, [owner, pinned]);
  useEffect(() => {
    if (!pinned) return;
    const id = setTimeout(() => setPinned(null), 1800);
    return () => clearTimeout(id);
  }, [pinned]);
  const dockOn = pinned ?? owner;

  return (
    <>
      {/* barra superior: amplia arriba, compacta al bajar */}
      <motion.header initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease, delay: 0.1 }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,height] duration-500 ${compact ? "h-16 bg-graphite/85 shadow-[0_1px_0_rgb(255_255_255/.06)] backdrop-blur-md" : "h-20 bg-transparent"}`}>
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-8">
          <a href={langPath(lang)} onClick={(e) => goTo(e, "inizio")} aria-label={t.ui.home}
            className={`text-frost transition-[opacity,translate] duration-500 ${compact ? "opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}><Logo tone="light" /></a>
          <nav aria-label="Principale" className="hidden items-center gap-1 md:flex">
            {navIds.map((id) => (
              <a key={id} href={`#${id}`} onClick={(e) => goTo(e, id)} aria-current={owner === id ? "true" : undefined}
                className={`relative px-3.5 py-2 text-[15px] font-medium transition-colors ${owner === id ? "text-frost" : "text-frost/65 hover:text-frost"}`}>
                {t.ui.nav[id]}
                {owner === id && <motion.span layoutId="nav-line" transition={spring} className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-gold-soft shadow-[0_0_10px_rgb(220_191_143/.6)]" />}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LangLink lang={lang} onSwitch={onSwitch} />
            <motion.a href={waHello} target="_blank" rel="noopener" data-track="whatsapp_nav" whileTap={{ scale: 0.95 }}
              className="hidden h-10 items-center gap-2 rounded-full bg-gold-soft px-4 text-[15px] font-semibold text-ink transition-colors hover:bg-[#e8cfa4] md:inline-flex">
              <WaIcon className="h-4 w-4" />{t.ui.whatsapp}
            </motion.a>
          </div>
        </div>
      </motion.header>

      {/* celular: dock inferior que aparece al bajar, con el indicador deslizándose */}
      <AnimatePresence>
        {dock && (
          <motion.nav aria-label="Principale" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={spring}
            className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-1 rounded-[26px] bg-[#2a262b]/90 p-1.5 text-frost shadow-[0_18px_40px_-10px_rgb(0_0_0/.7),0_0_0_1px_rgb(255_255_255/.14),inset_0_1px_0_rgb(255_255_255/.12)] backdrop-blur-xl md:hidden">
            {navIds.map((id) => {
              const Icon = icons[id], on = dockOn === id;
              return (
                <a key={id} href={`#${id}`} onClick={(e) => { setPinned(id); goTo(e, id); }} aria-current={owner === id ? "true" : undefined}
                  className="relative flex min-h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[20px] text-[12px] font-semibold max-[379px]:text-[11px] max-[379px]:tracking-[-0.01em]">
                  {on && (
                    <motion.span layoutId="dock" transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.9 }}
                      className="absolute inset-0 rounded-[20px] bg-white/12 shadow-[inset_0_1px_0_rgb(255_255_255/.14),0_6px_16px_-8px_rgb(0_0_0/.6)]">
                      <span aria-hidden className="absolute inset-x-4 bottom-1 h-[2px] rounded-full bg-gold-soft shadow-[0_0_8px_rgb(220_191_143/.7)]" />
                    </motion.span>
                  )}
                  <motion.span animate={on ? { y: [0, -4, 0], scale: [1, 1.12, 1] } : { y: 0, scale: 1 }} transition={{ duration: 0.45, ease }} className="relative">
                    <Icon className={`h-[18px] w-[18px] transition-colors duration-300 ${on ? "text-gold-soft" : "text-frost/70"}`} />
                  </motion.span>
                  <span className={`relative max-w-full truncate transition-colors duration-300 ${on ? "text-frost" : "text-frost/70"}`}>{t.ui.nav[id]}</span>
                </a>
              );
            })}
            <motion.a href={waHello} target="_blank" rel="noopener" data-track="whatsapp_dock"
              whileTap={{ scale: 0.9 }} transition={soft}
              animate={active === "negozio" ? { boxShadow: ["0 0 0 0 rgb(220 191 143 / .55)", "0 0 0 10px rgb(220 191 143 / 0)"] } : { boxShadow: "0 0 0 0 rgb(220 191 143 / 0)" }}
              className="relative flex min-h-[52px] flex-[1.15] flex-col max-[379px]:flex-[0.7] items-center justify-center gap-0.5 overflow-hidden rounded-[20px] bg-gradient-to-b from-gold-soft to-gold text-[12px] font-semibold text-ink">
              <span aria-hidden className="cta-sheen" />
              <motion.span className="relative" animate={active === "negozio" ? { rotate: [0, -14, 12, -8, 0] } : { rotate: 0 }} transition={{ duration: 0.7 }}><WaIcon className="h-[18px] w-[18px]" /></motion.span>
              {/* sotto i 380px solo l'icona: così le quattro voci restano intere */}
              <span className="relative max-[379px]:sr-only">{t.ui.whatsapp}</span>
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------------------------------------------------------- portada */

function Hero({ t }: { t: Copy }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const markY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const markScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const fanY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  // la sezione dopo scorre sopra: il contenuto della vetrina si allontana e si spegne un poco
  const sink = useTransform(scrollYProgress, [0.25, 1], [1, 0.94]);
  const dimOut = useTransform(scrollYProgress, [0.25, 1], [1, 0.35]);
  const h = t.hero, it = t.collections.items;
  const fan = [
    { id: "collane", src: "collana-ala", o: -1 },
    { id: "fedi", src: "fedi", o: 0 },
    { id: "bracciali", src: "bracciale", o: 1 },
  ] as const;
  return (
    <section ref={ref} id="inizio" aria-labelledby="h1" className="grain dark relative overflow-hidden bg-graphite pt-24 text-frost sm:pt-32">
      {/* luce di vetrina: un cono caldo dall'alto, nient'altro */}
      <div aria-hidden className="absolute left-1/2 top-[-18%] h-[80%] w-[110%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(220_191_143/.15),transparent)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />

      <motion.div style={{ scale: sink, opacity: dimOut }} className="relative mx-auto max-w-[1280px] origin-top px-4 text-center sm:px-8">
        <motion.div style={{ y: markY, scale: markScale }} className="relative mx-auto w-[min(66vw,320px)]">
          <InfinityMark draw delay={0.25} stroke={6.2} glint="loop" className="relative h-auto w-full" />
          {/* l'ombra del gioiello sul piano della vetrina */}
          <motion.div aria-hidden initial={{ opacity: 0, scaleX: 0.4 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 1.6, delay: 0.6, ease }}
            className="mx-auto mt-1 h-5 w-[64%] rounded-[50%] bg-black/70 blur-xl" />
        </motion.div>

        {/* il nome, come nel logo: compare da sinistra a destra e la luce lo attraversa */}
        <div aria-hidden className="mt-2 select-none sm:mt-3">
          <motion.p className="wordmark font-brand text-[clamp(2.6rem,7vw,5.2rem)] leading-none tracking-[0.32em] [margin-right:-0.32em]"
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.4 }} animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }} transition={{ duration: 1.3, delay: 0.9, ease: lid }}>
            JOVI'S
          </motion.p>
          <motion.p className="mt-1 font-script text-[clamp(1.6rem,3vw,2.3rem)] leading-none text-gold-soft"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.6, ease }}>{h.slogan}</motion.p>
        </div>

        <h1 id="h1" className="mt-7 sm:mt-9">
          <span className="block text-[clamp(2.2rem,4.4vw,3.9rem)] font-medium leading-[0.94] tracking-[-0.02em]">
            <Words text={h.h1a} delay={1.2} /><br />
            <Words text={h.h1b} delay={1.35} className="text-frost/50" />
          </span>
          <motion.span className="mx-auto mt-4 block max-w-[60ch] font-sans text-[17px] font-semibold leading-snug tracking-normal text-gold-soft sm:text-[18px]"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8, ease }}>{h.h1sub}</motion.span>
        </h1>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.75, duration: 0.8, ease }}>
          <p className="mx-auto mt-4 max-w-[52ch] text-[16px] text-frost/80 sm:text-[17px]">{h.lede}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            <Button href={wa(t.ui.waHello)} track="whatsapp_hero" variant="gold" icon={<WaIcon className="h-5 w-5" />}>{h.cta}</Button>
            <LineLink href="#collezioni" onClick={(e) => goTo(e, "collezioni")} className="text-frost">{h.link}</LineLink>
          </div>
        </motion.div>
      </motion.div>

      {/* tre pezzi veri della vetrina, a ventaglio; salgono più veloci del testo e la sezione dopo li copre */}
      <motion.div style={{ y: fanY }} className="relative mx-auto mt-12 h-[clamp(190px,36vw,380px)] max-w-[980px] sm:mt-14">
        {fan.map(({ id, src, o }) => (
          <motion.figure key={id}
            initial={{ opacity: 0, y: 160, x: `${-o * 60}%`, rotate: 0 }}
            animate={{ opacity: 1, y: o === 0 ? 0 : 36, x: "0%", rotate: o * 7 }}
            transition={{ duration: 1.3, delay: 1.7 + Math.abs(o) * 0.12, ease }}
            whileHover={{ rotate: 0, y: o === 0 ? -14 : 14, transition: soft }}
            className={`absolute top-0 overflow-hidden rounded-[22px] bg-graphite-2 shadow-[0_30px_60px_-20px_rgb(0_0_0/.8)] ring-1 ring-white/10 ${o === 0 ? "left-1/2 z-10 -ml-[23%] w-[46%] sm:-ml-[17%] sm:w-[34%]" : o < 0 ? "left-[3%] w-[38%] sm:left-[6%] sm:w-[28%]" : "right-[3%] w-[38%] sm:right-[6%] sm:w-[28%]"}`}>
            <img src={foto(src)} width={640} height={800} alt={it[id].alt} decoding="async" {...{ fetchpriority: o === 0 ? "high" : "auto" }}
              style={{ objectPosition: collPhotos[id].pos }} className="aspect-[4/5] w-full object-cover" />
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}

/* ---------------------------------------------------------------- frase que se enciende al leer */

function Char({ c, i, n, p }: { c: string; i: number; n: number; p: MotionValue<number> }) {
  const o = useTransform(p, [i / n, (i + 1) / n], [0.18, 1]);
  return <motion.span style={{ opacity: o }}>{c}</motion.span>;
}

function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.55"] });
  const words = text.split(" ");
  const total = text.replace(/ /g, "").length;
  const starts = words.map((_, wi) => words.slice(0, wi).join("").length);
  return (
    <div className="grain bg-pearl pb-24 pt-2 sm:pb-40">
      <p ref={ref} className="mx-auto max-w-[1100px] px-4 font-display text-[clamp(1.9rem,4.4vw,3.7rem)] font-light leading-[1.1] tracking-[-0.02em] sm:px-8">
        {reduce ? text : words.map((w, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {[...w].map((c, ci) => <Char key={ci} c={c} i={starts[wi] + ci} n={total} p={scrollYProgress} />)}
            {wi < words.length - 1 && " "}
          </span>
        ))}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- incisión: cómo funciona */

/** Il numero del passo si accende quando il punto del laser ci arriva. */
function StepDot({ n, at, p }: { n: number; at: number; p: MotionValue<number> }) {
  const lit = useTransform(p, [at - 0.04, at + 0.02], [0, 1]);
  const bg = useTransform(lit, [0, 1], ["rgb(17 15 18)", "rgb(220 191 143)"]);
  const fg = useTransform(lit, [0, 1], ["rgb(220 191 143)", "rgb(22 20 23)"]);
  const glow = useTransform(lit, (v) => `0 0 ${v * 18}px ${v * 4}px rgb(220 191 143 / ${v * 0.45})`);
  return (
    <motion.span aria-hidden initial={{ scale: 0.4 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-80px" }} transition={soft}
      style={{ backgroundColor: bg, color: fg, boxShadow: glow }}
      className="absolute left-0 top-0.5 grid h-8 w-8 place-items-center rounded-full text-[14px] font-semibold ring-1 ring-gold-soft/40">{n}</motion.span>
  );
}

function Steps({ steps }: { steps: Copy["engraving"]["steps"] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const clip = useTransform(p, (v) => `inset(0 0 ${(1 - v) * 100}% 0)`);
  const top = useTransform(p, (v) => `${v * 100}%`);
  return (
    <div className="relative">
      <span aria-hidden className="absolute bottom-4 left-[15px] top-4 w-px bg-frost/12" />
      <motion.span aria-hidden style={{ clipPath: clip }} className="absolute bottom-4 left-[14px] top-4 w-[3px] [background:repeating-linear-gradient(180deg,var(--color-gold)_0_8px,transparent_8px_14px)]" />
      {/* el punto del láser recorre el camino */}
      <motion.span aria-hidden style={{ top }} className="absolute left-[12px] -mt-[4px] h-[8px] w-[8px] rounded-full bg-white shadow-[0_0_6px_2px_#fff3d6,0_0_18px_6px_rgb(217_189_140/.7)]" />
      <ol ref={ref} className="space-y-10">
        {steps.map((s, i) => (
          <motion.li key={s.t} className="relative pl-14" initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, ease }}>
            <StepDot n={i + 1} at={steps.length > 1 ? i / (steps.length - 1) : 0} p={p} />
            <h3 className="text-[30px] leading-tight text-frost">{s.t}</h3>
            <p className="mt-1.5 max-w-[46ch] text-frost/80">{s.d}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function Engraving({ t, engraver }: { t: Copy["engraving"]; engraver: Copy["engraver"] }) {
  return (
    <section id="incisione" aria-labelledby="h-inc" className="grain dark relative z-10 -mt-10 rounded-t-[36px] bg-graphite pb-24 pt-20 text-frost shadow-[var(--shadow-sheet)] sm:-mt-14 sm:rounded-t-[56px] sm:pb-32 sm:pt-28">
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-[60%] w-[60%] bg-[radial-gradient(closest-side,rgb(220_191_143/.08),transparent)]" />
      <div className="relative mx-auto grid max-w-[1280px] gap-14 px-4 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Reveal><p className="eyebrow">{t.eyebrow}</p></Reveal>
          <h2 id="h-inc" className="mt-4 text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.98]">
            <Words text={t.h2a} inView /> <Words text={t.h2b} inView delay={0.12} className="text-frost/50" />
          </h2>
          <Reveal delay={0.1} as="p" className="mt-6 max-w-[46ch] text-[17px] text-frost/85">{t.lede}</Reveal>
          <Reveal delay={0.15} className="mt-12"><Steps steps={t.steps} /></Reveal>
          <Reveal delay={0.1} className="mt-12">
            <Button href={wa(t.ask)} track="whatsapp_incisione_sezione" variant="gold" icon={<WaIcon />}>{t.cta}</Button>
          </Reveal>
        </div>
        {/* el taller queda fijo al lado de los pasos mientras se leen */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal><Engraver key={engraver.title} t={engraver} /></Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- preguntas */

function FaqItem({ q, a, open, toggle, i }: { q: string; a: string; open: boolean; toggle: () => void; i: number }) {
  return (
    <div className="relative border-b border-ink/10">
      <motion.span aria-hidden initial={false} animate={{ scaleY: open ? 1 : 0 }} transition={{ duration: 0.4, ease }} className="absolute -left-4 bottom-5 top-5 w-[2px] origin-top bg-gold sm:-left-6" />
      <h3 className="font-sans">
        <button type="button" onClick={toggle} aria-expanded={open} aria-controls={`faq-${i}`} id={`faq-q-${i}`} className="group flex min-h-[64px] w-full items-center justify-between gap-5 py-5 text-left">
          <span className={`font-display text-[23px] leading-tight transition-colors sm:text-[26px] ${open ? "text-gold-ink" : "group-hover:text-gold-ink"}`}>{q}</span>
          <motion.span animate={{ rotate: open ? 135 : 0 }} transition={soft}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 transition-colors ${open ? "bg-ink text-frost ring-ink" : "ring-ink/20 group-hover:ring-ink/50"}`}>
            <Plus className="h-4 w-4" />
          </motion.span>
        </button>
      </h3>
      <motion.div id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`} initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
        <p className="max-w-[60ch] pb-6 text-ink-2">{a}</p>
      </motion.div>
    </div>
  );
}

function Faq({ t }: { t: Copy["faq"] }) {
  const [open, setOpen] = useState(0);
  const aside = (cls: string) => (
    <div className={`rounded-[24px] bg-graphite p-6 text-frost shadow-[var(--shadow-raised)] ${cls}`}>
      <p className="font-display text-[26px] leading-tight">{t.aside}</p>
      <p className="mt-1 text-frost/80">{t.asideText}</p>
      <Button href={wa(t.ask)} track="whatsapp_faq" variant="gold" icon={<WaIcon />} className="mt-5">{t.asideCta}</Button>
    </div>
  );
  return (
    <section id="domande" aria-labelledby="h-faq" className="grain relative z-10 -mt-10 rounded-t-[36px] bg-pearl py-20 shadow-[var(--shadow-sheet)] sm:-mt-14 sm:rounded-t-[56px] sm:py-32">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-4 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal><p className="eyebrow">{t.eyebrow}</p></Reveal>
          <h2 id="h-faq" className="mt-4 text-[clamp(2.4rem,5vw,4.2rem)] font-light leading-[1]">
            <Words text={t.h2a} inView /> <Words text={t.h2b} inView delay={0.12} className="text-mist" />
          </h2>
          <Reveal delay={0.15} className="mt-10 hidden lg:block">{aside("")}</Reveal>
        </div>
        <Reveal className="pl-4 sm:pl-6">
          {t.items.map((f, i) => <FaqItem key={f.q} {...f} i={i} open={open === i} toggle={() => setOpen(open === i ? -1 : i)} />)}
          {aside("mt-10 lg:hidden")}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- negozio */

function useRomeNow() {
  const [now, setNow] = useState<{ day: number; min: number } | null>(null);
  useEffect(() => {
    const read = () => {
      const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
      const get = (k: string) => parts.find((p) => p.type === k)?.value ?? "";
      const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday"));
      setNow({ day, min: Number(get("hour")) * 60 + Number(get("minute")) });
    };
    read();
    const id = setInterval(read, 60000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function Store({ t }: { t: Copy["store"] }) {
  const now = useRomeNow();
  const toMin = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3));
  const range = (d: number) => (d === 6 ? site.hours.sunday : site.hours.weekdays);
  const fmt = (h: string) => h.replace(/^0/, "");
  const status = now && (() => {
    const [o, c] = range(now.day);
    return now.min >= toMin(o) && now.min < toMin(c) ? t.openUntil(fmt(c)) : t.closedNow;
  })();
  // indirizzo completo sulla mappa, social nel footer: qui solo ciò che non si ripete
  const facts = [
    { k: t.bus, v: t.busText },
    { k: t.contact, v: <a href={`tel:${site.phone}`} data-track="tel" className="underline decoration-gold underline-offset-4">{site.phoneLabel}</a> },
  ];
  return (
    <section id="negozio" aria-labelledby="h-neg" className="grain dark relative z-10 -mt-10 rounded-t-[36px] bg-graphite pb-24 pt-20 text-frost shadow-[var(--shadow-sheet)] sm:-mt-14 sm:rounded-t-[56px] sm:pb-32 sm:pt-28">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-4 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div className="lg:py-6">
          <Reveal><p className="eyebrow">{t.eyebrow}</p></Reveal>
          <h2 id="h-neg" className="mt-4 text-[clamp(2.4rem,5vw,4.2rem)] font-light leading-[1]">
            <Words text={t.h2a} inView /> <Words text={t.h2b} inView delay={0.12} className="text-frost/55" />
          </h2>
          <Reveal delay={0.1} as="p" className="mt-6 max-w-[46ch] text-[18px] text-frost/85">{t.lede}</Reveal>
          <motion.dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6" initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
            {facts.map((f) => (
              <motion.div key={f.k} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="border-t border-frost/12 pt-3">
                <dt className="text-[14px] font-semibold text-gold-soft">{f.k}</dt>
                <dd className="mt-1 text-[16px] leading-snug">{f.v}</dd>
              </motion.div>
            ))}
          </motion.dl>
          <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Button href={wa(t.ask)} track="whatsapp_negozio" variant="gold" icon={<WaIcon />}>{t.cta}</Button>
            <LineLink href={maps} track="maps" className="text-frost">{t.directions}</LineLink>
          </Reveal>
        </div>
        <StoreMap t={t} />
      </div>

      {/* orari: la tarjeta flota sobre la foto y marca el día de hoy */}
      <div className="mx-auto mt-16 grid max-w-[1280px] items-center px-4 sm:mt-24 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div className="overflow-hidden rounded-[28px] shadow-[var(--shadow-float)]"
          initial={{ clipPath: "inset(0 0 100% 0 round 28px)" }} whileInView={{ clipPath: "inset(0 0 0% 0 round 28px)" }} viewport={{ once: true }} transition={{ duration: 1.2, ease: lid }}>
          <motion.img src={foto(photos.store, 1000)} width={1000} height={1250} loading="lazy" decoding="async" alt={t.photoAlt}
            initial={{ scale: 1.15 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease }}
            style={{ objectPosition: "50% 45%" }} className="aspect-[9/7] w-full object-cover lg:aspect-[16/11]" />
        </motion.div>
        <motion.div className="relative z-10 -mt-24 mr-3 rounded-[24px] bg-pearl p-6 text-ink shadow-[var(--shadow-float)] sm:mr-0 sm:w-[80%] lg:-ml-24 lg:mt-0 lg:w-auto"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.8, ease }}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="text-[14px] font-semibold text-gold-ink">{t.hours}</p>
            <AnimatePresence>{status && <motion.p initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-[14px] font-semibold">{t.today}: {status}</motion.p>}</AnimatePresence>
          </div>
          <motion.ul className="mt-3" initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } } }}>
            {t.days.map((d, i) => {
              const [o, c] = range(i), on = now?.day === i;
              return (
                <motion.li key={d} variants={{ hidden: { opacity: 0, x: 10 }, show: { opacity: 1, x: 0 } }}
                  className={`relative flex justify-between rounded-lg px-2 py-1.5 text-[15px] tabular-nums ${on ? "font-semibold" : "text-ink-2"}`}>
                  {on && <motion.span layoutId="today" className="absolute inset-0 rounded-lg bg-steel" transition={spring} />}
                  <span className="relative">{d}</span><span className="relative">{fmt(o)} – {fmt(c)}</span>
                </motion.li>
              );
            })}
          </motion.ul>
          <p className="mt-3 text-[13px] text-mist">{t.closed}</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- pie */

const credit = "Cristian Pérez · https://cristianperez.me";
const mark = "⁠" + [...new TextEncoder().encode(credit)].map((b) => b.toString(2).padStart(8, "0")).join("").replace(/0/g, "​").replace(/1/g, "‌") + "⁠";

function Footer({ t, lang, onSwitch }: { t: Copy; lang: Lang; onSwitch: Switch }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);
  const to = other(lang);
  // il nome si incide con lo stesso laser del laboratorio quando arriva in vista
  const nameRef = useRef<HTMLDivElement>(null);
  const lit = useInView(nameRef, { once: true, amount: 0.6 });
  return (
    <footer ref={ref} className="relative overflow-hidden bg-[#0f1113] pb-24 pt-16 text-frost md:pb-0">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <nav aria-label="Footer" className="grid gap-x-10 text-[16px] sm:grid-cols-2">
            {navIds.map((id) => <a key={id} href={`#${id}`} onClick={(e) => goTo(e, id)} className="min-h-[44px] content-center hover:text-gold-soft">{t.footer.links[id]}</a>)}
          </nav>
          <div className="grid gap-x-10 text-[16px] sm:grid-cols-2">
            <a href={wa(t.ui.waHello)} target="_blank" rel="noopener" data-track="whatsapp_footer" className="min-h-[44px] content-center hover:text-gold-soft">WhatsApp {site.phoneLabel}</a>
            <a href={site.instagram} target="_blank" rel="noopener" className="min-h-[44px] content-center hover:text-gold-soft">Instagram {site.instagramLabel}</a>
            <a href={site.facebook} target="_blank" rel="noopener" className="min-h-[44px] content-center hover:text-gold-soft">Facebook</a>
            <a href={langPath(to)} hrefLang={to} lang={to} onClick={(e) => onSwitch(to, e)} className="min-h-[44px] content-center hover:text-gold-soft">{t.ui.langSwitch}</a>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-1 border-t border-frost/10 pt-6 text-[14px] text-frost/60 sm:flex-row sm:justify-between">
          <p>© 2026 {site.name} · {site.mall}, {site.city} · {t.footer.rights}</p>
          <p>{t.footer.credit} <a href="https://cristianperez.me" target="_blank" rel="noopener" className="underline decoration-gold/60 underline-offset-4 hover:text-frost">Cristian Pérez</a>{mark}</p>
        </div>
      </div>
      <motion.div ref={nameRef} aria-hidden style={{ y }} className="mt-8 select-none text-center">
        <Laser k={lit ? "on" : "off"} duration={2.4} active={lit} beam="h-[16vw]">
          <span className="sheen block whitespace-nowrap font-brand text-[21vw] leading-[0.78] tracking-[0.12em]">JOVI'S</span>
        </Laser>
      </motion.div>
    </footer>
  );
}

/* ---------------------------------------------------------------- cortinilla al cambiar de idioma */

function Curtain({ phase, to }: { phase: "idle" | "closing" | "opening"; to: Lang }) {
  return (
    <AnimatePresence>
      {phase !== "idle" && (
        <motion.div key="curtain" aria-hidden className="pointer-events-none fixed inset-0 z-[90] grid place-items-center bg-graphite text-frost"
          initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: phase === "closing" ? "inset(0% 0 0 0)" : "inset(0 0 100% 0)" }}
          exit={{ opacity: 0 }} transition={{ duration: phase === "closing" ? 0.55 : 0.7, ease: lid }}>
          <div className="flex flex-col items-center gap-5">
            <InfinityMark draw stroke={4.5} glint="loop" speed={2.2} className="h-20 w-36" />
            <p className="font-brand text-[15px] tracking-[0.4em]">{to === "it" ? "ITALIANO" : "ENGLISH"}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------------- página */

export default function App({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [phase, setPhase] = useState<"idle" | "closing" | "opening">("idle");
  const [target, setTarget] = useState<Lang>(initialLang);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const t = copy[lang];

  const switchLang = useCallback<Switch>((to, e) => {
    e?.preventDefault();
    timers.current.forEach(clearTimeout);
    setTarget(to); setPhase("closing");
    timers.current = [
      // se cambia mientras la cortina tapa todo; se queda en la misma altura de la página
      setTimeout(() => {
        const y = window.scrollY, c = copy[to];
        if (e) history.pushState({ lang: to }, "", langPath(to));
        setLang(to);
        document.documentElement.lang = to;
        document.title = c.meta.title;
        document.querySelector('meta[name="description"]')?.setAttribute("content", c.meta.description);
        document.querySelector('link[rel="canonical"]')?.setAttribute("href", site.url + langPath(to));
        requestAnimationFrame(() => (smooth.lenis ? smooth.lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y)));
        setPhase("opening");
      }, 550),
      setTimeout(() => setPhase("idle"), 550 + 750),
    ];
  }, []);

  useEffect(() => {
    (window as unknown as { __ready: boolean }).__ready = true;
    history.scrollRestoration = "manual";
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduce ? null : new Lenis({ autoRaf: true, lerp: 0.1, anchors: false });
    smooth.lenis = lenis;
    const onPop = () => switchLang(location.pathname.startsWith("/en") ? "en" : "it");
    addEventListener("popstate", onPop);
    const track = (ev: globalThis.MouseEvent) => {
      const a = (ev.target as HTMLElement).closest<HTMLElement>("[data-track]");
      if (!a) return;
      const w = window as unknown as { dataLayer?: unknown[]; plausible?: (n: string, o: unknown) => void; va?: (t: string, o: unknown) => void };
      const props = { dove: a.dataset.track };
      w.dataLayer?.push({ event: "contatto_click", ...props });
      w.plausible?.("contatto_click", { props });
      w.va?.("event", { name: "contatto_click", data: props });
    };
    document.addEventListener("click", track);
    console.info("%cJovi's%c · inciso con pazienza da Cristian Pérez · https://cristianperez.me", "font-weight:700;color:#b9935a", "");
    const ts = timers.current;
    return () => { removeEventListener("popstate", onPop); document.removeEventListener("click", track); lenis?.destroy(); smooth.lenis = null; ts.forEach(clearTimeout); };
  }, [switchLang]);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#collezioni" className="fixed left-4 top-[-80px] z-[80] rounded-full bg-ink px-4 py-2 text-frost focus:top-4">{t.ui.skip}</a>
      <Nav t={t} lang={lang} onSwitch={switchLang} />
      <main>
        <Hero t={t} />
        <Collections t={t.collections} closeLabel={t.ui.close} />
        <Statement text={t.statement} />
        <Works t={t.works} />
        <Engraving t={t.engraving} engraver={t.engraver} />
        <Reviews t={t.reviews} lang={lang} />
        <Faq t={t.faq} />
        <Store t={t.store} />
      </main>
      <Footer t={t} lang={lang} onSwitch={switchLang} />
      <Curtain phase={phase} to={target} />
    </MotionConfig>
  );
}
