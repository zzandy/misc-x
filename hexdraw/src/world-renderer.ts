import { color, rgb } from "./palette";
import { getHexPos } from "./sprite-renderer";

export class WorldRenderer {
    constructor(private readonly ctx: CanvasRenderingContext2D
        , private readonly background: color
        , private readonly ox: number
        , private readonly oy: number
        , private readonly sx: number
        , private readonly sy: number) {

    }

    public render(i: number, j: number, sprite: HTMLCanvasElement) {
        const [hj, hi] = getHexPos(i, j);
        const { ox, oy, sx, sy } = this;

        this.ctx.drawImage(sprite, ox + hj * sx, oy + hi * sy);
    }

    public clear() {
        const ctx = this.ctx;
        const can = ctx.canvas;
        ctx.fillStyle = rgb(this.background);
        ctx.fillRect(0, 0, can.width, can.height);
    }
}


