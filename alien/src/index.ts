import { frequency, mark } from "./counter";

//calcfreq();
calcmark();

function norm(map: { [key: string]: number }) {
    const sum = map["sum"];

    for (const key in map) {
        if (key != "sum") map[key] /= sum;
    }

    return map;
}

function generate(
    key: string,
    maps: { [key: string]: { [key: string]: number } }
): string {
    let res = "";

    while (key != "") {
        let x = key;
        if (x.indexOf("/") != -1) {
            const parts = x.split("/");
            x = parts[(Math.random() * parts.length) | 0];
        }

        res += x;
        key = pick(maps[key]);
    }

    return res;
}

function pick(map: { [key: string]: number }): string {
    let prob = Math.random();

    for (let key in map) {
        if (key == "sum") continue;

        if (key.indexOf("/") != -1) {
            const parts = key.split("/");
            key = parts[(Math.random() * parts.length) | 0];
        }

        prob -= map[key];

        if (prob < 0) return key;
    }

    return "";
}

function calcmark() {
    mark()
        .then(maps => {
            for (const key in maps) norm(maps[key]);

            return maps;
        })
        .then(maps => {
            const keys: string[] = [];
            for (const key in maps) keys.push(key);

            for (var i = 0; i < 20; ++i) {
                const key = keys[(Math.random() * keys.length) | 0];
                const res = generate(key, maps);
                if (res.length < 7) {
                    --i;
                    continue;
                }
                console.log(res);
            }
        });
}

function calcfreq() {
    const threshold = 0.87;

    frequency()
        .then(norm)
        .then(map => {
            let n = 0;
            for (let key in map) {
                if (key != "sum")
                    console.log(
                        `${++n}. ${key}: ${(map[key] * 100).toFixed(2)}%${
                            map[key] < threshold ? " pass" : ""
                        }`
                    );
            }
        });
}

/*
1. the: 1.96%
2. th: 0.94%
3. in: 2.37%
4. er: 1.60%
5. an: 1.86%
6. re: 1.25%
7. es: 1.02%
8. on: 1.60%
9. en: 1.27%
10. at: 1.56%
11. or: 1.20%
12. ar: 0.96%
13. al: 1.06%
14. it: 1.10%
15. a: 4.54%
16. b: 1.86%
17. c: 3.99%
18. i: 5.71%
19. d: 4.52%
20. e: 7.58%
21. f: 2.61%
22. g: 2.47%
23. h: 3.00%
24. l: 4.01%
25. m: 3.10%
26. n: 1.60%
27. o: 6.37%
28. p: 2.62%
29. r: 2.31%
30. s: 7.03%
31. t: 5.78%
32. u: 3.68%
33. v: 1.29%
34. w: 2.10%
35. y: 2.36%
36. k/q/j/x/z: 1.70%


*/
