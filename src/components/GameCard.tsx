import React, { useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSplash } from './SplashParticle';

interface GameCardProps {
  title: string;
  emoji: string;
  description: string;
  path: string;
  scoreLabel: string;
  scoreSuffix: string;
  bestScore?: number | null;
}

export default function GameCard({
  title,
  emoji,
  description,
  path,
  scoreLabel,
  scoreSuffix,
  bestScore,
}: GameCardProps) {
  const navigate = useNavigate();
  const { triggerSplash } = useSplash();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    // Trigger splash at center of card or mouse click roughly
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      triggerSplash(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  return (
    <div
      ref={cardRef}
      className="card-game p-6 flex flex-col items-center text-center animate-float group cursor-none w-full max-w-sm mx-auto transition-transform duration-300 hover:scale-105"
    >
      <div
        className="text-[64px] leading-none mb-4"
        style={{ filter: 'drop-shadow(0 10px 10px rgba(0,206,209,0.5))' }}
      >
        {emoji}
      </div>
      
      <h2 className="text-3xl font-fredoka text-[var(--color-gold)] mb-2 drop-shadow-md">
        {title}
      </h2>
      
      <p className="text-white/90 text-sm mb-6 leading-relaxed flex-grow">
        {description}
      </p>

      {bestScore !== undefined && bestScore !== null && (
        <div className="mb-4 badge-gold animate-pulse">
          สถิติที่ดีที่สุด: {bestScore} {scoreSuffix}
        </div>
      )}

      {!bestScore && (
        <div className="mb-4 text-[var(--color-water)] text-sm opacity-80 h-[28px] flex items-center">
          ยังไม่มีสถิติ
        </div>
      )}

      <button
        onClick={handleClick}
        className="btn-water w-full font-fredoka text-xl tracking-wide py-3"
      >
        เล่นเลย! 💦
      </button>
      
      {/* Water ripple border effect on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-300 group-hover:border-[var(--color-water)] pointer-events-none" />
    </div>
  );
}
