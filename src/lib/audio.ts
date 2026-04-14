import { Howl, Howler } from 'howler';

// Use a global variable to persist the Howl instance across HMR in development
// and prevent multiple instances from being created.
const GLOBAL_BGM_KEY = '__SONGKRAN_BGM_INSTANCE__';

let bgMusicInstance: Howl;

if (typeof window !== 'undefined') {
  const win = window as any;
  if (!win[GLOBAL_BGM_KEY]) {
    win[GLOBAL_BGM_KEY] = new Howl({
      src: ['/audio/songkran-bgm.mp3'],
      loop: true,
      autoplay: false,
      volume: 0.5,
      preload: true,
      html5: false, // Switch to Web Audio to avoid HTML5 pool exhaustion
    });
  }
  bgMusicInstance = win[GLOBAL_BGM_KEY];
} else {
  // Fallback for non-browser environments if any
  bgMusicInstance = new Howl({
    src: ['/audio/songkran-bgm.mp3'],
    loop: true,
    volume: 0.5,
    html5: false,
  });
}

export const bgMusic = bgMusicInstance;

export const clickSound = new Howl({
  src: ['/audio/click.wav'],
  volume: 0.7,
  html5: false,
});

export const playClick = () => {
  if (clickSound.state() === 'loaded') {
    clickSound.play();
  }
};

// Explicitly resume AudioContext after user gesture
export const resumeAudioContext = async () => {
  if (Howler.ctx && Howler.ctx.state === 'suspended') {
    try {
      await Howler.ctx.resume();
      console.log('AudioContext resumed successfully');
    } catch (err) {
      console.error('Failed to resume AudioContext:', err);
    }
  }
};

export const playEffect = (src: string, volume: number = 0.5) => {
  const sound = new Howl({ 
    src: [src], 
    volume,
    html5: false,
    onend: () => sound.unload() // Auto-unload to keep pool clean
  });
  sound.play();
  return sound;
};

// --- Girl Game Specific Sounds (Preloaded) ---

export const waterSound = new Howl({
  src: ['/audio/dog-clicker_IygBqAk.mp3'],
  volume: 0.6,
  html5: false,
  preload: true,
});

export const adminSound = new Howl({
  src: ['/audio/ding-sound-effect_1_0gpHFnw.mp3'],
  volume: 0.7,
  html5: false,
  preload: true,
});

export const girlWinSound = new Howl({
  src: ['/audio/positive-win-game-sound-4-1.mp3'],
  volume: 0.8,
  html5: false,
  preload: true,
});

export const playWater = () => waterSound.play();
export const playAdmin = () => adminSound.play();
export const playGirlWin = () => girlWinSound.play();

// --- Balloon Game Specific Sounds (Preloaded) ---

export const balloonPopSound = new Howl({
  src: ['/audio/balloon-pop.mp3'],
  volume: 0.8,
  html5: false,
  preload: true,
});

export const balloonRowWinSound = new Howl({
  src: ['/audio/ding-sound-effect_1_0gpHFnw.mp3'],
  volume: 0.7,
  html5: false,
  preload: true,
});

export const balloonRowFailSound = new Howl({
  src: ['/audio/wrong-answer-buzzer.mp3'],
  volume: 0.7,
  html5: false,
  preload: true,
});

export const balloonWinSound = new Howl({
  src: ['/audio/positive-win-game-sound-4-1.mp3'],
  volume: 0.8,
  html5: false,
  preload: true,
});

export const playBalloonPop = () => balloonPopSound.play();
export const playBalloonRowWin = () => balloonRowWinSound.play();
export const playBalloonRowFail = () => balloonRowFailSound.play();
export const playBalloonWin = () => balloonWinSound.play();
