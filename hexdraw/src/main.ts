import { wheel2rgb } from '../../lib/color';

import { Point } from '../../lib/geometry';
import { Loop } from '../../lib/loop';

import { fullscreenCanvas } from '../../lib/canvas';

import { SpriteRenderer } from './sprite-renderer';
import { WorldRenderer, getHexPos } from './world-renderer';
import { World } from './world';


export const main = () => {
    const [sx, sy] = [2, 1];
    const [w, h] = [30, 20];

    const ctx = fullscreenCanvas();
    const [ox, oy] = getHexPos(h / 2, w / 2);
    const world = new World(w, h, new SpriteRenderer(sx, sy), new WorldRenderer(ctx, ctx.canvas.width / 2 - ox * sx, ctx.canvas.height / 2 - oy * sy, sx, sy));

    world.render();
}

