import { CellStore } from '../../hexflow/src/cellstore';
import { HexPos } from '../../hexflow/src/supercell';
import { rnd } from "./util";
import { hcy } from '../../elo/src/lib/color';

type CellType = { color: [number, number, number] };

export const red: CellType = { color: hcy(0, 1, .3) };
export const blue: CellType = { color: hcy(230, 1, .4) };
export const green: CellType = { color: hcy(130, 1, .5) };
export const yellow: CellType = { color: hcy(35, 1, .7) };
export const orange: CellType = { color: hcy(50, 1, .8) };
export const silver: CellType = { color: hcy(130, 0, .8) };

export const types = [red, blue, green, yellow, orange, silver];

export class Cell {
    constructor(public readonly type: CellType) {
    }
}

export class World {
    public readonly store: CellStore<Cell>;

    constructor() {
        const w = 9;
        const h = 5;

        this.store = bucketData(w, h);
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
