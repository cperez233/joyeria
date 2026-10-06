// editorial-ui · Cristian Pérez · cristianperez.me
// Taller de grabado: piezas de acero dibujadas en código, un láser que graba lo que escribes.
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { img, photos, wa, type Copy } from "./data";
import { Button, WaIcon, ease, spring } from "./ui";

type Piece = "piastrina" | "bracciale" | "fede";
type Mode = "frase" | "canzone" | "foto";
type Font = "corsivo" | "stampatello" | "macchina";

const MAX: Record<Piece, number> = { piastrina: 24, bracciale: 30, fede: 26 };
// ancho útil del área de grabado (en cqw del escenario) y ancho medio de un carácter por letra (em)
const AREA: Record<Piece, number> = { piastrina: 50, bracciale: 64, fede: 58 };
const CHAR: Record<Font, number> = { corsivo: 0.42, stampatello: 0.78, macchina: 0.6 };
const SIZE_MAX: Record<Piece, number> = { piastrina: 8.5, bracciale: 5.6, fede: 6.2 };
const fontClass: Record<Font, string> = {
  corsivo: "font-script",
  stampatello: "font-display uppercase tracking-[0.18em] font-medium",
  macchina: "font-type",
};

/** Altura de barras determinista a partir del título (sin Math.random: mismo HTML en servidor y cliente). */
function wave(seed: string, n = 34) {
  let h = 2166136261;
  for (const c of seed || "song") h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return Array.from({ length: n }, (_, i) => {
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    const env = Math.sin((i / (n - 1)) * Math.PI) * 0.6 + 0.4;
    return Math.round((0.25 + (h % 1000) / 1000 * 0.75) * env * 100);
  });
}

/* ---------------------------------------------------------------- piezas */

function PieceShape({ piece, children }: { piece: Piece; children: React.ReactNode }) {
  if (piece === "piastrina")
    return (
      <div className="relative w-[64%]">
        {/* cadena que sube fuera del escenario */}
        <svg aria-hidden viewBox="0 0 20 200" className="absolute bottom-[86%] left-1/2 h-[60cqw] w-[3cqw] -translate-x-1/2" preserveAspectRatio="none">
          <defs><pattern id="chain" width="20" height="16" patternUnits="userSpaceOnUse"><rect x="4" y="1" width="12" height="14" rx="6" fill="none" stroke="#c3c9cd" strokeWidth="2.4" /></pattern></defs>
          <rect width="20" height="200" fill="url(#chain)" />
        </svg>
        <div aria-hidden className="absolute left-1/2 top-[-7%] h-[13%] w-[9%] -translate-x-1/2 rounded-full border-[0.9cqw] border-[#c9ced2] shadow-[inset_0_1px_1px_rgb(0_0_0/.3)]" />
        <div className="steel relative aspect-[1.7] rounded-[3.2cqw] shadow-[inset_0_1px_0_rgb(255_255_255/.8),inset_0_-2px_4px_rgb(0_0_0/.25),0_30px_50px_-20px_rgb(0_0_0/.7)]">
          <div aria-hidden className="absolute left-1/2 top-[7%] h-[9%] w-[5.5%] -translate-x-1/2 rounded-full bg-graphite shadow-[inset_0_1px_2px_rgb(0_0_0/.8)]" />
          <div className="absolute inset-[16%_8%_10%] grid place-items-center">{children}</div>
        </div>
      </div>
    );
  if (piece === "bracciale")
    return (
      <div className="relative w-[90%]">
        <svg aria-hidden viewBox="0 0 400 160" className="absolute inset-x-[-2%] top-1/2 w-[104%] -translate-y-[38%]">
          <defs><linearGradient id="wire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f1f3f4" /><stop offset=".5" stopColor="#8f979d" /><stop offset="1" stopColor="#d5d9dc" /></linearGradient></defs>
          <ellipse cx="200" cy="70" rx="192" ry="64" fill="none" stroke="url(#wire)" strokeWidth="7" />
        </svg>
        <div className="steel relative mx-auto h-[15cqw] w-[78%] rounded-full shadow-[inset_0_1px_0_rgb(255_255_255/.8),inset_0_-2px_4px_rgb(0_0_0/.25),0_28px_44px_-20px_rgb(0_0_0/.75)]">
          <div className="absolute inset-[8%_7%] grid place-items-center">{children}</div>
        </div>
      </div>
    );
  return (
    <div className="relative w-[80%]">
      {/* el anillo visto en ángulo, y debajo su cara interna "desplegada" donde va el grabado */}
      <svg aria-hidden viewBox="0 0 400 120" className="absolute bottom-[78%] left-[10%] w-[80%]">
        <defs><linearGradient id="ring" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6f7f8" /><stop offset=".45" stopColor="#9aa2a8" /><stop offset="1" stopColor="#e3e6e8" /></linearGradient></defs>
        <ellipse cx="200" cy="60" rx="180" ry="44" fill="none" stroke="url(#ring)" strokeWidth="16" />
        <ellipse cx="200" cy="60" rx="180" ry="44" fill="none" stroke="#2a2e32" strokeOpacity=".25" strokeWidth="1" />
      </svg>
      <div className="steel-band relative h-[17cqw] rounded-[2cqw] shadow-[inset_0_2px_6px_rgb(0_0_0/.35),0_26px_40px_-20px_rgb(0_0_0/.7)]">
        <div className="absolute inset-[10%_6%] grid place-items-center">{children}</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- láser */

function Laser({ k, duration, children, active }: { k: string; duration: number; children: React.ReactNode; active: boolean }) {
  const p = useMotionValue(1);
  const reduce = useReducedMotion();
  const [burning, setBurning] = useState(false);
  useEffect(() => {
    if (reduce || !active) { p.set(1); return; }
    p.set(0); setBurning(true);
    const c = animate(p, 1, { duration, ease: "linear", onComplete: () => setBurning(false) });
    return () => c.stop();
  }, [k]); // eslint-disable-line react-hooks/exhaustive-deps
  const clip = useTransform(p, (v) => `inset(-30% ${(1 - v) * 100}% -30% 0)`);
  const left = useTransform(p, (v) => `${v * 100}%`);
  return (
    <span className="relative inline-block max-w-full">
      <motion.span style={{ clipPath: clip }} className="block">{children}</motion.span>
      <AnimatePresence>
        {burning && (
          <motion.span key="dot" style={{ left }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}
            aria-hidden className="pointer-events-none absolute top-1/2 -ml-[3px] -mt-[3px] block h-[6px] w-[6px]">
            <span className="absolute bottom-[3px] left-[2.5px] h-[90cqw] w-px bg-gradient-to-t from-[#fff6e0] via-gold-soft/50 to-transparent" />
            <span className="laser-flicker absolute inset-0 rounded-full bg-white shadow-[0_0_6px_2px_#fff3d6,0_0_18px_6px_rgb(217_189_140/.75),0_0_40px_10px_rgb(217_189_140/.35)]" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ---------------------------------------------------------------- controles */

function Seg<T extends string>({ group, items, value, onChange, label }: { group: string; items: { id: T; label: React.ReactNode }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex rounded-full bg-steel p-1">
      {items.map((o) => {
        const on = o.id === value;
        return (
          <motion.button key={o.id} type="button" aria-pressed={on} onClick={() => onChange(o.id)} whileTap={{ scale: 0.95 }}
            className={`relative min-h-[42px] flex-1 rounded-full px-3 text-[15px] transition-colors ${on ? "font-semibold text-frost" : "text-ink-2 hover:text-ink"}`}>
            {on && <motion.span layoutId={`eng-${group}`} transition={spring} className="absolute inset-0 rounded-full bg-ink shadow-[var(--shadow-rest)]" />}
            <span className="relative">{o.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- componente */

export function Engraver({ t }: { t: Copy["engraver"] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const ex = t.examples;
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [piece, setPiece] = useState<Piece>(ex[0].piece as Piece);
  const [mode, setMode] = useState<Mode>(ex[0].mode as Mode);
  const [font, setFont] = useState<Font>(ex[0].font as Font);
  const [text, setText] = useState(ex[0].text);
  const [song, setSong] = useState(t.examples[3].text);
  const [shown, setShown] = useState({ text: ex[0].text, song: t.examples[3].text }); // lo que ya grabó el láser
  const typed = useRef(false);
  const resume = useRef<ReturnType<typeof setTimeout>>();

  // Ejemplos en bucle: solo visible, sin reduced motion y mientras el usuario no tome el control.
  useEffect(() => {
    if (!auto || !inView || reduce) return;
    const id = setTimeout(() => {
      const n = (i + 1) % ex.length, e = ex[n];
      setI(n); setPiece(e.piece as Piece); setMode(e.mode as Mode); setFont(e.font as Font);
      if (e.mode === "canzone") { setSong(e.text); setShown((s) => ({ ...s, song: e.text })); }
      else { setText(e.text); setShown((s) => ({ ...s, text: e.text })); }
    }, 4600);
    return () => clearTimeout(id);
  }, [auto, inView, reduce, i, ex]);

  // Al tocar un control se pausa; si no escribió nada propio, vuelve el bucle a los 12 s.
  const takeOver = () => {
    setAuto(false);
    clearTimeout(resume.current);
    if (!typed.current) resume.current = setTimeout(() => setAuto(true), 12000);
  };
  useEffect(() => () => clearTimeout(resume.current), []);

  // El láser graba cuando dejas de escribir (no en cada tecla).
  useEffect(() => {
    if (auto) return;
    const id = setTimeout(() => setShown({ text, song }), 420);
    return () => clearTimeout(id);
  }, [text, song, auto]);

  const max = MAX[piece];
  const content = mode === "canzone" ? shown.song : shown.text;
  const len = Math.max(content.length, 6);
  const size = Math.min(SIZE_MAX[piece] * (font === "corsivo" ? 1.5 : 1), AREA[piece] / (len * CHAR[font]));
  const bars = useMemo(() => wave(shown.song), [shown.song]);
  const k = `${piece}|${mode}|${font}|${content}`;
  const duration = Math.min(1.9, 0.55 + content.length * 0.05);

  const fontName = t.fonts[font];
  const what = mode === "foto" ? t.photoWhat : mode === "canzone" ? t.songWhat(song || "…") : `«${text || "…"}»`;
  const message = t.message(what, t.pieceArticle[piece], mode === "foto" ? undefined : fontName);
  const label = t.preview(what, t.pieceArticle[piece]);

  return (
    <div ref={ref} className="overflow-hidden rounded-[30px] bg-white shadow-[var(--shadow-float)] ring-1 ring-white/10">
      {/* escenario */}
      <div role="img" aria-label={label} className="grain dark @container relative aspect-[5/4] overflow-hidden bg-graphite sm:aspect-[16/12]">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_42%,rgb(255_255_255/.13),transparent_70%)]" />
        <motion.div key={`shadow-${piece}`} aria-hidden initial={{ scaleX: 0.5, opacity: 0.2 }} animate={{ scaleX: 1, opacity: 1 }} transition={spring}
          className="absolute inset-x-[18%] bottom-[14%] h-[7%] rounded-[50%] bg-black/70 blur-2xl" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={piece} className="absolute inset-0 grid place-items-center pt-[4%]"
            initial={{ opacity: 0, y: 30, rotateX: 25, scale: 0.92 }} animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, ease }} style={{ transformPerspective: 900 }}>
            <PieceShape piece={piece}>
              <Laser k={k} duration={mode === "foto" ? 1.6 : duration} active={inView}>
                {mode === "frase" && (
                  <span className={`engraved block whitespace-nowrap leading-[1.15] ${fontClass[font]}`} style={{ fontSize: `${size}cqw` }}>
                    {shown.text || " "}
                  </span>
                )}
                {mode === "canzone" && (
                  <span className="flex flex-col items-center gap-[1cqw]">
                    <span className="flex h-[6.5cqw] items-center gap-[0.35cqw]">
                      {bars.map((h, b) => (
                        <span key={b} className="w-[0.55cqw] rounded-full bg-[rgb(38_42_46/.75)] shadow-[0_1px_0_rgb(255_255_255/.7)]" style={{ height: `${h}%` }} />
                      ))}
                    </span>
                    <span className={`engraved whitespace-nowrap leading-none ${fontClass[font]}`} style={{ fontSize: `${Math.min(size, 3.4) * (font === "corsivo" ? 1.3 : 0.8)}cqw` }}>
                      {shown.song || " "}
                    </span>
                  </span>
                )}
                {mode === "foto" && (
                  <img src={img(photos.portrait, 360, 260)} alt="" width={360} height={260} loading="lazy" draggable={false}
                    className={`block rounded-[1.2cqw] object-cover mix-blend-multiply [filter:grayscale(1)_contrast(1.6)_brightness(1.05)] ${piece === "piastrina" ? "h-[17cqw] w-[26cqw]" : piece === "bracciale" ? "h-[10cqw] w-[30cqw] rounded-full" : "h-[11cqw] w-[34cqw]"}`} />
                )}
              </Laser>
            </PieceShape>
          </motion.div>
        </AnimatePresence>

        {/* progreso de los ejemplos */}
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5" aria-hidden>
          {ex.map((_, d) => (
            <span key={d} className="relative h-1 overflow-hidden rounded-full bg-frost/20 transition-[width] duration-500" style={{ width: d === i && auto ? 26 : 8 }}>
              {d === i && auto && !reduce && inView && (
                <motion.span key={`${i}-${auto}`} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 4.6, ease: "linear" }}
                  className="absolute inset-y-0 left-0 bg-gold-soft" />
              )}
            </span>
          ))}
        </div>
        <p className="absolute right-4 top-3 text-[13px] font-semibold text-frost/70">{t.title}</p>
      </div>

      {/* controles */}
      <div className="space-y-3 p-4 sm:p-5">
        <Seg group="piece" label={t.title} value={piece} onChange={(v) => { takeOver(); setPiece(v); if (text.length > MAX[v]) setText(text.slice(0, MAX[v])); }}
          items={(Object.keys(t.pieces) as Piece[]).map((id) => ({ id, label: t.pieces[id] }))} />
        <div className="flex gap-5 border-b border-ink/10" role="group" aria-label={t.modes.frase + " / " + t.modes.canzone + " / " + t.modes.foto}>
          {(Object.keys(t.modes) as Mode[]).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => { takeOver(); setMode(m); }}
              className={`relative min-h-[44px] text-[15px] transition-colors ${mode === m ? "font-semibold text-ink" : "text-mist hover:text-ink"}`}>
              {t.modes[m]}
              {mode === m && <motion.span layoutId="eng-mode" transition={spring} className="absolute inset-x-0 -bottom-px h-[2px] bg-gold" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={mode === "foto" ? "foto" : "testo"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {mode === "foto" ? (
              <p className="py-2 text-[15px] text-ink-2">{t.photoNote}</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <label className="block">
                  <span className="flex justify-between text-[14px] font-semibold text-ink-2">
                    {mode === "canzone" ? t.songLabel : t.textLabel}
                    <span className="font-normal tabular-nums text-mist">{t.counter((mode === "canzone" ? song : text).length, max)}</span>
                  </span>
                  <input value={mode === "canzone" ? song : text} maxLength={max} placeholder={mode === "canzone" ? t.songPh : t.textPh}
                    onFocus={takeOver}
                    onChange={(e) => { typed.current = true; takeOver(); (mode === "canzone" ? setSong : setText)(e.target.value); }}
                    className="mt-1 h-12 w-full rounded-2xl bg-pearl px-4 text-[16px] text-ink outline-none ring-1 ring-ink/10 transition-shadow placeholder:text-mist/70 focus:ring-2 focus:ring-gold" />
                </label>
                <div role="group" aria-label={t.fontLabel} className="flex gap-1.5">
                  {(Object.keys(t.fonts) as Font[]).map((f) => (
                    <motion.button key={f} type="button" aria-pressed={font === f} aria-label={t.fonts[f]} title={t.fonts[f]} whileTap={{ scale: 0.93 }}
                      onClick={() => { takeOver(); setFont(f); }}
                      className={`grid h-12 w-12 place-items-center rounded-2xl text-[20px] ring-1 transition-colors ${font === f ? "bg-ink text-frost ring-ink" : "bg-pearl text-ink ring-ink/10 hover:ring-ink/40"} ${fontClass[f]} ${f === "stampatello" ? "!text-[15px] !tracking-[0.05em]" : ""}`}>
                      Aa
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <Button href={wa(message)} track="whatsapp_incisione" icon={<WaIcon />} className="w-full sm:w-auto">{t.cta}</Button>
          <p className="text-[13px] leading-snug text-mist sm:max-w-[22ch] sm:text-right">{t.note}</p>
        </div>
      </div>
    </div>
  );
}
