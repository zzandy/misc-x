import { array, shuffle, rnd } from '../../lib/util';

const replacements: Repl[] = [];

add(false, true, [
    '    / f-7 / f7 ',
    '--- / +-+ / j|f',
    '    / | | / f+j',
    '--- / j L / jL-'
]);

add(false, true, [
    '   / f7',
    '-- / ++',
    '   / ||',
    '-- / jL'
]);

add(true, false, [
    ' | / fj',
    '-+ / +-',
    ' | / L7',
]);

add(false, false, [
    '    / f7 ',
    '--- / j|f',
    '    /  Lj',
]);

add(true, true, [
    '  f / f--',
    'f-j / |  ',
]);

add(true, true, [
    'j  / +7',
    'f- / |L'
]);

add(false, true, [
    'Lj / ||',
    '7f / ++'
]);

add(false, true, [
    'Lj / ||',
    '   / Lj'
]);

add(true, true, [
    ' Lj / f+j',
    '--- / jL-'
]);

add(false, true, [
    '-- / 7f',
    '   / Lj'
]);

add(false, true, [
    'L-j / | |',
    '    / L-j'
]);

add(false, true, [
    'Lj / || / Lj',
    '-- / ++ / 7f',
    '   / Lj / Lj'
]);

add(false, true, [
    'L-j / | |',
    '--- / +-+',
    '    / L-j'
]);

add(true, true, [
    '--- / 7f-',
    '    / || ',
    '--- / ++-',
    '    / L+7',
    '--- / -jL',
]);

add(true, true, [
    'f-7 / f7 ',
    '| | / L+7',
    '+-+ / -++',
    'j L / -jL'
]);
add(true, true, [
    'f-7 / f7 ',
    '| | / || ',
    '| | / L+7',
    '+-+ / -++',
    'j L / -jL'
]);

add(true, false, [
    '|  / L7',
    '|  / fj'
]);


add(true, true, [
    'f-7 / f7 ',
    '+-+ / ++-',
    '| | / L+7',
    'j L / -jL',
]);


add(true, true, [
    '   / f7',
    'f- / L+',
    '|  / fj',
]);

add(true, true, [
    'f-7 / f7 ',
    '+-+ / ++-',
    '| | / L+7',
    '| | / fj|',
]);

function add(flipx: boolean, flipy: boolean, a: string[]) {
    replacements.push(parse(a));

    if (flipy) replacements.push(flipUpDown(parse(a)))
    if (flipx) replacements.push(flipLeftRight(parse(a)))
    if (flipx && flipy) replacements.push(flipUpDown(flipLeftRight(parse(a))));
}

const start = 'A';
const end = 'E';

type Repl = { w: number, h: number, key: Cell[][], subs: Cell[][][] };

export type Cell = 'A' | 'E' | '-' | '|' | '+' | 'j' | 'L' | 'f' | '7' | ' ';

export function lab(w: number, h: number): Cell[][] {
    return array(w, h, (i, j) => {

        if (j == 0 && i % 2 == 1) return start;
        if (j == w - 1 && i % 2 == 1) return end;
        if (i % 2 == 1) return '-';
        return ' ';
    });
}

function bySize(a: Repl, b: Repl) {
    return score(b) - score(a) + rnd(-5, 5);
}

function score(a: Repl) {
    return a.w * a.w + a.h * a.h;
}

export function mutate(lab: Cell[][]) {

    replacements.sort(bySize);

    for (const r of replacements) {
        const matches: [number, number][] = [];

        for (let i = 0; i <= lab.length - r.h; ++i)
            for (let j = 0; j <= lab[i].length - r.w; ++j) {
                let isMatch = true;
                match: for (let ki = 0; ki < r.h; ++ki)
                    for (let kj = 0; kj < r.w; ++kj) {
                        if (lab[i + ki][j + kj] != r.key[ki][kj]) {
                            isMatch = false;
                            break match;
                        }
                    }

                if (isMatch)
                    matches.push([i, j]);
            }

        if (matches.length > 0) {
            apply(lab, rnd(matches), rnd(r.subs));
        }
    }

    return lab;
}

function apply(lab: Cell[][], match: [number, number], sum: Cell[][]) {
    for (let i = 0; i < sum.length; ++i)
        for (let j = 0; j < sum[i].length; ++j)
            lab[i + match[0]][j + match[1]] = sum[i][j];
}

function parse(repl: string[]): Repl {

    const key: Cell[][] = [];
    const reps: Cell[][][] = [];

    for (let line of repl) {
        const [t, ...r] = line.split(' / ');

        key.push(<Cell[]>t.split(''));

        if (reps.length == 0)
            r.map(x => reps.push([<Cell[]>x.split('')]));
        else r.map((x, i) => reps[i].push(<Cell[]>x.split('')));

    }

    return { key, subs: reps, h: key.length, w: key[0].length };
}

function flipUpDown(s: Repl): Repl {
    return {
        ...s,
        key: flipUpDownArray(s.key),
        subs: s.subs.map(flipUpDownArray)
    }
}

function flipLeftRight(s: Repl): Repl {
    return {
        ...s,
        key: flipLeftRightArray(s.key),
        subs: s.subs.map(flipLeftRightArray)
    }
}

function flipUpDownArray(a: Cell[][]): Cell[][] {
    return a.map(line => line.map(flipUpDownChar))
        .reduce((a, line) => { a.unshift(line); return a }, <Cell[][]>[]);
}

function flipLeftRightArray(a: Cell[][]): Cell[][] {
    return a.map(line => line.map((char, i, a) => flipLeftRightChar(a[a.length - 1 - i])));
}

function flipUpDownChar(c: Cell) {
    switch (c) {
        case 'f': return 'L';
        case 'L': return 'f';
        case 'j': return '7';
        case '7': return 'j';
        default: return c;
    }
}

function flipLeftRightChar(c: Cell) {
    switch (c) {
        case 'f': return '7';
        case 'L': return 'j';
        case 'j': return 'L';
        case '7': return 'f';
        default: return c;
    }
}


