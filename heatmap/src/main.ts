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
    iter: number
}

let loop = new Loop(1000 / 60, init, update, render);
loop.start();

function generateMap(width: number, height: number) {
    let then = performance.now()
    let q = 2;
    let ext = Math.min(width, height);
    let noise = new SimplexNoise2d(.4, 4, 200200200);

    let map = new Uint8ClampedArray(width * height);

    for (let i = 0; i < height; ++i)
        for (let j = 0; j < width; ++j)
            map[i * width + j] = (noise.getNoise2d(j / ext * q, i / ext * q) + 1) / 2 * 255 | 0;

    return map;
}

function init(): TState {
    let ctx = fullscreenCanvas();

    let width = ctx.canvas.width;
    let height = ctx.canvas.height
    let map = new Uint8ClampedArray(0);

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

    let state = { ctx, map, width, height, gradient, iter: 0 }

    window.setTimeout(() => state.map = generateMap(width, height), 1);

    return state;
}

function update(delta: number, state: TState) {
    return state;
}

function render(delta: number, state: TState) {
    const { ctx, map, width, height, gradient } = state;

    if (map.length == 0) return;

    let data = ctx.getImageData(0, 0, width, height);

    for (let i = 0; i < map.length; ++i) {
        let color = gradient.getValue(map[i] / 255);
        data.data[i * 4] = color[0];
        data.data[i * 4 + 1] = color[1];
        data.data[i * 4 + 2] = color[2];
        data.data[i * 4 + 3] = 255;
    }

    ctx.putImageData(data, 0, 0);

    loop.stop();
}
