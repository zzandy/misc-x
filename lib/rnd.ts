export function rnd(): number;
export function rnd<T>(a: T[]): T;
export function rnd(a: number): number;
export function rnd(a: number, noint: boolean): number;
export function rnd(a: number, b: number, noint: boolean): number;
export function rnd<T>(a?: T[] | number, b?: number | boolean, c?: boolean): T | number {
    if (a !== undefined && b !== undefined) {
        if (c !== undefined)
            return <number>b + (<number>a - <number>b) * Math.random();

        return typeof b === "boolean"
            ? <number>a * Math.random()
            : (b + (<number>a - b) * Math.random()) | 0;
    } else if (a !== undefined && b === undefined) {
        if (a instanceof Array) return a[(Math.random() * a.length) | 0];
        else return (a * Math.random()) | 0;
    } else return Math.random();
}
