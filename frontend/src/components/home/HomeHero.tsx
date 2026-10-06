import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight } from "lucide-react";
import { HERO_SLIDES, SITE } from "@/data/site";
import { LineReveal, EASE } from "../Motion";

const Slides = ({ active, y, scale }: { active: number; y: MotionValue<string>; scale: MotionValue<number> }) => (
  <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
    {HERO_SLIDES.map((src, i) => (
      <motion.img
        key={src}
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        initial={false}
        animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1.08 : 1 }}
        transition={{ opacity: { duration: 1.4, ease: "easeInOut" }, scale: { duration: 7, ease: "linear" } }}
      />
    ))}
  </motion.div>
);

const Dots = ({ active, setActive }: { active: number; setActive: (i: number) => void }) => (
  <div className="flex gap-2">
    {HERO_SLIDES.map((_, i) => (
      <button key={i} data-testid={`hero-slide-dot-${i}`} aria-label={`Slide ${i + 1}`} onClick={() => setActive(i)} className="py-3">
        <span className={`block h-px transition-[width,background-color] duration-500 ${i === active ? "w-10 bg-[#f4f0ea]" : "w-5 bg-[#f4f0ea]/50"}`} />
      </button>
    ))}
  </div>
);

export const HomeHero = () => {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % HERO_SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} data-testid="home-hero" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[#0b0b0b] text-[#f4f0ea]">
      <motion.div initial={{ clipPath: "inset(12% 12% 12% 12%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} transition={{ duration: 1.6, ease: EASE }} className="absolute inset-0">
        <Slides active={active} y={y} scale={scale} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/40" />
      </motion.div>
      <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 container-x h-full flex flex-col justify-end pb-16 md:pb-20">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} data-testid="hero-eyebrow" className="eyebrow text-[#e9e3da]">
          Dal {SITE.founded} — {SITE.city} ({SITE.prov}), Italia
        </motion.p>
        <h1 className="mt-6 font-display text-[64px] sm:text-8xl lg:text-[150px] leading-[0.88] tracking-tight">
          <LineReveal delay={0.5} lines={["Materia,", "finitura,", <em key="p">progetto.</em>]} />
        </h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1, ease: EASE }} className="mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
          <div className="flex flex-wrap gap-3">
            <Link to="/preventivo" data-testid="hero-quote-btn" className="btn-light">Richiedi preventivo <ArrowRight size={16} /></Link>
            <Link to="/collezioni" data-testid="hero-collections-btn" className="btn-ghost">Esplora le collezioni</Link>
          </div>
          <Dots active={active} setActive={setActive} />
        </motion.div>
      </motion.div>
    </section>
  );
};
