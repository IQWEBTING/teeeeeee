import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import { supabase } from '../lib/supabase';
import { useGameStore } from '../stores/gameStore';
import GameCard from '../components/GameCard';
import PlayerNameModal from '../components/PlayerNameModal';
import NavBar from '../components/NavBar';
import { playClick } from '../lib/audio';

export default function Landing() {
  const { hasEnteredName, playerName, setHasEnteredName } = useGameStore();
  const navigate = useNavigate();
  
  const [showNameModal, setShowNameModal] = useState(!hasEnteredName);
  const [bestGirlScore, setBestGirlScore] = useState<number | null>(null);
  const [bestBalloonScore, setBestBalloonScore] = useState<number | null>(null);

  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Lobby background is now handled by GlobalPhaser component

  // Fetch Best Scores
  useEffect(() => {
    if (playerName && hasEnteredName) {
      const fetchScores = async () => {
        const [girlRes, balloonRes] = await Promise.all([
          supabase
            .from('girl_game_scores')
            .select('selections_used')
            .eq('player_name', playerName)
            .order('selections_used', { ascending: true })
            .limit(1)
            .maybeSingle(),
          supabase
            .from('balloon_game_scores')
            .select('rows_used')
            .eq('player_name', playerName)
            .order('rows_used', { ascending: false })
            .limit(1)
            .maybeSingle()
        ]);

        if (girlRes.data) setBestGirlScore(girlRes.data.selections_used);
        if (balloonRes.data) setBestBalloonScore(balloonRes.data.rows_used);
      };
      fetchScores();
    }
  }, [playerName, hasEnteredName]);

  // Entrance Animations
  useEffect(() => {
    if (heroTitleRef.current) {
      gsap.fromTo(heroTitleRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'bounce.out' });
    }
    if (subtitleRef.current) {
      gsap.fromTo(subtitleRef.current, { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.5 });
    }
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out', delay: 0.3 }
      );
    }
  }, []);

  // Sync state if it changed from NavBar
  useEffect(() => {
    if (!hasEnteredName) {
      setShowNameModal(true);
    } else {
      setShowNameModal(false);
    }
  }, [hasEnteredName]);

  return (
    <div className="relative min-h-screen pb-safe-nav">
      <NavBar onOpenNameModal={() => {
        setHasEnteredName(false); // force re-open
        setShowNameModal(true);
      }} />

      {/* Phaser Background */}
      <div id="lobby-bg" className="absolute inset-0 z-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 pt-[100px] flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* A) Hero Section */}
        <div className="text-center mb-12 w-full">
          <h1 ref={heroTitleRef} className="text-responsive-h1 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] mb-4">
            🎊 สงกรานต์เกมส์ 💦
          </h1>
          <p ref={subtitleRef} className="text-responsive-p text-white/90 drop-shadow-md relative inline-block">
            เล่นเกม ลุ้นรางวัล สนุกสุดฝน!
            
            {/* Animated SVG wave below title */}
            <svg className="absolute -bottom-6 left-0 w-full h-8 overflow-hidden pointer-events-none" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path className="animate-[water-ripple_3s_linear_infinite] opacity-30" d="M0,10 Q25,20 50,10 T100,10 V20 H0 Z" fill="var(--color-gold)" />
              <path className="animate-[water-ripple_4s_linear_infinite] opacity-50" d="M0,15 Q25,5 50,15 T100,15 V20 H0 Z" fill="var(--color-pink)" />
              <path className="animate-[water-ripple_5s_linear_infinite] opacity-80" d="M0,18 Q25,8 50,18 T100,18 V20 H0 Z" fill="white" />
            </svg>
          </p>
        </div>

        {/* B) Games Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl z-10 px-4">
          <GameCard
            title="สาวน้อยตกน้ำ"
            emoji="👧💦"
            description="เลือกหัวจ่ายน้ำให้ถูกต้องด้วยจำนวนครั้งที่น้อยที่สุด!"
            scoreLabel="ครั้งน้อยสุด"
            scoreSuffix="ครั้ง"
            path="/games/girl"
            bestScore={bestGirlScore}
          />
          <GameCard
            title="ปาโป่ง"
            emoji="🎈💥"
            description="ปาโป่งให้ตรงคู่ ยิ่งผ่านไปได้หลายแถวยิ่งเก่ง!"
            scoreLabel="แถวมากสุด"
            scoreSuffix="แถว"
            path="/games/balloon"
            bestScore={bestBalloonScore}
          />
        </div>

        {/* C) Footer Strip */}
        <div className="mt-16 w-full max-w-md mx-auto text-center z-10">
          <button 
            className="btn-water w-full py-4 text-xl flex items-center justify-center gap-2"
            onClick={() => {
              playClick();
              navigate('/leaderboard');
            }}
          >
            🏆 ดูลีดเดอร์บอร์ด
          </button>
          <div className="flex justify-center gap-4 mt-6 opacity-60">
            <span className="animate-float" style={{ animationDelay: '0s' }}>💧</span>
            <span className="animate-float" style={{ animationDelay: '0.2s' }}>💦</span>
            <span className="animate-float" style={{ animationDelay: '0.4s' }}>💧</span>
            <span className="animate-float" style={{ animationDelay: '0.6s' }}>💦</span>
          </div>
        </div>

      </div>

      {showNameModal && <PlayerNameModal />}
    </div>
  );
}
