import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Eyebrow, LineReveal, Reveal } from "./Motion";

export const CtaBand = () => (
  <section data-testid="cta-band" className="container-x py-28 md:py-40 text-center">
    <div className="flex justify-center"><Eyebrow>Iniziamo</Eyebrow></div>
    <h2 className="mt-8 font-display text-5xl md:text-7xl leading-[1] tracking-tight">
      <LineReveal inView lines={["Il vostro progetto,", <em key="e">un preventivo su misura.</em>]} />
    </h2>
    <Reveal delay={0.2}>
      <p className="mt-8 max-w-lg mx-auto text-base md:text-lg text-[#4a443d]">
        Raccontateci l'intervento: in pochi passaggi vi rispondiamo con una stima dedicata.
      </p>
      <Link to="/preventivo" data-testid="cta-start-quote" className="btn-dark mt-12">
        Inizia il preventivo <ArrowRight size={16} />
      </Link>
    </Reveal>
  </section>
);
