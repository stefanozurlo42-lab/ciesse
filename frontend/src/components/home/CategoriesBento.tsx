import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, type Category } from "@/data/site";
import { Eyebrow, LineReveal, EASE } from "../Motion";

const SPANS = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-2",
  "lg:col-span-2",
];

const Tile = ({ c, i }: { c: Category; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 1, ease: EASE, delay: (i % 3) * 0.08 }}
    className={`${SPANS[i]} min-h-[320px] lg:min-h-0`}
  >
    <Link to="/collezioni" data-testid={`category-tile-${i}`} className="group relative block h-full overflow-hidden bg-[#0b0b0b] text-[#f4f0ea]">
      <img src={c.img} alt={c.title} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-[transform,opacity] duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06] group-hover:opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-[12px] tracking-[0.3em] text-[#e9e3da]">{c.n}</p>
          <h3 className={`mt-2 font-display leading-none ${i === 0 ? "text-4xl md:text-6xl" : "text-3xl md:text-4xl"}`}>{c.title}</h3>
          <p className="mt-3 max-w-sm text-[14px] text-[#e9e3da] leading-relaxed whitespace-pre-line max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-[max-height,opacity] duration-700 hidden md:block">{c.text}</p>
          <p className="mt-3 max-w-sm text-[14px] text-[#e9e3da] leading-relaxed whitespace-pre-line md:hidden">{c.text}</p>
        </div>
        <span className="shrink-0 w-11 h-11 rounded-full border border-white/40 grid place-items-center transition-[background-color,transform] duration-500 group-hover:bg-[#B4532A] group-hover:border-[#B4532A] group-hover:rotate-45">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  </motion.div>
);

export const CategoriesBento = () => (
  <section data-testid="categories-section" className="container-x pb-24 md:pb-36">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
      <div>
        <Eyebrow>Le categorie</Eyebrow>
        <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-7xl leading-[1] tracking-tight">
          <LineReveal inView lines={["Sei mondi,", <em key="u">un solo indirizzo.</em>]} />
        </h2>
      </div>
      <Link to="/collezioni" data-testid="categories-see-all" className="nav-link text-[12px] tracking-[0.22em] uppercase self-start md:self-end">Vedi tutte</Link>
    </div>
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-4 lg:auto-rows-[300px]">
      {CATEGORIES.map((c, i) => <Tile key={c.title} c={c} i={i} />)}
    </div>
  </section>
);
