export function getMap(): [{ [key: string]: number }, { [key: string]: string }] {
    const keys = "THE AND HE IN ER RE ON AT ED IT"
        .toLowerCase()
        .split(" ");

    const letters = "abcidefghlmnoprstuvwyk".split("");
    const shift: { [key: string]: string } = {
        // k: 'k/q',
        // k: "k/q/j/x/z",
        q: "q/j/x/z",
        j: "q/j/x/z",
        x: "q/j/x/z",
        z: "q/j/x/z"
    };

    const map = keys.concat(letters).reduce(
        (map, key) => {
            map[key] = 0;
            return map;
        },
        <{ [key: string]: number }>{}
    );

    for (let key in shift) {
        map[shift[key]] = 0;
    }

    map["sum"] = 0;

    return [map, shift];
}
