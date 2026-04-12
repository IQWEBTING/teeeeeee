import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import NavBar from '../components/NavBar';
import WinnerBanner from '../components/WinnerBanner';
import { supabase } from '../lib/supabase';
import { useSplash } from '../components/SplashParticle';
import { useGameStore } from '../stores/gameStore';
import PlayerNameModal from '../components/PlayerNameModal';

type TapType = 'girl' | 'balloon';

type ScoreRow = {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
};

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<TapType>('girl');
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const { triggerSplash } = useSplash();
  const indicatorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { hasEnteredName, setHasEnteredName } = useGameStore();
  const [showModal, setShowModal] = useState(false);

  // Handle Tab Switch Animation
  useEffect(() => {
    if (indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        x: activeTab === 'girl' ? '0%' : '100%',
        duration: 0.4,
        ease: 'power3.out'
      });
    }
  }, [activeTab]);

  // Fetch Data & Subscribe
  useEffect(() => {
    const fetchScores = async () => {
      const table = activeTab === 'girl' ? 'girl_game_scores' : 'balloon_game_scores';
      const scoreCol = activeTab === 'girl' ? 'selections_used' : 'rows_used';

      const { data, error } = await supabase
        .from(table)
        .select(`id, player_name, ${scoreCol}, created_at`)
        .order(scoreCol, { ascending: true })
        .order('created_at', { ascending: true })
        .limit(10);
      
      if (!error && data) {
        setScores(data.map(d => ({
          id: d.id,
          player_name: d.player_name,
          score: d[scoreCol as keyof typeof d] as number,
          created_at: d.created_at
        })));
      }
    };

    fetchScores();

    const table = activeTab === 'girl' ? 'girl_game_scores' : 'balloon_game_scores';
    const channel = supabase.channel(`public:${table}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table }, (payload) => {
        // Optimistic refresh
        fetchScores();
        // Play splash on exact new item requires DOM lookup, but we can do a general splash
        triggerSplash(window.innerWidth / 2, window.innerHeight / 2);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab, triggerSplash]);

  // List entrance animation whenever scores array changes length from 0 to N
  useEffect(() => {
    if (listRef.current && scores.length > 0) {
      gsap.fromTo(
        listRef.current.children,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [activeTab]); // re-trigger on tab change

  const renderBadge = (index: number) => {
    if (index === 0) return <span className="badge-gold text-sm md:text-base">🥇 อันดับ {index + 1}</span>;
    if (index === 1) return <span className="badge-silver text-sm md:text-base">🥈 อันดับ {index + 1}</span>;
    if (index === 2) return <span className="badge-bronze text-sm md:text-base">🥉 อันดับ {index + 1}</span>;
    return <span className="bg-white/20 px-3 py-1 rounded-full text-white font-fredoka text-sm border-2 border-white/10">อันดับ {index + 1}</span>;
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'เมื่อกี้';
    if (diff < 60) return `${diff} นาทีที่แล้ว`;
    return `${Math.floor(diff / 60)} ชม. ที่แล้ว`;
  };

  return (
    <div className="min-h-screen pt-[70px] pb-10">
      <NavBar onOpenNameModal={() => {
        setHasEnteredName(false);
        setShowModal(true);
      }} />
      <WinnerBanner />

      <div className="max-w-3xl mx-auto px-4 mt-8">
        <h1 className="text-4xl text-center font-fredoka mb-8 drop-shadow-md">
          🏆 ตารางคะแนน
        </h1>

        {/* Tabs */}
        <div className="relative flex w-full max-w-sm mx-auto bg-black/20 rounded-full p-1 mb-8 overflow-hidden backdrop-blur-sm">
          <div 
            ref={indicatorRef} 
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-[var(--color-water)] rounded-full shadow-md z-0" 
          />
          <button 
            className={`flex-1 py-2 font-prompt z-10 transition-colors ${activeTab === 'girl' ? 'text-white font-bold' : 'text-white/60 hover:text-white/80'}`}
            onClick={() => setActiveTab('girl')}
          >
            👧💦 สาวน้อย
          </button>
          <button 
            className={`flex-1 py-2 font-prompt z-10 transition-colors ${activeTab === 'balloon' ? 'text-white font-bold' : 'text-white/60 hover:text-white/80'}`}
            onClick={() => setActiveTab('balloon')}
          >
            🎈 ปาโป่ง
          </button>
        </div>

        {/* List */}
        <div className="card-game p-4 md:p-6 min-h-[400px]">
          {scores.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-white/50 text-center opacity-80">
              <div className="text-5xl animate-float mb-4">🦆</div>
              <p className="font-prompt text-xl">ยังไม่มีคะแนน เป็นคนแรก! 💦</p>
            </div>
          ) : (
            <div ref={listRef} className="flex flex-col gap-3">
              {scores.map((row, idx) => (
                <div 
                  key={row.id} 
                  className="flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl p-4 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 shrink-0">
                      {renderBadge(idx)}
                    </div>
                    <span className="font-prompt font-bold text-lg truncate max-w-[120px] md:max-w-[200px]">
                      {row.player_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 md:gap-8 shrink-0">
                    <div className="flex flex-col items-end">
                      <span className="font-fredoka text-xl text-[var(--color-gold)]">
                        {row.score} <span className="text-sm text-white/80 font-prompt">{activeTab === 'girl' ? 'ครั้ง' : 'แถว'}</span>
                      </span>
                      <span className="text-xs text-white/50">{getTimeAgo(row.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && !hasEnteredName && <PlayerNameModal />}
    </div>
  );
}
