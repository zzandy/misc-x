import { fullscreenCanvas3d } from '../../lib/canvas';
import { makeCube, makeGrid, makeDodecahedrons } from './scene-helpers';
import { inverse, mul44 } from './matrix';
import { Camera, deg, makePerspective, lookAt } from './transform';
import { Loop } from '../../lib/loop';
import { Mesh } from './Mesh';
import { ViewController, MouseAdapter } from './mouse';

export const run = () => {
    const loop = new Loop(60, init, fixed, render);

    loop.start();
};

interface State { gl: WebGLRenderingContext, cam: Camera, aspect: number, meshes: Mesh[] };

const init = (): State => {
    const gl = fullscreenCanvas3d();
    gl.clearColor(0, 0, 0, 1);

    const state = {
        gl: gl,
        aspect: gl.canvas.width / gl.canvas.height,
        cam: new Camera([20, 20, 10], [0, 0, 0], [0, 0, 1], 80 * deg),
        meshes: [makeCube(gl), ...makeGrid(gl, [0, 0, 0], 100, 10, [1, 1, 1]), ...makeDodecahedrons(gl, 3, 3, 5, 7)]
    };

    const mouse = new MouseAdapter(new ViewController(state.cam));

    return state;
}

const fixed = (delta: number, state: State): State => {
    return state;
}

const render = (delta: number, state: State) => {
    const cam = state.cam;
    const gl = state.gl;

    const pr = makePerspective(cam.fov, state.aspect, 1, 100000);
    const view = inverse(lookAt(cam.pos, cam.lookat, cam.up));
    const proj = mul44(view, pr);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    state.meshes.forEach(o => o.draw(proj));
}
