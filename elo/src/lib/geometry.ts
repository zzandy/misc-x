export class Point {
    constructor(public readonly x: number, public readonly y: number) { }
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