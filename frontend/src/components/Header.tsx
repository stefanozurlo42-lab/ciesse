import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { NAV, SITE } from "@/data/site";

const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return scrolled;
};

const MobileMenu = () => (
  <motion.div
    data-testid="mobile-menu"
    initial={{ opacity: 0, y: -12 }}
    animate={{ opacity: 1, y: 0 }}
    className="lg:hidden h-[calc(100dvh-5rem)] bg-[#f4f0ea] container-x pt-10 pb-8 flex flex-col"
  >
    {NAV.map((n, i) => (
      <motion.div key={n.to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
        <NavLink to={n.to} end data-testid={`mobile-nav-${n.label.toLowerCase()}`} className="block font-display text-5xl py-2">
          {n.label}
        </NavLink>
      </motion.div>
    ))}
    <div className="mt-auto text-sm text-[#4a443d] space-y-1">
      <a href={`tel:${SITE.phones[0].tel}`} className="block">{SITE.phones[0].display}</a>
      <a href={`mailto:${SITE.email}`} className="block">{SITE.email}</a>
    </div>
  </motion.div>
);

export const Header = () => {
  const scrolled = useScrolled();
  const { pathname } = useLocation();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname; // auto-closes on navigation
  const overHero = pathname === "/" && !scrolled && !open;

  return (
    <header
      data-testid="site-header"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 border-b ${
        overHero ? "bg-transparent border-transparent" : "bg-[#f4f0ea]/85 backdrop-blur-xl border-[#0b0b0b]/10"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between">
        <Logo light={overHero} />
        <nav className="hidden lg:flex items-center gap-10">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end
              data-testid={`nav-${n.label.toLowerCase()}`}
              className={({ isActive }) =>
                `nav-link text-[12px] tracking-[0.18em] uppercase ${overHero ? "text-[#f4f0ea]" : "text-[#0b0b0b]"} ${isActive ? "is-active" : ""}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button
          data-testid="mobile-menu-toggle"
          aria-label="Menu"
          onClick={() => setOpenPath(open ? null : pathname)}
          className={`lg:hidden p-2 -mr-2 ${overHero ? "text-[#f4f0ea]" : "text-[#0b0b0b]"}`}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && <MobileMenu />}
    </header>
  );
};
