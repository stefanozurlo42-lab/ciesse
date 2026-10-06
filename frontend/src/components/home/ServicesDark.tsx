import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SERVICES, type Service } from "@/data/site";
import { Eyebrow, LineReveal, EASE } from "../Motion";

export const ServiceItem = ({ s, i }: { s: Service; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.9, ease: EASE, delay: (i % 4) * 0.08 }}
    data-testid={`service-item-${i}`}
    className="group relative border-t border-white/15 pt-6 pb-10 pr-6"
  >
    <span className="absolute left-0 top-0 h-px w-0 bg-[#B4532A] transition-[width] duration-700 group-hover:w-full" />
    <p className="text-[12px] tracking-[0.3em] text-[#a39b90]">{String(i + 1).padStart(2, "0")}</p>
    <h4 className="mt-4 font-display text-2xl md:text-[28px] leading-tight transition-transform duration-500 group-hover:translate-x-1">{s.title}</h4>
    <p className="mt-3 text-[15px] leading-relaxed text-[#c9c1b5]">{s.text}</p>
  </motion.div>
);

export const ServicesDark = () => (
  <section data-testid="services-section" className="bg-[#0b0b0b] text-[#f4f0ea]">
    <div className="container-x py-24 md:py-36">
      <div className="grid gap-10 lg:grid-cols-12 mb-16">
        <div className="lg:col-span-4"><Eyebrow light>I servizi</Eyebrow></div>
        <h2 className="lg:col-span-8 font-display text-4xl sm:text-5xl lg:text-7xl leading-[1] tracking-tight">
          <LineReveal inView lines={["Un servizio che va", <span key="o"><em>oltre</em> la fornitura.</span>]} />
        </h2>
      </div>
      <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => <ServiceItem key={s.title} s={s} i={i} />)}
      </div>
      <Link to="/servizi" data-testid="services-see-all" className="btn-light mt-10">Tutti i servizi <ArrowRight size={16} /></Link>
    </div>
  </section>
);
