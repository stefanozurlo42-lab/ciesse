import { MARQUEE } from "@/data/site";

const Row = ({ hidden }: { hidden?: boolean }) => (
  <div className="marquee-row" aria-hidden={hidden}>
    {MARQUEE.map((w) => (
      <span key={w} className="flex items-center gap-10 pr-10">
        <span className="font-display italic">{w}</span>
        <span className="w-2.5 h-2.5 bg-[#B4532A] rotate-45" />
      </span>
    ))}
  </div>
);

export const Marquee = () => (
  <section data-testid="editorial-marquee" className="border-y border-[#0b0b0b]/10 py-8 md:py-10 overflow-hidden bg-[#f4f0ea]">
    <div className="marquee-track text-4xl md:text-6xl text-[#0b0b0b]">
      <Row />
      <Row hidden />
    </div>
  </section>
);
