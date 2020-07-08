import { ICanvasRenderingContext2D } from "../../lib/canvas";
import { rnd } from '../../lib/rnd';
import { Shape } from "./shapes";

export const shapeTypes = ['heart', 'triangle', 'square', 'hex', 'circle',
    't2', 'h2', 'c', 'c2', 's2', 'diamond', 'd2', 'bolt',
    'cross', 'x', 'star', 'eq', 'pause', 'slash', 'sl2'] as const;
export type ShapeType = typeof shapeTypes[number];
export type Orientation = 'rows' | 'cols' | 'grid';
export type Shading = 'solid' | 'contour';
export const sq32 = Math.sqrt(3) / 2;

const types = shapeTypes.map(t => t);

const presets: { [key in Orientation]: ShapeType[][] } = {
    'grid': [
        ['c', 'c2'],
        ['hex', 'h2'],
        ['heart', 'd2'],
        ['circle', 'c'],
        ['circle', 'c2'],
        ['triangle', 'd2'],
        ['eq', 'pause'],
        ['eq', 'square'],
        ['square', 'pause', 'cross'],
        ['square', 'slash', 'sl2'],
        ['cross', 'x', 'diamond']
    ],

    'rows': [
        ['circle', 'h2'],
        ['hex', 's2'],
        ['h2', 's2'],
    ],

    'cols': [
        ['circle', 'hex'],
        ['t2', 'd2', 'heart'],
        ['hex', 's2'],
        ['h2', 's2'],
    ]
}

function preset(orientation: Orientation): ShapeType[] {
    let set = presets[orientation];

    return rnd() < Math.sqrt(set.length / types.length) / 3
        ? rnd(set)
        : types;
}

function badcombo(odd: ShapeType, fill: ShapeType, orientation: Orientation) {
    const res = orientation == 'rows' && fill == 'triangle'
        || orientation == 'cols' && fill == 't2';

    return res;
}

const colors = [
    '#dede0e',
    '#fad000',
    '#faa002',
    '#e66102',
    '#ed1515',
    '#ea005e',
    '#c80d66',
    '#ff4fbc',

    '#720C99',
    '#0d5bc7',
    '#079ebd',
    '#88dfbb',
    '#20cc10',
    '#00954a',
    '#fcfcfc',
]

function badcolor(a: string, b: string) {
    return a == '#dede0e' && b == '#fad000'
        || b == '#dede0e' && a == '#fad000'

        || a == '#ea005e' && b == '#c80d66'
        || b == '#ea005e' && a == '#c80d66'
}

function picker<T>(n: number, options: T[], orientation: Orientation, vary: boolean, varyAll: boolean = false, badcombo: (a: T, b: T, orientation: Orientation) => boolean = () => false): () => T {
    if (vary) {
        const t = rnd(n);

        console.log(t, n)
        let i = 0;

        const odd = rnd(options);
        let other = odd;
        while (other == odd || badcombo(odd, other, orientation))
            other = rnd(options);

        return () => i++ == t ? odd : other;
    }
    else {
        const r = rnd(options)
        return varyAll ? () => rnd(options) : () => r;
    }
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
        let vary = rnd(['shape', 'shape', 'shape', 'shape', 'color', 'color', 'color', 'shading', 'size']);

        this.orientation = rnd(['rows', 'cols', 'grid', 'grid', 'grid']);

        const [ver, hor] = [this.orientation == "rows", this.orientation == "cols"];
        const [sx, sy] = [ver ? 1 / sq32 : 1, hor ? 1 / sq32 : 1];

        const n = this.size;

        const [nx, ny] = this.aspect > 1
            ? [Math.round((1 + (n - 1) * sx) * this.aspect), Math.round(1 + (n - 1) * sy)]
            : [Math.round(1 + (n - 1) * sx), Math.round((1 + (n - 1) * sy) / this.aspect)];

        const len = nx * ny;

        var res = [];

        let pickShape = picker(len, preset(this.orientation), this.orientation, vary == 'shape', rnd() < .4 && this.orientation == "grid", badcombo);


        let pickColor = picker(len, colors, this.orientation, vary == 'color', rnd() < .4, badcolor);

        let shadings = ['solid', 'contour'] as Shading[];

        let pickShade = picker(len, shadings, this.orientation, vary == 'shading')

        const f = rnd() < .5;
        let pickSize = picker(len, vary == 'size' || rnd() < .2 ? [f, !f] : [false], this.orientation, vary == 'size')

        for (let i = 0; i < ny; ++i) {
            let row = [];
            for (let j = 0; j < nx; ++j) {
                row.push(new Shape(pickShape(), pickColor(), pickShade(), pickSize()))
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


