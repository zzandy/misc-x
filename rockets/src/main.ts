import { Loop } from '../../lib/loop';
import { Renderer } from './renderer';
import { rnd } from '../../lib/util';
import { AABB, Vector, newVector } from './geometry';
import { array, deg } from './util';
import { Rocket, Command, Explosion } from './rocket';

type State = {
    renderer: Renderer,
    rockets: Rocket[],
    area: AABB,
    explosions: Explosion[],
    goals: Vector[],
    obstacles: AABB[],
    wins: number,
    best: number,
    first: number,
    bestCommands: number,
    avgCommands: number,
    avgCommandsCount: number
};

const maxOut = 400;
const minMag = 20;
const maxMag = 30;
const minBurn = 300;
const maxBurn = 700;
const n = 500;
const minCommands = 10;
const maxCommands = 30;
let interval = 0;
const maxInterval = 7;
const g = .015;
const d = 50;
const loop = new Loop(1000 / 60, init, update, render);
loop.start();

function init() {
    const renderer = new Renderer();

    const { width: w, height: h } = renderer;

    const area = new AABB(-w / 2, 0, w, h);

    const rockets = array(n, k => new Rocket(0, 100, new Vector(0, -g), array(rnd(minCommands, maxCommands), randomCommand), k / n));

    const obstacles = [
        new AABB(-w / 4, h * .4, w / 2, h / 20),
        new AABB(-w / 2, h * .7, w / 3, h / 20),
        new AABB(w / 6, h * .7, w / 3, h / 20),
    ];

    return {
        renderer,
        rockets,
        area,
        explosions: [],
        goals: [new Vector(-w / 3, h * .9), new Vector(w / 3, h * .9)],
        obstacles,
        wins: 0,
        first: 0,
        best: 0,
        bestCommands: 0,
        avgCommands: 0,
        avgCommandsCount: 0
    };
}

function update(delta: number, state: State) {
    state.explosions = state.explosions.filter(expl => {
        expl.advance(delta);
        return expl.isAlive;
    });

    let numAlive = 0;
    let numCommands = 0;

    for (let rocket of state.rockets) {
        if (rocket.isDead) continue;

        rocket.advance(delta);

        const dist = state.goals.reduce((min, goal) => Math.min(min, goal.distance(rocket.pos)), Infinity);
        const won = dist < d;
        const score = (dist / d + interval / 1000 / maxInterval) / (won ? 1 : 2);

        rocket.score(score);

        if (won) {
            state.wins++;
            if (state.first == 0) state.first = interval / 1000;
        }

        state.best = Math.max(state.best, rocket.bestScore);
        if (state.best == rocket.bestScore)
            state.bestCommands = rocket.commands.length;

        let dead = won || !state.area.contains(rocket.pos)
            || state.obstacles.some(obstacle => obstacle.contains(rocket.pos));

        if (dead) {
            if (state.explosions.every(expl => expl.pos.distance(rocket.pos) > 30 || expl.age / expl.lifespan > .2))
                state.explosions.push(new Explosion(rocket.pos));
            rocket.isDead = true;
        }
        else {
            numCommands += rocket.commands.length
            ++numAlive;
        }
    }

    if (numAlive > 0) {
        state.avgCommands += numCommands;
        state.avgCommandsCount += numAlive;
    }

    if ((interval += delta) > maxInterval * 1000 || numAlive == 0) {
        interval = 0;

        //console.log(state.best.toFixed(3), state.wins, state.first.toFixed(2), state.bestCommands, (state.avgCommands / state.avgCommandsCount).toFixed(1));
        state.best = state.wins = state.first = state.bestCommands = 0;

        const prev = state.rockets;
        prev.sort((a, b) => b.bestScore - a.bestScore);
        state.rockets = [];
        let k = 0;
        while (state.rockets.length < n) {
            let a = prev[(rnd() * rnd() * n) | 0];
            let b = prev[(rnd() * rnd() * n) | 0];

            if (a == b) continue;
            const cmds = splice(a.commands, b.commands);

            if (cmds.length >= minCommands && cmds.length < maxCommands)
                state.rockets.push(new Rocket(0, 100, new Vector(0, -g), cmds, ++k / n));
        }
    }

    return state;
}

function render(delta: number, state: State) {
    state.renderer.draw(state.goals, state.obstacles, state.rockets, state.explosions, state.area);
}

function splice(a: Command[], b: Command[]) {
    if (rnd() < .5) [a, b] = [b, a]

    let s0 = rnd(a.length);
    let s1 = rnd(a.length);

    let t0 = rnd(b.length);
    let t1 = rnd(b.length);

    if (s0 > s1) [s0, s1] = [s1, s0];
    if (t0 > t1) [t0, t1] = [t1, t0];

    const res = a.slice(0, s0).concat(b.slice(t0, t1)).concat(a.slice(s1));

    if (rnd() < .3) {

        const mutation = rnd(['flip', 'drop', 'spawn']);
        const at = rnd(res.length);
        switch (mutation) {
            case "flip":
                res[at] = randomCommand();
                break;
            case "drop":
                res.splice(at, 1);
                break;
            case "spawn":
                res.splice(at, 0, randomCommand());
                break;
        }
    }

    return res;
}

function randomCommand() {
    return new Command(0,
        rnd(minBurn, maxBurn),
        newVector(rnd(180) * deg, rnd(minMag, maxMag)),
        rnd(maxOut));
}
