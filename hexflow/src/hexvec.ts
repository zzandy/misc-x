export enum HexDir {
    up = 0,
    upRight = 1,
    downRight = 2,
    down = 3,
    downLeft = 4,
    upLeft = 5
}

type HexArr = [number, number, number, number, number, number];

export class HexVec {

    constructor(public readonly value: HexArr) { }

    public add(dir: HexDir, value: number) {
        return new HexVec(HexVec.resolve(<HexArr>this.value.map((v, i) => i == dir ? v + value : v)));
    }

    public static readonly empty = new HexVec([0,0,0,0,0,0]);

    public static resolve(a: HexArr): HexArr {

        // ballance 120deg vectors
        for (let d = 0; d < 6; ++d) {
            const e = (d + 2) % 6;
            const c = (d + 1) % 6;

            let min = Math.min(a[d], a[e]);
            a[d] -= min;
            a[e] -= min;

            a[c] += min;
        }

        // cancel-out opposing directions
        for (const d of [HexDir.up, HexDir.upRight, HexDir.downRight]) {
            const min = Math.min(a[d], a[(d + 3) % 6]);
            a[d] -= min;
            a[(d + 3) % 6] -= min;
        }

        return a;
    }

}