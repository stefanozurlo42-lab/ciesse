import { Link } from "react-router-dom";

export const LogoMark = ({ className = "w-7 h-7" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <path d="M24 9.5A10 10 0 1 0 24 22.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
    <rect x="13" y="14.6" width="13" height="2.8" fill="#B4532A" />
  </svg>
);

export const Logo = ({ light = false, size = "md" }: { light?: boolean; size?: "md" | "lg" }) => (
  <Link to="/" data-testid="brand-logo-link" className={`group flex items-center gap-2.5 ${light ? "text-[#f4f0ea]" : "text-[#0b0b0b]"}`}>
    <LogoMark className={size === "lg" ? "w-9 h-9" : "w-7 h-7"} />
    <span className={`font-display leading-none ${size === "lg" ? "text-4xl" : "text-[26px]"}`}>Ciesse</span>
    <span className={`hidden sm:inline text-[10px] tracking-[0.32em] uppercase mt-1.5 ${light ? "text-[#c9c1b5]" : "text-[#6b645b]"}`}>
      Intermediazioni
    </span>
  </Link>
);
