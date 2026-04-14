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
import LoadingScreen from './components/LoadingScreen';
import GlobalPhaser from './components/GlobalPhaser';
import BottomNav from './components/BottomNav';
import NotFound from './pages/NotFound';
import { PostHogProvider } from '@posthog/react';

const posthogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
} as const;

// Placeholder component for future phase
const Admin = () => <div className="p-8 text-center"><h1 className="text-4xl text-white font-fredoka">Admin Dashboard</h1></div>;

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  if (isLoading) {
    return (
      <LoadingScreen 
        onFinished={() => {
          setIsLoading(false);
          // Force jump to landing page to prevent initialization bugs on deep links
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        }} 
      />
    );
  }

  return (
    <React.StrictMode>
      <PostHogProvider 
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN} 
        options={posthogOptions}
      >
        <BrowserRouter>
          <div className="min-h-screen bg-[var(--color-water)] overflow-hidden font-prompt text-white">
            {/* Global Phaser Instance */}
            <GlobalPhaser />

            {/* Global Overlays */}
            <WaterCursor />
            <SplashParticleSystem />
            <MusicToggle />
            <BottomNav />
            
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/games/girl" element={<GirlGame />} />
              <Route path="/games/balloon" element={<BalloonGame />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/howtoplay" element={<HowToPlay />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </PostHogProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
