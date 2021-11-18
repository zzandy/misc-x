import { TColor } from "./color";

export interface IInterpolator<TValue> {
    getValue(ratio: number): TValue;
}

export type Interpolation<TValue> = (min: TValue, max: TValue, ratio: number) => TValue;

export function lerp(min: number, max: number, ratio: number) {
    return min + (max - min) * ratio;
}

export class Interpolator implements IInterpolator<number>{
    constructor(private readonly min: number, private readonly max: number, private readonly funk: Interpolation<number>) { }

    getValue(ratio: number): number {
        return this.funk(this.min, this.max, ratio);
    }
}

export class Gradient implements IInterpolator<TColor>{
    
    private stops: [number, TColor][];

    constructor(private readonly startColor: TColor, private readonly endColor: TColor, private readonly funk: Interpolation<number>) {
        this.stops = [
            [0, startColor],
            [1, endColor]
        ]
    }

    addStop(ratio: number, color: TColor) {
        this.stops.push([ratio, color]);
        this.stops = this.stops.sort((a, b) => a[0] - b[0]);
    }

    getValue(ratio: number): TColor {
        let idx = this.stops.findIndex(s => s[0] > ratio);

        let next = idx == -1 ? this.stops.length - 1 : idx;
        let curr = Math.max(0, next - 1);

        let a = this.stops[curr];
        let b = this.stops[next];
        let fn = this.funk;

        let r = a == b ? 0 : (ratio - a[0]) / (b[0] - a[0]);

        return [
            fn(a[1][0], b[1][0], r),
            fn(a[1][1], b[1][1], r),
            fn(a[1][2], b[1][2], r)
        ]
    }
}