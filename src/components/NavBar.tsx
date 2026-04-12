import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useGameStore } from '../stores/gameStore';

interface NavBarProps {
  onOpenNameModal?: () => void;
}

export default function NavBar({ onOpenNameModal }: NavBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { playerName, hasEnteredName } = useGameStore();

  if (location.pathname === '/admin') {
    return null; // Hide on admin route
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[9000] bg-white/10 backdrop-blur-md border-b border-white/20 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm">
        
        {/* Left: Logo & Title */}
        <div 
          className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigate('/')}
        >
          <span className="text-3xl filter drop-shadow-md">💦</span>
          <h1 className="text-xl md:text-2xl font-fredoka text-white tracking-widest hidden sm:block drop-shadow-md">
            สงกรานต์เกมส์
          </h1>
        </div>

        {/* Right: Leaderboard & Player */}
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => navigate('/leaderboard')}
            className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-blue-500/50 to-blue-400/50 hover:from-blue-500/70 hover:to-blue-400/70 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full font-prompt text-sm md:text-base border border-white/30 transition-all shadow-md"
          >
            <span>🏆</span> 
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          <button 
            onClick={() => navigate('/howtoplay')}
            className="flex items-center gap-1 md:gap-2 bg-[var(--color-gold)]/30 hover:bg-[var(--color-gold)]/50 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full font-prompt text-sm md:text-base border border-[var(--color-gold)]/40 transition-all shadow-md"
          >
            <span>📖</span> 
            <span className="hidden sm:inline">วิธีเล่น</span>
          </button>
          
          {hasEnteredName ? (
            <button
              onClick={onOpenNameModal}
              className="flex items-center gap-2 bg-[var(--color-pink)]/80 hover:bg-[var(--color-pink)] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full font-prompt text-sm md:text-base border border-white/30 transition-all shadow-md"
            >
              <span>👤</span> 
              <span className="max-w-[100px] truncate">{playerName}</span>
            </button>
          ) : (
            <button
              onClick={onOpenNameModal}
              className="flex items-center gap-2 bg-[var(--color-pink)]/80 hover:bg-[var(--color-pink)] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full font-prompt text-sm md:text-base border border-white/30 transition-all shadow-md"
            >
              <span>👤</span> 
              <span>เข้าสู่ระบบ</span>
            </button>
          )}
        </div>
      </nav>

      {/* Decorative Wave Border Bottom */}
      <div className="fixed top-[60px] md:top-[68px] left-0 right-0 h-2 z-[9000] overflow-hidden pointer-events-none opacity-50">
        <svg viewBox="0 0 1200 20" preserveAspectRatio="none" className="w-[200%] h-full animate-[water-ripple_4s_linear_infinite]" style={{ transformOrigin: 'left' }}>
          <path d="M0,0 Q150,20 300,0 T600,0 T900,0 T1200,0 V20 H0 Z" fill="var(--color-water)" />
        </svg>
      </div>
    </>
  );
}
