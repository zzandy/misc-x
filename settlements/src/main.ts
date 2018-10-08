import { rnd } from "../../lib/rnd";
import { Point } from "../../lib/geometry";
import { fullscreenCanvas } from "../../lib/canvas";
import { Node, World } from "./world";
import { render } from "./render";
import { findCycles } from "./cycle";

const tau = Math.PI * 2;
const sin = Math.sin;
const cos = Math.cos;
const minlen = 6;

main();

function main() {
    const q = Math.sqrt(3) / 2;

    const size = 120;
    const ctx = fullscreenCanvas();

    const cols = (ctx.canvas.width / size / q) | 0;
    const rows = (ctx.canvas.height / size) | 0;

    const bottomOut = rows * size + size / 2 > ctx.canvas.height;

    let world: World | null = null;
    let score = 0;
    let tries = 10;
    const satisfactoryScore = 50;

    while (tries-- > 0) {
        let nodes: Node[] = [];
        for (let i = 0; i < rows; ++i) {
            for (let j = 0; j < cols; ++j) {
                if (i == rows - 1 && bottomOut && (j + 1) % 2) continue;

                const rmax = size / 2;
                let x = rmax + j * rmax * 2 * q;
                let y = rmax + i * rmax * 2 + ((j + 1) % 2) * rmax;

                const isRim =
                    (i == 0 && j % 2 == 0) ||
                    j == 0 ||
                    (i == rows - 1 && (bottomOut || j % 2 == 0)) ||
                    j == cols - 1;
                const r = rnd(0.85 * rmax, true);
                const a = isRim
                    ? Math.atan2(
                          ctx.canvas.height / 2 - y,
                          ctx.canvas.width / 2 - x
                      ) + rnd(-tau / 10, tau / 10, true)
                    : rnd(tau, true);

                //ctx.strokeCircle(x, y, rmax);

                x += r * cos(a);
                y += r * sin(a);

                nodes.push(
                    new Node(`${nodes.length}-${i}x${j}`, new Point(x, y))
                );
            }
        }

        const newWorld = new World(nodes, size);
        const newScore = getScore(findCycles(newWorld.graph.edges));

        if (newScore > score) {
            score = newScore;
            world = newWorld;
        }

        if (score > satisfactoryScore) {
            console.log(`early break ${tries} left`);
            break;
        }
    }

    if (world != null) {
        render(ctx, world);

        const cycles = findCycles(world.graph.edges);
        console.log(getScore(cycles));
        console.log(cycles.filter(c => c.length > minlen));
    }
};

function getScore(cycles: number[][]): number {
    return cycles
        .map(c => c.length)
        .filter(l => l >= minlen)
        .reduce((sum, len) => sum + len / minlen, 0);
}

