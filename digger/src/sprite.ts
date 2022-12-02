import { Palette } from "./color";

export class Sprite {
    imgdata

    constructor(ctx: CanvasRenderingContext2D, ox: number, oy: number, w: number, h: number, palette: Palette | null = null) {
        this.imgdata = ctx.getImageData(ox, oy, w, h);

        if (palette) this.#map(palette)
    }

    #map(palette: Palette) {
        let a = this.imgdata.data;
        let n = a.length;

        for (let i = 0; i < n; i += 4) {

            let c = palette[1];
            if (a[i] < 64) c = palette[0]
            if (a[i] > 64) c = palette[2]

            a[i + 3] = a[i] == 255 ? 0 : 255
            a[i] = c[0];
            a[i + 1] = c[1];
            a[i + 2] = c[2];
        }
    }

    draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.putImageData(this.imgdata, x, y);
    }
}

type binary = 0 | 1;
export function edgeIndex(td: binary, lr: binary, v: binary, h: binary, d: binary) {
    // the sprite for the corner of an empty cell is calculated based on:
    // - is the corner top (1) or bottom (0)
    // - is the corner left (1) or right (0)
    // - is the vertical neighbour solid (1) or empty (0)
    // - is the horizonal neighbour solid (1) or empty (0)
    // - is the diagonal neighbour solid (1) or empty (0)

    return ((((td) << 1
        | (lr)) << 1
        | (v)) << 1
        | (h)) << 1
        | (d);
}
