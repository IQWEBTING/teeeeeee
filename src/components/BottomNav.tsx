import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { playClick } from '../lib/audio';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'หน้าแรก', path: '/', emoji: '🏠' },
    { label: 'คะแนน', path: '/leaderboard', emoji: '🏆' },
    { label: 'วิธีเล่น', path: '/howtoplay', emoji: '📖' },
  ];

  // Don't show on admin or in-game pages if we want full immersion, 
  // but for mobile-first, easy escape is usually better.
  if (location.pathname === '/admin') return null;
  
  // Custom check: maybe hide during active gameplay to maximize screen real estate?
  const isGamePage = location.pathname.startsWith('/games/');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9000] sm:hidden bottom-nav-glass flex items-center justify-around px-2 py-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => {
              if (!isActive) {
                playClick();
                navigate(item.path);
              }
            }}
            className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${isActive ? 'nav-item-active' : 'text-white/60 hover:text-white/90'}`}
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="text-[10px] font-prompt uppercase tracking-wider">{item.label}</span>
            {isActive && (
              <span className="absolute -top-1 right-0 w-2 h-2 bg-[var(--color-pink)] rounded-full animate-pulse shadow-[0_0_8px_var(--color-pink)]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
