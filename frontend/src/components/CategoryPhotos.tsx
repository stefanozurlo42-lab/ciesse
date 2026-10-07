import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { Photo } from "@/data/site";

const INTERVAL_MS = 5000;

// Index of the visible photo; advances every INTERVAL_MS after an initial `offset` (so tiles don't change together).
const useCycle = (count: number, offset: number) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (count < 2) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      setActive((a) => (a + 1) % count);
      interval = setInterval(() => setActive((a) => (a + 1) % count), INTERVAL_MS);
    }, INTERVAL_MS + offset);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [count, offset]);
  return active;
};

/** Stacked category photos that cross-fade (same soft fade as the home hero). Fills its positioned parent. */
export const CategoryPhotos = ({ photos, offset = 0, testId }: { photos: Photo[]; offset?: number; testId: string }) => {
  const active = useCycle(photos.length, offset);
  return (
    <>
      {photos.map((p, i) => (
        <motion.img
          key={p.src}
          src={p.src}
          alt={p.alt}
          aria-hidden={i !== active}
          data-testid={`${testId}-${i}`}
          data-active={i === active}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: p.pos ?? "center" }}
          className="absolute inset-0 w-full h-full object-cover"
          initial={false}
          animate={{ opacity: i === active ? 1 : 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
      ))}
    </>
  );
};
