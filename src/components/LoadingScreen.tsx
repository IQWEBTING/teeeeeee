import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { bgMusic, clickSound, playClick, resumeAudioContext, waterSound, adminSound, girlWinSound, balloonPopSound, balloonRowWinSound, balloonRowFailSound, balloonWinSound } from '../lib/audio';

interface LoadingScreenProps {
  onFinished: () => void;
}

export default function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const [isReady, setIsReady] = useState(false);

  // 1. Simulate Loading Progress
  useEffect(() => {
    const duration = 2500; // 2.5 seconds minimum
    const interval = 20;
    const step = 100 / (duration / interval);
    
    let bgLoaded = false;
    let clickLoaded = false;
    let waterLoaded = false;
    let adminLoaded = false;
    let winLoaded = false;
    let bPopLoaded = false;
    let bRowWinLoaded = false;
    let bRowFailLoaded = false;
    let bWinLoaded = false;

    const onBgLoad = () => { bgLoaded = true; };
    const onClickLoad = () => { clickLoaded = true; };
    const onWaterLoad = () => { waterLoaded = true; };
    const onAdminLoad = () => { adminLoaded = true; };
    const onWinLoad = () => { winLoaded = true; };
    const onBPopLoad = () => { bPopLoaded = true; };
    const onBRowWinLoad = () => { bRowWinLoaded = true; };
    const onBRowFailLoad = () => { bRowFailLoaded = true; };
    const onBWinLoad = () => { bWinLoaded = true; };

    bgMusic.on('load', onBgLoad);
    clickSound.on('load', onClickLoad);
    waterSound.on('load', onWaterLoad);
    adminSound.on('load', onAdminLoad);
    girlWinSound.on('load', onWinLoad);
    balloonPopSound.on('load', onBPopLoad);
    balloonRowWinSound.on('load', onBRowWinLoad);
    balloonRowFailSound.on('load', onBRowFailLoad);
    balloonWinSound.on('load', onBWinLoad);

    // Initial check
    if (bgMusic.state() === 'loaded') bgLoaded = true;
    if (clickSound.state() === 'loaded') clickLoaded = true;
    if (waterSound.state() === 'loaded') waterLoaded = true;
    if (adminSound.state() === 'loaded') adminLoaded = true;
    if (girlWinSound.state() === 'loaded') winLoaded = true;
    if (balloonPopSound.state() === 'loaded') bPopLoaded = true;
    if (balloonRowWinSound.state() === 'loaded') bRowWinLoaded = true;
    if (balloonRowFailSound.state() === 'loaded') bRowFailLoaded = true;
    if (balloonWinSound.state() === 'loaded') bWinLoaded = true;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (bgLoaded && clickLoaded && waterLoaded && adminLoaded && winLoaded && bPopLoaded && bRowWinLoaded && bRowFailLoaded && bWinLoaded) {
            clearInterval(timer);
            return 100;
          }
          return 99;
        }
        return Math.min(prev + step + (Math.random() * 2), 100);
      });
    }, interval);

    return () => {
      clearInterval(timer);
      bgMusic.off('load', onBgLoad);
      clickSound.off('load', onClickLoad);
      waterSound.off('load', onWaterLoad);
      adminSound.off('load', onAdminLoad);
      girlWinSound.off('load', onWinLoad);
      balloonPopSound.off('load', onBPopLoad);
      balloonRowWinSound.off('load', onBRowWinLoad);
      balloonRowFailSound.off('load', onBRowFailLoad);
      balloonWinSound.off('load', onBWinLoad);
    };
  }, []);

  // 2. Check if ready based on progress
  useEffect(() => {
    if (progress === 100 && !isReady) {
      setIsReady(true);
      // Animate button in
      if (startButtonRef.current) {
        gsap.fromTo(startButtonRef.current, 
          { scale: 0, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
      }
    }
  }, [progress, isReady]);

  const handleStart = () => {
    const tl = gsap.timeline({
      onComplete: onFinished
    });

    // Interaction happened! Explicitly resume AudioContext for Howler & Phaser
    resumeAudioContext();
    window.dispatchEvent(new CustomEvent('resume-game-audio'));

    playClick();
    if (!bgMusic.playing()) {
      bgMusic.play();
    }

    tl.to(startButtonRef.current, { scale: 1.2, opacity: 0, duration: 0.3, ease: 'power2.in' })
      .to(logoRef.current, { y: -50, opacity: 0, duration: 0.5, ease: 'power2.in' }, "-=0.1")
      .to(progressRef.current, { scaleX: 0, opacity: 0, duration: 0.5, ease: 'power2.in' }, "-=0.3")
      .to(containerRef.current, { opacity: 0, duration: 0.8, ease: 'power2.out' });
  };

  // 3. Generate Bubbles
  useEffect(() => {
    if (!bubblesRef.current) return;
    
    const colors = ['#00CED1', '#FF69B4', '#FFD700', '#FFFFFF'];
    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
      const size = Math.random() * 40 + 10;
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 3 + 4;
      const xOffset = (Math.random() - 0.5) * 100;

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${left}%`;
      bubble.style.animationDelay = `${delay}s`;
      bubble.style.animationDuration = `${duration}s`;
      bubble.style.setProperty('--x-offset', `${xOffset}px`);
      bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)] + '44'; // 44 for transparency

      bubblesRef.current?.appendChild(bubble);

      // Cleanup
      setTimeout(() => {
        bubble.remove();
      }, (delay + duration) * 1000);
    };

    const bubbleInterval = setInterval(createBubble, 300);
    return () => clearInterval(bubbleInterval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[10000] loading-bg flex flex-col items-center justify-center p-6 font-prompt text-white"
    >
      {/* Background Bubbles Container */}
      <div ref={bubblesRef} className="absolute inset-0 pointer-events-none" />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        
        {/* Logo/Icon */}
        <div ref={logoRef} className="mb-8 text-center">
          <div className="text-6xl mb-4 animate-[water-ripple_2s_infinite]">💦</div>
          <h1 className="text-4xl md:text-5xl font-fredoka text-white text-glow mb-2">
            สงกรานต์เกมส์
          </h1>
          <p className="text-white/70 font-prompt tracking-widest text-sm uppercase">
            Loading Festive Fun...
          </p>
        </div>

        {/* Progress Section */}
        <div ref={progressRef} className="w-full">
          <div className="flex justify-between items-end mb-2">
            <span className="font-fredoka text-2xl text-[--color-gold]">
              {Math.round(progress)}%
            </span>
            <span className="font-prompt text-xs text-white/50">
              {progress < 100 ? 'เติมน้ำใส่ขัน...' : 'สาดน้ำได้เลย!'}
            </span>
          </div>
          
          <div className="wave-progress">
            <div 
              className="wave-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Start Button (Visible only when ready) */}
        <div className="mt-12 h-20 flex items-center justify-center">
          {isReady && (
            <button
              ref={startButtonRef}
              onClick={handleStart}
              className="btn-water px-12 py-4 text-2xl font-fredoka flex items-center gap-3 group"
            >
              <span>สาดน้ำเลย!</span>
              <span className="group-hover:translate-x-2 transition-transform">🔫</span>
            </button>
          )}
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex gap-4 text-2xl opacity-50">
          <span className="animate-float" style={{ animationDelay: '0s' }}>🌸</span>
          <span className="animate-float" style={{ animationDelay: '0.2s' }}>🔫</span>
          <span className="animate-float" style={{ animationDelay: '0.4s' }}>🐘</span>
        </div>
      </div>
    </div>
  );
}
