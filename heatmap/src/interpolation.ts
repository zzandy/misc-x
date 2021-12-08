import { triplet } from "../../lib/hcl";

export interface IInterpolator<TValue> {
    getValue(ratio: number): TValue;
}

type easing = (v: number) => number;

export function lerp(min: number, max: number, ratio: number) {
    return min + (max - min) * ratio;
}

export function linear(x: number): number { return x }
export function easeInOut(x: number): number { return x * x * x * (x * (x * 6 - 15) + 10) }
export function easeOut(x: number): number { return easeInOut(x / 2) * 2 }
export function easeIn(x: number): number { return easeInOut(x / 2 + .5) * 2 - 1 }

export class Gradient implements IInterpolator<triplet>{

    private stops: [number, triplet, easing][];

    constructor(startColor: triplet, endColor: triplet, easeFn: easing | null = null) {
        this.stops = [
            [0, startColor, linear],
            [1, endColor, easeFn ?? linear]
        ]
    }

    addStop(ratio: number, color: triplet, easeFn: easing | null = null) {
        this.stops.push([ratio, color, easeFn ?? linear]);
        this.stops = this.stops.sort((a, b) => a[0] - b[0]);
    }

    getValue(ratio: number): triplet {
        let idx = this.stops.findIndex(s => s[0] > ratio);

        let next = idx == -1 ? this.stops.length - 1 : idx;
        let curr = Math.max(0, next - 1);

        let a = this.stops[curr];
        let b = this.stops[next];
        let ease = this.stops[next][2];

        let r = a == b ? 0 : (ratio - a[0]) / (b[0] - a[0]);

        return [
            lerp(a[1][0], b[1][0], ease(r)),
            lerp(a[1][1], b[1][1], ease(r)),
            lerp(a[1][2], b[1][2], ease(r))
        ]
    }
}