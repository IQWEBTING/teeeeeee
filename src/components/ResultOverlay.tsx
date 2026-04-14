import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { playClick } from '../lib/audio';

interface ResultOverlayProps {
  isVisible: boolean;
  title: string;
  scoreText: string;
  ratingText: string;
  onReplay: () => void;
  onLeaderboard: () => void;
}

export default function ResultOverlay({
  isVisible,
  title,
  scoreText,
  ratingText,
  onReplay,
  onLeaderboard
}: ResultOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      if (overlayRef.current) {
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
      }
      if (cardRef.current) {
        gsap.fromTo(cardRef.current, 
          { scale: 0.5, opacity: 0, y: 50 }, 
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.5)", delay: 0.1 }
        );
      }
    } else {
      if (overlayRef.current) {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
      }
    }
  }, [isVisible]);

  if (!isVisible) return <div ref={overlayRef} className="fixed inset-0 z-[9900] opacity-0 pointer-events-none" />;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[9900] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 opacity-0">
      
      {/* CSS Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              backgroundColor: ['#FF69B4', '#00CED1', '#FFD700', '#FF6B35', '#ffffff'][Math.floor(Math.random() * 5)],
              animation: `overlay-confetti ${Math.random() * 2 + 1}s linear forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes overlay-confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      
      <div ref={cardRef} className="card-game bg-[var(--color-water)]/90 max-w-sm w-full p-8 text-center relative border-4 border-white/30 shadow-2xl">
        <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 text-[64px] md:text-[80px] drop-shadow-lg z-10 animate-float">
          💦
        </div>
        
        <h2 className="text-3xl md:text-4xl font-fredoka text-white mt-12 mb-2 drop-shadow-md">{title}</h2>
        <p className="text-xl md:text-2xl font-prompt text-white mb-4 bg-black/20 rounded-xl py-2 shadow-inner border border-white/10">
          {scoreText}
        </p>
        <p className="text-lg md:text-xl font-prompt text-[var(--color-gold)] font-bold mb-8 drop-shadow-sm">
          {ratingText}
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              playClick();
              onReplay();
            }} 
            className="btn-pink font-fredoka text-xl py-3 w-full border-2 border-white/20"
          >
            เล่นใหม่ 🔄
          </button>
          <button 
            onClick={() => {
              playClick();
              onLeaderboard();
            }} 
            className="btn-water font-fredoka text-xl py-3 w-full border-2 border-white/20"
          >
            ดูลีดเดอร์บอร์ด 🏆
          </button>
        </div>
      </div>
    </div>
  );
}
