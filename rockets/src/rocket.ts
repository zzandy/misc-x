import { rnd } from "../../lib/util";
import { Vector, newVector } from "./geometry";

export class Rocket {
    private commandIndex: number = 0;
    private timer: number = 0;
    private state: 'lead-in' | 'burn' | 'lead-out' = 'lead-in';
    pos: Vector;
    burnVector: Vector = new Vector(0, 0);
    vector: Vector = new Vector(0, 0);
    bestScore = 0;
    isDead = false;

    constructor(x: number, y: number, private readonly gravity: Vector, public readonly commands: Command[], public a: number) {
        this.pos = new Vector(x, y);
    }

    public score(n: number) {
        this.bestScore = Math.max(this.bestScore, n);
    }

    public advance(delta: number) {
        let time = delta;
        let cmd = this.commands[this.commandIndex];
        let burnVector = new Vector(0, 0);
        let more = true;

        while (more) {
            more = false;
            switch (this.state) {
                case "lead-in":
                    if (this.timer + time > cmd.leadTime) {
                        time -= cmd.leadTime - this.timer;
                        this.timer = 0;
                        this.state = "burn";
                        more = true;
                    }
                    else this.timer += time;
                    break;
                case "burn":
                    if (this.timer + time > cmd.burnTime) {
                        const x = cmd.burnTime - this.timer;
                        burnVector = burnVector.add(cmd.vector.times(x / 1000));
                        time -= x;
                        this.timer = 0;
                        this.state = "lead-out";
                        more = true;
                    }
                    else {
                        burnVector = burnVector.add(cmd.vector.times(time / 1000));
                        this.timer += time;
                    }
                    break;
                case "lead-out":
                    if (this.timer + time > cmd.outTime) {
                        time -= cmd.outTime - this.timer;
                        this.timer = 0;
                        this.commandIndex = (++this.commandIndex) % this.commands.length;
                        cmd = this.commands[this.commandIndex];
                        this.state = "lead-in";
                        more = true;
                    }
                    else this.timer += time;
                    break;
            }
        }

        this.burnVector = burnVector;
        this.vector = this.vector.add(burnVector).add(this.gravity.times(delta));
        this.pos = this.pos.add(this.vector);
    }
}

export class Command {
    constructor(public readonly leadTime: number,
        public readonly burnTime: number,
        public readonly vector: Vector, public readonly outTime: number) { }
}

export class Explosion {
    age: number = 0;
    lifespan: number = rnd(100, 300);

    constructor(public readonly pos: Vector) {

    }

    public advance(time: number) {
        this.age += time;
    }

    public get isAlive() {
        return this.age < this.lifespan;
    }
}
