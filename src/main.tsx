import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './styles/songkran-theme.css';

import Landing from './pages/Landing';
import Leaderboard from './pages/Leaderboard';
import GirlGame from './pages/GirlGame';
import BalloonGame from './pages/BalloonGame';
import HowToPlay from './pages/HowToPlay';
import WaterCursor from './components/WaterCursor';
import SplashParticleSystem from './components/SplashParticle';
import MusicToggle from './components/MusicToggle';

// Placeholder component for future phase
const Admin = () => <div className="p-8 text-center"><h1 className="text-4xl text-white font-fredoka">Admin Dashboard</h1></div>;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-water)] overflow-hidden font-prompt text-white">
        {/* Global Overlays */}
        <WaterCursor />
        <SplashParticleSystem />
        <MusicToggle />
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/games/girl" element={<GirlGame />} />
          <Route path="/games/balloon" element={<BalloonGame />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/howtoplay" element={<HowToPlay />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
