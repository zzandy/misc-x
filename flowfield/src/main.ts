import { fullscreenCanvas, ICanvasRenderingContext2D } from '../../lib/canvas';
import { Loop } from '../../lib/loop';
import { Point, Rect } from '../../lib/geometry';
import { array, rnd } from '../../lib/util';
import { SimplexNoise2d } from '../../lib/simplex';
import { hcl2rgb, rgb2hcl, triplet } from '../../lib/hcl'

const sq32 = Math.sqrt(3) / 2;
const tau = 2 * Math.PI;
const deg = tau / 360;

class Sampler extends Point {
    sample: number = 0;

    constructor(x: number, y: number) {
        super(x, y);
    }
}

class Particle {
    public pos: Point;
    public lastRenderedPos: Point;

    constructor(x: number, y: number) {
        this.pos = new Point(x, y);
        this.lastRenderedPos = this.pos;
    }
}

type TState = { ctx: ICanvasRenderingContext2D, viewport: Rect, samplers: Sampler[][], r: number, particles: Particle[] }

const main = new Loop(1000 / 60, init, update, render);

function init() {
    const ctx = fullscreenCanvas(false, true);

    const pad = ctx.canvas.width * .05;

    const viewport = new Rect(pad, pad, ctx.canvas.width - 2 * pad, ctx.canvas.height - 2 * pad);
    let d = 25;
    let cols = Math.round(viewport.w / d / sq32);
    d = viewport.w / cols / sq32;
    let rows = Math.round(viewport.h / d) + 1;

    let noise = new SimplexNoise2d(.1, 3);

    const samplers = array(cols, rows, (i, j) => {
        let sampler = new Sampler(d / 2 + j * d * sq32, d / 2 * (j % 2) + i * d);
        sampler.sample = (1 + noise.getNoise2d(sampler.x / viewport.h/2, sampler.y / viewport.h/2)) / 2;
        return sampler;
    });

    let particles = [];
    for (let i = 0; i < 1000; ++i)particles.push(new Particle(rnd(viewport.w), rnd(viewport.h)))

    return { ctx, viewport, samplers, r: d / 2, particles }
}

function update(delta: number, state: TState) {
    const k = .1;
    for (let point of state.particles) {
        let nodes = getNodes(point.pos.x, point.pos.y, state.r * 2);

        let [a, n] = nodes.reduce(([a, n], [i, j]) => {

            let row = state.samplers[i]
            if (row === undefined) return [a, n];

            let sampler = row[j];
            if (sampler === undefined) return [a, n];

            return [a + sampler.sample * tau, n + 1];
        }, [0, 0]);
        if (n > 0) {
            a /= n;


            let x = point.pos.x + k * state.r * Math.cos(a);
            let y = point.pos.y + k * state.r * Math.sin(a);

            if (x < 0 || y < 0 || x > state.viewport.w || y > state.viewport.h)
                point.pos = point.lastRenderedPos = new Point(rnd(state.viewport.w), rnd(state.viewport.h));
            else
                point.pos = new Point(x, y);
        }
    }

    return state;
}

function render(delta: number, state: TState) {
    const { ctx, viewport, samplers, r } = state;

    ctx.strokeStyle = 'rgba(255, 255, 255, .01)';

    ctx.save();
    ctx.translate(viewport.x, viewport.y);

    for (let particle of state.particles) {
        ctx.beginPath();

        ctx.moveTo(particle.lastRenderedPos.x, particle.lastRenderedPos.y);
        ctx.lineTo(particle.pos.x, particle.pos.y);

        particle.lastRenderedPos = particle.pos;

        ctx.stroke();
    }

    ctx.restore();
}

function getNodes(x: number, y: number, d: number) {
    let j = x / d / sq32;
    let i = y / d + (1 - (j | 0) % 2) / 2

    let targets = [[Math.floor(i), Math.floor(j)]]

    let dx = (j - (j | 0)) - .5;
    let dy = (i - (i | 0)) - .5;

    i |= 0;
    j |= 0;

    let left = dx < 0;
    let two = dy < dx * sq32 / 2;
    let ten = dy < -dx * sq32 / 2;

    if (ten && two)
        targets.push([i - 1, j])

    if (!ten && !two)
        targets.push([i + 1, j])

    if (ten && left)
        targets.push([i - (j + 1) % 2, j - 1])

    if (!ten && !left)
        targets.push([i + j % 2, j + 1])

    if (two && !left)
        targets.push([i - (j + 1) % 2, j + 1])

    if (!two && left)
        targets.push([i + j % 2, j - 1])

    return targets;
}

function rgb(color: triplet) {
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
}

main.start();
