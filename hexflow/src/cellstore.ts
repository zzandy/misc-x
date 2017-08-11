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

export interface updateFn<TValue> {
    (pos: HexPos, oldCell: TValue, newCell: TValue, oldGetter: getterFn<TValue>, newData: getterFn<TValue>): void;
}

export interface cloneFn<TValue> {
    (old: TValue): TValue;
}

export interface getterFn<TValue> {
    (pos: HexPos): TValue | null;
}

export class CellStore<TValue>{

    private current: (TValue | null)[][];
    private next: (TValue | null)[][];

    private readonly w: number;
    private readonly h: number;

    constructor(data: (TValue | null)[][], readonly storeOrigin: HexPos) {
        this.h = data.length;
        this.w = data[0].length;

        this.current = data;
        this.next = [];
        for (let i = 0; i < this.h; ++i) {
            let row: (TValue | null)[] = [];
            for (let j = 0; j < this.w; ++j) {
                row.push(data[i][j])
            }
            this.next.push(row);
        }
    }

    static Create<TValue>(corners: HexPos[], initFn: (p: HexPos) => (TValue | null)): CellStore<TValue> {
        const data: (TValue | null)[][] = [];
        const storeOrigin = makeArray(corners, data, initFn);
        return new CellStore<TValue>(data, storeOrigin);
    }

    public forEach(callback: (pos: HexPos, value: TValue) => void) {
        const data = this.current;
        for (let i = 0; i < this.h; ++i) {
            for (let j = 0; j < this.w; ++j) {
                const d = data[i][j];
                if (d != null)
                    callback(new HexPos(i - this.storeOrigin.i, j - this.storeOrigin.j), d);
            }
        }
    }

    public update(cloneFn: cloneFn<TValue>, callback: updateFn<TValue>) {
        const prev = this.current;
        const next = this.next;

        for (let i = 0; i < this.h; ++i) {
            for (let j = 0; j < this.w; ++j) {
                const d = prev[i][j];
                next[i][j] = d == null ? null : cloneFn(d);
            }
        }

        for (let i = 0; i < this.h; ++i) {
            for (let j = 0; j < this.w; ++j) {
                const d = prev[i][j];
                if (d != null)
                    callback(new HexPos(i - this.storeOrigin.i, j - this.storeOrigin.j), <TValue>prev[i][j], <TValue>next[i][j], this.prevGetter.bind(this), this.nextGetter.bind(this));
            }
        }

        this.next = prev;
        this.current = next;
    }

    private prevGetter(pos: HexPos): TValue | null {
        const i = pos.i + this.storeOrigin.i;
        const j = pos.j + this.storeOrigin.j;

        return i >= 0 && j >= 0 && i < this.h && j < this.w ? this.current[i][j] : null;
    }
    private nextGetter(pos: HexPos): TValue | null {
        const i = pos.i + this.storeOrigin.i;
        const j = pos.j + this.storeOrigin.j;

        return i >= 0 && j >= 0 && i < this.h && j < this.w ? this.next[i][j] : null;
    }
}