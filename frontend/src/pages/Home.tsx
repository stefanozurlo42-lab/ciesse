import { HomeHero } from "@/components/home/HomeHero";
import { About } from "@/components/home/About";
import { CategoriesBento } from "@/components/home/CategoriesBento";
import { ServicesDark } from "@/components/home/ServicesDark";
import { Marquee } from "@/components/Marquee";
import { HoursAndMap } from "@/components/HoursAndMap";
import { CtaBand } from "@/components/CtaBand";

export default function Home() {
  return (
    <div data-testid="home-page">
      <HomeHero />
      <Marquee />
      <About />
      <CategoriesBento />
      <ServicesDark />
      <HoursAndMap />
      <CtaBand />
    </div>
  );
}
