import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGameStore } from '../stores/gameStore';
import { useSplash } from './SplashParticle';
import { playClick } from '../lib/audio';

export default function PlayerNameModal() {
  const { setPlayerName, setHasEnteredName } = useGameStore();
  const { triggerSplash } = useSplash();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.75)' }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    playClick(); // Added
    e.preventDefault();
    const val = inputValue.trim();
    
    if (!val) {
      setError('กรุณาใส่ชื่อโอเพนแชทของคุณ');
      return;
    }

    // Trigger splash
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      triggerSplash(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    // GSAP Exit animation
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setPlayerName(val);
          setHasEnteredName(true);
        }
      });
    } else {
      setPlayerName(val);
      setHasEnteredName(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[9900] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        ref={modalRef}
        className="card-game bg-[var(--color-water)]/90 max-w-md w-full p-8 text-center relative overflow-hidden"
      >
        <div ref={containerRef} className="relative z-10">
          <h2 className="text-4xl font-fredoka text-white mb-2 drop-shadow-md">
            สวัสดีปีใหม่! 🎊
          </h2>
          <p className="text-white/90 mb-6 font-prompt">
            ใส่ชื่อโอเพนแชทของคุณเพื่อเล่นและลงคะแนน
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                maxLength={50}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError('');
                }}
                placeholder="ชื่อโอเพนแชทของคุณ..."
                className="w-full px-4 py-3 rounded-xl bg-white/20 border-2 border-white/40 text-white placeholder-white/60 outline-none focus:border-[var(--color-gold)] transition-colors font-prompt text-lg text-center"
              />
              {error && (
                <p className="text-[var(--color-pink)] text-sm mt-2 font-semibold absolute -bottom-6 w-full fade-in">
                  {error}
                </p>
              )}
            </div>
            
            <button
              type="submit"
              className="btn-pink font-fredoka text-xl py-3 mt-4"
              onClick={handleSubmit}
            >
              เริ่มเลย! 💦
            </button>
          </form>
        </div>
        
        {/* Decorative background splashes */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--color-pink)]/20 rounded-full blur-2xl pointer-events-none" />
      </div>
    </div>
  );
}
