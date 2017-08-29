
import { fullscreenCanvas } from '../../elo/src/lib/canvas';
import { Loop } from '../../gl/src/loop';
import { Renderer } from './render';
import { World } from "./world";


type IState = {
    renderer: Renderer,
    world: World
};

export const main = () => {
    const loop = new Loop(200, init, fixedUpdate, variableUpdate);

    loop.start();
};

function init(): IState {
    return {
        renderer: new Renderer(fullscreenCanvas()),
        world: new World()
    };
}

function fixedUpdate(delta: number, state: IState) {
    return state;
}

function variableUpdate(delta: number, state: IState) {
    state.renderer.clear();
    state.renderer.render(state.world);
}