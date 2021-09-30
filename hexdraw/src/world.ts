import { rnd, array } from '../../lib/util';
import { color, Palette } from './palette';
import { SpriteRenderer } from './sprite-renderer';
import { WorldRenderer } from './world-renderer';

type adjarray = [boolean, boolean, boolean, boolean, boolean, boolean];
/* hex:  0
        ___
    5  /   \  1
    4  \___/  2
         3           */
type adjindex = 0 | 1 | 2 | 3 | 4 | 5;


class Cell {
    constructor(public readonly value: number, public color: color) {
    }

    public sprite: HTMLCanvasElement | null = null;
}

export class World {
    private readonly data: Cell[][];

    constructor(public readonly w: number, public readonly h: number, private readonly palette: Palette, sr: SpriteRenderer, private readonly wr: WorldRenderer) {
        const data = this.data = array(w, h, (i, j) => {
            const cell = new Cell((j === 0 || j === w - 1 || (i === 0 && j % 2 === 1) || i === h - 1 && !!(j % 2)) ? 0 : Math.random() < .7 ? 1 : 0, this.palette.secondary);
            return cell;
        });

        let overflow = 0;

        while (1) {

            const i = rnd(h);
            const j = rnd(w / 2);

            const k = h - i - 1;
            const l = w - j - 1;

            if (i >= 0 && i < h && j >= 0 && j < w && k >= 0 && k < h && l >= 0 && l < w && data[i][j].value && data[k][l].value) {

                data[i][j].color = this.palette.primary;
                data[k][l].color = this.palette.accent;

                break;
            }

            if (++overflow > 100)
                throw new Error("Failed to place source and destination");
        }

        for (let i = 0; i < this.data.length; ++i)
            for (let j = 0; j < this.data[i].length; ++j) {
                const cell = this.data[i][j];
                const adjs = collectAdjacency(this.data, i, j, cell.value);

                cell.sprite = sr.render(cell.value != 0, cell.color, adjs);
            }
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

const collectAdjacency = (data: Cell[][], i: number, j: number, value: number): adjarray => {
    return [
        isSolid(getAdj(data, 0, i, j)),
        isSolid(getAdj(data, 1, i, j)),
        isSolid(getAdj(data, 2, i, j)),
        isSolid(getAdj(data, 3, i, j)),
        isSolid(getAdj(data, 4, i, j)),
        isSolid(getAdj(data, 5, i, j))
    ];
}

const isSolid = (adj: Cell | null): boolean => {
    return adj !== null && adj.value != 0;
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