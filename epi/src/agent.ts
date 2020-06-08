import { Point, Vector } from "./geometry";

export class Agent {
    constructor(public pos: Point, public vector: Vector, public progress: number = 0) { }

    public get x() { return this.pos.x }
    public get y() { return this.pos.y }

    public move(vector: Vector) {
        this.vector = vector;
        this.pos = this.pos.add(vector).clamp([0, 1], [0, 1]);
    }
}