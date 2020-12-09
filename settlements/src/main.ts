import { rnd } from "../../lib/rnd";
import { fullscreenCanvas } from "../../lib/canvas";

const tau = Math.PI * 2;
const sqrt32 = Math.sqrt(3) / 2;

const sin = Math.sin;
const cos = Math.cos;
const max = Math.max;

type Point = { x: number, y: number }

class QuadTree<TValue extends Point> {
    static readonly maxDirectChildren: number = 7;

    public children: TValue[] = [];
    public quads: QuadTree<TValue>[] = [];

    constructor(public readonly x: number, public readonly y: number, public readonly w: number, public readonly h: number) { }

    public contains(point: TValue) {
        const { x, y, w, h } = this;
        return point.x >= x && point.y >= y && point.x < x + w && point.y < y + h;
    }

    public forEach(callback: (_: TValue) => void) {
        if (this.quads.length > 0)
            this.quads.forEach(q => q.forEach(callback));
        else
            this.children.forEach(callback);
    }

    public push(point: TValue) {
        if (!this.contains(point)) return false;

        if (this.quads.length > 0)
            this.place(point)

        else if (this.children.push(point) > QuadTree.maxDirectChildren) {

            const { x, y, w, h } = this;
            const [w2, h2] = [w / 2, h / 2];

            this.quads = [
                new QuadTree<TValue>(x, y, w2, h2),
                new QuadTree<TValue>(x + w2, y, w2, h2),
                new QuadTree<TValue>(x, y + h2, w2, h2),
                new QuadTree<TValue>(x + w2, y + h2, w2, h2)
            ];

            this.children.every(child => this.place(child));
            this.children.length = 0;
        }

        return true;
    }

    private place(point: TValue): boolean {
        return this.quads.some(q => q.push(point));
    }
}

start();

function start() {

    const ctx = fullscreenCanvas();
    const cols = 12;
    const buffer = .8;
    const padding = .05;

    const r = ctx.canvas.width * (1 - 2 * padding) / (1 + (cols - 1) * sqrt32) / 2;

    const rows = (ctx.canvas.height * (1 - 2 * padding) / r - 1) / 2 | 0;

    ctx.strokeStyle = 'hsla(0, 0%, 100%, .1)';
    ctx.fillStyle = 'silver';

    const nodes: { x: number, y: number, cluster: object }[] = [];
    const tree = new QuadTree<typeof nodes[0]>(ctx.canvas.width * padding, ctx.canvas.height * padding, max(2 * r + (cols - 1) * 2 * r * sqrt32, r * (rows * 2 + 1)), max(2 * r + (cols - 1) * 2 * r * sqrt32, r * (rows * 2 + 1)));

    for (let i = 0; i < rows; ++i)
        for (let j = 0; j < cols; ++j) {
            let x = ctx.canvas.width * padding + j * 2 * r * sqrt32 + r;
            let y = ctx.canvas.height * padding + i * 2 * r + r + r * (j % 2);

            ctx.strokeCircle(x, y, r);
            ctx.strokeCircle(x, y, r * buffer);

            let a = rnd(tau, true);
            let d = r * rnd(buffer, true);

            let node = { x: x + d * cos(a), y: y + d * sin(a), cluster: {} };

            ctx.fillCircle(node.x, node.y, 2);

            nodes.push(node);
            tree.push(node);
        }
}