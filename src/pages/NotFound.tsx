import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import { playClick } from '../lib/audio';

export default function NotFound() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const tl = gsap.timeline();
      tl.fromTo('.anim-404', 
        { scale: 0, rotation: -20, opacity: 0 }, 
        { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: 'back.out(1.7)' }
      );
      tl.fromTo('.anim-text', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.2 }, 
        "-=0.5"
      );
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#00CED1] to-[#001f3f] text-white p-6 text-center overflow-hidden relative"
    >
      {/* Background Splashes */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '0s' }}>💦</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>💧</div>
      <div className="absolute top-1/4 right-1/4 text-4xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>💦</div>

      <div className="z-10">
        <div className="anim-404 text-[120px] md:text-[180px] font-fredoka leading-none drop-shadow-[0_10px_30px_rgba(255,255,255,0.3)] select-none">
          404
        </div>
        
        <div className="anim-text mt-4">
          <div className="text-5xl mb-4">😵‍💫💦</div>
          <h1 className="text-3xl md:text-4xl font-fredoka mb-2 text-[var(--color-gold)]">โอ๊ะ! หน้านี้โดนน้ำสาดหายไปแล้ว</h1>
          <p className="font-prompt text-lg md:text-xl text-white/80 mb-8 max-w-md mx-auto">
            ดูเหมือนเราจะหาหน้าที่คุณต้องการไม่เจอ ลองกลับไปตั้งหลักที่หน้าแรกก่อนนะ!
          </p>
        </div>

        <button
          onClick={() => {
            playClick();
            navigate('/');
          }}
          className="anim-text btn-water text-2xl font-fredoka px-12 py-4 rounded-full shadow-[0_0_30px_rgba(0,206,209,0.5)] active:scale-95 transition-transform"
        >
          กลับหน้าหลัก 🏠
        </button>
      </div>

      {/* Waves Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            className="animate-[water-ripple_5s_linear_infinite]" 
            d="M0,60 Q300,100 600,60 T1200,60 V120 H0 Z" 
            fill="rgba(255,255,255,0.1)" 
          />
          <path 
            className="animate-[water-ripple_4s_linear_infinite]" 
            d="M0,80 Q300,40 600,80 T1200,80 V120 H0 Z" 
            fill="rgba(255,255,255,0.2)" 
          />
        </svg>
      </div>
    </div>
  );
}
