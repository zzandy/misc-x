import { ICanvasRenderingContext2D } from "../../lib/canvas";
import { rnd } from '../../lib/rnd';
import { shuffle, array } from '../../lib/util';
import { Shape } from "./shapes";

export const shapeTypes = ['heart', 'triangle', 'square', 'hex', 'circle', 't2', 'h2', 'c', 'c2', 's2', 'diamond', 'cross', 'x', 'star'] as const;
export type ShapeType = typeof shapeTypes[number];
export type Orientation = 'vertical' | 'horizontal' | 'grid';
export const sq32 = Math.sqrt(3) / 2;

const colors = [
    '#ed1515',
    '#f67400',
    '#ffd900',
    '#20cc10',
    '#00dbdb',
    '#1d99f3',
    '#ff4fbc',
    '#ea005e',
    '#fcfcfc',
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
const maxsize = 30;

export class Director {

    private _shapes: IDrawable[][] | null = null;
    private size: number = 12;
    public orientation: Orientation = 'grid';

    public isNew = true;

    constructor(private aspect: number = 1) {
    }

    private makeShapes() {
        let vary = rnd(['shape', 'color', 'shading', 'size']);

        const types = shapeTypes.map(t => t);
        shuffle(types);
        shuffle(colors);

        this.orientation = vary != "shape" && rnd() < .5 ? rnd(['vertical', 'horizontal']) : 'grid'

        const w = (this.orientation == "vertical" ? 1 / sq32 : 1) * this.size | 0;
        const h = (this.orientation == "horizontal" ? 1 / sq32 : 1) * (this.size / this.aspect) | 0;

        const len = w * h;

        const shapes = pick(types, len, vary == 'shape', this.orientation == "grid" && rnd() < .5);
        const cols = pick(colors, len, vary == 'color', rnd() < .5);

        let f = rnd() < .5;
        const fils = pick([f, !f], len, vary == 'shading');

        f = vary == 'size' ? rnd() < .5 : false;
        const size = pick([f, !f], len, vary == 'size');

        var res = [];

        for (let i = 0; i < h; ++i) {
            let row = [];
            for (let j = 0; j < w; ++j) {
                let k = i * w + j;
                row.push(new Shape(shapes[k], cols[k], fils[k], size[k]));
            }

            res.push(row);
        }

        return res;
    }

    public get shapes() {
        if (this._shapes == null) {
            this._shapes = this.makeShapes();
            this.isNew = true;

        }

        return this._shapes;
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


