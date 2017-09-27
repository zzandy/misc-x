import { CellStore } from '../../lib/cellstore';
import { HexPos } from '../../lib/supercell';
import { Point } from '../../lib/geometry';
import { rnd } from "../../lib/util";
import { wheelHcy } from '../../lib/color';

type CellType = { color: [number, number, number] };

export const red: CellType = { color: wheelHcy(0, 1, .25) };
export const blue: CellType = { color: wheelHcy(240, 1, .35) };
export const green: CellType = { color: wheelHcy(180, 1, .45) };
export const yellow: CellType = { color: wheelHcy(90, 1, .8) };
export const orange: CellType = { color: wheelHcy(45, 1, .5) };
export const silver: CellType = { color: wheelHcy(90, .1, .9) };
export const violet: CellType = { color: wheelHcy(305, 1, .5) }

export const types = [red, blue, green, yellow, orange, silver, violet];

export class Cell {
    constructor(public readonly type: CellType) {
    }
}

export class World {
    public readonly store: CellStore<Cell>;
    public dragStart: HexPos | null;
    public dragEnd: HexPos | null;

    constructor(w: number, h: number) {
        this.store = bucketData(w, h);
    }

    public beginDrag(point: Point): void {
        const pos = HexPos.fromPoint(point);

        console.log(pos, this.store.get(pos));

        if (this.store.get(pos) != null)
            this.dragStart = pos;
        else
            this.dragStart = this.dragEnd = null;
    }

    public endDrag(point: Point): void {
        const pos = HexPos.fromPoint(point);

        if (this.store.get(pos) != null)
            this.dragEnd = pos;
        else
            this.dragStart = this.dragEnd = null;
    }

    public update(delta: number) {

    }
}

function bucketData(w: number, h: number): CellStore<Cell> {
    const a: (Cell | null)[][] = [];

    const ox = (w / 2) | 0;
    const numrows = ((h - 1) || 1) + (w - 1) / 2;
    const oy = ((numrows - 1) / 2) | 0;

    for (let i = 0; i < numrows; ++i) {
        const row: (Cell | null)[] = [];

        for (let j = 0; j < w; ++j) {

            if (i < (j - 1) / 2 || i > (j - 1) / 2 + h - 1)
                row.push(null)
            else
                row.push(new Cell(rnd(types)));
        }

        a.push(row);
    }

    return new CellStore(a, new HexPos(oy, ox));
}
