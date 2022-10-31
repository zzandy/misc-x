
export const array = <T>(n: number, callback: (i: number) => T): T[] => {
    const res: T[] = new Array(n);

    for (let i = 0; i < n; ++i)res[i] = callback(i);

    return res;
}

export const tau = Math.PI * 2;
export const deg = Math.PI / 180;
export type Stats = {
    wins: number,
    best: number,
    first: number, // seconds until first
    bestCommands: number,
    avgCommands: number,
    avgCommandsCount: number,
    globalBest: number,
    rate: number,
    lastGlobalImp: number,
    frame: number,
    gen: number
}
