import { fullscreenCanvas } from '../../elo/src/lib/canvas';
import { Loop } from '../../gl/src/loop';
import { CellStore } from "./cellstore";
import { Supercell, HexPos } from "./supercell";
import { CellRender } from "./cellrender";

export const main = () => {
    const ctx = fullscreenCanvas();

    type State = { store: CellStore<number> };

    const init = (): State => {
        const cell = new Supercell(new HexPos(0, 0), 13);

        const makeCell = (pos: HexPos): number | null => {
            if (!cell.contains(pos)) return null;

            if (pos.i == 0 && pos.j == 0) return 4;

            return (pos.i > 0 ? 2 : 0) + (pos.j > 0 ? 1 : 0);
        }

        const cloneCell = (pos: HexPos, cell: number): number => {
            return cell;
        }

        const storage = new CellStore<number>(cell.corners, makeCell, cloneCell);

        return {
            store: storage
        }
    }

    const fixed = (delta: number, s: State): State => {
        return s;
    }

    const variable = (delta: number, s: State): void => {
        const render = new XCellRender(10);
        render.render(ctx, s.store);
    }

    const loop = new Loop(1000 / 60, init, fixed, variable);

    loop.start();
}

const colors = ['red', 'green', 'blue', 'silver', 'black'];

class XCellRender extends CellRender<number> {
    protected getCellColor(value: number): string {
        return colors[value];
    }
}
