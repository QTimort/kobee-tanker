import ImpactBody = Phaser.Physics.Impact.ImpactBody;

export class Tank {
    private _body: ImpactBody;

    public constructor(body: ImpactBody) {
        this._body = body;
    }

    get body(): Phaser.Physics.Impact.ImpactBody {
        return this._body;
    }

    public getX() : number {
        return (<{ x: number, y: number }>this.body.body.pos).x;
    }

    public getY() {
        return (<{ x: number, y: number }>this.body.body.pos).y;
    }

    public move(x: number, y: number) : void {
        let p = <{ x: number, y: number }>this.body.body.pos;
        p.x += x;
        p.y += y;
    }
}
