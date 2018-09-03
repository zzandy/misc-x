export function getMap(): [{ [key: string]: number }, { [key: string]: string }] {
    const keys = "THE th IN ER AN RE ES ON EN AT OR AR AL IT"
        .toLowerCase()
        .split(" ");

    const letters = "abcidefghlmnoprstuvwy".split("");
    const shift: { [key: string]: string } = {
        k: "k/q/j/x/z",
        q: "k/q/j/x/z",
        j: "k/q/j/x/z",
        x: "k/q/j/x/z",
        z: "k/q/j/x/z"
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
