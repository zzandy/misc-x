import { Loop } from '../../lib/loop';
import { Render } from './render';
import { Director, IDrawable } from './director';

type World = {
    renderer: Render,
    dir: Director,
};

const loop = new Loop(1000 / 60, init, update, render);
loop.start();

function init(): World {
    const r = new Render();
    let world = {
        renderer: r,
        dir: new Director(r.aspect),
    };

    document.body.style.backgroundColor = '#181a1b';

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
        world.dir.isNew = shapes.reduce(checkRowNeedsUpdate, false);
        renderer.draw(shapes, orientation);
    }

    function checkNeedsUpdate(needsUpdate: boolean, shape: IDrawable) {
        return shape.getFade().update(delta) || needsUpdate;
    }

    function checkRowNeedsUpdate(needsUpdate: boolean, row: IDrawable[]) {
        return row.reduce(checkNeedsUpdate, false) || needsUpdate;
    }
}
