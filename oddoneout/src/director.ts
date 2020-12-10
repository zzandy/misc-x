import { ICanvasRenderingContext2D } from "../../lib/canvas";
import { rnd } from '../../lib/rnd';
import { Shape } from "./shapes";

export const shapeTypes = ['heart', 'triangle', 'square', 'hex', 'circle', 'coin', 'tripl', 'y', 'asterisk',
    't2', 'h2', 'c', 'c2', 's2', 'diamond', 'd2', 'bolt', 'clubs', 'diamonds',
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
        ['circle', 'coin'],
        ['circle', 'asterisk'],
        ['circle', 'coin', 'c', 'c2'],
        ['triangle', 'd2'],
        ['triangle', 'clubs'],
        ['square', 'pause', 'cross', 'eq'],
        ['square', 'slash', 'sl2'],
        ['cross', 'x', 'diamond'],
        ['cross', 'x', 'asterisk'],
        ['x', 'tripl', 'asterisk'],
        ['x', 'y', 'tripl', 'cross'],
        ['tripl', 'asterisk'],
        ['asterisk', 'hex', 'h2'],
        ['diamond', 'diamonds'],
        ['diamonds', 'heart', 'clubs'],
        ['heart', 'clubs'],
        ['circle', 'diamonds'],
        ['s2', 'diamonds']
    ],

    'rows': [
        ['circle', 'h2', 'coin'],
        ['hex', 's2', 'asterisk'],
        ['h2', 's2'],
        ['triangle', 'heart', 'tripl'],
        ['tripl', 'asterisk', 'clubs'],
        ['tripl', "y"],
    ],

    'cols': [
        ['circle', 'hex', 'coin'],
        ['t2', 'd2', 'heart', 'y'],
        ['hex', 's2'],
        ['h2', 's2'],
        ['tripl', 'asterisk', 'clubs', "y"],
        ['tripl', "y"],
    ]
}

function preset(orientation: Orientation): ShapeType[] {
    let set = presets[orientation];

    return rnd() < Math.sqrt(set.length / types.length) / 3
        ? rnd(set)
        : types;
}

const colors = [
    '#dede0e', // 0
    '#fad000', // 1
    '#faa002', // 2
    '#e66102', // 3
    '#ed1515', // 4
    '#ea005e', // 5
    '#c80d66', // 6
    '#ff4fbc', // 7
    '#720C99', // 8
    '#0d5bc7', // 9
    '#079ebd', // 10
    '#88dfbb', // 11
    '#20cc10', // 12
    '#00954a', // 13
    '#fcfcfc', // 14
];

function presetColor() {
    let pick = rnd();

    if (pick < .1) {
        return [colors[colors.length - 1]].concat(colors[rnd(colors.length - 1)])
    }
    else if (pick < .2) {
        let x = rnd(colors.length - 1);
        return [colors[x], colors[(x + 1) % (colors.length - 1)], colors[(x + 2) % (colors.length - 1)]]
    }
    else if (pick < .3) {
        let x = rnd(colors.length - 1);
        return colors.filter((_, i) => i != colors.length - 1 && i != x && i != (x + 1) % (colors.length - 1) && i != (x + 2) % (colors.length - 1));
    }

    return colors;
}

function badcombo(odd: ShapeType, fill: ShapeType, orientation: Orientation) {
    return fill == 'triangle' && odd != 't2' || fill == 't2' && odd != 'triangle'
        || odd == 'triangle' && fill != 't2' || odd == 't2' && fill != "triangle"
        || (fill == 'tripl' || fill == 'y') && orientation == 'grid'
        || fill == 'cross' && orientation == 'rows';
}

function badcolor(a: string, b: string) {
    return a == '#dede0e' && b == '#fad000'
        || b == '#dede0e' && a == '#fad000'

        || a == '#ea005e' && b == '#c80d66'
        || b == '#ea005e' && a == '#c80d66'
}

function picker<T>(n: number, options: T[], orientation: Orientation, vary: boolean, varyAll: boolean = false, badcombo: (a: T, b: T, orientation: Orientation) => boolean = () => false): () => T {
    if (vary) {
        const t = rnd(n);

        let i = 0;

        let odd = rnd(options);
        let other = odd;

        let z = 0;
        while (other == odd || options.length > 2 && badcombo(odd, other, orientation)) {
            if (++z > 20) {
                console.log(odd, other, options)
                throw 1
            }

            odd = rnd(options);
            other = rnd(options);
        }

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

        let pickColor = picker(len, presetColor(), this.orientation, vary == 'color', rnd() < .4, badcolor);

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


