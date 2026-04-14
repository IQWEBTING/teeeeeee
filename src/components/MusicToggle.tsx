import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGameStore } from '../stores/gameStore';
import { bgMusic, playClick } from '../lib/audio';

export default function MusicToggle() {
  const { isMusicOn, toggleMusic } = useGameStore();
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMusicOn) {
      if (!bgMusic.playing()) {
        bgMusic.play();
      }
    } else {
      bgMusic.pause();
    }
  }, [isMusicOn]);

  const handleToggle = () => {
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotation: 0, scale: 0.8 },
        { rotation: 360, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }
      );
    }
    playClick();
    toggleMusic();
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed bottom-6 left-6 z-[9990] w-12 h-12 bg-white/20 backdrop-blur-md rounded-full border border-white/40 flex items-center justify-center text-2xl shadow-lg hover:bg-white/30 transition-colors"
      title={isMusicOn ? "ปิดเสียง" : "เปิดเสียง"}
    >
      <div ref={iconRef}>{isMusicOn ? '🔊' : '🔇'}</div>
    </button>
  );
}
