import { ICanvasRenderingContext2D } from '../../lib/canvas';
import { World, Cell } from "./world";
import { HexPos } from "../../lib/supercell";
import { Point } from '../../lib/geometry';
import { rgbdata2rgb } from '../../lib/color';

export class Renderer {
    constructor(private readonly ctx: ICanvasRenderingContext2D, private readonly size: number) {

    }

    public clear(): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    public mapPoint(p: Point): Point {
        const ctx = this.ctx;
        const s = this.size;

        return p.plus(-ctx.canvas.width / 2, -ctx.canvas.height / 2).times(1 / s, -1 / s);
    }

    public render(world: World, cursor: Point | null): void {
        const ctx = this.ctx;
        const s = this.size;

        world.store.forEach((pos: HexPos, cell: Cell) => {
            const point = pos.toPoint().times(s, -s).plus(ctx.canvas.width / 2, ctx.canvas.height / 2);

            ctx.fillStyle = rgbdata2rgb(cell.type.color);

            if (world.dragStart != null && world.dragStart.i == pos.i && world.dragStart.j == pos.j)
                ctx.fillStyle = 'grey';

            ctx.fillCircle(point.x, point.y, s / 2);

            if (cursor != null) {
                ctx.fillStyle = 'rgba(255, 255, 255, .3)';

                let dx = cursor.x - point.x;
                let dy = cursor.y - point.y;

                const d = Math.sqrt(dx * dx + dy * dy);
                const q = d / (d + 101);

                ctx.fillCircle(point.x + q * dx / d * s / 2, point.y + q * dy / d * s / 2, s / 10);
            }
        });

        if (cursor != null) {
            ctx.fillStyle = 'white';
            ctx.fillRect(cursor.x - 10, cursor.y, 20, 1);
            ctx.fillRect(cursor.x, cursor.y - 10, 1, 20);
        }
    }
}
