import type { ReactNode } from "react";
import { motion } from "motion/react";

export const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children?: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export const Reveal = ({ children, delay = 0, y = 32, className = "" }: RevealProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.9, ease: EASE, delay }}
  >
    {children}
  </motion.div>
);

const LINE = { hidden: { y: "110%" }, show: { y: "0%" } };

interface LineRevealProps {
  lines: ReactNode[];
  delay?: number;
  inView?: boolean;
  className?: string;
}

export const LineReveal = ({ lines, delay = 0, inView = false, className = "" }: LineRevealProps) => (
  <motion.span
    className={`block ${className}`}
    initial="hidden"
    {...(inView ? { whileInView: "show", viewport: { once: true, amount: 0.1 } } : { animate: "show" })}
  >
    {lines.map((line, i) => (
      <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
        <motion.span
          className="block will-change-transform"
          variants={LINE}
          transition={{ duration: 1.2, ease: EASE, delay: delay + i * 0.12 }}
        >
          {line}
        </motion.span>
      </span>
    ))}
  </motion.span>
);

export const Eyebrow = ({ children, light = false, testId }: { children: ReactNode; light?: boolean; testId?: string }) => (
  <p data-testid={testId} className={`eyebrow ${light ? "text-[#c9c1b5]" : "text-[#6b645b]"}`}>
    <span className="inline-block w-6 h-px align-middle mr-3 bg-current" />
    {children}
  </p>
);
