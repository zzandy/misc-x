import { fullscreenCanvas } from '../../lib/canvas';
import { World, Burst, Fall } from './world';
import { Vector, AABB } from './geometry';
import { version } from 'webpack';
import { tau } from './util';

const colors = ['#fed203', '#d6050d', '#1337b2', '#078ebd', '#f76f03', '#8e0c70', '#cbcbcb'];

const sq32 = Math.sqrt(3) / 2;

export class HexScaler {
    public readonly area: AABB;
    public readonly r: number;

    constructor(private readonly size: number, area: AABB) {
        const { x, y, w: width, h: height } = area;

        const hr = area.h / (2 * size - 1);
        const wr = area.w / ((2 * size - 2) * sq32 + 1);

        this.r = Math.min(hr, wr) / 2;

        const w = 2 * this.r * ((2 * size - 2) * sq32 + 1);
        const h = 2 * this.r * (2 * size - 1);
        this.area = new AABB(x + (width - w) / 2, y + (height - h) / 2, w, h);
    }

    public screenToStore(pos: Vector): [number, number] | null {
        if (!this.area.contains(pos)) return null;

        const fi = (pos.x - this.area.x - this.r) / 2 / sq32 / this.r + .333;
        let i = Math.floor(fi);
        let fj = (pos.y - this.area.y + (i - this.size) * this.r) / 2 / this.r + .5;
        let j = Math.floor(fj);

        const x = fi - i;
        const y = fj - j;
        let di = 0;
        let dj = 0;

        if (x > .666) {

            if (y < .5 && y < 3 * x / 2 - 1) {
                di = 1;
            }
            else if (y > .5 && y > -3 * x / 2 + 2) {
                di = 1;
                dj = 1
            }
        }

        return [i + di, j + dj];
    }

    public storeToScreen(i: number, j: number): Vector {
        return new Vector(this.area.x + sq32 * i * this.r * 2 + this.r,
            + this.area.y + j * this.r * 2 - (i - this.size) * this.r);
    }
}

export class ScreenManager {
    private readonly ctx = fullscreenCanvas();
    private pos: Vector = new Vector(0, 0);
    private readonly scaler: HexScaler;
    private active: [number, number] | null = null;
    private readonly clipPath: Path2D;

    constructor(size: number) {
        let canvas = this.ctx.canvas;
        let { width, height } = canvas;

        this.scaler = new HexScaler(size, new AABB(10, 10, width - 20, height - 20));
        const a = this.scaler.r;
        const sctr = tau / 12;
        const ctx = new Path2D();

        [
            this.scaler.storeToScreen(0, 0).add(new Vector(-a, 0)),
            this.scaler.storeToScreen(0, 0),

            this.scaler.storeToScreen(size - 1, 0).add(new Vector(-a / 2, -a * sq32)),
            this.scaler.storeToScreen(size - 1, 0),

            this.scaler.storeToScreen(size * 2 - 2, size - 1).add(new Vector(a / 2, -a * sq32)),
            this.scaler.storeToScreen(size * 2 - 2, size - 1),

            this.scaler.storeToScreen(size * 2 - 2, size * 2 - 2).add(new Vector(a, 0)),
            this.scaler.storeToScreen(size * 2 - 2, size * 2 - 2),

            this.scaler.storeToScreen(size - 1, size * 2 - 2).add(new Vector(a / 2, a * sq32)),
            this.scaler.storeToScreen(size - 1, size * 2 - 2),

            this.scaler.storeToScreen(0, size - 1).add(new Vector(-a / 2, a * sq32)),
            this.scaler.storeToScreen(0, size - 1),
        ].forEach((p, i) => {
            if (i % 2 == 0) {
                if (i == 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y)
            }
            else {
                let n = (i - 1) / 2;
                ctx.arc(p.x, p.y, a, sctr * (i + 5), sctr * (i + 7));
            }
        });

        this.clipPath = ctx;

        canvas.addEventListener('mousemove', (e) => this.onMove(e));
        canvas.addEventListener('mousedown', (e) => this.onDown(e));
        canvas.addEventListener('mouseup', (e) => this.onUp(e));
    }

    private onMove(e: MouseEvent): any {
        this.pos = new Vector(e.clientX, e.clientY);
        this.active = this.scaler.screenToStore(this.pos);
    }

    private onDown(e: MouseEvent): any {
    }

    private onUp(e: MouseEvent): any {
    }

    public render(delta: number, world: World) {
        const ctx = this.ctx;
        const { width, height } = ctx.canvas;
        const r0 = this.scaler.r;
        const r = r0 * .7;

        ctx.clearRect(0, 0, width, height);
        ctx.save();

        let a = r0;

        ctx.clip(this.clipPath);

        world.cells.each((i, j, cell) => {
            const color = cell.color
            ctx.strokeStyle = 'white';
            ctx.fillStyle = colors[color];

            const pos = this.scaler.storeToScreen(i, j);

            if (cell.change instanceof Burst) {
                ctx.fillCircle(pos.x, pos.y, r * Math.sqrt(1 - cell.change.phase));
            }
            else if (cell.change instanceof Fall) {
                let c = cell.change;
                ctx.fillCircle(pos.x, pos.y - (c.dropHeight - c.phase) * r0 * 2, r);

            }
            else {
                if (this.active != null && this.active[0] == i && this.active[1] == j)
                    ctx.strokeCircle(pos.x, pos.y, r);

                ctx.fillCircle(pos.x, pos.y, r);
            }

            // if (cell.change != null) {
            //     ctx.strokeStyle = 'white';
            //     ctx.lineWidth = 3;
            //     ctx.strokeCircle(pos.x, pos.y, r)
            // }

            ctx.fillStyle = 'black'
            ctx.fillText(i + ' ' + j, pos.x, pos.y)
        });

        ctx.restore();
    }
}