export class WorldRenderer {
    constructor(private readonly ctx: CanvasRenderingContext2D
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
        ctx.clearRect(0, 0, can.width, can.height);
    }
}

export const getHexPos = (i: number, j: number) => [j * 20 - i * 4 - (j / 2 | 0) * 4, i * 19 - (j % 2) * 5 + (j / 2 | 0) * 9];
