import { ICanvasRenderingContext2D, fullscreenCanvas } from "../../lib/canvas";
import { Cell } from "./replace";

const fg = 'grey';

export class Render {
    private ctx: ICanvasRenderingContext2D;
    public readonly numCols: number = 35;
    public readonly numRows: number;
    private readonly paths: { [key in Cell]: Path2D };

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

        this.paths = makePaths(this.elementSize);
    }

    public draw(lab: Cell[][]) {
        const { pad, ctx } = this;
        const { width, height } = this.ctx.canvas;

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(pad, pad);

        const s = (this.elementSize / 2) | 0;
        const d = s * 2;

        const lw = 2;

        ctx.lineWidth = lw;

        for (let i = 0; i < lab.length; ++i) {
            const line = lab[i];
            const y = (s + d * i) | 0;

            for (let j = 0; j < line.length; ++j) {
                let char = line[j];
                const x = (s + d * j) | 0;

                ctx.save();
                ctx.translate(x, y);

                if (char == '+' && ((i % 2 + j) % 2) == 0) {
                    ctx.rotate(Math.PI / 2)
                }
                else if (char == "j") {
                    char = '7';
                    ctx.rotate(Math.PI / 2);
                }
                else if (char == "L") {
                    char = '7';
                    ctx.rotate(Math.PI);
                }
                else if (char == "f") {
                    char = '7';
                    ctx.rotate(3 * Math.PI / 2);
                }

                ctx.stroke(this.paths[char]);

                ctx.restore();
            }
        }

        ctx.restore();
    }
}

function makePaths(d: number): { [key in Cell]: Path2D } {
    const l = (d / 6) | 0
    const w = l * 2;
    const r = (Math.sqrt(d * d + w * w) / 2) | 0;
    const a = Math.asin(w / d);

    let p0 = (-d / 2) | 0
    let p1 = p0 + d;

    return {
        'A': bp(path => path.arc(0, 0, r, a, -a)),
        'E': bp(path => path.arc(0, 0, r, a + Math.PI, -a + Math.PI)),
        '-': bp(path => {
            path.moveTo(p0, -l);
            path.lineTo(p1, -l);

            path.moveTo(p0, l);
            path.lineTo(p1, l);
        }),
        '|': bp(path => {
            path.moveTo(-l, p0);
            path.lineTo(-l, p1);

            path.moveTo(l, p0);
            path.lineTo(l, p1);
        }),
        '+': bp(path => {
            path.moveTo(p0, -l);
            path.lineTo(p1, -l);

            path.moveTo(p0, l);
            path.lineTo(p1, l);

            path.moveTo(-l, p0);
            path.lineTo(-l, -l);

            path.moveTo(l, p0);
            path.lineTo(l, -l);

            path.moveTo(-l, l);
            path.lineTo(-l, p1);

            path.moveTo(l, l);
            path.lineTo(l, p1);
        }),
        'f': bp(path => { }),
        'L': bp(path => { }),
        '7': bp(path => {
            path.moveTo(p0, -l);

            path.quadraticCurveTo(l, -l, l, p1);

            path.moveTo(p0, l);
            path.quadraticCurveTo(-l, l, - l, p1);
        }),
        'j': bp(path => { }),
        ' ': bp(path => { })
    }
}

function bp(build: (p: Path2D) => void) {
    const path = new Path2D();
    build(path);
    return path;
}