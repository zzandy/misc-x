
import { fullscreenCanvas } from '../../elo/src/lib/canvas';
import { Loop } from '../../gl/src/loop';
import { Renderer } from './render';
import { World } from "./world";
import { Point } from "../../hexflow/src/supercell";


type IState = {
    renderer: Renderer,
    world: World,
    cursor: { position: Point | null, updated: boolean, down: Point | null, up: Point | null }
};

export const main = () => {
    const loop = new Loop(16, init, fixedUpdate, variableUpdate);

    loop.start();
};

function init(): IState {

    const ctx = fullscreenCanvas(false, true);
    const cursor = {
        position: <Point | null>null,
        updated: false,
        down: <Point | null>null,
        up: <Point | null>null
    };

    const state = {
        renderer: new Renderer(ctx, 50),
        world: new World(9, 9),
        cursor: cursor,
    };

    ctx.canvas.addEventListener('mousemove', e => {
        cursor.position = new Point(e.clientX, e.clientY);
        cursor.down = new Point(e.clientX, e.clientY);
    });

    ctx.canvas.addEventListener('mousedown', e => {
        cursor.down = new Point(e.clientX, e.clientY);
    });

    ctx.canvas.addEventListener('mouseup', e => {
        cursor.up = new Point(e.clientX, e.clientY);
    });

    return state;
}

function fixedUpdate(delta: number, state: IState) {

    if (state.cursor.down != null)
        state.world.beginDrag(state.renderer.mapPoint(state.cursor.down));

    if (state.cursor.up != null)
        state.world.endDrag(state.renderer.mapPoint(state.cursor.up));

    state.world.update(delta);

    state.cursor.updated = false;
    state.cursor.down = null;
    state.cursor.up = null;
    return state;
}

function variableUpdate(delta: number, state: IState) {
    state.renderer.clear();
    state.renderer.render(state.world, state.cursor.position);
}