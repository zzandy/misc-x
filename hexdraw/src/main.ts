import { wheel2rgb } from '../../lib/color';

import { Point } from '../../lib/geometry';
import { Loop } from '../../lib/loop';

import { fullscreenCanvas } from '../../lib/canvas';

import { getHexPos, SpriteRenderer } from './sprite-renderer';
import { WorldRenderer } from './world-renderer';
import { World } from './world';
import { Palette } from './palette';


export const main = () => {
    const [sx, sy] = [4, 2];
    const [w, h] = [25, 15];

    const ctx = fullscreenCanvas();
    const [ox, oy] = getHexPos(h / 2, w / 2);

    const palette = new Palette(
        [0x00, 0x36, 0x38],
        [0x05, 0x50, 0x52],
        [0x53, 0xB8, 0xBB],
        [0xF3, 0xF2, 0xC9]
    );

    const world = new World(w, h, palette, new SpriteRenderer(sx, sy), new WorldRenderer(ctx, palette.bg, (ctx.canvas.width / 2 - ox * sx) | 0, (ctx.canvas.height / 2 - oy * sy) | 0, sx, sy));

    world.render();
}

