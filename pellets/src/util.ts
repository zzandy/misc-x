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

export { rnd };