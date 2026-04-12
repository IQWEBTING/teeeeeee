import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import NavBar from '../components/NavBar';
import { useGameStore } from '../stores/gameStore';

const STEP_ICON_STYLE = "w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-white/30 shrink-0";

function StepCard({ num, icon, title, desc }: { num: number; icon: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start bg-white/10 hover:bg-white/20 transition-colors rounded-2xl p-4 border border-white/10">
      <div className={`${STEP_ICON_STYLE} bg-gradient-to-br from-[var(--color-water)] to-blue-600`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-white/20 text-white text-xs font-fredoka px-2 py-0.5 rounded-full">ขั้นที่ {num}</span>
          <h3 className="font-fredoka text-lg text-white">{title}</h3>
        </div>
        <p className="font-prompt text-white/80 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function TipBadge({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-[var(--color-gold)]/20 border border-[var(--color-gold)]/30 rounded-xl px-4 py-2.5">
      <span className="text-xl">{emoji}</span>
      <p className="font-prompt text-sm text-white/90">{text}</p>
    </div>
  );
}

export default function HowToPlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hasEnteredName, setHasEnteredName } = useGameStore();

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.anim-card'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out', delay: 0.1 }
      );
    }
  }, []);

  return (
    <div className="min-h-screen pt-[70px] pb-16" ref={containerRef}>
      <NavBar onOpenNameModal={() => setHasEnteredName(false)} />

      {/* Header */}
      <div className="anim-card text-center py-10 px-4">
        <div className="text-6xl mb-3 animate-float inline-block">📖</div>
        <h1 className="font-fredoka text-4xl md:text-5xl text-white drop-shadow-lg mb-2">คู่มือการเล่น</h1>
        <p className="font-prompt text-white/70 text-lg">สงกรานต์มินิเกม — เรียนรู้วิธีเล่นทั้ง 2 เกม</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 flex flex-col gap-10">

        {/* ===== GAME 1: GIRL GAME ===== */}
        <div className="anim-card card-game overflow-hidden">
          {/* Game Banner */}
          <div className="bg-gradient-to-r from-blue-500/50 to-cyan-400/50 p-6 flex items-center gap-4 border-b border-white/10">
            <div className="text-5xl animate-float">👧💦</div>
            <div>
              <p className="font-prompt text-white/60 text-sm uppercase tracking-widest">เกมที่ 1</p>
              <h2 className="font-fredoka text-2xl md:text-3xl text-white drop-shadow">สาวน้อยตกน้ำ</h2>
              <p className="font-prompt text-white/70 text-sm">Find the Admin · ยิ่งใช้น้อยครั้งยิ่งดี</p>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-4">
            {/* Objective */}
            <div className="bg-[var(--color-pink)]/20 border border-[var(--color-pink)]/30 rounded-xl p-4 text-center">
              <p className="font-fredoka text-lg text-white">🎯 เป้าหมาย</p>
              <p className="font-prompt text-white/80 text-sm mt-1">
                ค้นหา <strong className="text-[var(--color-gold)]">หัวแอดมิน 3 หัว</strong> ที่ซ่อนอยู่ใน 20 วงกลม ด้วยจำนวนคลิกที่น้อยที่สุด!
              </p>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-3">
              <StepCard num={1} icon="👀" title="มองดูกริด" desc="บนหน้าจอจะมีวงกลม 20 อัน เรียงเป็น 3 แถว (6–7–7) มีหัวแอดมินซ่อนอยู่ 3 หัวในจำนวนนั้น" />
              <StepCard num={2} icon="👆" title="คลิกเพื่อเปิด" desc="คลิกวงกลมที่คุณสงสัย — มันจะพลิกเผยว่าข้างในเป็นหัวแอดมินหรือเปล่า จำนวน 'ครั้งที่คลิก' จะนับขึ้นทุกครั้งที่คุณคลิก" />
              <StepCard num={3} icon="🥳" title="เจอครบ 3 หัว" desc="เมื่อคุณคลิกเจอหัวแอดมินครบทั้ง 3 หัว เกมจะจบทันที คะแนนของคุณคือจำนวนครั้งที่คลิกทั้งหมด" />
              <StepCard num={4} icon="🏆" title="ขึ้นลีดเดอร์บอร์ด" desc="คะแนนของคุณจะถูกบันทึกอัตโนมัติ ใครคลิกเจอด้วยจำนวนครั้งน้อยที่สุดจะได้อยู่อันดับต้น!" />
            </div>

            {/* Tips */}
            <div className="flex flex-col gap-2 mt-1">
              <p className="font-fredoka text-white/60 text-sm">💡 เคล็ดลับ</p>
              <TipBadge emoji="🧠" text="ลองแบ่งกริดเป็นโซน แล้วเปิดทีละโซน เพิ่มโอกาสเจอเร็วขึ้น" />
              <TipBadge emoji="🍀" text="แอดมินซ่อนสุ่มทุกรอบ ไม่มีรูปแบบ แต่ดวงช่วยได้!" />
            </div>

            {/* CTA */}
            <Link to="/games/girl" className="btn-water text-center font-fredoka text-lg py-3 mt-2 block rounded-full">
              เล่น สาวน้อยตกน้ำ 👧
            </Link>
          </div>
        </div>

        {/* ===== GAME 2: BALLOON GAME ===== */}
        <div className="anim-card card-game overflow-hidden">
          {/* Game Banner */}
          <div className="bg-gradient-to-r from-pink-500/50 to-rose-400/50 p-6 flex items-center gap-4 border-b border-white/10">
            <div className="text-5xl animate-float">🎈</div>
            <div>
              <p className="font-prompt text-white/60 text-sm uppercase tracking-widest">เกมที่ 2</p>
              <h2 className="font-fredoka text-2xl md:text-3xl text-white drop-shadow">ปาโป่งวัดดวง</h2>
              <p className="font-prompt text-white/70 text-sm">Matching Balloons · ยิ่งอยู่ได้นานยิ่งเก่ง</p>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-4">
            {/* Objective */}
            <div className="bg-[var(--color-pink)]/20 border border-[var(--color-pink)]/30 rounded-xl p-4 text-center">
              <p className="font-fredoka text-lg text-white">🎯 เป้าหมาย</p>
              <p className="font-prompt text-white/80 text-sm mt-1">
                กดลูกโป่งให้ได้ <strong className="text-[var(--color-gold)]">เลขตรงกัน 2 ลูก</strong> ภายใน 5 ครั้ง! ถ้าไม่ได้ แถวใหม่จะมาเรื่อยๆ — ใครอยู่ได้นาน (หลายแถว) คือผู้ชนะ!
              </p>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-3">
              <StepCard num={1} icon="👀" title="ดูแถวลูกโป่ง" desc="แต่ละแถวมีลูกโป่ง 10 ลูก แต่ละลูกมีตัวเลขซ่อนอยู่ด้านใน — คุณเห็นเฉพาะสีในตอนแรก" />
              <StepCard num={2} icon="🎈" title="กดเพื่อเปิดเลข" desc="คลิกลูกโป่งเพื่อพลิกดูตัวเลข คุณมี 5 โอกาสต่อแถว เพื่อหาลูกโป่ง 2 ลูกที่มีเลขตรงกัน" />
              <StepCard num={3} icon="✅" title="จับคู่ได้ = ผ่าน!" desc="ถ้าลูกโป่งที่ 2 ลูกมีเลขตรงกัน คุณผ่านแถวนั้น และจะได้แถวใหม่ต่อไปเรื่อยๆ" />
              <StepCard num={4} icon="💥" title="ไม่จับคู่ = เกมจบ" desc="ถ้าใช้ครบ 5 ครั้งแล้วไม่เจอคู่เลย เกมจะจบทันที คะแนนคือจำนวนแถวที่ผ่านได้ทั้งหมด" />
              <StepCard num={5} icon="🏆" title="แข่งกันทนที่สุด" desc="ยิ่งผ่านได้หลายแถวยิ่งดี! คะแนนจะถูกบันทึกและแสดงบนลีดเดอร์บอร์ด" />
            </div>

            {/* Visual example of a row */}
            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <p className="font-fredoka text-white/60 text-sm mb-3">ตัวอย่างแถวลูกโป่ง (10 ลูก · 5 ครั้งต่อแถว)</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['🎈','🎈','🎈','🎈','🎈','🎈','🎈','🎈','🎈','🎈'].map((b, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-lg shadow-md border-2 border-white/20 cursor-default hover:scale-110 transition-transform">
                    {b}
                  </div>
                ))}
              </div>
              <p className="font-prompt text-white/50 text-xs mt-3">ข้างในแต่ละลูกมีตัวเลขซ่อนอยู่ กดเพื่อเปิด!</p>
            </div>

            {/* Tips */}
            <div className="flex flex-col gap-2 mt-1">
              <p className="font-fredoka text-white/60 text-sm">💡 เคล็ดลับ</p>
              <TipBadge emoji="🎯" text="จำเลขที่เปิดไปแล้วให้ดี! ถ้าเปิดเลข 7 แล้วต่อมาเปิดเจออีก 7 นั่นแหละคือคู่" />
              <TipBadge emoji="🧮" text="ในแต่ละแถวมีเลขซ้ำกันอย่างน้อย 1 คู่ ดังนั้นอย่าเพิ่งหมดหวัง!" />
              <TipBadge emoji="🍀" text="ยิ่งอยู่ได้หลายแถวยิ่งเก่ง ไม่มีขีดจำกัด — ท้าทายตัวเองดู!" />
            </div>

            {/* CTA */}
            <Link to="/games/balloon" className="btn-pink text-center font-fredoka text-lg py-3 mt-2 block rounded-full">
              เล่น ปาโป่งวัดดวง 🎈
            </Link>
          </div>
        </div>

        {/* Quick Summary Table */}
        <div className="anim-card card-game p-6">
          <h2 className="font-fredoka text-2xl text-center mb-5">📊 สรุปเปรียบเทียบ 2 เกม</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-prompt">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-2 pr-4 text-white/60"></th>
                  <th className="text-center py-2 px-2 text-white">👧 สาวน้อยตกน้ำ</th>
                  <th className="text-center py-2 px-2 text-white">🎈 ปาโป่งวัดดวง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  ['วัตถุประสงค์', 'หาหัวแอดมิน 3 หัว', 'จับคู่ลูกโป่งให้นานที่สุด'],
                  ['วงกลม/ลูกโป่ง', '20 วงกลม', '10 ลูกต่อแถว'],
                  ['จำนวนครั้ง', 'ไม่จำกัด (นับทุกครั้ง)', '5 ครั้งต่อแถว'],
                  ['คะแนน', 'จำนวนครั้งที่คลิก', 'จำนวนแถวที่ผ่าน'],
                  ['ชนะเลิศ', 'คลิก น้อย ที่สุด', 'ผ่าน มาก แถวที่สุด'],
                ].map(([label, g1, g2]) => (
                  <tr key={label} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 pr-4 text-white/60 whitespace-nowrap">{label}</td>
                    <td className="py-2.5 px-2 text-center text-white/90">{g1}</td>
                    <td className="py-2.5 px-2 text-center text-white/90">{g2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nav Buttons */}
        <div className="anim-card flex flex-col sm:flex-row gap-3 justify-center pb-4">
          <Link to="/" className="btn-water font-fredoka text-lg py-3 px-8 text-center rounded-full">
            🏠 กลับหน้าหลัก
          </Link>
          <Link to="/leaderboard" className="btn-pink font-fredoka text-lg py-3 px-8 text-center rounded-full">
            🏆 ดูลีดเดอร์บอร์ด
          </Link>
        </div>

      </div>
    </div>
  );
}
