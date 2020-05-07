import { Loop } from '../../lib/loop';
import { Render } from './render';
import { Director } from './director';

type World = {
    render: Render,
    dir: Director
};

const loop = new Loop(1000 / 15, init, update, render);
loop.start();

function init(): World {
    let world = {
        render: new Render(),
        dir: new Director()
    };

    addEventListener('keydown', () => world.dir.startregen());
    addEventListener('keyup', () => world.dir.stopregen());
    addEventListener('mousedown', () => world.dir.startregen());
    addEventListener('mouseup', () => world.dir.stopregen());

    addEventListener("wheel", (e) => { if (e.deltaY < 0) world.dir.grow(); else world.dir.shrink(); });

    return world;
}

function update(delta: number, world: World): World {
    return world;
}

function render(delta: number, world: World) {
    world.render.draw(world.dir.shapes);
}

