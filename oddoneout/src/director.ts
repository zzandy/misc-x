import { hcy2rgb } from "../../lib/color";
import { ICanvasRenderingContext2D } from "../../lib/canvas";
import { rnd } from '../../lib/rnd';
import { shuffle } from '../../lib/util';

export const shapeTypes = ['triangle', 'square', 'hex', 'circle', 't2', 'h2', 'c', 'c2', 'diamond', 'cross', 'x', 'star'] as const;
export type ShapeType = typeof shapeTypes[number];

const colors = [
    '#ed1515', '#f67400', '#ffb900', '#c9ce3b', '#1cdc9a', '#11d116', '#1d99f3',
    '#fcfcfc', '#ea005e', '#b146c2'
];

function pick<T>(options: T[], n: number, oddone: boolean, alldifferent: boolean = false): T[] {
    const res = [];

    alldifferent = alldifferent && !oddone;

    for (let i = 0; i < n; ++i) {
        res.push(options[alldifferent ? (i % options.length) : 0]);
    }

    if (oddone) {
        res[0] = options[1];
    }

    shuffle(res);

    return res;
}

const minsize = 2;
const maxsize = 27;

export class Director {

    private _shapes: IDrawable[] | null = null;
    private size: number = 10;
    private isregen: boolean = false;

    private makeShapes() {

        let vary = rnd(['shape', 'color', 'shading', 'size']);

        const types = shapeTypes.map(t => t);
        shuffle(types);
        shuffle(colors);

        const len = this.size * this.size;
        const shapes = pick(types, len, vary == 'shape', rnd() < .5);
        const cols = pick(colors, len, vary == 'color', rnd() < .5);

        let f = rnd() < .5;
        const fils = pick([f, !f], len, vary == 'shading');

        f = vary == 'size' ? rnd() < .5 : false;
        const size = pick([f, !f], len, vary == 'size');

        var res = [];
        for (let i = 0; i < len; ++i) {
            res.push(new Shape(shapes[i], cols[i], fils[i], size[i]));
        }

        return res;
    }

    public get shapes() {
        if (this._shapes == null || this.isregen) {
            this._shapes = this.makeShapes();
        }

        return this._shapes;
    }

    public startregen() {
        this.isregen = true;
    }

    public stopregen() {
        this.isregen = false;
    }

    public regen() {
        this._shapes = null;
    }

    public grow() {
        if (this.size < maxsize) {
            this.size++;
            this.regen();
        }
    }

    public shrink() {
        if (this.size > minsize) {
            this.size--;
            this.regen();
        }
    }
}



export interface IDrawable {
    draw(ctx: ICanvasRenderingContext2D): void;
}

const tau = Math.PI * 2;

export class Shape implements IDrawable {
    constructor(public readonly type: ShapeType, public readonly color: string, public readonly filled: boolean, private readonly small: boolean) {
        //this.type = "diamond";
    }

    draw(ctx: ICanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;

        if (this.small) {
            ctx.translate(.25, .25)
            ctx.scale(.5, .5);
            ctx.lineWidth *= 2;
        }

        this.path(ctx);
        ctx.fill();

        if (!this.filled) {
            ctx.save();

            ctx.translate(.5, .5);

            switch (this.type) {
                case 'triangle':
                    ctx.scale(.83, .83);
                    ctx.translate(-.5, -.47);
                    break;
                case 't2':
                    ctx.scale(.83, .83);
                    ctx.translate(-.5, -.53);
                    break;
                case 'diamond':
                    ctx.scale(.86, .86);
                    ctx.translate(-.5, -.5);
                    break;
                case 'x':
                case 'star':
                    ctx.scale(.82, .82);
                    ctx.translate(-.5, -.5);
                    break;
                default:
                    ctx.scale(.88, .88);
                    ctx.translate(-.5, -.5);
                    break;
            }

            this.path(ctx, true);

            ctx.globalCompositeOperation = "destination-out";
            ctx.fill();
            ctx.restore();
        }
    }

    path(ctx: ICanvasRenderingContext2D, small: boolean = false) {
        ctx.beginPath();

        switch (this.type) {
            case "circle":
                ctx.arc(.5, .5, .5, 0, tau);
                break;
            case "triangle":
                ctx.moveTo(0, .9);
                ctx.lineTo(.5, .1);
                ctx.lineTo(1, .9);
                break;
            case 't2':
                ctx.moveTo(0, .1);
                ctx.lineTo(.5, .9);
                ctx.lineTo(1, .1);
                break;
            case "hex":
                ctx.lineTo(.5, 0);
                ctx.lineTo(.95, .2);
                ctx.lineTo(.95, .8);
                ctx.lineTo(.5, 1);
                ctx.lineTo(.05, .8);
                ctx.lineTo(.05, .2);
                break;
            case 'h2':
                ctx.lineTo(0, .5);
                ctx.lineTo(.2, .95);
                ctx.lineTo(.8, .95);
                ctx.lineTo(1, .5);
                ctx.lineTo(.8, .05);
                ctx.lineTo(.2, .05);
                break;
            case "square":
                ctx.moveTo(.1, .1);
                ctx.lineTo(.1, .9);
                ctx.lineTo(.9, .9);
                ctx.lineTo(.9, .1);
                break;
            case "c":
                const a = small ? .12 : .1
                ctx.arc(.5, .5, .5, a * tau, (1 - a) * tau);
                ctx.lineTo(small ? .4 : .5, .5)
                break;
            case "c2":
                const b = small ? .12 : .1
                ctx.arc(.5, .5, .5, (.5 - b) * tau, (.5 + b) * tau, true);
                ctx.lineTo(small ? .6 : .5, .5)
                break;
            case 'diamond':
                ctx.moveTo(.5, 0);
                ctx.lineTo(1, .5);
                ctx.lineTo(.5, 1);
                ctx.lineTo(0, .5);
                break;
            case 'x':
                const w = small ? .20 : .25;

                ctx.moveTo(w, 0);
                ctx.lineTo(.5, .5 - w);
                ctx.lineTo(1 - w, 0);
                ctx.lineTo(1, w);
                ctx.lineTo(.5 + w, .5);
                ctx.lineTo(1, 1 - w);
                ctx.lineTo(1 - w, 1);
                ctx.lineTo(.5, .5 + w);
                ctx.lineTo(w, 1);
                ctx.lineTo(0, 1 - w);
                ctx.lineTo(.5 - w, .5);
                ctx.lineTo(0, w);
                break;
            case 'cross':
                const z = small ? .16 : .2;
                ctx.moveTo(.5 - z, 0);
                ctx.lineTo(.5 + z, 0);
                ctx.lineTo(.5 + z, .5 - z);
                ctx.lineTo(1, .5 - z);
                ctx.lineTo(1, .5 + z);
                ctx.lineTo(.5 + z, .5 + z);
                ctx.lineTo(.5 + z, 1);
                ctx.lineTo(.5 - z, 1);
                ctx.lineTo(.5 - z, .5 + z);
                ctx.lineTo(0, .5 + z);
                ctx.lineTo(0, .5 - z);
                ctx.lineTo(.5 - z, .5 - z);
                break;
            case 'star':
                const r1 = .3;
                const r2 = .5;
                ctx.moveTo(.5, 0);

                for (let i = 0; i < 5; ++i) {
                    let a1 = tau / 5 * (i - 2);
                    let a2 = tau / 10 + tau / 5 * (i - 2);
                    ctx.lineTo(.5 + r1 * Math.sin(a1), .5 + r1 * Math.cos(a1));
                    ctx.lineTo(.5 + r2 * Math.sin(a2), .5 + r2 * Math.cos(a2));
                }

                break;
        }

        ctx.closePath();
    }
}