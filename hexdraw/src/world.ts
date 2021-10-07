import { rnd, array } from '../../lib/util';
import { color, Palette } from './palette';
import { adjarray, adjindex, SpriteRenderer } from './sprite-renderer';
import { WorldRenderer } from './world-renderer';

class Cell {
    constructor(public value: number) {
    }

    public sprite: HTMLCanvasElement | null = null;
}

export class World {
    private data: Cell[][];

    private static makeMap(w: number, h: number) {
        return array(w, h, (i, j) => new Cell((j === 0 || j === w - 1 || (i === 0 && j % 2 === 1) || i === h - 1 && !!(j % 2)) ? 0 : Math.random() < .7 ? 1 : 0));
    }

    private static pickRandomPair(data: Cell[][]) {

        let overflow = 0;

        const h = data.length;
        const w = data[0].length

        while (1) {

            const i = rnd(h);
            const j = rnd(w / 2);

            const k = h - i - 1;
            const l = w - j - 1;

            if (i >= 0 && i < h && j >= 0 && j < w && k >= 0 && k < h && l >= 0 && l < w && data[i][j].value && data[k][l].value)
                return [i, j, k, l];

            if (++overflow > 100)
                break;
        }

        throw new Error("Failed to place source and destination");
    }

    constructor(public readonly w: number, public readonly h: number, private readonly palette: Palette, private readonly sr: SpriteRenderer, private readonly wr: WorldRenderer) {
        this.data = this.initMap();

        window.addEventListener('click', () => {
            this.data = this.initMap();
            this.render();
        })
    }

    private initMap() {
        const data = World.makeMap(this.w, this.h);

        let [i, j, k, l] = World.pickRandomPair(data);

        data[i][j].value = 2;

        data[k][l].value = 3;

        for (let i = 0; i < this.h; ++i)
            for (let j = 0; j < this.w; ++j) {
                const cell = data[i][j];
                const adjs = collectAdjacency(data, i, j);

                cell.sprite = this.sr.render(cell.value, (n)=>this.getColor(n), adjs);
            }

        return data;
    }

    private getColor(value: number) {
        return value == 1
            ? this.palette.secondary
            : value == 2
                ? this.palette.accent
                : value == 3
                    ? this.palette.primary
                    : this.palette.bg;
    }

    public render() {
        this.wr.clear();

        for (let i = 0; i < this.data.length; ++i)
            for (let j = 0; j < this.data[i].length; ++j) {
                const cell = this.data[i][j];

                if (cell.sprite != null)
                    this.wr.render(i, j, cell.sprite);
            }
    }
}

const collectAdjacency = (data: Cell[][], i: number, j: number): adjarray => {
    return [
        getAdj(data, 0, i, j)?.value ?? 0,
        getAdj(data, 1, i, j)?.value ?? 0,
        getAdj(data, 2, i, j)?.value ?? 0,
        getAdj(data, 3, i, j)?.value ?? 0,
        getAdj(data, 4, i, j)?.value ?? 0,
        getAdj(data, 5, i, j)?.value ?? 0
    ];
}

const isSolid = (adj: Cell | null, value: number): boolean => {
    return adj !== null && adj.value > 0 && adj.value >= value;
}

const getAdj = <TCell>(data: TCell[][], n: adjindex, i: number, j: number): TCell | null => {
    let ni = i, nj = j;

    switch (n) {
        case 0: // top
            ni -= 1;
            break;
        case 1:
            ni -= j % 2 ? 1 : 0;
            nj += 1;
            break;
        case 2:
            ni += j % 2 ? 0 : 1;
            nj += 1;
            break;
        case 3:
            ni += 1;
            break;
        case 4:
            ni += j % 2 ? 0 : 1;
            nj -= 1;
            break;
        case 5:
            ni -= j % 2 ? 1 : 0;
            nj -= 1;
            break;
    }

    return ni >= 0 && nj >= 0 && ni < data.length && nj < data[ni].length ? data[ni][nj] : null;
}