import { wheel2rgb } from '../../lib/color';

import { Point } from '../../lib/geometry';
import { Loop } from '../../lib/loop';

import { fullscreenCanvas } from '../../lib/canvas';

import { SpriteRenderer } from './sprite-renderer';
import { WorldRenderer, getHexPos } from './world-renderer';
import { World } from './world';
import { Palette } from './palette';


export const main = () => {
    const [sx, sy] = [3, 2];
    const [w, h] = [30, 20];

    const ctx = fullscreenCanvas();
    const [ox, oy] = getHexPos(h / 2, w / 2);
    const palette = new Palette(
        [0x00, 0x36, 0x38],
        [0x05, 0x50, 0x52],
        [0x53, 0xB8, 0xBB],
        [0xF3, 0xF2, 0xC9]
    );
    const world = new World(w, h, palette, new SpriteRenderer(sx, sy), new WorldRenderer(ctx, palette.bg, ctx.canvas.width / 2 - ox * sx, ctx.canvas.height / 2 - oy * sy, sx, sy));

    world.render();
}

