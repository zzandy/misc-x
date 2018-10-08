import { ICanvasRenderingContext2D } from "../../lib/canvas";
import { World, Node } from "./world";
import { DistMap } from "./dist-map";
import { wheelHcy } from "./../../lib/color";

export function render(ctx: ICanvasRenderingContext2D, world: World): void {
    const maxdist = world.graph.edges.reduce(avgedge(world.dists), 0)*1.01;

    const { width: w, height: h } = ctx.canvas;

    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    for (let i = 0; i < h; ++i) {
        for (let j = 0; j < w; ++j) {
            const v = world.nodes
                .map(distto(j, i))
                .filter(d => d < maxdist)
                .map(d => d / maxdist)
                .reduce((a, b) => a + fade(1 - b), 0);

            const [r, g, b] = mapColor(v);
            const idx = (i * w + j) * 4;

            data[idx] = (r * 255) & 255;
            data[idx + 1] = (g * 255) & 255;
            data[idx + 2] = (b * 255) & 255;

            data[idx + 3] = 150;
        }
    }
    ctx.putImageData(imgData, 0, 0);

    for (let [i, j] of world.graph.edges) {
        const node = world.nodes[i];
        const other = world.nodes[j];

        ctx.beginPath();
        ctx.moveTo(node.pos.x, node.pos.y);
        ctx.lineTo(other.pos.x, other.pos.y);
        ctx.stroke();
    }

    for (let i = 0; i < world.nodes.length; ++i) {
        const node = world.nodes[i];
        ctx.fillCircle(node.pos.x, node.pos.y, 5);
        ctx.fillText(node.name, node.pos.x, node.pos.y - 7);
    }
}

function avgedge(dist: DistMap) {
    return (
        max: number,
        [a, b]: [number, number],
        i: number,
        arr: [number, number][]
    ): number => {
        return max + dist.dist(a, b) / arr.length;
    };
}

function distto(x: number, y: number) {
    return ({ pos: pos }: Node): number => {
        return dist(x, y, pos.x, pos.y);
    };
}

function dist(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

const grad: [number, [number, number, number]][] = [
    [0, wheelHcy(0, 1, 1)],
    [0.4, wheelHcy(0, 1, 1)],
    [0.405, wheelHcy(0, 1, 0.5)],
    [0.55, wheelHcy(120, 1, 0.5)],
    [0.60, wheelHcy(60, 1, 0.8)],
];

function mapColor(n: number) {
    return mapGrad(n, grad);
}

function mapGrad(
    v: number,
    grad: [number, [number, number, number]][]
): [number, number, number] {
    let prev = grad[0];
    for (let i = 1; i < grad.length; ++i) {
        const [lvl, color] = grad[i];
        if (v < lvl) {
            const [lvl0, color0] = prev;
            const k = 1 - (v - lvl0) / (lvl - lvl0);

            return [
                color0[0] * k + color[0] * (1 - k),
                color0[1] * k + color[1] * (1 - k),
                color0[2] * k + color[2] * (1 - k)
            ];
        }
        prev = grad[i];
    }

    return grad[grad.length - 1][1];
}

function fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}
