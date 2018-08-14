const keys = "THE th IN ER AN RE ES ON EN AT OR AR AL IT"
    .toLowerCase()
    .split(" ");

const letters = "abcidefghlmnoprstuvwy".split("");
const shift:{[key:string]:string} = {
    'k':'k/q/j/x/z',
    'q':'k/q/j/x/z',
    'j':'k/q/j/x/z',
    'x':'k/q/j/x/z',
    'z':'k/q/j/x/z'
}

const map = keys.concat(letters).reduce(
    (map, key) => {
        map[key] = 0;
        return map;
    },
    <{ [key: string]: number }>{}
);

for(let key in shift){map[shift[key]]=0}

map["sum"] = 0;

import fs = require("fs");

export function run(): Promise<{ [key: string]: number }> {
    return new Promise<{ [key: string]: number }>((res, rej) => {
        const path = __dirname + "\\..\\data";

        fs.readdir(path, (e, files) => {
            const len = files.length;
            let n = 0;
            for (let file of files) {
                count(path + "\\" + file, map);

                process.stdout.write(
                    `\r${++n}/${len} - ${((100 * n) / len).toFixed(2)}%`
                );
            }
            console.log('\rDone processing ' + len + ' files')

            const nm: { [key: string]: number } = {};

            for (let key in map) {
                if (key == "sum") continue;

                nm[key] = (100 * map[key]) / map["sum"];
            }

            res(nm);
        });
    });
}

function count(path: string, map: { [key: string]: number }) {
    build(map, fs.readFileSync(path, "utf8").toLowerCase());
}

function build(map: { [key: string]: number }, data: string) {
    const len = data.length;
    for (let i = 0; i < len; ++i) {
        let key = (data[i] in shift) ? shift[data[i]] : data[i];
        if (!(key in map)) continue;
        map["sum"]++;

        let tri = data.substr(i, 3);
        if (tri in map) {
            map[tri]++;
            i += 2;
            continue;
        }

        let di = tri.substr(0, 2);
        if (di in map) {
            map[di]++;
            i += 1;
            continue;
        }

        map[key]++;
    }
}
