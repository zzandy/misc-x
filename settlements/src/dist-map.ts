import { Point } from "../../lib/geometry";

export class DistMap {
    private readonly dists: number[] = [];
    public readonly length: number;

    constructor(points: Point[]) {
        this.length = points.length;
        for (let i = 1; i < points.length; ++i)
            for (let j = 0; j < i; ++j) {
                const { x: x0, y: y0 } = points[i];
                const { x: x1, y: y1 } = points[j];
                const d = Math.sqrt(
                    (x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)
                );

                this.dists.push(d);
            }
    }

    public dist(i0: number, i1: number): number {
        return i0 == i1
            ? 0
            : i1 > i0
                ? this.dists[((i1 - 1) * i1) / 2 + i0]
                : this.dists[((i0 - 1) * i0) / 2 + i1];
    }

    public closest(idx: number): number {
        let dist = Infinity;
        let ix = -1;

        for (let j = 0; j < idx; ++j) {
            let d = this.dist(idx, j);
            if (d < dist) {
                dist = d;
                ix = j;
            }
        }

        for (let i = idx + 1; i < this.length; ++i) {
            let d = this.dist(i, idx);
            if (d < dist) {
                dist = d;
                ix = i;
            }
        }

        return ix;
    }
}
