// editorial-ui · Cristian Pérez · cristianperez.me
import { AnimatePresence, animate, motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { collIds, collPhotos, foto, site, wa, type CollId, type Copy } from "./data";
import { Button, InfinityMark, Rail, Reveal, TouchSheen, WaIcon, Words, ease, lid, smooth } from "./ui";

/* Vitrina: en escritorio la fila avanza en horizontal mientras bajas (sección fija); en el celular es una fila deslizable. */
export function useDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(min-width: 1024px)");
    const on = () => setD(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return d;
}

function Card({ id, n, t, onOpen, progress, row, desktop }:
  { id: CollId; n: number; t: Copy["collections"]; onOpen: (id: CollId, el: HTMLElement) => void; progress: MotionValue<number>; row: RefObject<HTMLUListElement>; desktop: boolean }) {
  const it = t.items[id], ph = collPhotos[id];
  const ref = useRef<HTMLLIElement>(null);
  // escritorio: la foto se desliza dentro del marco más despacio que la fila (profundidad)
  const imgX = useTransform(progress, [0, 1], ["5%", "-5%"]);
  // celular: la tarjeta centrada a tamaño completo, las vecinas más pequeñas y apagadas
  const { scrollXProgress } = useScroll({ container: row, target: ref, axis: "x", offset: ["start end", "end start"] });
  const scale = useTransform(scrollXProgress, [0.08, 0.5, 0.92], [0.9, 1, 0.9]);
  const dim = useTransform(scrollXProgress, [0.08, 0.5, 0.92], [0.55, 1, 0.55]);
  return (
    <motion.li ref={ref} style={desktop ? { scale: 1, opacity: 1 } : { scale, opacity: dim }}
      className={`w-[80%] shrink-0 snap-center sm:w-[56%] md:w-[44%] lg:w-[min(44vh,430px)] ${n % 2 ? "lg:mt-[14vh]" : "lg:-mt-[4vh]"}`}>
      <motion.div variants={{ hidden: { opacity: 0, y: 48 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}>
      <button type="button" aria-haspopup="dialog" onClick={(e) => onOpen(id, e.currentTarget)} className="group block w-full text-left transition-transform duration-300 active:scale-[0.98]">
        <span data-frame className="relative block overflow-hidden rounded-[26px] bg-steel shadow-[var(--shadow-raised)] transition-shadow duration-500 [@media(hover:hover)]:group-hover:shadow-[var(--shadow-float)]">
          <motion.img src={foto(ph.src)} srcSet={`${foto(ph.src)} 640w, ${foto(ph.src, 1000)} 1000w`} sizes="(min-width:1024px) 430px, 80vw"
            width={640} height={800} alt={it.alt} loading="lazy" decoding="async" draggable={false}
            style={{ objectPosition: ph.pos, x: desktop ? imgX : 0 }}
            className="aspect-[4/5] w-full scale-[1.1] object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] [@media(hover:hover)]:group-hover:scale-[1.17]" />
          {/* un riflesso attraversa la foto al passaggio del puntero */}
          <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-[60%] w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-[left,opacity] duration-[1.1s] ease-[var(--ease-out-soft)] [@media(hover:hover)]:group-hover:left-[120%] [@media(hover:hover)]:group-hover:opacity-100" />
          <TouchSheen />
          <span className="absolute left-3.5 top-3.5 rounded-full bg-pearl/90 px-3 py-1 text-[13px] font-semibold text-ink backdrop-blur-sm">{t.tag}</span>
        </span>
        <span className="mt-4 flex items-end justify-between gap-4 px-1">
          <span className="min-w-0">
            <span className="block font-display text-[clamp(1.9rem,2.6vw,2.6rem)] font-medium leading-[1]">{it.name}</span>
            <span className="mt-1.5 block text-[15px] text-ink-2">{it.short}</span>
          </span>
          <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full ring-1 ring-ink/20 transition-[transform,background-color,color] duration-500 group-hover:-rotate-45 group-hover:bg-ink group-hover:text-frost">→</span>
        </span>
      </button>
      </motion.div>
    </motion.li>
  );
}

type Box = { top: number; left: number; width: number; height: number };
const box = (el: Element): Box => { const r = el.getBoundingClientRect(); return { top: r.top, left: r.left, width: r.width, height: r.height }; };

function Detail({ id, t, onClose: close, closeLabel, origin }: { id: CollId; t: Copy["collections"]; onClose: () => void; closeLabel: string; origin: HTMLElement | null }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const [phone] = useState(() => !matchMedia("(min-width: 768px)").matches);
  const panelRef = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const cloneImg = useRef<HTMLImageElement>(null);
  const frame = () => origin?.querySelector("[data-frame]") ?? null;
  const canFly = !!origin && !reduce;
  const [flying, setFlying] = useState(canFly);

  /* La foto vola dalla tarjeta alla testata. Vive DENTRO il pannello (prima del foglio di testo, che quindi le sta
     sopra senza ritagli) e ad ogni fotogramma si ricalcola dalla posizione reale del pannello e della testata:
     così atterra esattamente dove sta la testata, senza correzioni finali. Niente transform sui figli: angoli tondi anche su Safari. */
  const place = (from: Box, v: number) => {
    const c = cloneRef.current, im = cloneImg.current, pn = panelRef.current, h = head.current;
    if (!c || !im || !pn || !h) return;
    const pr = pn.getBoundingClientRect(), hr = h.getBoundingClientRect();
    const mix = (a: number, b: number) => a + (b - a) * v;
    c.style.left = `${mix(from.left, hr.left) - pr.left}px`;
    c.style.top = `${mix(from.top, hr.top) - pr.top}px`;
    c.style.width = `${mix(from.width, hr.width)}px`;
    c.style.height = `${mix(from.height, hr.height)}px`;
    const rt = mix(26, 28), rb = mix(26, 0);
    c.style.borderRadius = `${rt}px ${rt}px ${rb}px ${rb}px`;
    const z = mix(1.1, 1); // nella tarjeta la foto è ingrandita del 10%
    im.style.left = im.style.top = `${(1 - z) * 50}%`;
    im.style.width = im.style.height = `${z * 100}%`;
  };
  useLayoutEffect(() => {
    const f = frame();
    if (!canFly || !f) { setFlying(false); return; }
    const from = box(f);
    place(from, 0);
    const ctl = animate(0, 1, { duration: 0.7, ease: lid, onUpdate: (v) => place(from, v), onComplete: () => setFlying(false) });
    return () => ctl.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const closing = useRef(false);
  const onClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const f = frame();
    if (canFly && f) {
      const to = box(f);
      setFlying(true);
      place(to, 1);
      animate(1, 0, { duration: 0.5, ease: lid, onUpdate: (v) => place(to, v) });
    }
    close();
  }, [close, canFly]); // eslint-disable-line react-hooks/exhaustive-deps
  const hidden = flying;
  useEffect(() => {
    closeRef.current?.focus();
    smooth.lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const html = document.documentElement, prev = html.style.overflow;
    html.style.overflow = "hidden";
    addEventListener("keydown", onKey);
    return () => { removeEventListener("keydown", onKey); html.style.overflow = prev; smooth.lenis?.start(); };
  }, [onClose]);
  const it = t.items[id], ph = collPhotos[id];
  const panel = phone ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } } : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };

  return createPortal(
    <div className="fixed inset-0 z-[60]" data-lenis-prevent>
      <motion.div className="absolute inset-0 bg-graphite/55 backdrop-blur-[2px]" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} />
      <motion.div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="d-name" {...panel}
        transition={reduce ? { duration: 0 } : { duration: 0.6, ease: lid }} exit={{ ...(phone ? { y: "100%" } : { x: "100%" }), transition: { duration: 0.5, ease: lid } }}
        drag={phone ? "y" : false} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, i) => (i.offset.y > 120 || i.velocity.y > 600) && onClose()}
        className={`absolute inset-x-0 bottom-0 flex max-h-[92svh] flex-col rounded-t-[28px] bg-pearl ${hidden ? "overflow-visible" : "overflow-hidden"} shadow-[var(--shadow-float)] md:inset-y-3 md:left-auto md:right-3 md:max-h-none md:w-[480px] md:rounded-[28px]`}>
        {canFly && (
          <div ref={cloneRef} aria-hidden style={{ visibility: flying ? "visible" : "hidden" }}
            className="pointer-events-none absolute overflow-hidden bg-steel shadow-[0_24px_48px_-20px_rgb(10_12_14/.5)]">
            <img ref={cloneImg} src={foto(ph.src, 1000)} alt="" draggable={false} style={{ objectPosition: ph.pos }} className="absolute max-w-none object-cover" />
          </div>
        )}
        <div className={`absolute inset-x-0 top-2 z-10 flex justify-center transition-opacity duration-300 md:hidden ${hidden ? "opacity-0" : "opacity-100"}`} aria-hidden><span className="h-1.5 w-11 rounded-full bg-pearl/80 shadow" /></div>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={closeLabel}
          className={`absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-pearl/90 text-ink shadow-[var(--shadow-rest)] backdrop-blur transition-[transform,opacity] duration-300 hover:rotate-90 active:scale-95 ${hidden ? "opacity-0" : "opacity-100"}`}>
          <X className="h-5 w-5" />
        </button>
        <div className="overflow-y-auto overscroll-contain">
          <div ref={head} className="overflow-hidden bg-steel">
            <motion.img initial={origin && !reduce ? false : { scale: 1.12, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease }}
              style={{ objectPosition: ph.pos, visibility: hidden ? "hidden" : "visible" }}
              src={foto(ph.src, 1000)} width={1000} height={1250} alt={it.alt} draggable={false}
              className="aspect-[5/4] w-full object-cover" />
          </div>
          <motion.div className="relative -mt-8 rounded-t-[26px] bg-pearl px-6 pb-8 pt-7" initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}>
            {[
              <h3 key="n" id="d-name" className="text-[36px] leading-[1.02]">{it.name}</h3>,
              <div key="w" className="mt-5 border-t border-ink/10 pt-4"><p className="text-[14px] font-semibold text-gold-ink">{t.what}</p><p className="mt-1 text-ink-2">{it.what}</p></div>,
              <div key="e" className="mt-4 border-t border-ink/10 pt-4"><p className="text-[14px] font-semibold text-gold-ink">{t.engrave}</p><p className="mt-1 text-ink-2">{it.engrave}</p></div>,
              <div key="c" className="mt-7"><Button href={wa(t.ask(it.name))} track={`whatsapp_${id}`} icon={<WaIcon />} className="w-full">{t.cta}</Button></div>,
              <p key="p" className="mt-3 text-center text-[14px] text-mist">{t.priceNote}</p>,
            ].map((el, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}>{el}</motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

export function Collections({ t, closeLabel }: { t: Copy["collections"]; closeLabel: string }) {
  const [open, setOpen] = useState<CollId | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const close = useCallback(() => { setOpen(null); requestAnimationFrame(() => trigger.current?.focus()); }, []);
  const desktop = useDesktop();
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLUListElement>(null);
  const [dist, setDist] = useState(0);

  // distancia horizontal = lo que sobra de la fila; la sección mide eso más una pantalla (1 px de scroll = 1 px de avance)
  useEffect(() => {
    if (!desktop || !track.current) { setDist(0); return; }
    const measure = () => setDist(Math.max(0, track.current!.scrollWidth - innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    return () => ro.disconnect();
  }, [desktop]);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 });
  const x = useTransform(p, (v) => (desktop ? -v * dist : 0));
  const bar = useTransform(p, (v) => `inset(0 ${(1 - v) * 100}% 0 0)`);
  const head = useTransform(p, (v) => `${v * 100}%`);

  return (
    <section id="collezioni" aria-labelledby="h-coll" className="grain relative z-10 -mt-10 rounded-t-[36px] bg-pearl pb-20 pt-16 shadow-[var(--shadow-sheet)] sm:-mt-14 sm:rounded-t-[56px] sm:pb-28 sm:pt-24 lg:pt-0">
      <div ref={outer} style={desktop && dist ? { height: `calc(100svh + ${dist}px)` } : undefined}>
        <div className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:items-center lg:overflow-hidden">
          <motion.div ref={track} style={{ x }} className="lg:flex lg:w-max lg:items-center lg:gap-14 lg:pl-[max(2rem,calc((100vw-1280px)/2+2rem))] lg:pr-[10vw]">
            <div className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:mx-0 lg:w-[min(34vw,470px)] lg:shrink-0 lg:px-0">
              <Reveal><p className="eyebrow">{t.eyebrow}</p></Reveal>
              <h2 id="h-coll" className="mt-4 text-[clamp(2.8rem,5.6vw,5rem)] leading-[0.95]">
                <Words text={t.h2a} inView /><br /><Words text={t.h2b} inView delay={0.12} className="text-mist" />
              </h2>
              <Reveal delay={0.1} as="p" className="mt-5 max-w-[40ch] text-ink-2">{t.lede}</Reveal>
              <Reveal delay={0.2} className="mt-8 hidden items-center gap-3 text-[15px] font-semibold text-ink-2 lg:flex">
                <span aria-hidden className="relative h-px w-14 overflow-hidden bg-ink/15"><span className="anim-loop absolute inset-y-0 left-0 w-1/2 animate-[nudge_1.8s_ease-in-out_infinite] bg-gold" /></span>
                {t.scrollHint}
              </Reveal>
            </div>

            <motion.ul ref={row} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} data-lenis-prevent-touch
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
              className="mt-10 flex snap-x snap-mandatory scroll-px-[10%] gap-3 overflow-x-auto px-[10%] pb-6 [scrollbar-width:none] sm:gap-5 lg:mt-0 lg:snap-none lg:gap-12 lg:overflow-visible lg:px-0 lg:pb-0">
              {collIds.map((id, n) => (
                <Card key={id} id={id} n={n} t={t} progress={p} row={row} desktop={desktop} onOpen={(c, el) => { trigger.current = el; setOpen(c); }} />
              ))}
            </motion.ul>
            <Rail row={row} count={collIds.length} labels={collIds.map((id) => t.items[id].name)} group={t.eyebrow} className="-mt-1" />
          </motion.div>

          {/* avance de la vitrina: línea de bronce con un punto de luz en la punta */}
          <div aria-hidden className="absolute inset-x-[max(2rem,calc((100vw-1280px)/2+2rem))] bottom-7 hidden h-px bg-ink/12 lg:block">
            <motion.span style={{ clipPath: bar }} className="absolute inset-0 bg-gold" />
            <motion.span style={{ left: head }} className="absolute top-1/2 -ml-1 -mt-1 h-2 w-2 rounded-full bg-white shadow-[0_0_6px_2px_#fff3d6,0_0_16px_5px_rgb(220_191_143/.7)]" />
          </div>
        </div>
      </div>

      {/* Puerta a Instagram: ahí están las colecciones completas */}
      <div className="mx-auto mt-8 max-w-[1280px] px-4 sm:px-8 lg:mt-4">
        <Reveal>
          <motion.a href={site.instagram} target="_blank" rel="noopener" data-track="instagram" whileHover={{ y: -4 }}
            className="group relative flex items-center gap-5 overflow-hidden rounded-[26px] bg-graphite p-5 text-frost ring-1 ring-gold/20 transition-[box-shadow] hover:ring-gold/60 sm:gap-8 sm:p-7">
            <span className="font-display text-[68px] font-medium leading-[.8] text-gold-soft sm:text-[104px]">{t.doorCount}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-frost/75">{t.doorCount} {t.doorCountLabel} · {t.doorCaption}</span>
              <span className="mt-1.5 block truncate font-display text-[28px] leading-none sm:text-[42px]">{site.instagramLabel}</span>
            </span>
            <InfinityMark className="hidden h-14 w-28 shrink-0 sm:block" stroke={5} glint="loop" speed={4} gem={false} />
            <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold text-ink transition-transform duration-500 group-hover:-rotate-45 sm:h-14 sm:w-14">→</span>
          </motion.a>
        </Reveal>
      </div>

      <AnimatePresence>{open && <Detail key={open} id={open} t={t} onClose={close} closeLabel={closeLabel} origin={trigger.current} />}</AnimatePresence>
    </section>
  );
}
