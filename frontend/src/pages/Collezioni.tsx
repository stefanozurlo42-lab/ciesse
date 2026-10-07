import { motion } from "motion/react";
import { CATEGORIES, type Category } from "@/data/site";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { EASE } from "@/components/Motion";
import { CategoryPhotos } from "@/components/CategoryPhotos";

const Row = ({ c, i }: { c: Category; i: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 1, ease: EASE }}
    data-testid={`collection-row-${i}`}
    className="group grid gap-8 md:grid-cols-12 items-center py-12 md:py-16 border-t border-[#0b0b0b]/12"
  >
    <div className={`relative md:col-span-7 overflow-hidden aspect-[16/10] ${i % 2 ? "md:order-2" : ""}`}>
      <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]">
        <CategoryPhotos photos={c.photos} offset={i * 2500} testId={`collection-row-${i}-photo`} />
      </div>
    </div>
    <div className={`md:col-span-5 ${i % 2 ? "md:order-1 md:pr-10" : "md:pl-10"}`}>
      <p className="text-[12px] tracking-[0.3em] text-[#6b645b]">{c.n}</p>
      <h2 className="mt-4 font-display text-4xl md:text-6xl leading-[1] tracking-tight">{c.title}</h2>
      <p className="mt-6 text-base leading-relaxed text-[#4a443d] max-w-md whitespace-pre-line">{c.text}</p>
    </div>
  </motion.article>
);

export default function Collezioni() {
  return (
    <div data-testid="collections-page">
      <PageHero
        testId="collections-hero"
        eyebrow="Collezioni"
        lines={["Dalle fondamenta", <em key="f">alla finitura.</em>]}
        intro="Nel magazzino di oltre 25.000 mq e nello show-room di Sulmona: sei mondi di prodotto selezionati tra i migliori marchi del mercato."
      />
      <section className="container-x pb-12">
        {CATEGORIES.map((c, i) => <Row key={c.title} c={c} i={i} />)}
      </section>
      <CtaBand />
    </div>
  );
}
