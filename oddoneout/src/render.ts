import { ICanvasRenderingContext2D, fullscreenCanvas } from "../../lib/canvas";
import { IDrawable, Orientation, sq32 } from "./director";

export class Render {
    public readonly aspect: number;

    constructor(private ctx: ICanvasRenderingContext2D = fullscreenCanvas()) {
        this.aspect = ctx.canvas.width / ctx.canvas.height;
    }

    public draw(shapes: IDrawable[][], orientation: Orientation) {
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

        for (let i = 0; i < ny; ++i) {
            for (let j = 0; j < nx; ++j) {

                let shape = shapes[i][j];
                let fade = fadefn(shape.getFade().value);

                ctx.save();

                let dx = cols ? ((i % 2) == 0 ? 0 : .5) : 0;
                let dy = rows ? ((j % 2) == 0 ? 0 : .5) : 0;

                ctx.translate(sx * (pad) * (j + dx), sy * (pad) * (i + dy));
                ctx.globalAlpha = fade;
                ctx.scale(box*fade, box*fade);

                ctx.lineWidth = .06;
                shape.draw(ctx);

                ctx.restore();
            }
        }

        ctx.restore();
    }
}

function fadefn(w: number) {
    return ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w)
}