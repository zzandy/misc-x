import { ICanvasRenderingContext2D } from '../../lib/canvas';
import { Map, Tile } from './map';

export function renderMap(ctx: ICanvasRenderingContext2D, map: Map) {
    let ox = 10;
    let oy = 30;
    let sx = 20;
    let sy = 20;

    for (let i = 0; i < map.length; ++i) {
        for (let j = 0; j < map[i].length; ++j) {
            ctx.save();
            ctx.translate(ox + sx * j, oy + sy * i);

            switch (map[i][j]) {
                case Tile.Solid:
                    ctx.fillStyle = 'brown'
                    ctx.fillRect(0, 0, sx, sy)
                    break;
                case Tile.Void:
                    break;
                case Tile.Geode:
                    ctx.fillStyle = 'gray'
                    ctx.fillCircle(sx / 2, sy / 2, sx / 2)
                    break;
                case Tile.Nugget:
                    ctx.fillStyle = 'gold'
                    ctx.fillCircle(sx / 2, sy / 2, .6 * sx / 2)
                    break;
            }

            ctx.restore();
        }
    }
}
