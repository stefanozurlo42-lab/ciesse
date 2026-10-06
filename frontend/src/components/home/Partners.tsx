import { PARTNERS } from "@/data/site";
import { Eyebrow, Reveal } from "../Motion";

export const Partners = () => (
  <section data-testid="partners-section" className="container-x py-24 md:py-32 border-t border-[#0b0b0b]/10">
    <div className="grid gap-12 lg:grid-cols-12">
      <Reveal className="lg:col-span-4">
        <Eyebrow>I nostri partner</Eyebrow>
        <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-[#4a443d]">
          La qualità e la garanzia dei migliori marchi presenti sul mercato. Una selezione dei nostri partner.
        </p>
      </Reveal>
      <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-l border-t border-[#0b0b0b]/10">
        {PARTNERS.map((p, i) => (
          <Reveal key={p} delay={(i % 4) * 0.05} y={12} className="border-r border-b border-[#0b0b0b]/10">
            <p data-testid={`partner-${i}`} className="font-display text-xl md:text-2xl px-5 py-7 text-[#2a2621] transition-colors duration-300 hover:text-[#B4532A]">
              {p}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
