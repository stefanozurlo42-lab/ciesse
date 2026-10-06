import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { Logo } from "./Logo";
import { NAV, SITE } from "@/data/site";

export const Footer = () => (
  <footer data-testid="site-footer" className="bg-[#0b0b0b] text-[#f4f0ea]">
    <div className="container-x pt-24 pb-10">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Logo light size="lg" />
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#c9c1b5]">
            Materiali e finiture per l'edilizia a Sulmona dal {SITE.founded}. Un punto di riferimento per privati,
            professionisti e aziende del settore.
          </p>
        </div>
        <div className="lg:col-span-3">
          <p className="footer-title">Navigazione</p>
          <ul className="space-y-3">
            {NAV.slice(1).map((n) => (
              <li key={n.to}>
                <Link to={n.to} data-testid={`footer-nav-${n.label.toLowerCase()}`} className="link-underline text-[15px]">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-4">
          <p className="footer-title">Contatti</p>
          <ul className="space-y-3 text-[15px]">
            {SITE.phones.slice(0, 2).map((p, i) => (
              <li key={p.tel} className="flex items-center gap-3">
                <Phone size={15} className="text-[#c9c1b5]" />
                <a href={`tel:${p.tel}`} data-testid={`footer-phone-${i}`} className="link-underline">{p.display}</a>
              </li>
            ))}
            <li className="flex items-center gap-3">
              <Mail size={15} className="text-[#c9c1b5]" />
              <a href={`mailto:${SITE.email}`} data-testid="footer-email" className="link-underline">{SITE.email}</a>
            </li>
            <li className="flex items-start gap-3 text-[#c9c1b5]" data-testid="footer-address">
              <MapPin size={15} className="mt-1 shrink-0" />
              <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="link-underline">
                {SITE.street} — {SITE.cap} {SITE.city} ({SITE.prov})
              </a>
            </li>
          </ul>
          <div className="mt-6 flex gap-3">
            <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" data-testid="footer-instagram" className="social-btn"><Instagram size={16} /></a>
            <a href={SITE.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" data-testid="footer-facebook" className="social-btn"><Facebook size={16} /></a>
          </div>
        </div>
      </div>
      <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between text-[13px] text-[#a39b90]">
        <p data-testid="footer-legal">© {new Date().getFullYear()} {SITE.legal} — P. IVA {SITE.vat}</p>
        <a href={SITE.privacyUrl} target="_blank" rel="noreferrer" className="link-underline" data-testid="footer-privacy">Privacy Policy</a>
      </div>
    </div>
  </footer>
);
