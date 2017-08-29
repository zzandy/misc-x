import { ICanvasRenderingContext2D } from '../../elo/src/lib/canvas';
import { World, Cell } from "./world";
import { HexPos } from "../../hexflow/src/supercell";
import { rgbdata2rgb } from '../../elo/src/lib/color';


export class Renderer {
    constructor(private readonly ctx: ICanvasRenderingContext2D) {

    }

    public clear(): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    public render(world: World): void {
        const ctx = this.ctx;
        const s = 10;

        world.store.forEach((pos: HexPos, cell: Cell) => {
            const point = pos.toPoint().times(s, -s).plus(ctx.canvas.width / 2, ctx.canvas.height / 2);

            ctx.fillStyle = rgbdata2rgb(cell.type.color);
            ctx.fillCircle(point.x, point.y, s/2);
        });

        ctx.fillStyle = 'black';
        ctx.save()
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
        ctx.fillRect(-100,0,200, 1);
        ctx.fillRect(0,-100, 1, 200);
        ctx.restore();
    }
}
