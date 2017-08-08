import { ICanvasRenderingContext2D } from '../../elo/src/lib/canvas';
import { HexPos, Supercell } from "./supercell";
import { CellStore } from "./cellstore";

export class Point {
    constructor(public readonly x: number, public readonly y: number) { }
}

const q = 1 / Math.sqrt(3);
const sq32 = Math.sqrt(3) / 2;

export abstract class CellRender<TValue> {
    constructor(private readonly cellsize: number) { }

    public render(ctx: ICanvasRenderingContext2D, cells: CellStore<TValue>) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        cells.forEach((pos: HexPos, value: TValue) => this.renderCell(ctx, pos, value));
    }

    private renderCell(ctx: ICanvasRenderingContext2D, pos: HexPos, value: TValue) {
        const s = this.cellsize;
        const { x, y } = this.getScreen(ctx, pos);

        ctx.fillStyle = this.getCellColor(value);
        this.fillHex(ctx, x, y, s);
    }

    protected abstract getCellColor(value: TValue): string;

    private getScreen(ctx: ICanvasRenderingContext2D, pos: HexPos): Point {
        const s = this.cellsize;
        const q = .95;

        return new Point(ctx.canvas.width/2+q * s * pos.j * sq32, ctx.canvas.height/2+q * -s * (pos.i - pos.j / 2))
    }

    private fillHex(ctx: ICanvasRenderingContext2D, x: number, y: number, s: number): void {
        ctx.save();
        ctx.translate(x, y);

        const dx = q * s / 2;
        const dy = s / 2;

        ctx.beginPath();
        ctx.moveTo(2 * dx, 0);
        ctx.lineTo(dx, -dy);
        ctx.lineTo(-dx, -dy);
        ctx.lineTo(-2 * dx, 0);
        ctx.lineTo(-dx, dy);
        ctx.lineTo(dx, dy);

        ctx.closePath();

        ctx.fill();
        ctx.restore();
    }
}