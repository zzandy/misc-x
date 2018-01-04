import { rnd } from '../../lib/rnd';
import { Point } from '../../lib/geometry';
import { fullscreenCanvas, ICanvasRenderingContext2D } from '../../lib/canvas';

class Node {
    constructor(public readonly name: string, public pos: Point) { }
}

class World {
    public readonly dists: DistMap;
    constructor(public nodes: Node[]) {
        this.dists = new DistMap(nodes.map(n => n.pos));
    }
}

class DistMap {
    private readonly dists: number[] = [];
    private readonly length: number;

    constructor(points: Point[]) {

        this.length = points.length;
        for (let i = 1; i < points.length; ++i)
            for (let j = 0; j < i; ++j) {

                const { x: x0, y: y0 } = points[i];
                const { x: x1, y: y1 } = points[j];
                const d = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));

                this.dists.push(d);
            }
    }

    public dist(i0: number, i1: number): number {
        return i0 == i1
            ? 0
            : i1 > i0
                ? this.dists[(i1 - 1) * i1 / 2 + i0]
                : this.dists[(i0 - 1) * i0 / 2 + i1];
    }

    public closest(idx: number): number {
        let dist = Infinity;
        let ix = -1;


        for (let j = 0; j < idx; ++j) {
            let d = this.dist(idx, j);
            if (d < dist) {
                dist = d;
                ix = j;
            }
        }

        for (let i = idx + 1; i < this.length; ++i) {
            let d = this.dist(i, idx);
            if (d < dist) {
                dist = d;
                ix = i;
            }
        }

        return ix;
    }
}

export const main = function () {
    const q = Math.sqrt(3) / 2;

    const size = 100;
    const ctx = fullscreenCanvas();
    const [rows, cols] = blocks(ctx.canvas.width, ctx.canvas.height / q, size);
    const [bw, bh] = [ctx.canvas.width / cols, ctx.canvas.height / rows * q];

    const nodes: Node[] = [];

    for (let i = 1; i < rows - 1; ++i)
        for (let j = 1; j < cols - 1; ++j) {
            let x = (j + i % 2 / 2) * bw;
            let y = (i + .5) * bh;

            const a = Math.random() * 2 * Math.PI;
            const d = Math.random() * size * q * 2 / 3 * .8;

            x += d * Math.cos(a);
            y += d * Math.sin(a);

            nodes.push(new Node(`${i}x${j}`, new Point(x, y)));
        }

    const world = new World(nodes);
    render(ctx, world);
}

function blocks(width: number, height: number, size: number): [number, number] {
    return [height / size, width / size];
}

function render(ctx: ICanvasRenderingContext2D, world: World): void {
    for (let i = 0; i < world.nodes.length; ++i) {
        const node = world.nodes[i];
        ctx.fillRect(node.pos.x - 5, node.pos.y - 5, 10, 10);
        ctx.fillText(node.name, node.pos.x, node.pos.y);

        const j = world.dists.closest(i);
        const other = world.nodes[j];
        ctx.beginPath();
        ctx.moveTo(node.pos.x, node.pos.y);
        ctx.lineTo(other.pos.x, other.pos.y);
        ctx.stroke();
    }
}