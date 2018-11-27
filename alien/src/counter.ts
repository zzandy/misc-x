import { stream } from "./streamer";
import { getMap } from "./map";
import fs = require("fs");

export function doublemark() {
    const [map, shift] = getMap();

    const mark: { [key: string]: { [key: string]: number } } = {};
    let prev1 = "";
    let prev2 = "";

    return cache("doublemark", () =>
        run(map, shift, key => {
            const prev = prev1 + "." + prev2;

            if (!(prev in mark)) {
                mark[prev] = { sum: 0 };
            }

            const map = mark[prev];

            if (!(key in map)) map[key] = 0;

            ++map[key];
            ++map["sum"];

            prev2 = prev1;
            prev1 = key;
        }).then(() => mark)
    );
}

export function mark() {
    const [map, shift] = getMap();

    const mark: { [key: string]: { [key: string]: number } } = {};
    let prev = "";

    return cache("markov", () =>
        run(map, shift, key => {
            if (!(prev in mark)) {
                mark[prev] = { sum: 0 };
            }

            const map = mark[prev];

            if (!(key in map)) map[key] = 0;

            ++map[key];
            ++map["sum"];

            prev = key;
        }).then(() => mark)
    );
}

export function frequency() {
    const [map, shift] = getMap();

    return cache("frequency", () =>
        run(map, shift, key => {
            if (key != "") {
                map[key]++;
                map["sum"]++;
            }
        })
    );
}

function run(
    map: { [key: string]: number },
    shift: { [key: string]: string },
    match: (symbol: string) => void
): Promise<{ [key: string]: number }> {
    return stream(data => {
        build(map, shift, match, data.toLocaleLowerCase());
    }).then(() => map);
}

function cache<TRes>(name: string, fn: () => Promise<TRes>): Promise<TRes> {
    const path = "./" + name + ".cache.json";

    if (
        !fs.existsSync(path) ||
        fs.lstatSync(path).mtime < fs.lstatSync(__filename).mtime
    ) {
        return fn().then(res => {
            fs.writeFileSync(path, JSON.stringify(res));
            return res;
        });
    } else
        return Promise.resolve(<TRes>JSON.parse(fs.readFileSync(path, "utf8")));
}

function build(
    map: { [key: string]: number },
    shift: { [ket: string]: string },
    match: (symbol: string) => void,
    data: string
) {
    const len = data.length;
    for (let i = 0; i < len; ++i) {
        let key = data[i] in shift ? shift[data[i]] : data[i];
        if (!(key in map)) {
            match("");
            continue;
        }

        let tri = data.substr(i, 3);
        if (tri in map) {
            match(tri);
            i += 2;
            continue;
        }

        let di = tri.substr(0, 2);
        if (di in map) {
            match(di);
            i += 1;
            continue;
        }

        match(key);
    }
}
