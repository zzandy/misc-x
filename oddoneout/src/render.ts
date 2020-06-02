import { ICanvasRenderingContext2D, fullscreenCanvas } from "../../lib/canvas";
import { IDrawable } from "./director";

export class Render {
    public readonly aspect: number;

    constructor(private ctx: ICanvasRenderingContext2D = fullscreenCanvas()) {
        this.aspect = ctx.canvas.width / ctx.canvas.height;
    }

    public draw(shapes: IDrawable[][]) {
        const ctx = this.ctx;
        const { width, height } = ctx.canvas;

        const w = shapes[0].length;
        const h = shapes.length;

        const m = .04;
        const p = .2;

        const box = width / w < height / h
            ? (width - 2 * width * m) / (1 + (1 + p) * (w - 1))
            : (height - 2 * height * m) / (1 + (1 + p) * (h - 1));

        const mx = (width - box * (1 + (1 + p) * (w - 1))) / 2;
        const my = (height - box * (1 + (1 + p) * (h - 1))) / 2.5;

        const pad = box * p;
        ctx.clearRect(0, 0, width, height);

        ctx.save();
        ctx.translate(mx, my);

        for (let i = 0; i < shapes.length; ++i) {
            for (let j = 0; j < shapes[i].length; ++j) {
                let shape = shapes[i][j];
                ctx.save();

                ctx.translate((pad + box) * j, (pad + box) * i);
                ctx.scale(box, box);
                ctx.lineWidth = .1;
                shape.draw(ctx);

                ctx.restore();
            }
        }

        ctx.restore();
    }
}