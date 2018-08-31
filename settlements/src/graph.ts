import { DistMap } from "./dist-map";

export class Graph {
    public readonly edges: [number, number][] = [];

    constructor(dist: DistMap, cutoff: number) {
        const connected: boolean[] = [true];

        let done = false;

        while (!done) {
            let cluster: number[] = [];
            let pending: number[] = [];
            const links: [number, number, number][] = [];

            for (let i = 0; i < dist.length; ++i) {
                (connected[i] ? cluster : pending).push(i);
            }

            if (pending.length > 0) {
                for (let src of cluster)
                    for (let tgt of pending) {
                        links.push([src, tgt, dist.dist(src, tgt)]);
                    }

                links.sort(([a, b, d1], [c, d, d2]) => d1 - d2);

                links
                    .filter(([x, y, d], i) => i < 2 || i < 4 && d < cutoff / 2)
                    .forEach(v => {
                        const [src, tgt] = v;

                        connected[tgt] = true;
                        this.edges.push([
                            Math.min(src, tgt),
                            Math.max(src, tgt)
                        ]);
                    });
            } else {
                done = true;
            }
        }
    }
}
