import { Loop } from '../../lib/loop';
import { Render } from './render';
import { lab, mutate, Cell } from './replace';

type World = {
    render: Render,
    lab: Cell[][]
};

const loop = new Loop(1000, init, update, render);
loop.start();

function init(): World {
    return {
        render: new Render(),
        lab: lab(40, 25)
    };
}

function update(delta: number, world: World): World {

    world.lab = mutate(world.lab);

    return world;
}

function render(delta: number, world: World) {
    world.render.draw(world.lab);
}

