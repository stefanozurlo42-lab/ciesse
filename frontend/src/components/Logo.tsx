import { Link } from "react-router-dom";

// Official Ciesse vector logo (from the client's PDF). "-light" = same artwork recoloured for dark backgrounds.
export const LogoImage = ({ light = false, className = "h-11 w-auto" }: { light?: boolean; className?: string }) => (
  <img
    src={light ? "/logo-ciesse-light.svg" : "/logo-ciesse.svg"}
    alt="Ciesse — Materiali e Finiture per l'Edilizia"
    className={className}
    draggable={false}
  />
);

export const Logo = ({ light = false, size = "md" }: { light?: boolean; size?: "md" | "lg" }) => (
  <Link to="/" data-testid="brand-logo-link" className="group flex items-center">
    <LogoImage light={light} className={size === "lg" ? "h-16 w-auto" : "h-11 w-auto"} />
  </Link>
);
