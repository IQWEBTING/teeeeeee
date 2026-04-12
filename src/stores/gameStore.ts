import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GameState {
  playerName: string;
  setPlayerName: (name: string) => void;

  girlGameScore: number | null;
  setGirlGameScore: (n: number) => void;

  balloonGameScore: number | null;
  setBalloonGameScore: (n: number) => void;

  hasEnteredName: boolean;
  setHasEnteredName: (v: boolean) => void;

  isMusicOn: boolean;
  toggleMusic: () => void;

  adminSession: boolean;
  setAdminSession: (v: boolean) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      playerName: '',
      setPlayerName: (name) => set({ playerName: name }),

      girlGameScore: null,
      setGirlGameScore: (n) => set({ girlGameScore: n }),

      balloonGameScore: null,
      setBalloonGameScore: (n) => set({ balloonGameScore: n }),

      hasEnteredName: false,
      setHasEnteredName: (v) => set({ hasEnteredName: v }),

      isMusicOn: true,
      toggleMusic: () => set((state) => ({ isMusicOn: !state.isMusicOn })),

      adminSession: false,
      setAdminSession: (v) => set({ adminSession: v }),
    }),
    {
      name: 'songkran-game-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        playerName: state.playerName,
        hasEnteredName: state.hasEnteredName,
      }),
    }
  )
);
