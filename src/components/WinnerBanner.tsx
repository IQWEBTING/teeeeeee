import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type Winner = { name: string; game: string };

export default function WinnerBanner() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 1. Fetch initial latest announcement
    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('announced_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data && data.winners_json && Array.isArray(data.winners_json)) {
        if (data.winners_json.length > 0) {
          setWinners(data.winners_json as Winner[]);
          setShow(true);
        } else {
          setShow(false); // empty array can imply hiding
        }
      }
    };

    fetchLatest();

    // 2. Subscribe to realtime inserts
    const channel: RealtimeChannel = supabase
      .channel('announcements-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        (payload) => {
          const newDoc = payload.new;
          if (newDoc && newDoc.winners_json && Array.isArray(newDoc.winners_json)) {
            if (newDoc.winners_json.length > 0) {
              setWinners(newDoc.winners_json as Winner[]);
              setShow(true);
            } else {
              setShow(false);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!show || winners.length === 0) return null;

  return (
    <div className="relative w-full bg-gradient-to-b from-yellow-300 via-[var(--color-gold)] to-yellow-600 text-yellow-950 px-4 py-8 overflow-hidden shadow-2xl border-b-4 border-yellow-200">
      
      {/* Confetti Background CSS */}
      <div className="absolute inset-0 pointer-events-none opacity-50 flex overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              backgroundColor: ['#fff', '#FF69B4', '#00CED1', '#ff4500'][Math.floor(Math.random() * 4)],
              animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(200px) rotate(360deg); opacity: 0; }
        }
      `}</style>
      
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-fredoka text-center mb-6 drop-shadow-md tracking-wider">
          🎊 ผู้ชนะเลิศสงกรานต์เกมส์ 2568 🎊
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center w-full">
          {winners.map((winner, idx) => (
            <div key={idx} className="bg-white/30 backdrop-blur-sm px-6 py-4 rounded-xl border-2 border-white/50 text-center flex-1 shadow-lg transform transition-transform hover:scale-105">
              <span className="text-4xl block mb-2">{winner.game === 'girl' ? '👧💦' : '🎈💥'}</span>
              <h3 className="font-fredoka text-xl text-yellow-900">{winner.game === 'girl' ? 'สาวน้อยตกน้ำ' : 'ปาโป่ง'}</h3>
              <p className="font-prompt text-2xl font-bold text-yellow-950 mt-1">{winner.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
