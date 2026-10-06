import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/data/site";
import { Reveal, Eyebrow } from "./Motion";

export const HoursList = ({ light = false }: { light?: boolean }) => (
  <div className="grid gap-10 sm:grid-cols-2">
    {SITE.hours.map((h) => (
      <div key={h.title} data-testid={`hours-${h.title.split(" ")[0].toLowerCase()}`}>
        <p className={`font-display text-2xl mb-4 ${light ? "" : "text-[#0b0b0b]"}`}>{h.title}</p>
        <ul className={`space-y-3 text-[15px] ${light ? "text-[#c9c1b5]" : "text-[#4a443d]"}`}>
          {h.rows.map(([d, t, note]) => (
            <li key={d} className={`flex flex-col border-b pb-3 ${light ? "border-white/10" : "border-[#0b0b0b]/10"}`}>
              <span className="text-[12px] tracking-[0.18em] uppercase">{d}</span>
              <span className={`mt-1 ${light ? "text-[#f4f0ea]" : "text-[#0b0b0b]"}`}>
                {t}
                {note && <em className="ml-2 not-italic text-[13px] opacity-80">— {note}</em>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export const MapFrame = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-[#e7e1d8] ${className}`}>
    <iframe
      data-testid="google-map-embed"
      title="Ciesse Intermediazioni — Sulmona"
      src={SITE.mapsEmbed}
      className="absolute inset-0 w-full h-full grayscale-[0.85] contrast-[1.05]"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
);

export const HoursAndMap = () => (
  <section data-testid="visit-section" className="container-x py-24 md:py-36">
    <div className="grid gap-14 lg:grid-cols-12 items-start">
      <Reveal className="lg:col-span-6">
        <Eyebrow>Vieni a trovarci</Eyebrow>
        <h2 className="mt-6 font-display text-4xl md:text-6xl leading-[1] tracking-tight">
          {SITE.city}, <em>{SITE.street.replace("Via ", "via ")}.</em>
        </h2>
        <p className="mt-6 text-[15px] text-[#4a443d] max-w-md">{SITE.directions}</p>
        <div className="mt-12"><HoursList /></div>
        <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" data-testid="visit-open-maps" className="btn-dark mt-12">
          Apri in Google Maps <ArrowUpRight size={16} />
        </a>
      </Reveal>
      <Reveal delay={0.15} className="lg:col-span-6">
        <MapFrame className="aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]" />
      </Reveal>
    </div>
  </section>
);
