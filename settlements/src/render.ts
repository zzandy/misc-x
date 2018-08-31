import { ICanvasRenderingContext2D } from "../../lib/canvas";
import { World } from "./world";

export function render(ctx: ICanvasRenderingContext2D, world: World): void {
    //ctx.fillStyle = "#262626";
    //ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //ctx.fillStyle = "#aeaeae";
    //ctx.strokeStyle = "hsla(0,0%,100%,.2)";

    for (let [i, j] of world.graph.edges) {
        const node = world.nodes[i];
        const other = world.nodes[j];

        ctx.beginPath();
        ctx.moveTo(node.pos.x, node.pos.y);
        ctx.lineTo(other.pos.x, other.pos.y);
        ctx.stroke();
    }

    for (let i = 0; i < world.nodes.length; ++i) {
        const node = world.nodes[i];
        ctx.fillCircle(node.pos.x, node.pos.y, 5);
        ctx.fillText(node.name, node.pos.x, node.pos.y - 7);
    }
}