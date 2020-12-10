import { ICanvasRenderingContext2D } from "../../lib/canvas";
import { IDrawable, ShapeType, Shading, sq32 } from "./director";

const tau = Math.PI * 2;
const sin = Math.sin;
const cos = Math.cos;

export class Shape implements IDrawable {
    constructor(public readonly type: ShapeType,
        public readonly color: string,
        public readonly shading: Shading,
        private readonly small: boolean) {
    }

    draw(ctx: ICanvasRenderingContext2D): void {
        ctx.fillStyle = ctx.strokeStyle = this.color;
        ctx.translate(.5, .5);

        if (this.small) {
            ctx.scale(.6, .6);
            ctx.lineWidth *= 1.5;
        }

        if (this.shading != 'solid')
            ctx.scale(.95, .95);

        this.path(ctx);

        if (this.shading != "contour")
            ctx.fill();

        if (this.shading != "solid")
            ctx.stroke();
    }

    path(ctx: ICanvasRenderingContext2D) {
        ctx.beginPath();

        const a = .1;
        const r1 = .3;
        const r2 = .55;
        const rh = .5;
        const rt = .62;
        const at = .2;

        switch (this.type) {
            case 'circle':
                ctx.arc(0, 0, .5, 0, tau);
                break;
            case "coin":
                ctx.arc(0, 0, .5, 0, tau);
                ctx.moveTo(.15, .15)
                ctx.lineTo(.15, -.15)
                ctx.lineTo(-.15, -.15)
                ctx.lineTo(-.15, .15)
                break;
            case "triangle":
                for (let i = 0; i < 3; ++i) {
                    let a1 = tau / 3 * i;
                    if (i == 0)
                        ctx.moveTo(rt * sin(a1), -at + rt * cos(a1));
                    else
                        ctx.lineTo(rt * sin(a1), -at + rt * cos(a1));
                }
                break;
            case 't2':
                for (let i = 0; i < 3; ++i) {
                    let a1 = tau / 3 * i + tau / 6;
                    if (i == 0)
                        ctx.moveTo(rt * sin(a1), at + rt * cos(a1));
                    else
                        ctx.lineTo(rt * sin(a1), at + rt * cos(a1));
                }
                break;
            case "hex":
                for (let i = 0; i < 6; ++i) {
                    let a1 = tau / 6 * i;
                    if (i == 0)
                        ctx.moveTo(rh * sin(a1), rh * cos(a1));
                    else
                        ctx.lineTo(rh * sin(a1), rh * cos(a1));
                }
                break;
            case 'h2':
                for (let i = 0; i < 6; ++i) {
                    let a1 = tau / 6 * i + tau / 12;
                    if (i == 0)
                        ctx.moveTo(rh * sin(a1), rh * cos(a1));
                    else
                        ctx.lineTo(rh * sin(a1), rh * cos(a1));
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
                        ctx.moveTo(r1 * sin(a1), r1 * cos(a1));
                    else
                        ctx.lineTo(r1 * sin(a1), r1 * cos(a1));
                    ctx.lineTo(r2 * sin(a2), r2 * cos(a2));
                }

                break;
            case 's2':
                for (let i = 0; i < 6; ++i) {
                    let a2 = tau / 6 * i;
                    let a1 = tau / 6 * i - tau / 12;
                    if (i == 0)
                        ctx.moveTo(r1 * sin(a1), r1 * cos(a1));
                    else
                        ctx.lineTo(r1 * sin(a1), r1 * cos(a1));
                    ctx.lineTo(r2 * sin(a2), r2 * cos(a2));
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
            case "eq":
                ctx.moveTo(-.45, -.35);
                ctx.lineTo(.45, -.35);
                ctx.lineTo(.45, -.05);
                ctx.lineTo(-.45, -.05);

                ctx.closePath();

                ctx.moveTo(-.45, .05);
                ctx.lineTo(.45, .05);
                ctx.lineTo(.45, .35);
                ctx.lineTo(-.45, .35);
                break;
            case 'pause':
                ctx.moveTo(-.35, -.45);
                ctx.lineTo(-.35, .45);
                ctx.lineTo(-.05, .45);
                ctx.lineTo(-.05, -.45);

                ctx.closePath();

                ctx.moveTo(.05, -.45);
                ctx.lineTo(.05, .45);
                ctx.lineTo(.35, .45);
                ctx.lineTo(.35, -.45);
                break;

            case 'slash':
                ctx.moveTo(.1, .45);
                ctx.lineTo(.45, -.45);
                ctx.lineTo(-.1, -.45);
                ctx.lineTo(-.45, .45)
                break;
            case 'sl2':
                ctx.moveTo(.45, .45);
                ctx.lineTo(.1, -.45);
                ctx.lineTo(-.45, -.45);
                ctx.lineTo(-.1, .45)
                break;
            case 'd2':
                ctx.moveTo(0, .5);
                ctx.lineTo(.5, -.2);
                ctx.lineTo(.3, -.45);
                ctx.lineTo(-.3, -.45);
                ctx.lineTo(-.5, -.2)
                break;
            case 'bolt':
                ctx.moveTo(.1, .6);
                ctx.lineTo(0, .1);
                ctx.lineTo(.35, .2);
                ctx.lineTo(.2, -.45);
                ctx.lineTo(-.2, -.45);
                ctx.lineTo(0, -.05)
                ctx.lineTo(-.4, -.15);
                break;
            case 'clubs':
                let r = .28;
                for (let i = 0; i < 3; ++i) {
                    let a = i * tau / 3 + tau / 12;
                    ctx.arc(r * cos(a), r * sin(a), r, a - tau / 3, a + tau / 3,)
                }

                break;
            case 'diamonds':

                ctx.moveTo(0, r2);
                ctx.quadraticCurveTo(r1 / 2, r1 / 2, r2, 0);
                ctx.quadraticCurveTo(r1 / 2, -r1 / 2, 0, -r2);
                ctx.quadraticCurveTo(-r1 / 2, -r1 / 2, -r2, 0);
                ctx.quadraticCurveTo(-r1 / 2, r1 / 2, 0, r2);

                break;
            case 'asterisk':
                let t = .15;
                ctx.save();
                ctx.moveTo(-t, rh);
                for (let i = 0; i < 6; ++i) {
                    ctx.lineTo(-t, rh);
                    ctx.lineTo(t, rh);
                    ctx.lineTo(t, 3 * t / sq32 / 2);
                    ctx.rotate(-tau / 6);
                }
                ctx.restore();
                break;
            case 'tripl':
                let n = .27;
                ctx.save();
                ctx.rotate(tau / 6);
                ctx.moveTo(-n, rh);
                for (let i = 0; i < 3; ++i) {
                    ctx.lineTo(-n, rh);
                    ctx.lineTo(n, rh);
                    ctx.lineTo(n, n / sq32 / 2);
                    ctx.rotate(-tau / 3);
                }
                ctx.restore();
                break;
            case 'y':
                let e = .25;
                ctx.save();
                ctx.moveTo(-e, rh);
                for (let i = 0; i < 3; ++i) {
                    ctx.lineTo(-e, rh);
                    ctx.lineTo(e, rh);
                    ctx.lineTo(e, e / sq32 / 2);
                    ctx.rotate(-tau / 3);
                }
                ctx.restore();
                break;
            default:
                break;
        }

        ctx.closePath();
    }
}