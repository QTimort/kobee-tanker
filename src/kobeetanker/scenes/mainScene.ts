export class MainScene extends Phaser.Scene {
  private graphics;
  private lines;
  private width;
  private height;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {

  }

  create(): void {
    this.graphics = this.add.graphics();
    this.width = 800;
    this.height = 600;
    this.lines = new Array(this.width);

    let seed = Math.random();
    for (let i = 0; i < this.lines.length; ++i) {
      let height = ((Math.cos(i / 100 * seed) *  Math.sin(i / 42 * seed))) * 120 + 70;
      this.lines[i] = height;
    }
  }


  update(time: number, delta: number): void {
    this.graphics.fillStyle(0x00ff00, 1);
    for (let i = 0; i < this.lines.length; ++i) {
      this.graphics.fillRect(i, this.height - this.lines[i], 1, this.height);
    }
  }
}
