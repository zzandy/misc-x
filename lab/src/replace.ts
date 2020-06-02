import { array, rnd } from '../../lib/util';

const replacements: Repl[] = [];

add(true, true, [
    '----- / 7 f-- / ---7f / -7f-- / 7f---',
    '      / L-+-7 /  f-+j /  L+-7 / ||f-7',
    '----- / --+7L / 7|f+- / -7|f+ / +j|f+',
    '      / f7||  / ||||  /  |||| / |f+j|',
    '----- / j||L- / ++jL- / -+j|L / +j|f+',
    '      /  L+-7 / L+--7 / f+-j  / L-j||',
    '----- / --j L / -j  L / jL--- / ---jL',
]);

add(true, true, [
    '---- / -7f- / --7f / --7f',
    '     / fj|  / f-+j / f7||',
    '---- / +-+- / jf+- / ++++',
    '     / L-+7 /  ||  / |L+j',
    '---- / --jL / -jL- / j L-',
]);

add(true, true, [
    '     / f-7  /  f-7 / f--7',
    '---- / jf+- / 7|f+ / +--+',
    '     /  ||  / L+j| / L7fj',
    '---- / -jL- / -j L / -jL-'
]);

add(true, true, [
    '     /   f7',
    '---- / 7f++',
    '     / L+j|',
    '---- / -+-+',
    '     /  L-j'
], 10);

add(true, true, [
    '    / f-7',
    '--- / +7L',
    '    / L+7',
    '--- / 7L+',
    '    / L-j'
], 10);

add(true, true, [
    ' | |  / f+-+7 /  |f+7',
    '-j L- / +j L+ / -j|L+',
    ' f-7  / L7 fj / f-j |'
], 20);

add(true, true, [
    ' | |  / f+-+7 /  |f+7',
    '-j L- / +j L+ / -j|L+',
    ' f--- / L7  L / f-j L'
], 20);

add(true, true, [
    'LjLj / |L+j',
    '---- / +-+-',
    '     / L-j '
]);

add(false, false, [
    'jL / ++',
    '7f / ++',
], 0, 6);

add(true, true, [
    '-- / 7f',
    '-7 / +j',
    ' L / L-',
], 0, 2);

add(false, true, [
    'f--7 / f7f7',
    '+--+ / ++++',
    '|  | / |Lj|',
], 0, 2);

add(true, true, [
    ' | / fj',
    'fj / L7',
    '|  / fj',
]);

add(true, true, [
    ' f / f-',
    'fj / L7',
    'j  / -j',
]);

add(true, true, [
    'j  L / jf7L',
    'f--7 / fjL7'
]);

add(true, true, [
    'L-j  / |f+7',
    ' f-7 / L+j|'
], 10);

add(true, false, [
    ' f / f-',
    '-+ / +-',
    ' L / L-'
], -10);
add(true, true, [
    ' f / f-',
    '-+ / +-',
    ' | / L7'
], -10);

add(true, true, [
    '   f / f---',
    '---j / +--7',
    '     / L--j'
]);

add(true, true, [
    '  f / f--',
    '--j / +-7',
    '    / L-j'
]);

add(true, true, [
    ' f / f-',
    '-j / +7',
    '   / Lj'
]);

add(true, true, [
    ' ||  / f++7',
    '7L+- / jL++',
    'L-+7 /   ||'
]);

add(true, true, [
    ' ||  / f++7',
    '7L+- / jL++',
    'L-+- /   |L'
]);

add(true, true, [
    '||  / L+7',
    '|L- /  L+',
    '|   / f-j'
], 20);

add(true, true, [
    ' |  / f+7',
    ' L- / |L+',
    '--- / j L'
], 20);

add(true, true, [
    '   / f7',
    '7  / +j'
], -10);

add(true, true, [
    '--- / -7f',
    '7   / 7Lj'
], -5);

add(true, true, [
    '--j / -7|',
    '7   / 7Lj'
], -5);

add(true, true, [
    'j   / jf7',
    ' f- / fjL',
    ' |  / L7 '
], -7);

add(true, true, [
    '    / f-7',
    '--- / jf+',
    '    /  Lj'
], -5);

add(true, true, [
    '    / f-7',
    'f7  / L7|',
    'j|  / -+j',
]);

add(true, true, [
    '    / f-7',
    'f7  / L7|',
    '||  / f+j',
]);

add(true, true, [
    ' f-7 / f--7',
    '-+-+ / +--+',
    ' | | / L7fj',
    '-j L / -jL-',
]);

add(true, true, [
    'Lj / ||',
    '   / Lj'
]);

add(true, true, [
    'L-j / | |',
    '    / L-j'
]);

add(true, true, [
    'L--j / |  | / |f7|',
    '     / L--j / LjLj'
]);

add(true, true, [
    'fjL7 / f++7',
    '+--+ / ++++',
    'L--j / LjLj'
], 0, 2);

add(false, true, [
    '---- / 7f7f',
    '     / L++j',
    '---- / -jL-'
]);

add(false, true, [
    '     / f--7 / f7f7',
    ' f7  / L7fj / L++j'
]);

add(false, true, [
    '      / f---7 / f7 f7',
    ' f-7  / L7 fj / L+-+j'
], 10);

add(true, true, [
    ' |f / f+-',
    '-jL / +jf',
    '    / L-j'
]);

add(true, true, [
    ' || / f+j',
    '-jL / +jf',
    '    / L-j'
]);

add(false, true, [
    ' Lj  / f++7',
    'f--7 / |Lj|'
]);

add(false, true, [
    ' L-j  / f+-+7',
    'f---7 / |L-j|'
]);

add(false, true, [
    '   / f7',
    '-- / ++',
    'f7 / ||'
], -10);

add(false, true, [
    '    / f-7',
    '--- / +-+',
    'f-7 / | |'
], -10);

add(false, true, [
    '     / f--7',
    '---- / +--+',
    'f--7 / |  |'
], -10);

function add(flipx: boolean, flipy: boolean, a: string[], p: number = 0, freq: number = 1) {
    replacements.push(parse(a, p, freq));

    if (flipy) replacements.push(flipUpDown(parse(a, p, freq)))
    if (flipx) replacements.push(flipLeftRight(parse(a, p, freq)))
    if (flipx && flipy) replacements.push(flipUpDown(flipLeftRight(parse(a, p, freq))));
}

const start = 'A';
const end = 'E';

type Repl = { w: number, h: number, key: Cell[][], subs: Cell[][][], p: number, freq: number };

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
    return a.w * a.w + a.h * a.h + a.p;
}

const kfreq = rnd(10);

export function mutate(lab: Cell[][]) {
    const matches: [number, number][] = [];
    let num = 0;
    do {
        replacements.sort(bySize);
        for (const r of replacements) {
            matches.length = 0;
            for (let i = 0; i <= lab.length - r.h; ++i)
                for (let j = 0; j <= lab[i].length - r.w; ++j) {
                    if ((i + j + kfreq) % r.freq != 0) continue;

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
                num = 0;
                apply(lab, rnd(matches), rnd(r.subs));
                matches.length = 0;
            }
            else ++num;
        }
    } while (num < 15);

    return lab;
}

function apply(lab: Cell[][], match: [number, number], sum: Cell[][]) {
    for (let i = 0; i < sum.length; ++i)
        for (let j = 0; j < sum[i].length; ++j)
            lab[i + match[0]][j + match[1]] = sum[i][j];
}

function parse(repl: string[], p: number, freq: number): Repl {

    const key: Cell[][] = [];
    const reps: Cell[][][] = [];

    for (let line of repl) {
        const [t, ...r] = line.split(' / ');

        key.push(<Cell[]>t.split(''));

        if (reps.length == 0)
            r.map(x => reps.push([<Cell[]>x.split('')]));
        else r.map((x, i) => reps[i].push(<Cell[]>x.split('')));

    }

    return { key, subs: reps, h: key.length, w: key[0].length, p, freq };
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


