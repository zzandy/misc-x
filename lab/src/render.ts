import { ICanvasRenderingContext2D, fullscreenCanvas } from "../../lib/canvas";
import { Cell } from "./replace";

const fg = 'grey';

export class Render {
    private ctx: ICanvasRenderingContext2D;
    public readonly numCols: number = 35;
    public readonly numRows: number;

    private readonly elementSize: number;

    private pad = 50;

    constructor() {
        const ctx = this.ctx = fullscreenCanvas();

        // ctx.canvas.height = ctx.canvas.height * 2;
        // ctx.canvas.width = ctx.canvas.height * 1.41421;

        ctx.strokeStyle = ctx.fillStyle = fg;

        this.numRows = (this.numCols * (ctx.canvas.height - 2 * this.pad) / (this.ctx.canvas.width - 2 * this.pad)) | 0;
        this.elementSize = ((ctx.canvas.width - 2 * this.pad) / this.numCols) | 0;

        this.pad = ((ctx.canvas.width - this.elementSize * this.numCols) / 2) | 0;
        console.log(this.pad);
    }

    public draw(lab: Cell[][]) {
        const { pad, ctx } = this;
        const { width, height } = this.ctx.canvas;

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(pad, pad);

        const d = this.elementSize;
        const w = (d / 3) | 0;

        const lw = 2;

        ctx.lineWidth = lw;
        const r = Math.sqrt(d * d + w * w) / 2;
        const a = Math.asin(w / d);

        for (let i = 0; i < lab.length; ++i) {
            const line = lab[i];
            const y = (d / 2 + d * i) | 0 + .5;

            for (let j = 0; j < line.length; ++j) {
                const char = line[j];
                const x = (d / 2 + d * j) | 0 + .5;

                switch (char) {
                    case 'A':
                        ctx.beginPath();
                        ctx.arc(x, y, r, a, -a);
                        ctx.stroke();
                        break;
                    case 'E':
                        ctx.beginPath();
                        ctx.arc(x, y, r, a + Math.PI, -a + Math.PI);
                        ctx.stroke();
                        break;
                    case '-':
                        ctx.fillRect(x - d / 2, y - w / 2, d, w);
                        ctx.clearRect(x - d / 2, y - w / 2 + lw, d, w - 2 * lw);
                        break;
                    case '|':
                        ctx.fillRect(x - w / 2, y - d / 2, w, d);
                        ctx.clearRect(x - w / 2 + lw, y - d / 2, w - 2 * lw, d);
                        break;
                    case '+':
                        if ((i + j) % 2 == 0) {
                            ctx.fillRect(x - d / 2, y - w / 2, d, w);
                            ctx.clearRect(x - d / 2, y - w / 2 + lw, d, w - 2 * lw);

                            ctx.fillRect(x - w / 2, y - d / 2, w, d);
                            ctx.clearRect(x - w / 2 + lw, y - d / 2, w - 2 * lw, d);
                        }
                        else {
                            ctx.fillRect(x - w / 2, y - d / 2, w, d);
                            ctx.clearRect(x - w / 2 + lw, y - d / 2, w - 2 * lw, d);

                            ctx.fillRect(x - d / 2, y - w / 2, d, w);
                            ctx.clearRect(x - d / 2, y - w / 2 + lw, d, w - 2 * lw);
                        }

                        break;

                    case 'f':
                        ctx.fillRect(x, y - w / 2, d / 2, w);
                        ctx.fillRect(x - w / 2, y - w / 2, w, d / 2 + w / 2);
                        ctx.clearRect(x + lw, y - w / 2 + lw, d / 2 - lw, w - 2 * lw);
                        ctx.clearRect(x - w / 2 + lw, y - w / 2 + lw, w - 2 * lw, d / 2 + w / 2 - lw);
                        break;

                    case 'L':
                        ctx.fillRect(x, y - w / 2, d / 2, w);
                        ctx.fillRect(x - w / 2, y + w / 2, w, -d / 2 - w / 2);
                        ctx.clearRect(x + lw, y - w / 2 + lw, d / 2 - lw, w - 2 * lw);
                        ctx.clearRect(x - w / 2 + lw, y + w / 2 - lw, w - 2 * lw, -d / 2 - w / 2 + lw);
                        break;

                    case "7":
                        ctx.fillRect(x, y - w / 2, -d / 2, w);
                        ctx.fillRect(x - w / 2, y - w / 2, w, d / 2 + w / 2);
                        ctx.clearRect(x, y - w / 2 + lw, -d / 2, w - 2 * lw);
                        ctx.clearRect(x - w / 2 + lw, y - w / 2 + lw, w - 2 * lw, d / 2 + w / 2 - lw);
                        break;

                    case 'j':
                        ctx.fillRect(x, y - w / 2, -d / 2, w);
                        ctx.fillRect(x - w / 2, y + w / 2, w, -d / 2 - w / 2);

                        ctx.clearRect(x, y - w / 2 + lw, -d / 2, w - 2 * lw);
                        ctx.clearRect(x - w / 2 + lw, y + w / 2 - lw, w - 2 * lw, -d / 2 - w / 2 + lw);
                        break;

                    case ' ':
                        ctx.fillCircle(x, y, lw)
                        break;
                    default:
                        ctx.strokeCircle(x, y, 5)
                        break;
                }
            }
        }

        ctx.restore();
    }
}