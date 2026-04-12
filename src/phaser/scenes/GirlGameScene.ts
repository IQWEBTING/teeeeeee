import Phaser from 'phaser';

export default class GirlGameScene extends Phaser.Scene {
  private totalClicks: number = 0;
  private adminsFound: number = 0;
  private gridItems: Phaser.GameObjects.Container[] = [];
  
  // Game state
  private gameOver: boolean = false;
  
  constructor() {
    super('GirlGameScene');
  }

  create() {
    this.totalClicks = 0;
    this.adminsFound = 0;
    this.gameOver = false;
    this.gridItems = [];

    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x00CED1, 0x00CED1, 1);
    bg.fillRect(0, 0, 900, 600);

    // Title
    this.add.text(450, 40, 'ตามหาแอดมิน 3 คนให้เจอ!', {
      fontFamily: 'Prompt, sans-serif',
      fontSize: '28px',
      color: '#ffffff',
      stroke: '#005f73',
      strokeThickness: 4
    }).setOrigin(0.5);

    const scoreText = this.add.text(880, 20, 'กดไป: 0 ครั้ง', {
       fontFamily: 'Prompt, sans-serif',
       fontSize: '28px',
       color: '#ffffff',
       backgroundColor: '#00000088',
       padding: { x: 10, y: 5 }
    }).setOrigin(1, 0);

    // Create 20 slots
    const totalSlots = 20;
    const adminIndices: number[] = [];
    while (adminIndices.length < 3) {
      const rand = Phaser.Math.Between(0, totalSlots - 1);
      if (!adminIndices.includes(rand)) adminIndices.push(rand);
    }

    // rows: 6, 7, 7 (total 20)
    const rowCounts = [6, 7, 7];
    const rowY = [160, 290, 420];
    const spacing = 110; // 900 max width, 8 items = ~880px, perfectly fit.

    let index = 0;
    for (let r = 0; r < 3; r++) {
      const count = rowCounts[r];
      // center the row
      const startX = 450 - ((count - 1) * spacing) / 2;

      for (let c = 0; c < count; c++) {
        const x = startX + c * spacing;
        const y = rowY[r];

        const isAdmin = adminIndices.includes(index);
        this.createHole(x, y, isAdmin, scoreText);
        index++;
      }
    }
    
    // Water effect at bottom
    const water = this.add.graphics();
    water.fillStyle(0x00a8cc, 0.6);
    water.fillRect(0, 520, 900, 80);
    this.tweens.add({
      targets: water,
      y: 15,
      yoyo: true,
      repeat: -1,
      duration: 2000,
      ease: 'Sine.inOut'
    });
  }

  private createHole(x: number, y: number, isAdmin: boolean, scoreText: Phaser.GameObjects.Text) {
    const container = this.add.container(x, y);

    // Outer circle
    const circle = this.add.graphics();
    circle.fillStyle(0xffffff, 0.9);
    circle.fillCircle(0, 0, 45);
    circle.lineStyle(4, 0x00a8cc, 1);
    circle.strokeCircle(0, 0, 45);

    // Hit area
    const hitArea = new Phaser.Geom.Circle(0, 0, 45);
    container.setInteractive(hitArea, Phaser.Geom.Circle.Contains);
    
    container.add(circle);
    
    // Revealed content (hidden initially)
    const contentText = this.add.text(0, 0, isAdmin ? '👧' : '💧', {
      fontSize: '48px'
    }).setOrigin(0.5).setAlpha(0).setScale(0);
    container.add(contentText);

    let isRevealed = false;

    container.on('pointerover', () => {
      if (!isRevealed && !this.gameOver) {
        this.tweens.add({ targets: container, scale: 1.05, duration: 200, ease: 'Back.out' });
        this.input.setDefaultCursor('pointer');
      }
    });

    container.on('pointerout', () => {
      if (!isRevealed && !this.gameOver) {
        this.tweens.add({ targets: container, scale: 1, duration: 200, ease: 'Back.out' });
        this.input.setDefaultCursor('auto');
      }
    });

    container.on('pointerdown', () => {
      if (isRevealed || this.gameOver) return;
      isRevealed = true;
      this.input.setDefaultCursor('auto');
      
      this.totalClicks++;
      scoreText.setText(`กดไป: ${this.totalClicks} ครั้ง`);

      // Trigger global splash
      window.dispatchEvent(new CustomEvent('splash-particle'));

      // Animation
      this.tweens.add({
        targets: circle,
        alpha: 0.3,
        duration: 300
      });

      this.tweens.add({
        targets: contentText,
        alpha: 1,
        scale: 1,
        duration: 500,
        ease: 'Elastic.out'
      });

      if (isAdmin) {
        this.adminsFound++;
        // Confetti local
        this.fireLocalConfetti(x, y);
        
        if (this.adminsFound >= 3) {
          this.gameOver = true;
          this.time.delayedCall(1000, () => {
            // Dispatch game over event
            window.dispatchEvent(new CustomEvent('girl-game-end', {
              detail: { score: this.totalClicks }
            }));
          });
        }
      }
    });

    this.gridItems.push(container);
  }

  private fireLocalConfetti(x: number, y: number) {
    for (let i = 0; i < 20; i++) {
        const char = ['✨', '🌟', '🎉', '👧'][Phaser.Math.Between(0, 3)];
        const p = this.add.text(x, y, char, { fontSize: '24px' }).setOrigin(0.5);
        this.tweens.add({
            targets: p,
            x: x + Phaser.Math.Between(-100, 100),
            y: y - Phaser.Math.Between(50, 150),
            alpha: 0,
            angle: Phaser.Math.Between(-180, 180),
            duration: Phaser.Math.Between(800, 1500),
            ease: 'Power2',
            onComplete: () => p.destroy()
        });
    }
  }
}
