import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { baseConfig } from '../phaser/config';
import GirlGameScene from '../phaser/scenes/GirlGameScene';
import ResultOverlay from '../components/ResultOverlay';
import { useGameStore } from '../stores/gameStore';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router';

export default function GirlGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { playerName } = useGameStore();

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      // @ts-ignore - TS might not recognize orientation.lock fully across all targets
      if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
        // @ts-ignore
        await window.screen.orientation.lock('landscape').catch(() => {});
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      ...baseConfig,
      parent: containerRef.current,
      scene: [GirlGameScene],
    };

    const game = new Phaser.Game(config);

    const handleGameEnd = async (e: Event) => {
      const customEvent = e as CustomEvent;
      const finalScore = customEvent.detail.score; // Number of clicks used
      setScore(finalScore);
      setShowResult(true);

      // Save to Supabase
      if (playerName) {
        try {
          await supabase.from('girl_game_scores').insert([
            { player_name: playerName, selections_used: finalScore },
          ]);
        } catch (error) {
          console.error("Failed to save score:", error);
        }
      }
    };

    window.addEventListener('girl-game-end', handleGameEnd);

    return () => {
      window.removeEventListener('girl-game-end', handleGameEnd);
      game.destroy(true);
    };
  }, [playerName]);

  // For clicks, lower is better.
  const getRatingText = (clicks: number) => {
    if (clicks === 3) return "แรร์ไอเท็ม! แม่นเหมือนจับวาง 👑";
    if (clicks <= 8) return "เซียนเรียกพี่! 😎";
    if (clicks <= 15) return "โชคยังเข้าข้างนะ 🍀";
    return "เกลือล้วนๆ ดื่มน้ำไปก่อนนะ 💦";
  };

  return (
    <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 md:flex-row md:gap-4">
        <Link to="/" className="text-white flex items-center gap-2 hover:text-[#00CED1] transition-colors font-prompt bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          กลับหน้าหลัก
        </Link>
        <Link to="/games/balloon" className="text-white flex items-center gap-2 hover:text-[#FF69B4] transition-colors font-prompt bg-[#FF69B4]/20 border border-[#FF69B4]/50 px-4 py-2 rounded-full backdrop-blur-sm">
          สลับไปเล่น ปาโป่ง 🎈
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </Link>
      </div>
      
      <button 
        onClick={handleFullscreen}
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-sm transition-colors border border-white/20 font-prompt flex items-center gap-2 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
        <span className="hidden md:inline">เต็มจอ</span>
        <span className="md:hidden">แนวนอน</span>
      </button>

      <div 
        ref={containerRef} 
        className="w-full h-full bg-slate-900"
      />

      {showResult && (
        <ResultOverlay
          isVisible={showResult}
          title="ภารกิจเสร็จสิ้น!"
          scoreText={`ใช้จำนวนกดไปทั้งหมด: ${score} ครั้ง`}
          ratingText={getRatingText(score)}
          onReplay={() => window.location.reload()}
          onLeaderboard={() => window.location.href = '/leaderboard'}
        />
      )}
    </div>
  );
}
