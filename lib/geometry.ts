export class Point {
    constructor(public readonly x: number, public readonly y: number) { }

    times(x: number, y: number): Point;
    times(p: Point): Point;
    times(a: number | Point, b?: number): Point {
        if (typeof (a) === 'number')
            return new Point(this.x * a, this.y * <number>b);

        return new Point(this.x * a.x, this.y * a.y);
    }

    plus(x: number, y: number): Point;
    plus(p: Point): Point;
    plus(a: number | Point, b?: number): Point {
        if (typeof (a) === 'number')
            return new Point(this.x + a, this.y + <number>b);

        return new Point(this.x + a.x, this.y + a.y);
    }
}

export class Rect extends Point {
    constructor(x: number, y: number, public readonly w: number, public readonly h: number) {
        super(x, y);
    }

    public get horizontal() {
        return new Range(this.x, this.w);
    }

    public get vertical() {
        return new Range(this.y, this.h);
    }
}

export class Range {
    constructor(public readonly start: number, public readonly length: number) { }

    public get end() {
        return this.start + this.length;
    }
}