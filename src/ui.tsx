// editorial-ui · Cristian Pérez · cristianperez.me
import { motion, useMotionValue, useSpring, type Variants } from "framer-motion";
import { Fragment, type CSSProperties, type ReactNode, type MouseEvent } from "react";
import type Lenis from "lenis";

export const ease = [0.22, 1, 0.36, 1] as const;
export const lid = [0.76, 0, 0.24, 1] as const;
export const spring = { type: "spring" as const, stiffness: 260, damping: 26 };
export const soft = { type: "spring" as const, stiffness: 400, damping: 24 };

export const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
export const rise: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } } };

/* Scroll suave: todo el scroll programático pasa por Lenis cuando está activo. */
export const smooth: { lenis: Lenis | null } = { lenis: null };
export function goTo(e: MouseEvent<HTMLElement> | null, id: string) {
  e?.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  if (smooth.lenis) smooth.lenis.scrollTo(el, { offset: id === "inizio" ? 0 : -72, duration: 1.3 });
  else el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

export function Reveal({ children, className = "", delay = 0, as = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "p" | "li" }) {
  const M = motion[as];
  return (
    <M className={className} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay, ease }}>
      {children}
    </M>
  );
}

/** Palabras que suben desde una ranura. Se observa la ranura (visible), no la palabra recortada. */
export function Words({ text, delay = 0, className = "", inView = false }: { text: string; delay?: number; className?: string; inView?: boolean }) {
  const trigger = inView ? { whileInView: "show", viewport: { once: true, margin: "-40px" } } : { animate: "show" };
  return (
    <>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          <motion.span initial="hidden" {...trigger} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span className={`inline-block ${className}`}
              variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 1, delay: delay + i * 0.055, ease } } }}>
              {w}
            </motion.span>
          </motion.span>{" "}
        </Fragment>
      ))}
    </>
  );
}

/** El infinito del logo: lazo izquierdo en acero, derecho en negro con canto de bronce, diamante sobre el cruce.
 *  `glint` = un resplandor que recorre todo el trazo (en bucle o al pasar el puntero), en vez de girar. */
const LOOP_L = "M50 25C40 12 30 8 21 8 11 8 5 16 5 25s6 17 16 17c9 0 19-4 29-17";
const LOOP_R = "M50 25c10-13 20-17 29-17 10 0 16 8 16 17s-6 17-16 17c-9 0-19-4-29-17";
const LOOP = "M50 25C40 12 30 8 21 8 11 8 5 16 5 25s6 17 16 17c9 0 19-4 29-17 10-13 20-17 29-17 10 0 16 8 16 17s-6 17-16 17c-9 0-19-4-29-17Z";
export function InfinityMark({ className = "h-5 w-10", draw = false, delay = 0, stroke = 6, tone = "light", glint = "none", gem = true, speed = 5.2 }:
  { className?: string; draw?: boolean; delay?: number; stroke?: number; tone?: "light" | "dark"; glint?: "loop" | "hover" | "none"; gem?: boolean; speed?: number }) {
  const anim = (d: number) => draw
    ? { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 1.6, delay: delay + d, ease: lid } }
    : {};
  const id = `g-${tone}`;
  const glintStart = draw ? delay + 1.7 : delay;
  return (
    <svg viewBox="0 -4 100 54" className={`overflow-visible ${glint === "loop" ? "glint-loop" : glint === "hover" ? "glint-hover" : ""} ${className}`} aria-hidden fill="none"
      style={{ "--glint-dur": `${speed}s`, "--glint-delay": `${glintStart}s` } as CSSProperties}>
      <defs>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tone === "light" ? "#f4f4f2" : "#9a9c9e"} />
          <stop offset=".5" stopColor={tone === "light" ? "#a4a7aa" : "#3f4245"} />
          <stop offset="1" stopColor={tone === "light" ? "#e1e2e2" : "#74787b"} />
        </linearGradient>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0d9ab" /><stop offset=".55" stopColor="#ad8048" /><stop offset="1" stopColor="#7d5c2c" />
        </linearGradient>
        <linearGradient id="g-gem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset=".5" stopColor="#cfd6dc" /><stop offset="1" stopColor="#8e989f" />
        </linearGradient>
        <filter id="g-halo" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="1.6" /></filter>
      </defs>
      <motion.path d={LOOP_L} stroke={`url(#${id}-s)`} strokeWidth={stroke} strokeLinecap="round" {...anim(0)} />
      <motion.path d={LOOP_R} stroke={`url(#${id}-g)`} strokeWidth={stroke} strokeLinecap="round" {...anim(0.25)} />
      {/* filo scuro interno, come il nero dell'anello destro nel logo */}
      <motion.path d={LOOP_R} stroke={tone === "light" ? "#0d0b0d" : "#161417"} strokeOpacity=".35" strokeWidth={stroke * 0.22} strokeLinecap="round" {...anim(0.4)} />
      {glint !== "none" && (
        <>
          <path d={LOOP} pathLength={1} className="glint" stroke="#f3d9a6" strokeOpacity=".7" strokeWidth={stroke * 1.5} strokeLinecap="round" filter="url(#g-halo)" />
          <path d={LOOP} pathLength={1} className="glint glint-core" stroke="#fffaf0" strokeWidth={stroke * 0.28} strokeLinecap="round" />
        </>
      )}
      {gem && (
        <motion.g initial={draw ? { opacity: 0, y: -6 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: delay + 1.2, ease }}>
          <path d="M44.6 9.2 47 6.4h6l2.4 2.8L50 16.6Z" fill="url(#g-gem)" stroke={tone === "light" ? "#ffffff" : "#5b6166"} strokeOpacity=".7" strokeWidth=".35" strokeLinejoin="round" />
          <path d="M44.6 9.2h10.8M47 6.4l1.4 2.8L50 16.6l1.6-7.4L53 6.4M48.4 9.2 50 6.4l1.6 2.8" stroke={tone === "light" ? "#ffffff" : "#5b6166"} strokeOpacity=".55" strokeWidth=".3" strokeLinejoin="round" />
          {glint === "loop" && <path className="sparkle" d="M50 2.2 50.9 8.1 56.4 9 50.9 9.9 50 15.8 49.1 9.9 43.6 9 49.1 8.1Z" fill="#fffdf6" />}
        </motion.g>
      )}
    </svg>
  );
}

export function Logo({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={`group flex items-center gap-2.5 ${className}`}>
      <InfinityMark className="h-[22px] w-10" tone={tone === "dark" ? "dark" : "light"} stroke={6.5} glint="hover" gem={false} />
      <span className="font-brand text-[19px] tracking-[0.3em]">JOVI'S</span>
    </span>
  );
}

export function WaIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.1 8.1 0 1 1 12 20.1Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

/** Botón principal: barrido de luz, flecha que se va y vuelve, atracción magnética (solo con puntero). */
export function Button({ href, children, track, icon, variant = "ink", className = "" }:
  { href: string; children: ReactNode; track?: string; icon?: ReactNode; variant?: "ink" | "gold" | "frost"; className?: string }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 }), sy = useSpring(y, { stiffness: 300, damping: 20 });
  const move = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!canHover()) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.2); y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const tone = {
    ink: "bg-ink text-frost hover:bg-graphite-2",
    gold: "bg-gold text-[#1c150b] hover:bg-[#c7a169]",
    frost: "bg-frost text-ink hover:bg-white",
  }[variant];
  const external = href.startsWith("http");
  return (
    <motion.a href={href} data-track={track} style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.96 }} target={external ? "_blank" : undefined} rel={external ? "noopener" : undefined}
      className={`group relative inline-flex min-h-[52px] items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 text-[16px] font-semibold shadow-[var(--shadow-rest)] transition-colors duration-300 ${tone} ${className}`}>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-[left,opacity] duration-700 ease-[var(--ease-out-soft)] [@media(hover:hover)]:group-hover:left-[120%] [@media(hover:hover)]:group-hover:opacity-100" />
      {icon}
      <span className="relative">{children}</span>
      <span aria-hidden className="relative h-4 w-4 overflow-hidden">
        <span className="absolute inset-0 transition-transform duration-500 ease-[var(--ease-out-soft)] [@media(hover:hover)]:group-hover:translate-x-full [@media(hover:hover)]:group-hover:-translate-y-full">↗</span>
        <span className="absolute inset-0 -translate-x-full translate-y-full transition-transform duration-500 ease-[var(--ease-out-soft)] [@media(hover:hover)]:group-hover:translate-x-0 [@media(hover:hover)]:group-hover:translate-y-0">↗</span>
      </span>
    </motion.a>
  );
}

/** Enlace con subrayado que se borra y se redibuja en oro. */
export function LineLink({ href, children, className = "", track, onClick }: { href: string; children: ReactNode; className?: string; track?: string; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  const external = href.startsWith("http");
  return (
    <a href={href} data-track={track} onClick={onClick} target={external ? "_blank" : undefined} rel={external ? "noopener" : undefined}
      className={`group relative inline-flex min-h-[44px] items-center gap-1.5 font-semibold ${className}`}>
      <span className="relative">
        {children}
        <span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-100 bg-current opacity-40 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:origin-left group-hover:scale-x-0" />
        <span aria-hidden className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform delay-150 duration-500 ease-[var(--ease-out-soft)] group-hover:scale-x-100" />
      </span>
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </a>
  );
}
