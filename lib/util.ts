function rnd(): number;
function rnd(max: number): number;
function rnd(min: number, max: number): number;
function rnd<T>(a: T[]): T;
function rnd<T>(min?: number | T[], max?: number): number | T {

    if (typeof max === 'number' && typeof min === 'number')
        return Math.floor(min + Math.random() * (max - min));

    if (typeof min === 'number')
        return Math.floor(min * Math.random());

    if (min instanceof Array)
        return (<T[]>min)[Math.floor(min.length * Math.random())];

    throw new Error('invalid set of arguments to rnd');
}

function array<TValue>(w: number, h: number, fn: (i: number, j: number) => TValue): TValue[][] {
    const res = [];
    for (let i = 0; i < h; ++i) {
        const row = [];
        for (let j = 0; j < w; ++j)
            row.push(fn(i, j));
        res.push(row);
    }
    return res;
}

export { rnd, array };