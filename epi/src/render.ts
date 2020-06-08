import { ICanvasRenderingContext2D, fullscreenCanvas } from "../../lib/canvas";
import { Agent } from "./agent";
import { Vector } from "./geometry";
import { QuadTree } from "./qt";

export class Render {
    private readonly ctx: ICanvasRenderingContext2D;

    private readonly size: number;
    private readonly padding: Vector;

    constructor() {
        const ctx = this.ctx = fullscreenCanvas();
        ctx.strokeStyle = ctx.fillStyle = '#aaa';

        this.padding = new Vector(20, 20);

        this.size = Math.min(ctx.canvas.width - this.padding.x * 2, ctx.canvas.height - this.padding.y * 2);
    }

    public draw(agents: Agent[]) {
        const ctx = this.ctx;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeRect(this.padding.x, this.padding.y, this.size, this.size);

        for (let agent of agents) {

            ctx.fillStyle = agent.progress > 100
                ? 'green'
                : agent.progress > 0
                    ? 'red'
                    : '#aaa';
            const r = agent.progress > 0 && agent.progress < 100 ? 5 : 3;
            ctx.fillCircle(this.padding.x + agent.pos.x * this.size, this.padding.y + agent.pos.y * this.size, r);
        }
    }
}