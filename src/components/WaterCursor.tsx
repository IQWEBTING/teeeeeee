import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

type Drop = { id: number; x: number; y: number };

export default function WaterCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    // Hide default cursor globally
    document.body.style.cursor = 'none';

    // Ensure all interactive elements inherit the none cursor so it works site-wide
    const style = document.createElement('style');
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    const handleDown = (e: MouseEvent | TouchEvent) => {
      let clientX = pos.x;
      let clientY = pos.y;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        setPos({ x: clientX, y: clientY });
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      setDrops((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), x: clientX, y: clientY },
      ]);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('touchstart', handleDown);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('touchstart', handleDown);
      document.head.removeChild(style);
      document.body.style.cursor = '';
    };
  }, [pos.x, pos.y]); // Include pos in dependencies so touch can use latest pos, but it updates frequently. We track using state directly in down handler.

  useEffect(() => {
    // Cleanup drops after 600ms
    if (drops.length > 0) {
      const timer = setTimeout(() => {
        setDrops((prev) => prev.slice(1));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [drops]);

  return (
    <>
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      >
        {/* SVG Water Gun Icon */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-water)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="-ml-1 -mt-1 drop-shadow-md"
        >
          <path d="M12 2v6" />
          <path d="M8 4h8" />
          <path d="M5 10A2 2 0 0 1 7 8h10a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
          <path d="M6 14v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" />
          <path d="M12 17v3" />
        </svg>
      </div>

      {drops.map((drop) => (
        <WaterDrops key={drop.id} x={drop.x} y={drop.y} />
      ))}
    </>
  );
}

const WaterDrops = ({ x, y }: { x: number; y: number }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.children;

    gsap.to(elements, {
      x: () => (Math.random() - 0.5) * 80,
      y: () => Math.random() * 60 + 20, // Fall down
      opacity: 0,
      scale: 0.5,
      duration: 0.6,
      ease: 'power1.out',
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed pointer-events-none z-[9998]"
      style={{ left: x, top: y }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-blue-300 rounded-full -ml-1 -mt-1"
        />
      ))}
    </div>
  );
};
