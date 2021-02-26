import { ICanvasRenderingContext2D, fullscreenCanvas } from "../../lib/canvas";
import { IDrawable, Orientation, sq32, fadefn } from "./director";

const scalers: ((ctx: ICanvasRenderingContext2D, fade: number, seed: number) => void)[] = [
    (ctx, fade, seed) => {

        fade = fadefn(fade);

        ctx.globalAlpha = fade;
        ctx.scale(fade, fade);

        const trn = 4;//seed % 5;

        ctx.translate((1 - fade), (1 - fade))
        ctx.translate(0, (1 - fade));

        const d2 = seed / 10 % 10;
        const d3 = seed / 100 % 10;

        const x = d2 < 3
            ? 2
            : d2 < 4
                ? 2 : 0;

        const y = d3 < 2
            ? 1
            : d3 < 4
                ? 2 : 0;

        ctx.translate((1 - fade) * x / 2, (1 - fade) * y / 2);
    }
]

export class Render {
    public readonly aspect: number;

    constructor(private ctx: ICanvasRenderingContext2D = fullscreenCanvas()) {
        this.aspect = ctx.canvas.width / ctx.canvas.height;
    }

    public draw(shapes: IDrawable[][], orientation: Orientation, seed: number) {
        const ctx = this.ctx;
        const { width, height } = ctx.canvas;

        const [rows, cols] = [orientation == "rows", orientation == "cols"];

        const sx = rows ? sq32 : 1;
        const sy = cols ? sq32 : 1;

        const ax = !rows && cols ? 0.5 : 0;
        const ay = !cols && rows ? 0.5 : 0;

        const [nx, ny] = [shapes[0].length, shapes.length];

        const m = .01;
        const p = .1;

        const ex = 1 + ((nx + ax) * (1 + p) - p - 1) * sx;
        const ey = 1 + ((ny + ay) * (1 + p) - p - 1) * sy;

        const box = ex / ey > this.aspect
            ? (width - 2 * width * m) / ex
            : (height - 2 * height * m) / ey;

        const pad = box * (1 + p);

        const [mx, my] = [(width - ex * box) / 2, (height - ey * box) / 2]

        ctx.clearRect(0, 0, width, height);

        ctx.save();
        ctx.translate(mx, my);
        const scaler = scalers[seed % scalers.length];

        for (let i = 0; i < ny; ++i) {
            for (let j = 0; j < nx; ++j) {

                let shape = shapes[i][j];
                let fade = shape.getFade().value;

                ctx.save();

                let dx = cols ? ((i % 2) == 0 ? 0 : .5) : 0;
                let dy = rows ? ((j % 2) == 0 ? 0 : .5) : 0;

                ctx.translate(sx * pad * (j + dx), sy * pad * (i + dy));
                ctx.scale(box, box);

                scaler(ctx, fade, seed);

                ctx.lineWidth = .06;
                shape.draw(ctx);

                ctx.restore();
            }
        }

        ctx.restore();
    }
}
