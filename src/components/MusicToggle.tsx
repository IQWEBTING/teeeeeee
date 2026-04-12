import React, { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import gsap from 'gsap';
import { useGameStore } from '../stores/gameStore';

// Mock empty audio to avoid fetch error, in a real app this would be a valid mp3 path.
// For the sake of complete delivery without missing assets, we use a silent base64 data URI or we can instantiate Howl without it playing immediately and failing loudly.
const bgMusic = new Howl({
  src: ['data:audio/mp3;base64,//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'],
  loop: true,
  volume: 0.3,
});

export default function MusicToggle() {
  const { isMusicOn, toggleMusic } = useGameStore();
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMusicOn) {
      bgMusic.play();
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
