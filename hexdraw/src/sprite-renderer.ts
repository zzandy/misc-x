const stencil = (""
    + ". . . . . . . ^ ^ ^ ^ . . . . . . . . . . . . .\n"
    + ". . . . . . ^ ^ ^ ^ ^ # # # # T T . . . . . . .\n"
    + ". . . . . ^ ^ # # # # # # # # # T T T T . . . .\n"
    + ". . . . # # # # # # # # # # # # # T T T . . . .\n"
    + ". . . # # # # # # # # # # # # # # # # T T . . .\n"
    + ". . < # # # # # # # # # # # # # # # # # T . . .\n"
    + ". < < # # # # # # # # # # # # # # # # # # . . .\n"
    + "< < < # # # # # # # # # # # # # # # # # # # . .\n"
    + "< < # # # # # # # # # # # # # # # # # # # # . .\n"
    + ". < # # # # # # # # # # # # # # # # # # # # > .\n"
    + ". < # # # # # # # # # # # # # # # # # # # # > .\n"
    + ". < # # # # # # # # # # # # # # # # # # # # > .\n"
    + ". . # # # # # # # # # # # # # # # # # # # # > >\n"
    + ". . # # # # # # # # # # # # # # # # # # # > > >\n"
    + ". . . # # # # # # # # # # # # # # # # # # > > .\n"
    + ". . . L # # # # # # # # # # # # # # # # # > . .\n"
    + ". . . L L # # # # # # # # # # # # # # # # . . .\n"
    + ". . . . L L L # # # # # # # # # # # # # . . . .\n"
    + ". . . . L L L L # # # # # # # # # v v . . . . .\n"
    + ". . . . . . . L L # # # # v v v v v . . . . . .\n"
    + ". . . . . . . . . . . . . v v v v . . . . . . .")
    .split('\n')
    .map(row => row.split(' ').map(c => {
        switch (c) {
            case '#':
                return 7;
            case '^':
                return 1;
            case 'T':
                return 2;
            case '>':
                return 3;
            case 'v':
                return 4;
            case 'L':
                return 5;
            case '<':
                return 6;
            default:
                return 0;
        }
    }));

const h = 21; //stencil.length;
const w = 24; //stencil[0].length;

export const getHexPos = (i: number, j: number) => [j * 20 - i * 4 - ((j / 2) | 0) * 4, i * 19 - (j % 2) * 5 + ((j / 2) | 0) * 9];

type adjarray = [boolean, boolean, boolean, boolean, boolean, boolean];

export class SpriteRenderer {

    constructor(private readonly sx: number, private readonly sy: number) { }

    public render(coreSet: boolean, color: [number, number, number], adj: adjarray): HTMLCanvasElement {

        const { sx, sy } = this;
        const can = <HTMLCanvasElement>document.createElement('canvas');
        can.width = w * sx;
        can.height = h * sx;
        const ctx = <CanvasRenderingContext2D>(can).getContext('2d');

        const id = ctx.createImageData(w * sx, h * sy);
        const data = id.data;

        for (let i = 0; i < h; ++i) {
            for (let j = 0; j < w; ++j) {
                let set = isSet(coreSet, stencil[i][j], adj);
                let col = set ? color : [0, 0, 0, 0];

                for (let si = 0; si < sy; ++si) {
                    for (let sj = 0; sj < sx; ++sj) {
                        let index = ((sy * i + si) * w * sx + sx * j + sj) * 4;
                        data[index] = col[0];
                        data[index + 1] = col[1];
                        data[index + 2] = col[2];

                        data[index + 3] = col.length > 3 ? col[3] : 255;
                    }
                }
            }
        }
        ctx.putImageData(id, 0, 0);
        return can;
    }
}

const isSet = (v: boolean, p: number, n: adjarray) =>
    (v && p === 7)
    || (((v && n[5]) || (v && n[0]) || (n[5] && n[0])) && p === 1)
    || (((v && n[0]) || (v && n[1]) || (n[0] && n[1])) && p === 2)
    || (((v && n[1]) || (v && n[2]) || (n[1] && n[2])) && p === 3)
    || (((v && n[2]) || (v && n[3]) || (n[2] && n[3])) && p === 4)
    || (((v && n[3]) || (v && n[4]) || (n[3] && n[4])) && p === 5)
    || (((v && n[4]) || (v && n[5]) || (n[4] && n[5])) && p === 6);

