import { Loop } from '../../lib/loop';
import { array, rnd } from '../../lib/util';
import { Render } from './render';
import { Agent } from './agent';
import { Point, Vector, newRandomVector } from './geometry';
import { DllPlugin } from 'webpack';

type World = {
    render: Render,
    agents: Agent[],
    repulsionRange: number,
    repulsionIntensity: number,
    contagionRange: number
};

const dp = 10;

const loop = new Loop(1000 / 24, init, update, render);
loop.start();

function init(): World {
const repulsionIntensity=.02;

    return {
        render: new Render(),
        repulsionIntensity,
        repulsionRange: .05,
        contagionRange: .03,
        agents: array(750, 1, (i) => {
            return new Agent(new Point(rnd(), rnd()), newRandomVector(repulsionIntensity/10), rnd() < .02 ? .1 : 0);
        })[0]
    };
}

function update(delta: number, world: World): World {
    const vectors = world.agents.map(agent =>
        world.agents
            .filter(a => a != agent && agent.pos.dist(a.pos) < world.repulsionRange)
            .reduce((vec, a) => {
                if (agent.progress == 0 && a.progress > 0 && rnd() < .1 && agent.pos.dist(a.pos) < world.contagionRange)
                    agent.progress = .1;

                const force = a.pos.to(agent.pos);
                const revd = (world.repulsionRange - force.length) / world.repulsionRange;

                return vec.add(force.norm.times(revd * revd * world.repulsionIntensity));
            }, agent.vector)
    );

    world.agents.forEach((agent, i) => {
        if (agent.progress > 0 && agent.progress < 100) agent.progress += delta * dp / 1000;
        if(rnd()<.01)agent.vector = newRandomVector(world.repulsionIntensity/10)
        agent.move(vectors[i]);
    });

    return world;
}

function render(delta: number, world: World) {
    world.render.draw(world.agents);
}
