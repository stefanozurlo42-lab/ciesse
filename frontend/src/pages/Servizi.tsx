import { SERVICES, CERTIFICATIONS } from "@/data/site";
import { PageHero } from "@/components/PageHero";
import { ServiceItem } from "@/components/home/ServicesDark";
import { CtaBand } from "@/components/CtaBand";
import { Eyebrow, Reveal } from "@/components/Motion";

export default function Servizi() {
  return (
    <div data-testid="services-page">
      <PageHero
        testId="services-hero"
        eyebrow="Servizi"
        lines={["Oltre", <em key="f">la fornitura.</em>]}
        intro="Consegne, parco mezzi, calcestruzzo dai nostri impianti, consulenza d'interni e agevolazioni: un unico interlocutore per tutto il cantiere."
      />
      <section className="bg-[#0b0b0b] text-[#f4f0ea]">
        <div className="container-x py-24 md:py-32 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => <ServiceItem key={s.title} s={s} i={i} />)}
        </div>
      </section>
      <section data-testid="certifications-section" className="container-x py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4"><Eyebrow>Certificazioni</Eyebrow></div>
          <div className="lg:col-span-8">
            {CERTIFICATIONS.map((c, i) => (
              <Reveal key={c.k} delay={i * 0.08} className="grid md:grid-cols-2 gap-4 py-8 border-t border-[#0b0b0b]/12">
                <p data-testid={`cert-${i}`} className="font-display text-3xl md:text-4xl">{c.k}</p>
                <p className="text-[15px] leading-relaxed text-[#4a443d] self-center">{c.v}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </div>
  );
}
