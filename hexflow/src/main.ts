import { fullscreenCanvas } from '../../lib/canvas';
import { Loop } from '../../gl/src/loop';
import { CellStore, getterFn } from "../../lib/cellstore";
import { Supercell, HexPos } from "../../lib/supercell";
import { CellRender } from "./cellrender";
import { hcy2rgb } from '../../lib/color';
import { HexVec, HexDir } from './hexvec';

class Cell {
    value: number;
    vector: HexVec;
}
let g = 0;
export const main = () => {
    const ctx = fullscreenCanvas();
    const render = new XCellRender(10);

    type State = { store: CellStore<Cell> };

    const init = (): State => {
        const cell = new Supercell(new HexPos(0, 0), 13);

        const makeCell = (pos: HexPos): Cell | null => {
            if (!cell.contains(pos)) return null;

            let n = pos.i == 0 && pos.j == 0 ? 3000000 : 0;
            //let n = Math.floor(Math.random() * 360);

            return { value: n, vector: HexVec.empty };
        }

        const storage = CellStore.Create<Cell>(cell.corners, makeCell);

        return {
            store: storage
        }
    }

    const fixed = (delta: number, s: State): State => {
        g = 0;
        s.store.update(clone, update);
        //console.log(g)
        return s;
    }

    const variable = (delta: number, s: State): void => {
        render.render(ctx, s.store);
        render.applyValueScale();
    }

    const loop = new Loop(1000 / 10, init, fixed, variable);

    const state = init();
    ctx.canvas.addEventListener('mousedown', _ => { fixed(0, state); variable(0, state) })

    //loop.start();
}

function clone(c: Cell): Cell {
    return { value: c.value, vector: new HexVec(c.vector.value) };
}

function targetDemand(source: Cell, dir: HexDir, target: Cell) {
    return source.value + source.vector.value[dir] - target.value - target.vector.value[(dir + 3) % 6];
}

function update(pos: HexPos, oldCell: Cell, newCell: Cell, oldGet: getterFn<Cell>, newGet: getterFn<Cell>) {
    const log = (pos.i == 0 && pos.j == 1) || (pos.i == 0 && pos.j == 0);
    const v = oldCell.value;
    g += oldCell.value;

    const adj = <CellPos<Cell>[]>(surround(pos, oldGet).filter(a => a.cell != null));
    const clients = adj.filter(a => targetDemand(oldCell, a.dir, a.cell) > 0);

    if (clients.length > 0) {
        const totalDemand = clients.reduce((s, a) => s + targetDemand(oldCell, a.dir, a.cell), 0);
        const minLevel = 0;//Math.floor(clients.reduce((s, a) => Math.min(a.cell.value, s), Infinity) + v * .1);
        let totalProduct = v - minLevel;
        const k = totalDemand > totalProduct ? totalProduct / totalDemand : 1;
        clients
            .sort((a, b) => a.cell.value - b.cell.value)
            .forEach(a => {
                const take = Math.min(totalProduct, Math.round(k * targetDemand(oldCell, a.dir, a.cell)));
                const target = <Cell>newGet(a.pos);

                target.value += take;
                target.vector = target.vector.add(a.dir, take);

                newCell.value -= take;
                newCell.vector = newCell.vector.add(a.dir, -take);

                totalProduct -= take;
            });
    }
    if (log) console.log(pos.i, pos.j, newCell.value, newCell.vector.value.join(';'))
}

interface CellPos<TValue> {
    dir: HexDir,
    cell: TValue,
    pos: HexPos
}

function surround<TValue>(pos: HexPos, getter: getterFn<TValue>): (CellPos<TValue | null>)[] {
    return [
/* up         */{ dir: HexDir.up, pos: pos.add(0, 1), cell: getter(pos.add(0, 1)) },
/* up-right   */{ dir: HexDir.upRight, pos: pos.add(1, 1), cell: getter(pos.add(1, 1)) },
/* down-right */{ dir: HexDir.downRight, pos: pos.add(1, 0), cell: getter(pos.add(1, 0)) },
/* down       */{ dir: HexDir.down, pos: pos.add(0, -1), cell: getter(pos.add(0, -1)) },
/* down-left  */{ dir: HexDir.downLeft, pos: pos.add(-1, -1), cell: getter(pos.add(-1, -1)) },
/* up-left    */{ dir: HexDir.upLeft, pos: pos.add(-1, 0), cell: getter(pos.add(-1, 0)) },
    ];
}

const colors = ['white', 'black', 'red', 'silver', 'black'];

class XCellRender extends CellRender<Cell> {
    private min: number = Infinity;
    private max: number = -Infinity;
    private q: number = 1;
    private o: number = 0;

    protected getCellColor(cell: Cell): string {

        this.min = Math.min(this.min, cell.value - 1);
        this.max = Math.max(this.max, cell.value + 1);

        const v = (cell.value - this.o) / this.q;

        return hcy2rgb(360 * v, 0, .3 + .4 * v);
    }

    public applyValueScale() {
        this.o = this.min;
        this.q = (this.max - this.min);

        this.min = Infinity;
        this.max = -Infinity;
    }
}
