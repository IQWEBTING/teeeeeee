import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import Phaser from 'phaser';
import { createPhaserGame } from '../phaser/config';
import { useGameStore } from '../stores/gameStore';
import { bgMusic } from '../lib/audio';

// Global variable to persist Phaser game instance across navigation and HMR
let sharedGame: Phaser.Game | null = null;

/**
 * GlobalPhaser component manages a single Phaser Game instance
 * throughout the application lifecycle to prevent transition lag.
 */
export default function GlobalPhaser() {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // 1. Initialize or Re-parent Game Instance singleton
  useEffect(() => {
    if (!containerRef.current) return;

    if (!sharedGame) {
      // Create for the first time
      sharedGame = createPhaserGame(containerRef.current, []);
    } else {
      // Re-parent the existing canvas to the new container
      const canvas = sharedGame.canvas;
      if (canvas && containerRef.current) {
        containerRef.current.appendChild(canvas);
        // Ensure scale manager updates
        sharedGame.scale.refresh();
      }
    }

    // IMPORTANT: No local destroy in cleanup to preserve AudioContext & Resources
    // We only create once and let it live forever.
  }, []);

  const game = sharedGame;

  // 1.1 Support explicit audio resume for autoplay policies
  useEffect(() => {
    const handleResume = () => {
      if (game && game.sound) {
        game.sound.resumeAll();
      }
    };
    window.addEventListener('resume-game-audio', handleResume);
    return () => window.removeEventListener('resume-game-audio', handleResume);
  }, [game]);

  // 1.2 Support scene restart without page reload
  useEffect(() => {
    const handleRestart = () => {
      if (game && game.scene) {
        const activeScenes = game.scene.getScenes(true);
        activeScenes.forEach(s => {
          if (s.scene.key !== 'LobbyScene') {
            s.scene.restart();
          }
        });
      }
    };
    window.addEventListener('phaser-restart-scene', handleRestart);
    return () => window.removeEventListener('phaser-restart-scene', handleRestart);
  }, [game]);

  // 2. Handle Scene Switching based on Route
  useEffect(() => {
    if (!game) return;

    const path = location.pathname;
    const sceneManager = game.scene;

    // Helper to start or restart scene
    const transitionTo = (sceneKey: string) => {
      const activeScenes = sceneManager.getScenes(true);
      
      // Stop ALL other scenes to prevent overlap/ghosts
      activeScenes.forEach(s => {
        if (s.scene.key !== sceneKey) {
          sceneManager.stop(s.scene.key);
        }
      });

      const isSceneRunning = activeScenes.some(s => s.scene.key === sceneKey);
      if (isSceneRunning) {
        sceneManager.getScene(sceneKey).scene.restart();
      } else {
        sceneManager.start(sceneKey);
      }
    };

    if (path === '/games/girl') {
      transitionTo('GirlGameScene');
    } else if (path === '/games/balloon') {
      transitionTo('BalloonScene');
    } else {
      // Default to LobbyScene (Home, Leaderboard, etc.)
      const activeScenes = sceneManager.getScenes(true);
      const isLobbyActive = activeScenes.some(s => s.scene.key === 'LobbyScene');
      
      if (!isLobbyActive) {
        // Stop any game scenes before going back to lobby
        activeScenes.forEach(s => sceneManager.stop(s.scene.key));
        sceneManager.start('LobbyScene');
      }
    }
  }, [location.pathname]);

  // 3. Handle Audio Fade based on Route
  const { isMusicOn } = useGameStore();

  useEffect(() => {
    // If music is toggled OFF, ensure it's paused and don't try to fade
    if (!isMusicOn) {
      bgMusic.pause();
      return;
    }

    const isAtGame = location.pathname.startsWith('/games/');
    const TARGET_VOLUME = 0.5;

    if (isAtGame) {
      // Fade out when entering game
      bgMusic.fade(bgMusic.volume(), 0, 1000);
    } else {
      // Fade in when returning home
      if (!bgMusic.playing()) {
        bgMusic.play();
      }
      bgMusic.fade(bgMusic.volume(), TARGET_VOLUME, 1000);
    }
  }, [location.pathname, isMusicOn]);

  // 4. Dynamic Styling (Background vs Foreground)
  const isAtGame = location.pathname.startsWith('/games/');
  
  return (
    <div 
      ref={containerRef}
      id="global-phaser-container"
      className={`fixed inset-0 transition-all duration-700 ${
        isAtGame 
          ? 'z-10 opacity-100 pointer-events-auto' 
          : 'z-0 opacity-40 pointer-events-none'
      }`}
      style={{
        backgroundColor: isAtGame ? '#0f172a' : 'transparent'
      }}
    />
  );
}
