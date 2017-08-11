import { fullscreenCanvas } from '../../elo/src/lib/canvas';
import { Loop } from '../../gl/src/loop';
import { CellStore, getterFn } from "./cellstore";
import { Supercell, HexPos } from "./supercell";
import { CellRender } from "./cellrender";

class Cell {
    value: number;
}

export const main = () => {
    const ctx = fullscreenCanvas();

    type State = { store: CellStore<Cell> };

    const init = (): State => {
        const cell = new Supercell(new HexPos(0, 0), 13);

        const makeCell = (pos: HexPos): Cell | null => {
            if (!cell.contains(pos)) return null;

            let n = Math.floor(3 * Math.random());

            return { value: n };
        }

        const storage = CellStore.Create<Cell>(cell.corners, makeCell);

        return {
            store: storage
        }
    }

    const fixed = (delta: number, s: State): State => {
        s.store.update(clone, update);
        return s;
    }

    const variable = (delta: number, s: State): void => {
        const render = new XCellRender(10);
        render.render(ctx, s.store);
    }

    const loop = new Loop(1000 / 10, init, fixed, variable);

    loop.start();
}

function clone(c: Cell): Cell {
    return { value: c.value };
}

function update(pos: HexPos, oldCell: Cell, newCell: Cell, oldGet: getterFn<Cell>, newGet: getterFn<Cell>) {
    const adj = surround(pos, oldGet);
    const living = adj.reduce((a, b) => a + (b != null && b.value == 1 ? 1 : 0), 0);
    const red = adj.reduce((a, b) => a + (b != null && b.value == 2 ? 1 : 0), 0);
    const isalive = oldCell.value == 1;


    if (isalive && (living > 4 || living < 2))
        newCell.value = 2;

    if (!isalive) {

        if ((living == 0 && red == 1) || living == 3) {
            newCell.value = 1;
        }
        else newCell.value = 0;
    }
}

function surround<TValue>(pos: HexPos, getter: getterFn<TValue>): (TValue | null)[] {
    return [
/* up         */ getter(pos.add(0, 1)),
/* up-right   */ getter(pos.add(1, 1)),
/* donw-right */ getter(pos.add(1, 0)),
/* down       */ getter(pos.add(0, -1)),
/* down-left  */ getter(pos.add(-1, -1)),
/* up-left    */ getter(pos.add(-1, 0)),
    ];
}

const colors = ['white', 'black', 'red', 'silver', 'black'];

class XCellRender extends CellRender<Cell> {
    protected getCellColor(cell: Cell): string {
        return colors[cell.value];
    }
}
