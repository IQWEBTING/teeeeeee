import React, { useEffect, useRef } from 'react';
import { create } from 'zustand';
import gsap from 'gsap';

type SplashData = { id: number; x: number; y: number };

interface SplashStore {
  splashes: SplashData[];
  addSplash: (x: number, y: number) => void;
  removeSplash: (id: number) => void;
}

const useSplashStore = create<SplashStore>((set) => ({
  splashes: [],
  addSplash: (x, y) =>
    set((state) => ({
      splashes: [...state.splashes, { id: Date.now() + Math.random(), x, y }],
    })),
  removeSplash: (id) =>
    set((state) => ({
      splashes: state.splashes.filter((s) => s.id !== id),
    })),
}));

export const useSplash = () => {
  const triggerSplash = useSplashStore((state) => state.addSplash);
  return { triggerSplash };
};

const SingleSplash = ({ splash, onComplete }: { splash: SplashData; onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const drops = containerRef.current.children;

    gsap.to(drops, {
      x: () => (Math.random() - 0.5) * 150,
      y: () => (Math.random() - 0.5) * 150,
      scale: () => Math.random() * 0.5,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete,
    });
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed pointer-events-none z-[10000]"
      style={{ left: splash.x, top: splash.y }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 bg-[var(--color-water)] rounded-full -ml-2 -mt-2 opacity-80"
          style={{ 
            boxShadow: '0 0 8px var(--color-water)',
          }}
        />
      ))}
    </div>
  );
};

export default function SplashParticleSystem() {
  const { splashes, removeSplash } = useSplashStore();
  return (
    <>
      {splashes.map((s) => (
        <SingleSplash key={s.id} splash={s} onComplete={() => removeSplash(s.id)} />
      ))}
    </>
  );
}
