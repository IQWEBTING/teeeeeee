import Phaser from 'phaser';

export const baseConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  transparent: true, // Transparent to overlay on React UI
  scale: {
    mode: Phaser.Scale.FIT, // ScaleManager FIT mode
    autoCenter: Phaser.Scale.CENTER_BOTH, // Centered
    width: 900,
    height: 600,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 300 },
      debug: false,
    },
  },
};

/**
 * Helper to initialize a Phaser game inside a specific React container
 */
export function createPhaserGame(containerId: string, scene: Phaser.Types.Scenes.SceneType | Phaser.Types.Scenes.SceneType[]): Phaser.Game {
  return new Phaser.Game({
    ...baseConfig,
    parent: containerId,
    scene,
  });
}
