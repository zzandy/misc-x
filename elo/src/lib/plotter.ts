import { ICanvasRenderingContext2D } from 'canvas';
import { Point, Range, Rect } from 'geometry';
import { IPlotter, IDataWindow, IPlotData, ISeries, Break } from 'plot-data';

type LabelInfo = { text: string, pos: number, color: string };

export function last<T>(array: T[]) {
    return array[array.length - 1];
}

export class Plotter implements IPlotter {
    constructor(private readonly ctx: ICanvasRenderingContext2D, private readonly region: Rect) { }

    render(data: IDataWindow, viewName: string): void {

        const view = data.views.filter(v => v.name == viewName)[0];

        if (view === undefined) throw new Error(`View ${viewName} not found`);

        const labels = view.data.map(s => s.name);

        this.ctx.font = '10pt Segoe UI';
        const axisLabels = Plotter.getMaxTextWidth(this.ctx, data.breaks.y.map(b => b.label)) + 2;

        this.ctx.font = '12pt Segoe UI';
        const labelWidth = Plotter.getMaxTextWidth(this.ctx, labels) + 5;

        const region = new Rect(this.region.x + axisLabels, this.region.y - 30, this.region.w - labelWidth - axisLabels, this.region.h + 30);

        const scale = Plotter.getScale(region, data.window);

        const labelPos = view.data.map(s => { return { text: s.name, pos: scale(new Point(0, s.data[0].y)).y, color: s.color } });
        Plotter.adjustLabelPositions(20, labelPos);

        this.ctx.fillStyle = 'silver';
        this.placeLabels(axisLabels + region.x + region.w + 2, labelPos);
        this.drawBreaks(data.breaks, region, scale, axisLabels);
        this.plotData(scale, view);
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

    private static adjustLabelPositions(height: number, labels: LabelInfo[]) {
        labels.sort((a, b) => a.pos - b.pos);

        let overlap = true;
        let retries = 0;

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

    private placeLabels(offset: number, labels: LabelInfo[]) {
        for (const label of labels) {
            this.ctx.fillStyle = label.color;
            this.ctx.fillText(label.text, offset, label.pos);
        }
    }

    private drawBreaks(breaks: { x: Break[], y: Break[] }, region: Rect, scale: (x: Point) => Point, pad: number): void {
        this.ctx.font = '10pt Segoe UI'

        for (const $break of breaks.x) {
            const x = scale(new Point($break.coord, 0)).x;

            this.ctx.fillStyle = $break.label == '' ? '#333' : '#555';
            this.ctx.fillRect(x | 0 + .5, region.y, 1, region.h);
        }

        for (const $break of breaks.y) {
            const y = scale(new Point(0, $break.coord)).y;
            this.ctx.fillStyle = 'silver';
            this.ctx.fillRect(region.x, y | 0 + .5, region.w, 1);
            this.ctx.fillText($break.label, region.x - pad, y + 5)
        }
    }

    private plotData(scale: (x: Point) => Point, view: IPlotData): void {
        for (const series of view.data) {
            this.ctx.fillStyle = series.color;
            this.ctx.strokeStyle = series.color;

            let prev: Point | null = null;

            for (const point of series.data) {
                const p = scale(point);
                this.ctx.fillCircle(p.x, p.y, 1.7);

                if (prev !== null) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(prev.x, prev.y);
                    this.ctx.lineTo(p.x, p.y);
                    this.ctx.stroke();
                }

                prev = p;
            }
        }
    }
}
