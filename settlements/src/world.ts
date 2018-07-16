import { Graph } from "./graph";
import { DistMap } from "./dist-map";
import { Point } from "../../lib/geometry";

export class Node {
    constructor(public readonly name: string, public pos: Point) {}
}

export class World {
    public readonly graph: Graph;
    public readonly dists: DistMap;
    constructor(public nodes: Node[], cutoff:number) {
        this.dists = new DistMap(nodes.map(n => n.pos));
        this.graph = new Graph(this.dists, cutoff);
    }
}
