import { ICanvasRenderingContext2D, fullscreenCanvas } from "../../lib/canvas";
import { IDrawable } from "./director";

export class Render {
    constructor(private ctx: ICanvasRenderingContext2D = fullscreenCanvas()) {
    }

    public draw(shapes: IDrawable[]) {
        const ctx = this.ctx;
        const { width: w, height: h } = ctx.canvas;
        const e = Math.min(w, h);
        const row = Math.sqrt(shapes.length) | 0;

        const p = .2;

        const mar = e * .04;
        const box = (e - mar * 2) / (1 + (row - 1) * (1 + p));
        const pad = box * p;
        const auto = w > e ? (w - e) / row : 0;
        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < shapes.length; ++i) {
            let shape = shapes[i];
            ctx.save();

            ctx.lineWidth = 10 / box;
            ctx.translate(auto + mar + (pad + box) * (i % row), mar + (pad + box) * ((i / row) | 0));
            ctx.scale(box, box);

            shape.draw(ctx);

            ctx.restore();
        }
    }
}