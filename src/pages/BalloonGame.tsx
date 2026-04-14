import { useEffect, useRef, useState } from 'react';
import { baseConfig } from '../phaser/config';
import ResultOverlay from '../components/ResultOverlay';
import { useGameStore } from '../stores/gameStore';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router';
import { resumeAudioContext } from '../lib/audio';

export default function BalloonGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { playerName } = useGameStore();
  const navigate = useNavigate();
  
  // Emergency resume for audio on mount and setup listeners
  useEffect(() => {
    resumeAudioContext();
    
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const onResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('resize', onResize);
    
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        // Attempt to lock orientation
        // @ts-ignore
        if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
          // @ts-ignore
          await window.screen.orientation.lock('landscape').catch(() => {
            console.log("Orientation lock not supported or failed");
          });
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  useEffect(() => {
    const handleGameEnd = async (e: Event) => {
      const customEvent = e as CustomEvent;
      const finalScore = customEvent.detail.score; // Rows used
      setScore(finalScore);
      setShowResult(true);

      // Save to Supabase (Unique best score logic)
      if (playerName) {
        try {
          // 1. Check for existing best score
          const { data: existing } = await supabase
            .from('balloon_game_scores')
            .select('id, rows_used')
            .eq('player_name', playerName)
            .maybeSingle();

          if (!existing) {
            // No record yet, insert new
            await supabase.from('balloon_game_scores').insert([
              { player_name: playerName, rows_used: finalScore },
            ]);
          } else if (finalScore > existing.rows_used) {
            // New score is better, update existing record
            await supabase.from('balloon_game_scores')
              .update({ rows_used: finalScore, created_at: new Date().toISOString() })
              .eq('id', existing.id);
          }
        } catch (error) {
          console.error("Failed to save score:", error);
        }
      }
    };

    window.addEventListener('balloon-game-end', handleGameEnd);

    return () => {
      window.removeEventListener('balloon-game-end', handleGameEnd);
      // Phaser Game destruction is now handled by GlobalPhaser component
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
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 md:flex-row md:gap-4">
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
        className={`absolute top-4 right-4 z-20 ${isFullscreen ? 'bg-red-500/80 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'} text-white px-4 py-2 rounded-full backdrop-blur-sm transition-all border border-white/20 font-prompt flex items-center gap-2 shadow-lg`}
      >
        {isFullscreen ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
            <span>ออก</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
            <span className="hidden md:inline">เต็มจอ</span>
            <span className="md:hidden">แนวนอน</span>
          </>
        )}
      </button>

      {/* Rotation hint for mobile in fullscreen portrait */}
      {isFullscreen && isPortrait && (
        <div className="absolute inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center text-white font-prompt p-6 text-center animate-fade-in">
          <div className="w-16 h-16 mb-4 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/><path d="m15 7-3-3-3 3"/></svg>
          </div>
          <h2 className="text-xl font-bold mb-2">กรุณาหมุนโทรศัพท์เป็นแนวนอน</h2>
          <p className="text-white/70">เพื่อประสบการณ์การเล่นเกมที่ดีที่สุด</p>
          <button 
            onClick={() => setIsPortrait(false)} // Let users dismiss if needed, though resize will likely trigger it again
            className="mt-6 bg-white/10 px-4 py-2 rounded-full text-sm border border-white/20"
          >
            ฉันหมุนแล้ว/ข้าม
          </button>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className="w-full h-full bg-slate-900 opacity-0 pointer-events-none" 
      >
        {/* The Phaser canvas is now injected by GlobalPhaser in main.tsx */}
      </div>

      {showResult && (
        <ResultOverlay
          isVisible={showResult}
          title="ปาเป้าเข้าคู่แล้ว!"
          scoreText={`ใช้ไปทั้งหมด: ${score} แถว`}
          ratingText={getRatingText(score)}
          onReplay={() => {
            setShowResult(false);
            setScore(0);
            window.dispatchEvent(new CustomEvent('phaser-restart-scene'));
          }}
          onLeaderboard={() => navigate('/leaderboard')}
        />
      )}
    </div>
  );
}
