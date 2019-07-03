import { fullscreenCanvas, ICanvasRenderingContext2D } from '../../lib/canvas';
import { wheelHcy } from '../../lib/color';
import { SimplexNoise2d } from '../../lib/simplex';

let octaves =  7;
let persistance = .5;
let scale = 1000;

export const main = () => {
    const ctx = fullscreenCanvas();
    document.body.style.backgroundColor = 'black';

    render(ctx, octaves, persistance);

    return (o: number, p: number) => render(ctx, o, p);
}

export const render = (ctx: ICanvasRenderingContext2D, octaves: number, persistance: number) => {
    const before = (new Date).getTime();
    renderNoise(ctx, octaves, persistance);
    const after = (new Date).getTime();
    console.log('fullscreen in ' + (after - before) + 'ms');
}

function renderNoise(ctx: ICanvasRenderingContext2D, octaves: number, persistance: number) {
    const noise = new SimplexNoise2d(persistance, octaves);
    const { width: w, height: h } = ctx.canvas;

    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;
    const levels = 16;

    for (let i = 0; i < h; ++i) {
        for (let j = 0; j < w; ++j) {
            const v = noise.getNoise2d(j / scale, i / scale);
            // move to [0, 1] range and expand the middle
            const va = (1 - Math.abs(v + 1)) * (1 - Math.abs(v + 1));;
            const borderdist = Math.min(i, j, h - i, w - j);

            const vignette = borderdist < 200 ? ease(borderdist / 200) : 1;
            const [r, g, b] = mapColor(((levels * (Math.min(1, Math.max(0, va * vignette)))) | 0) / levels);
            const idx = (i * w + j) * 4;

            data[idx] = (r * 255) & 255;
            data[idx + 1] = (g * 255) & 255;
            data[idx + 2] = (b * 255) & 255;

            data[idx + 3] = 150;
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

function ease(x: number) {
    return x * x * x * (x * (6 * x - 15) + 10);
}

const waterlevel = .15;
const sandlevel = .25;
const greenslevel = .90;

const depths = wheelHcy(210, 1, .2);
const depths2 = wheelHcy(220, 1, .4);
const sand = wheelHcy(80, 1, .9);

const grad: [number, [number, number, number]][] = [
    [0, depths],
    [waterlevel, depths2],
    [waterlevel + .001, sand],
    [sandlevel, sand],
    [sandlevel + .001, wheelHcy(155, 1, .5)],
    [greenslevel, wheelHcy(80, .05, .2)],
    [greenslevel + .001, wheelHcy(230, 1, .8)],
    [1, wheelHcy(230, 1, .99)]
];

function mapColor(v: number) {
    //return mapGrad(v, [[0, [0, 0, 0]], [1, [1, 1, 1]]]);
    return mapGrad(v, grad);
}

function mapGrad(v: number, grad: [number, [number, number, number]][]): [number, number, number] {
    let prev = grad[0];
    for (let i = 1; i < grad.length; ++i) {
        const [lvl, color] = grad[i];
        if (v < lvl) {
            const [lvl0, color0] = prev
            const k = 1 - (v - lvl0) / (lvl - lvl0);

            return [color0[0] * k + color[0] * (1 - k), color0[1] * k + color[1] * (1 - k), color0[2] * k + color[2] * (1 - k)];
        }
        prev = grad[i];
    }

    return grad[grad.length - 1][1];
}
