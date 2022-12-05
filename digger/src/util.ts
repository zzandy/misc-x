export function pick<T>(scoreValueArray: [number, T][]): T {
    let t = Math.random();
    for (let [score, value] of scoreValueArray) {
        if ((t -= score) < 0) return value;

    }

    return scoreValueArray[scoreValueArray.length - 1][1];
}