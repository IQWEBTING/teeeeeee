import Phaser from 'phaser';

export default class LobbyScene extends Phaser.Scene {
  private waterGraphics!: Phaser.GameObjects.Graphics;
  private timeElapsed: number = 0;
  private ducks: { graphics: Phaser.GameObjects.Graphics; baseX: number; baseY: number; offset: number }[] = [];
  
  constructor() {
    super('LobbyScene');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Water Surface (animated sine wave in update)
    this.waterGraphics = this.add.graphics();

    // Floating Ducks (Simple Graphics)
    for (let i = 0; i < 5; i++) {
      const g = this.add.graphics();
      // Draw duck body
      g.fillStyle(0xffe100, 1);
      g.fillCircle(0, 0, 15);
      // Draw beak
      g.fillStyle(0xff8c00, 1);
      g.fillTriangle(10, 0, 20, -5, 20, 5);
      // Draw eye
      g.fillStyle(0x000000, 1);
      g.fillCircle(5, -5, 2);

      const baseX = Math.random() * width;
      const baseY = height - 100 + Math.random() * 50;
      g.setPosition(baseX, baseY);
      
      this.ducks.push({ graphics: g, baseX, baseY, offset: Math.random() * Math.PI * 2 });
    }

    // Bubbles Generator
    this.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {
        const x = Math.random() * width;
        const bubble = this.add.graphics();
        bubble.lineStyle(2, 0xffffff, 0.6);
        const radius = 2 + Math.random() * 4;
        bubble.strokeCircle(0, 0, radius);
        bubble.setPosition(x, height + 20);
        
        // Tween rising up
        this.tweens.add({
          targets: bubble,
          y: -20,
          x: x + (Math.random() - 0.5) * 50,
          duration: 3000 + Math.random() * 2000,
          ease: 'Sine.inOut',
          onComplete: () => {
            bubble.destroy();
          }
        });
      }
    });

    // Rain Drops Generator
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        const x = Math.random() * width;
        const drop = this.add.graphics();
        drop.fillStyle(0xffffff, 0.3);
        drop.fillCircle(0, 0, 1.5);
        drop.setPosition(x, -10);

        this.tweens.add({
          targets: drop,
          y: height + 10,
          duration: 1000 + Math.random() * 500,
          ease: 'Linear',
          onComplete: () => {
            drop.destroy();
          }
        });
      }
    });
  }

  update(time: number, delta: number) {
    this.timeElapsed += delta * 0.002;
    const width = this.scale.width;
    const height = this.scale.height;
    const waterBaseY = height - 120;

    // Render animated wave
    this.waterGraphics.clear();
    this.waterGraphics.fillStyle(0x00ced1, 0.3); // Semi-transparent water color
    this.waterGraphics.beginPath();
    this.waterGraphics.moveTo(0, height);
    
    for (let x = 0; x <= width; x += 10) {
      const y = waterBaseY + Math.sin(x * 0.01 + this.timeElapsed) * 15 + Math.sin(x * 0.02 - this.timeElapsed * 0.5) * 5;
      this.waterGraphics.lineTo(x, y);
    }
    
    this.waterGraphics.lineTo(width, height);
    this.waterGraphics.lineTo(0, height);
    this.waterGraphics.closePath();
    this.waterGraphics.fillPath();

    // Update Ducks
    this.ducks.forEach((duck) => {
      // Bobbing movement
      const newY = duck.baseY + Math.sin(this.timeElapsed * 2 + duck.offset) * 10;
      duck.graphics.y = newY;
      duck.graphics.rotation = Math.sin(this.timeElapsed + duck.offset) * 0.1;
      
      // Wrap around screen horizontally slowly
      duck.baseX -= 0.5;
      if (duck.baseX < -30) duck.baseX = width + 30;
      duck.graphics.x = duck.baseX;
    });
  }
}
