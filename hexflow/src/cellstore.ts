import { HexPos } from "./supercell";

class Cell<TValue>{
    constructor(public value: TValue) { }
}

const makeArray = <TValue>(corners: HexPos[], array: (TValue | null)[][], initFn: (p: HexPos) => TValue | null): HexPos => {
    const min = Math.min;
    const max = Math.max;

    type Tmiminax = { min: HexPos, max: HexPos }
    const minmax = <Tmiminax>corners.reduce((aggr: Tmiminax | null, corner) => {
        return aggr == null
            ? { min: corner, max: corner }
            : {
                min: new HexPos(min(aggr.min.i, corner.i), min(aggr.min.j, corner.j)),
                max: new HexPos(max(aggr.max.i, corner.i), max(aggr.max.j, corner.j))
            }

    }, null);

    const n = minmax.max.i - minmax.min.i + 1;
    const m = minmax.max.j - minmax.min.j + 1;

    for (let i = 0; i < n; ++i) {
        const row = [];
        for (let j = 0; j < m; ++j)
            row.push(initFn(new HexPos(i + minmax.min.i, j + minmax.min.j)))

        array.push(row);
    }

    return new HexPos(-minmax.min.j, -minmax.min.i);
}

export class CellStore<TValue>{
    private readonly data: (TValue|null)[][];
    private readonly storeOrigin: HexPos;

    constructor(corners: HexPos[], initFn: (p: HexPos) => TValue | null, private readonly cloneFn: (p: HexPos, value: TValue) => TValue TValue) {
        this.data = [];
        this.storeOrigin = makeArray(corners, this.data, initFn)
    }

    public forEach(callback: (pos: HexPos, value: TValue) => void) {
        for (let i = 0; i < this.data.length; ++i) {
            for (let j = 0; j < this.data[i].length; ++j) {
                const d = this.data[i][j];
                if (d != null)
                    callback(new HexPos(i - this.storeOrigin.i, j - this.storeOrigin.j), d);
            }
        }
    }
}