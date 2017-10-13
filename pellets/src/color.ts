import { fullscreenCanvas, ICanvasRenderingContext2D } from '../../lib/canvas';
import { hcy2rgb, wheelHcy } from '../../lib/color';
import { SimplexNoise2d } from '../../lib/simplex';

export const main = () => {
    const ctx = fullscreenCanvas();
    document.body.style.backgroundColor = 'black';



    const r = 200;
    const t = .2;

    const before = (new Date).getTime();
    renderNoise(ctx);
    const after = (new Date).getTime();
    console.log('fullscreen in ', after - before);

    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    // renderWheel(ctx, r, t, hcy2rgb);
    // renderWheel(ctx, r * .7, t * 2, wheelColor);
    // renderWheel(ctx, r * .4, t * 3, wheelHsl);
}

function renderNoise(ctx: ICanvasRenderingContext2D) {
    const noise = new SimplexNoise2d(.7, 10);
    const { width: w, height: h } = ctx.canvas;

    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    for (let i = 0; i < h; ++i) {
        for (let j = 0; j < w; ++j) {
            const v = noise.getNoise2d(j / 1, i / 1);
            // move to [0, 1] range and expand the middle
            const va = ease((v + 1) / 2);
            const borderdist = Math.min(i, j, h - i, w - j);

            const vignette = borderdist < 200 ? ease(borderdist / 200) :1;
            const [r, g, b] = mapColor(va * vignette);
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

const waterlevel = .3;
const sandlevel = .33;
const greenslevel = .90;

const grad: [number, [number, number, number]][] = [
    [0, wheelHcy(270, 1, .05)],
    [waterlevel, wheelHcy(270, 1, .4)],
    [waterlevel + .01, wheelHcy(60, 1, .8)],
    [sandlevel, wheelHcy(60, 1, .6)],
    [sandlevel + .01, wheelHcy(180, 1, .4)],
    [greenslevel, wheelHcy(100, 1, .4)],
    [greenslevel + .01, wheelHcy(170, 1, 1)],
    [1, wheelHcy(170, 1, .95)]
];

function mapColor(v: number) {
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

function renderWheel(ctx: ICanvasRenderingContext2D, r: number, t: number, colorFn: (h: number, c: number, y: number) => string) {
    const steps = 360;
    const tau = Math.PI * 2;
    const [sin, cos] = [Math.sin, Math.cos];

    for (let i = 0; i < steps; ++i) {
        const a = tau * i / steps;
        const b = tau * (i + 1) / steps;

        ctx.beginPath();
        ctx.closePath();

        ctx.moveTo(r * cos(a), -r * sin(a));
        ctx.lineTo((1 + t) * r * cos(a), -(1 + t) * r * sin(a));

        ctx.lineTo((1 + t) * r * cos(b), - (1 + t) * r * sin(b));
        ctx.lineTo(r * cos(b), -r * sin(b));

        ctx.fillStyle = colorFn(i * 360 / steps, 1, .5);
        ctx.fill();
    }
}

function wheelColor(h: number, c: number, y: number, a?: number): string {
    const h2 = h < 180 ? 2 * h / 3 : 120 + (h - 180) * 4 / 3;

    return hcy2rgb(h2, c, y, a);
}

function wheelHsl(h: number, s: number, l: number) {
    const h2 = h < 180 ? 2 * h / 3 : 120 + (h - 180) * 4 / 3;
    return 'hsl(' + h2 + ', ' + s * 100 + '%, ' + l * 100 + '%)';
}