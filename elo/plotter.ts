import { ICanvasRenderingContext2D } from 'canvas';
import { Point, Range, Rect } from 'geometry';
import { IRender, DataWindow, PlotData, Series } from 'plot-data';

type LabelPos = { text: string, pos: number };

declare global {
    interface Array<T> {
        mapMany<U>(fn: (this: void, value: T, index: number, array: T[]) => U[]): U[];

    }
}

Array.prototype.mapMany = function <T, U>(fn: (this: void, value: T, index: number, array: T[]) => U[]): U[] {

    let res = new Array<U>();

    this.forEach((item, index, array) => {

        const subres = fn(item, index, array);

        res = res.concat(subres);

    });

    return res;
}

export function last<T>(array: T[]) {
    return array[array.length - 1];
}

export class Plotter implements IRender {
    constructor(private readonly ctx: ICanvasRenderingContext2D, private readonly region: Rect) { }

    render(world: Rect, data: PlotData): void {
        const allSeries = data.data.map(d => last(d.data).y.toFixed(0) + " " + d.name);

        const labelWidth = Plotter.getMaxTextWidth(this.ctx, allSeries);
        const region = new Rect(this.region.x, this.region.y, this.region.w - 30, this.region.h);

        const scale = Plotter.getScale(region, world);
        const labels = Plotter.getLabelPositions(data.data.map(s => { return { text: s.name, pos: s.data[0].y } }));



    }

    private static getScale(screen: Rect, world: Rect) {

        const ws = screen.horizontal.length;
        const hs = screen.vertical.length;

        const ww = world.horizontal.length;
        const hw = world.vertical.length;

        const sx = ws / ww;
        const sy = hs / hw;

        return (coords: Point) => {
            var wx = coords.x - world.horizontal.start;
            var wy = coords.y - world.vertical.start;

            return new Point(screen.horizontal.start + sx * wx, screen.vertical.start + sy * wy);
        }
    }

    private static getMaxTextWidth(ctx: CanvasRenderingContext2D, labels: string[]) {
        let res = 0;

        for (const label of labels) {
            var w = ctx.measureText(label).width;
            res = Math.max(res, w);
        }

        return res;
    }

    private static getLabelPositions(labels: LabelPos[]) {
        labels.sort((a, b) => a.pos - b.pos);

        let overlap = true;
        let retries = 0;
        let height = 16;

        while (retries < 10 && overlap) {
            overlap = false;
            ++retries;

            let last = labels[0];

            for (let next of labels) {

                if (last == next) continue;

                let gap = next.pos - last.pos;

                if (gap < height) {
                    last.pos -= (height - gap) / 2;
                    next.pos += (height - gap) / 2;
                    overlap = true;
                }

                last = next;
            }
        }
    }
}
