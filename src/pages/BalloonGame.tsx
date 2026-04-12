import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { baseConfig } from '../phaser/config';
import BalloonScene from '../phaser/scenes/BalloonScene';
import ResultOverlay from '../components/ResultOverlay';
import { useGameStore } from '../stores/gameStore';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router';

export default function BalloonGame() {
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
      scene: [BalloonScene],
    };

    const game = new Phaser.Game(config);

    const handleGameEnd = async (e: Event) => {
      const customEvent = e as CustomEvent;
      const finalScore = customEvent.detail.score; // Rows used
      setScore(finalScore);
      setShowResult(true);

      // Save to Supabase
      if (playerName) {
        try {
          await supabase.from('balloon_game_scores').insert([
            { player_name: playerName, rows_used: finalScore },
          ]);
        } catch (error) {
          console.error("Failed to save score:", error);
        }
      }
    };

    window.addEventListener('balloon-game-end', handleGameEnd);

    return () => {
      window.removeEventListener('balloon-game-end', handleGameEnd);
      game.destroy(true);
    };
  }, [playerName]);

  // Higher rows used is better
  const getRatingText = (rows: number) => {
    if (rows >= 10) return "โคตรอึด! สุดยอดมากๆ 🏆";
    if (rows >= 5) return "สู้ได้ดีมากแม่นยำสุดๆ 👏";
    return "จบไวไปหน่อย พรุ่งนี้มาแก้มือนะ 🥲";
  };

  return (
    <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 md:flex-row md:gap-4">
        <Link to="/" className="text-white flex items-center gap-2 hover:text-[#00CED1] transition-colors font-prompt bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          กลับหน้าหลัก
        </Link>
        <Link to="/games/girl" className="text-white flex items-center gap-2 hover:text-[#00a8cc] transition-colors font-prompt bg-[#00a8cc]/20 border border-[#00a8cc]/50 px-4 py-2 rounded-full backdrop-blur-sm">
          สลับไปเล่น สาวน้อยตกน้ำ 👧
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
          title="ปาเป้าเข้าคู่แล้ว!"
          scoreText={`ใช้ไปทั้งหมด: ${score} แถว`}
          ratingText={getRatingText(score)}
          onReplay={() => window.location.reload()}
          onLeaderboard={() => window.location.href = '/leaderboard'}
        />
      )}
    </div>
  );
}
