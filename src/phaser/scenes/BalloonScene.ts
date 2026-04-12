import Phaser from 'phaser';

export default class BalloonScene extends Phaser.Scene {
  private totalRowsUsed: number = 1;
  private currentClicks: number = 0;
  private maxClicksPerRow: number = 5;
  
  private activeBalloons: Phaser.GameObjects.Container[] = [];
  private revealedNumbers: number[] = [];
  private revealedContainers: Phaser.GameObjects.Container[] = [];

  // Game state
  private gameOver: boolean = false;
  
  private rowText!: Phaser.GameObjects.Text;
  private clicksText!: Phaser.GameObjects.Text;

  constructor() {
    super('BalloonScene');
  }

  create() {
    this.totalRowsUsed = 1;
    this.gameOver = false;
    
    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a2a6c, 0x112244, 0xb21f1f, 0x8a1b1b, 1);
    bg.fillRect(0, 0, 900, 600);

    // Titles
    this.add.text(450, 40, 'ปาโป่งลุ้นคู่!', {
      fontFamily: 'Prompt, sans-serif',
      fontSize: '28px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.rowText = this.add.text(450, 90, `แถวที่: ${this.totalRowsUsed}`, {
      fontFamily: 'Prompt, sans-serif',
      fontSize: '28px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    this.clicksText = this.add.text(450, 130, `เหลือโอกาสกด: ${this.maxClicksPerRow}`, {
      fontFamily: 'Prompt, sans-serif',
      fontSize: '28px',
      color: '#FF69B4',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    this.spawnRow();
  }

  private spawnRow() {
    this.currentClicks = 0;
    this.revealedNumbers = [];
    this.revealedContainers = [];
    
    this.clicksText.setText(`เหลือโอกาสกด: ${this.maxClicksPerRow}`);
    this.rowText.setText(`แถวที่: ${this.totalRowsUsed}`);
    this.tweens.add({
        targets: this.rowText,
        scale: 1.2,
        yoyo: true,
        duration: 200
    });

    // Clean up old active
    this.activeBalloons.forEach(b => {
       // Fly away old balloons
       this.tweens.add({
           targets: b,
           y: -100,
           duration: 1000,
           ease: 'Power2',
           onComplete: () => b.destroy()
       });
    });
    this.activeBalloons = [];

    // [1,1, 2,2, 3,3, 4,4, 5,5]
    const values = [1,1,2,2,3,3,4,4,5,5];
    Phaser.Utils.Array.Shuffle(values);

    const spacing = 80;
    const startX = 450 - ((10 - 1) * spacing) / 2;

    for (let i = 0; i < 10; i++) {
        const x = startX + i * spacing;
        const y = 650; // start below screen
        const targetY = 350 + Phaser.Math.Between(-20, 20);

        const container = this.createBalloon(x, y, values[i]);
        this.activeBalloons.push(container);

        this.tweens.add({
            targets: container,
            y: targetY,
            duration: 800 + i * 100,
            ease: 'Back.out'
        });

        // Floating effect
        this.tweens.add({
            targets: container,
            y: targetY - 15,
            yoyo: true,
            repeat: -1,
            duration: Phaser.Math.Between(1500, 2500),
            ease: 'Sine.inOut',
            delay: 1000 + i * 100
        });
    }
  }

  private createBalloon(x: number, y: number, value: number) {
    const container = this.add.container(x, y);

    const colors = [0xFF3366, 0x33CCFF, 0x33FF66, 0xFFCC00, 0xCC33FF];
    const color = Phaser.Utils.Array.GetRandom(colors);

    const balloon = this.add.graphics();
    balloon.fillStyle(color, 1);
    balloon.fillEllipse(0, 0, 30, 40);
    // string
    balloon.lineStyle(2, 0xffffff, 0.8);
    balloon.beginPath();
    balloon.moveTo(0, 40);
    balloon.lineTo(0, 60);
    balloon.strokePath();

    container.add(balloon);

    const text = this.add.text(0, 0, value.toString(), {
        fontSize: '28px',
        fontFamily: 'Prompt, sans-serif',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0).setScale(0); // hidden initially
    
    container.add(text);

    const hitArea = new Phaser.Geom.Ellipse(0, 0, 60, 80);
    container.setInteractive(hitArea, Phaser.Geom.Ellipse.Contains);

    let isPopped = false;

    container.on('pointerdown', () => {
        if (isPopped || this.gameOver || this.currentClicks >= this.maxClicksPerRow) return;
        isPopped = true;
        this.currentClicks++;
        
        this.clicksText.setText(`เหลือโอกาสกด: ${this.maxClicksPerRow - this.currentClicks}`);

        // Dispatch particle
        window.dispatchEvent(new CustomEvent('splash-particle'));

        // Pop Animation
        this.tweens.add({
            targets: balloon,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 150
        });

        this.tweens.add({
            targets: text,
            alpha: 1,
            scale: 1,
            duration: 200,
            ease: 'Back.out'
        });

        this.revealedNumbers.push(value);
        this.revealedContainers.push(container);

        if (this.currentClicks >= this.maxClicksPerRow) {
            this.time.delayedCall(500, () => this.checkWinCondition());
        }
    });

    container.on('pointerover', () => {
        if (!isPopped && !this.gameOver) {
            container.setScale(1.1);
            this.input.setDefaultCursor('crosshair');
        }
    });

    container.on('pointerout', () => {
        if (!isPopped && !this.gameOver) {
            container.setScale(1);
            this.input.setDefaultCursor('auto');
        }
    });

    return container;
  }

  private checkWinCondition() {
    // Check if there are any duplicates in revealedNumbers
    const hasPair = new Set(this.revealedNumbers).size !== this.revealedNumbers.length;

    if (hasPair) {
        this.gameOver = true;

        // Highlight matching pairs
        const counts: Record<number, number> = {};
        this.revealedNumbers.forEach(v => counts[v] = (counts[v] || 0) + 1);
        
        this.revealedContainers.forEach((container, idx) => {
            const val = this.revealedNumbers[idx];
            if (counts[val] > 1) {
                // Success animation globally on matching balloons
                const star = this.add.text(container.x, container.y, '⭐', { fontSize: '40px' }).setOrigin(0.5);
                this.tweens.add({
                    targets: star,
                    y: container.y - 100,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Power2'
                });
            } else {
                // Dim non-matches
                this.tweens.add({ targets: container, alpha: 0.3, duration: 500 });
            }
        });

        this.time.delayedCall(1500, () => {
            window.dispatchEvent(new CustomEvent('balloon-game-end', {
                detail: { score: this.totalRowsUsed }
            }));
        });
    } else {
        // Failed this row
        this.clicksText.setText('พลาดคู่! กำลังเปลี่ยนแถว...');
        this.clicksText.setColor('#ff4444');
        
        // Dim all
        this.revealedContainers.forEach(c => {
             this.tweens.add({ targets: c, alpha: 0.3, duration: 500 });
        });

        this.time.delayedCall(1500, () => {
            this.totalRowsUsed++;
            this.clicksText.setColor('#FF69B4');
            this.spawnRow();
        });
    }
  }
}
