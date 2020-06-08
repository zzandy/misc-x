import { Loop } from '../../lib/loop';
import { array, rnd } from '../../lib/util';
import { Render } from './render';
import { Agent } from './agent';
import { Point, newRandomVector, Vector } from './geometry';
import { QuadTree, AABB } from './qt';

type World = {
    render: Render,
    agents: Agent[],
    repulsionRange: number,
    repulsionIntensity: number,
    contagionRange: number
};

const dp = 10;

const n = 1024;

const movement = .001;
const repulsionIntensity = movement * 5;
const contagionRange = .5 / Math.sqrt(n);
const repulsionRange = contagionRange * 1.2;

const loop = new Loop(1000 / 24, init, update, render);
loop.start();

function init(): World {
    return {
        render: new Render(),
        repulsionIntensity,
        repulsionRange,
        contagionRange,
        agents: array(n, 1, (_, k) => {
            const w = Math.sqrt(n) | 0;

            const i = (k % w + .5) / w;
            const j = (((k / w) | 0) + .5) / w;

            const dx = i-.5;
            const dy = j-.5;

            return new Agent(new Point(i, j), newRandomVector(movement), (dx*dx+dy*dy)<.01 ? .1+rnd(dp) : 0);
        })[0]
    };
}

function update(delta: number, world: World): World {
    const qt = new QuadTree(0, 0, 1.01, 1.01);
    const range = Math.max(world.contagionRange, world.repulsionRange);

    world.agents.forEach(a => qt.add(a));

    const vectors = world.agents.map(agent => {
        return (qt.get(new AABB(agent.x - range, agent.y - range, range * 2, range * 2)) as Agent[])
            .reduce((vec, a) => {
                if (a == agent) return vec;

                const force = a.pos.to(agent.pos);

                if (agent.progress == 0 && a.progress > 0 && force.length < world.contagionRange && rnd() < .1)
                    agent.progress = .1;

                const revd = (world.repulsionRange - force.length) / world.repulsionRange;
                return vec.add(force.norm.times(revd * revd * world.repulsionIntensity)).norm.times(movement);
            }, agent.vector);
    });

    world.agents.forEach((agent, i) => {
        if (agent.progress > 0 && agent.progress < 100) agent.progress += delta * dp / 1000;
        agent.move(vectors[i]);
    });

    return world;
}

function render(delta: number, world: World) {
    world.render.draw(world.agents);
}
