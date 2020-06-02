import { ICanvasRenderingContext2D } from "../../lib/canvas";
import { IDrawable, ShapeType } from "./director";

const tau = Math.PI * 2;

export class Shape implements IDrawable {
    constructor(public readonly type: ShapeType, public readonly color: string, public readonly filled: boolean, private readonly small: boolean) {
    }

    draw(ctx: ICanvasRenderingContext2D): void {
        ctx.fillStyle = ctx.strokeStyle = this.color;
        ctx.translate(.5, .5);

        if (this.small) {
            ctx.scale(.5, .5);
            ctx.lineWidth *= 1.7;
        }

        if (!this.filled)
            ctx.scale(.95, .95);

        this.path(ctx);

        if (this.filled)
            ctx.fill();
        else {
            ctx.stroke();
        }
    }

    path(ctx: ICanvasRenderingContext2D) {
        ctx.beginPath();

        const h = .3;
        const a = .1;
        const r1 = .3;
        const r2 = .55;
        const rh = .5;
        const rt = .62;
        const at = .2;

        switch (this.type) {
            case "circle":
                ctx.arc(0, 0, .5, 0, tau);
                break;
            case "triangle":
                for (let i = 0; i < 3; ++i) {
                    let a1 = tau / 3 * i;
                    if (i == 0)
                        ctx.moveTo(rt * Math.sin(a1), -at + rt * Math.cos(a1));
                    else
                        ctx.lineTo(rt * Math.sin(a1), -at + rt * Math.cos(a1));
                }
                break;
            case 't2':
                for (let i = 0; i < 3; ++i) {
                    let a1 = tau / 3 * i + tau / 6;
                    if (i == 0)
                        ctx.moveTo(rt * Math.sin(a1), at + rt * Math.cos(a1));
                    else
                        ctx.lineTo(rt * Math.sin(a1), at + rt * Math.cos(a1));
                }
                break;
            case "hex":
                for (let i = 0; i < 6; ++i) {
                    let a1 = tau / 6 * i;
                    if (i == 0)
                        ctx.moveTo(rh * Math.sin(a1), rh * Math.cos(a1));
                    else
                        ctx.lineTo(rh * Math.sin(a1), rh * Math.cos(a1));
                }
                break;
            case 'h2':
                for (let i = 0; i < 6; ++i) {
                    let a1 = tau / 6 * i + tau / 12;
                    if (i == 0)
                        ctx.moveTo(rh * Math.sin(a1), rh * Math.cos(a1));
                    else
                        ctx.lineTo(rh * Math.sin(a1), rh * Math.cos(a1));
                }
                break;
            case "square":
                ctx.moveTo(-.45, -.45);
                ctx.lineTo(-.45, .45);
                ctx.lineTo(.45, .45);
                ctx.lineTo(.45, -.45);
                break;
            case "c":
                ctx.moveTo(-.1, 0);
                ctx.arc(0, 0, .5, a * tau, (1 - a) * tau);
                break;
            case "c2":
                ctx.moveTo(.1, 0);
                ctx.arc(0, 0, .5, (.5 - a) * tau, (.5 + a) * tau, true);
                break;
            case 'diamond':
                ctx.moveTo(0, -r2);
                ctx.lineTo(r2, 0);
                ctx.lineTo(0, r2);
                ctx.lineTo(-r2, 0);
                break;
            case 'x':
                const w = .25;
                const q = .5 - w;

                ctx.moveTo(0, -w);
                ctx.lineTo(q, -.5);
                ctx.lineTo(.5, -q);
                ctx.lineTo(w, 0);
                ctx.lineTo(.5, q);
                ctx.lineTo(q, .5);
                ctx.lineTo(0, w);
                ctx.lineTo(-q, .5);
                ctx.lineTo(-.5, q);
                ctx.lineTo(-w, 0);
                ctx.lineTo(-.5, -q);
                ctx.lineTo(-q, -.5);
                break;
            case 'cross':
                const z = .2;
                ctx.moveTo(- z, -.5);
                ctx.lineTo(z, -.5);
                ctx.lineTo(z, - z);
                ctx.lineTo(.5, - z);
                ctx.lineTo(.5, z);
                ctx.lineTo(z, z);
                ctx.lineTo(z, .5);
                ctx.lineTo(- z, .5);
                ctx.lineTo(- z, z);
                ctx.lineTo(-.5, z);
                ctx.lineTo(-.5, - z);
                ctx.lineTo(- z, - z);
                break;
            case 'star':
                for (let i = 0; i < 5; ++i) {
                    let a2 = tau / 10 + tau / 5 * i;
                    let a1 = tau / 5 * i;
                    if (i == 0)
                        ctx.moveTo(r1 * Math.sin(a1), r1 * Math.cos(a1));
                    else
                        ctx.lineTo(r1 * Math.sin(a1), r1 * Math.cos(a1));
                    ctx.lineTo(r2 * Math.sin(a2), r2 * Math.cos(a2));
                }

                break;
            case 's2':
                for (let i = 0; i < 6; ++i) {
                    let a2 = tau / 6 * i;
                    let a1 = tau / 6 * i - tau / 12;
                    if (i == 0)
                        ctx.moveTo(r1 * Math.sin(a1), r1 * Math.cos(a1));
                    else
                        ctx.lineTo(r1 * Math.sin(a1), r1 * Math.cos(a1));
                    ctx.lineTo(r2 * Math.sin(a2), r2 * Math.cos(a2));
                }

                break;
            case 'heart':
                const s = .6;
                const x = s / Math.sqrt(2);
                const m = .05;

                ctx.moveTo(x, m);
                ctx.lineTo(0, m + x);
                ctx.lineTo(0 - x, m);
                ctx.arc(- x / 2, m - x / 2, s / 2, 3 * tau / 8, 7 * tau / 8);
                ctx.arc(x / 2, m - x / 2, s / 2, 5 * tau / 8, tau / 8);

                break;
        }

        ctx.closePath();
    }
}