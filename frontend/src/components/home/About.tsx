import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { STATS, SITE } from "@/data/site";
import { Eyebrow, Reveal, LineReveal, EASE } from "../Motion";

const ClippedPhoto = ({ src, alt, className, testId }: { src: string; alt: string; className: string; testId: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <motion.div ref={ref} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className={className}>
      <motion.div
        variants={{ hidden: { clipPath: "inset(0 0 100% 0)" }, show: { clipPath: "inset(0 0 0% 0)" } }}
        transition={{ duration: 1.4, ease: EASE }}
        className="relative h-full overflow-hidden"
      >
        <motion.img data-testid={testId} src={src} alt={alt} style={{ y }} className="absolute inset-0 w-full h-[116%] -top-[8%] object-cover" />
      </motion.div>
    </motion.div>
  );
};

export const About = () => (
  <section data-testid="about-section" className="container-x py-24 md:py-36">
    <div className="grid gap-14 lg:grid-cols-12">
      <div className="lg:col-span-4"><Eyebrow testId="about-eyebrow">Chi siamo</Eyebrow></div>
      <div className="lg:col-span-8">
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
          <LineReveal inView lines={["Nati a Sulmona nel " + SITE.founded + ",", <em key="a">tutto per l'edilizia</em>, "in un unico indirizzo."]} />
        </h2>
        <Reveal delay={0.1} className="mt-10 grid gap-8 md:grid-cols-2 text-[15px] leading-relaxed text-[#4a443d]">
          <p data-testid="about-text-1">
            La Ciesse Intermediazioni nasce a Sulmona nel {SITE.founded}, da una pregressa attività nel settore della vendita e del
            commercio al dettaglio di materiali edili e attrezzature. Oggi è punto di riferimento dell'intero territorio per privati,
            professionisti e aziende del settore.
          </p>
          <p data-testid="about-text-2">
            Nel vasto magazzino di oltre 25.000 mq trovate tutto per costruire, ristrutturare e rifinire; lo show-room è interamente
            dedicato all'esposizione casa e alla progettazione di interni. Consulenti specializzati mettono a disposizione oltre 30
            anni di esperienza.
          </p>
        </Reveal>
      </div>
    </div>
    <div className="mt-20 grid gap-4 md:grid-cols-12">
      <ClippedPhoto testId="about-photo-aerial" src="/img/file2-18.jpeg" alt="Veduta aerea del magazzino Ciesse a Sulmona" className="md:col-span-8 aspect-[16/10]" />
      <ClippedPhoto testId="about-photo-team" src="/img/ciesse-team-2.jpg" alt="Il team Ciesse nel piazzale" className="md:col-span-4 aspect-[16/10] md:aspect-auto md:h-full" />
    </div>
    <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 border-t border-[#0b0b0b]/15">
      {STATS.map((s, i) => (
        <Reveal key={s.k} delay={i * 0.08} className="pt-8 pb-4 pr-4 border-b lg:border-b-0 border-[#0b0b0b]/10">
          <p data-testid={`stat-${i}`} className="font-display text-5xl md:text-6xl">{s.k}</p>
          <p className="mt-3 text-[13px] tracking-[0.12em] uppercase text-[#6b645b]">{s.v}</p>
        </Reveal>
      ))}
    </div>
  </section>
);
