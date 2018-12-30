import ImpactBody = Phaser.Physics.Impact.ImpactBody;

export class MainScene extends Phaser.Scene {
  private graphics;
  private lines: Array<ImpactBody>;
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
    this.lines = new Array<ImpactBody>(this.width);
    this.impact.world.setBounds(0, 0, this.width, this.height, 10);

    let seed = Math.random();
    for (let i = 0; i < this.lines.length; ++i) {
      let height = ((Math.cos(i / 100 * seed) *  Math.sin(i / 42) * seed)) * 120 + 70;
      this.lines[i] = this.impact.add.body(i, this.height - height, 1, height);
      this.lines[i].setBounce(0);
      this.lines[i].setGravity(0);
      this.lines[i].setFixedCollision();
      this.lines[i].debugShowBody = false;
    }
    let b = this.impact.add.body(Math.random() * this.width, Math.random() * this.height, 1, 1);
    this.explosion(464, 450, 10);
    b.setActiveCollision();
    b.setVelocity(300, 150);
    b.setCollideCallback(() => {
      let pos = <{ x: number , y: number }>b.body.pos;
      this.explosion(pos.x, this.height - pos.y, 20);
      b.body.destroy()
    }, null);
  }

  bresenhamCircle(xc: number, yc: number ,r:number ): void {
    let x, y, p;
    x = 0;
    y = r;
    this.reduceLine(xc+x,yc-y);
    p = 3 - (2 * r);
    for (x = 0; x <= y; x++) {
      if (p < 0) {
        p = (p + (4 * x) + 6);
      } else {
        y -= 1;
        p += ((4 * (x - y) + 10));
      }
      this.reduceLine(xc+x,yc-y);
      this.reduceLine(xc-x,yc-y);
      this.reduceLine(xc+y,yc-x);
      this.reduceLine(xc-y,yc-x);
    }
  }

  setLine(x, height) {
    x = parseInt(x);
    height = parseInt(height);
    if (x < 0 || x > this.width)
      return;
    let body = this.lines[x];
    let size = <{ x: number, y: number }>body.body.size;
    let pos = <{ x: number, y: number }>body.body.pos;
    body.setBodySize(size.x, height);
    (<{ x: number, y: number }>body.body.pos).y = this.height - height;
  }

  reduceLine(x, height) {
    x = parseInt(x);
    height = parseInt(height);
    if (x < 0 || x >= this.width)
      return;
    if (height < 0)
      height = 0;
    let body = this.lines[x];
    let size = <{ x: number, y: number }>body.body.size;
    let pos = <{ x: number, y: number }>body.body.pos;
    if (height < size.y) {
      body.setBodySize(size.x, height);
      (<{ x: number, y: number }>body.body.pos).y = this.height - height;
    }
  }

  explosion(x: number, y:number, radius:number) {
    this.bresenhamCircle(x, y, radius);
  }

  update(time: number, delta: number): void {
    this.graphics.clear();
    this.graphics.fillStyle(0x00ff00, 1);
    for (let i = 0; i < this.lines.length; ++i) {
      let body = this.lines[i];
      let size = <{x: number, y: number}>body.body.size;
      let pos = <{x: number, y: number}>body.body.pos;
      this.graphics.fillRect(pos.x, pos.y, size.x, size.y);
    }
  }
}
