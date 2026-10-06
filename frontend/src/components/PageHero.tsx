import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Eyebrow, LineReveal, EASE } from "./Motion";

interface Props {
  eyebrow: ReactNode;
  lines: ReactNode[];
  intro?: ReactNode;
  testId?: string;
}

export const PageHero = ({ eyebrow, lines, intro, testId }: Props) => (
  <section data-testid={testId} className="container-x pt-40 md:pt-48 pb-16 md:pb-24">
    <Eyebrow>{eyebrow}</Eyebrow>
    <h1 className="mt-8 font-display text-5xl sm:text-6xl lg:text-8xl leading-[0.95] tracking-tight max-w-5xl">
      <LineReveal lines={lines} delay={0.1} />
    </h1>
    {intro && (
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
        className="mt-10 max-w-xl text-base md:text-lg leading-relaxed text-[#4a443d]"
      >
        {intro}
      </motion.p>
    )}
  </section>
);
