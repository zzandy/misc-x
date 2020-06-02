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

        const w = shapes[0].length* (orientation == "vertical" ? sq32 : 1);
        const h = shapes.length * (orientation == "horizontal" ? sq32 : 1);

        const m = .04;
        const p = .15;

        const box = width / w < height / h
            ? (width - 2 * width * m) / (1 + (1 + p) * (w - 1))
            : (height - 2 * height * m) / (1 + (1 + p) * (h - 1));

        const mx = (width - box * (1 + (1 + p) * (w - 1))) / 2;
        const my = (height - box * (1 + (1 + p) * (h - 1))) / 2.5;

        const pad = box * p;
        ctx.clearRect(0, 0, width, height);

        ctx.save();
        ctx.translate(mx, my);

        const sx = orientation == "vertical" ? sq32 : 1;
        const sy = orientation == "horizontal" ? sq32 : 1;

        for (let i = 0; i < shapes.length; ++i) {
            for (let j = 0; j < shapes[i].length; ++j) {
                let shape = shapes[i][j];
                ctx.save();

                let dx = orientation == "horizontal"
                    ? ((i % 2) == 0 ? -.25 : .25)
                    : 0;

                let dy = orientation == "vertical"
                    ? ((j % 2) == 0 ? -.25 : .25)
                    : 0;

                ctx.translate(sx * (pad + box) * (j + dx), sy * (pad + box) * (i + dy));
                ctx.scale(box, box);

                ctx.lineWidth = .06;
                shape.draw(ctx);

                ctx.restore();
            }
        }

        ctx.restore();
    }
}