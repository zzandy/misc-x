import { Loop } from '../../lib/loop';
import { fullscreenCanvas, ICanvasRenderingContext2D } from '../../lib/canvas'
import { SimplexNoise2d } from '../../lib/simplex';
import { Gradient, IInterpolator, lerp } from './interpolation';
import { colorString, parseColor, TColor } from './color';

type TState = {
    ctx: ICanvasRenderingContext2D,
    map: Uint8ClampedArray,
    width: number,
    height: number,
    gradient: IInterpolator<TColor>;
}

let loop = new Loop(1000 / 60, init, update, render);
loop.start();

function init(): TState {
    let ctx = fullscreenCanvas();
    ctx.fillStyle = '#262626';
    ctx.strokeStyle = '#aeaeae';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#aeaeae';

    let noise = new SimplexNoise2d(.4, 4, 200200200);
    let width = ctx.canvas.width;
    let height = ctx.canvas.height
    let q = 2;
    let ext = Math.min(width, height);
    let map = new Uint8ClampedArray(width * height);

    for (let i = 0; i < height; ++i)
        for (let j = 0; j < width; ++j)
            map[i * width + j] = (noise.getNoise2d(j / ext * q, i / ext * q) + 1) / 2 * 255 | 0;

    let bottom = '#e0af71';
    let middle = '#4e2b2a';
    let top = '#201921';
    let deep = '#543a6f';
    let shallow = '#d3b8c7';
    let edge = '#e3d1db';

    let gradient = new Gradient(parseColor(deep), parseColor(top), lerp);
    gradient.addStop(.2, parseColor(shallow));
    gradient.addStop(.21, parseColor(edge));
    gradient.addStop(.22, parseColor(bottom));
    gradient.addStop(.8, parseColor(middle));

    return { ctx, map, width, height, gradient }
}

function update(delta: number, state: TState) {
    return state;
}

function render(delta: number, state: TState) {
    const { ctx, map, width, height, gradient } = state;

    for (let y = 0; y < height; ++y) for (let x = 0; x < width; ++x) {

        ctx.fillStyle = colorString(gradient.getValue(map[y * width + x] / 255));
        ctx.fillRect(x, y, 1, 1);
    }

    loop.stop();
}
