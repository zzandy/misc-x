import { Loop } from '../../lib/loop';
import { Render } from './render';
import { Director } from './director';

type World = {
    renderer: Render,
    dir: Director,
};

const loop = new Loop(1000 / 24, init, update, render);
loop.start();

function init(): World {
    const r = new Render();
    let world = {
        renderer: r,
        dir: new Director(r.aspect),
    };

    addEventListener('keydown', () => world.dir.regen());
    addEventListener('mousedown', () => world.dir.regen());

    addEventListener("wheel", (e) => { if (e.deltaY > 0) world.dir.grow(); else world.dir.shrink(); });

    return world;
}

function update(delta: number, world: World): World {
    return world;
}

function render(delta: number, world: World) {
    const { dir: { shapes, isNew, orientation }, renderer } = world;
    if (isNew) {
        renderer.draw(shapes, orientation);
        world.dir.isNew = false;
    }
}

