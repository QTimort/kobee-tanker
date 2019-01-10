import ImpactBody = Phaser.Physics.Impact.ImpactBody;
import {Tank} from "../tank";

export class MainScene extends Phaser.Scene {
    private graphics;
    private lines: Array<ImpactBody>;
    private width;
    private height;
    private tank: Tank;
    private cursors: CursorKeys;

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
        this.tank = new Tank(this.impact.add.body(200, 100, 10, 10));
        this.tank.body.setActiveCollision();
        this.tank.body.setGravity(500);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.tank.body.setCollideCallback((bodyA, bodyB, axis) => {
            if (axis === 'x') {
                let deltaX;
                let deltaY;
                let tankPos;
                let groudPos;
                if (bodyA === this.tank.body.body) {
                    tankPos = <{ x: number, y: number }>bodyA.pos;
                    groudPos = <{ x: number, y: number }>bodyB.pos;
                } else {
                    tankPos = <{ x: number, y: number }>bodyB.pos;
                    groudPos = <{ x: number, y: number }>bodyA.pos;
                }
                deltaX = groudPos.x - tankPos.x;
                deltaY = groudPos.y - tankPos.y;
                this.tank.move(deltaX, 0);
            }
        }, this);

        let seed = Math.random();
        for (let i = 0; i < this.lines.length; ++i) {
            let height = ((Math.cos(i / 100 * seed) * Math.sin(i / 42) * seed)) * 120 + 70;
            this.lines[i] = this.impact.add.body(i, this.height - height, 1, height);
            this.lines[i].setBounce(0);
            this.lines[i].setGravity(0);
            this.lines[i].setFixedCollision();
            this.lines[i].debugShowBody = false;
        }
    }

    bresenhamCircle(xc: number, yc: number, r: number): void {
        let lowests = new Array<number>(r);
        let x, y, p;
        x = 0;
        y = r;
        lowests[xc + x] = yc - y;
        p = 3 - (2 * r);
        for (x = 0; x <= y; x++) {
            if (p < 0) {
                p = (p + (4 * x) + 6);
            } else {
                y -= 1;
                p += ((4 * (x - y) + 10));
            }
            lowests[xc + x] = y;
            lowests[xc - x] = y;
        }
        for (let i = 0; i < lowests.length; ++i) {
            if (lowests[i] != undefined) {
                this.reduceLine(i, lowests[i]);
            }
        }
    }

    NoiseReduction(severity) {
        // fixme us bezier curve or something else
        for (let i: number = 0; i < this.lines.length; i++) {
            let start = (i - severity > 0 ? i - severity : 0);
            let end = (i + severity < this.lines.length ? i + severity : this.lines.length);
            let sum = 0;
            let body = this.lines[i];
            let size = <{ x: number, y: number }>body.body.size;
            for (let j: number = start; j < end; j++) {
                sum += size.y;
            }
            let avg = sum / (end - start);
            //console.log('diff: ' + (avg - size.y));
            this.setLine(i, Math.round(avg));
        }
    }

    setLine(x, height) {
        x = parseInt(x);
        height = parseInt(height);
        if (x < 0 || x >= this.width)
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
        if (height > size.y) {
            height = size.y;
        }
        body.setBodySize(size.x, size.y - height);
        (<{ x: number, y: number }>body.body.pos).y += height;
    }

    explosion(x: number, radius: number) {
        x = parseInt(x.toString());
        if (x < 0 || x >= this.width)
            return;
        this.bresenhamCircle(x, (<{ x: number, y: number }>this.lines[x].body.pos).y, radius);
    }

    update(time: number, delta: number): void {
        this.graphics.clear();
        this.graphics.fillStyle(0x00ff00, 1);
        for (let i = 0; i < this.lines.length; ++i) {
            let body = this.lines[i];
            let size = <{ x: number, y: number }>body.body.size;
            let pos = <{ x: number, y: number }>body.body.pos;
            this.graphics.fillRect(pos.x, pos.y, size.x, size.y);
        }
        if (this.cursors.left.isDown) {
            this.tank.move(-1, 0);
        }
        if (this.cursors.right.isDown) {
            this.tank.move(1, 0);
        }
        if (this.cursors.space.isDown) {
            let _this = this;
                let b = this.impact.add.body(this.tank.getX(), this.tank.getY() - 5, 4, 4);
                b.setPassiveCollision();
                b.setVelocity(40, -150);
                b.setCollideCallback((bodyA, bodyB, axis) => {
                    let pos = <{ x: number, y: number }>b.body.pos;
                    _this.explosion(pos.x, 20);
                    b.body.destroy()
                }, this);
        }
    }
}
