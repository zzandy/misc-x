import { fullscreenCanvas3d } from '../../elo/src/lib/canvas';
import { makeCube } from './scene-helpers';
import { inverse, mul44 } from './matrix';
import { Camera, deg, makePerspective, lookAt } from './transform';
import { Loop } from './loop';
import { Mesh, SimpleProgram } from './Mesh';

export const run = () => {
    const loop = new Loop(60, init, fixed, render);

    loop.start();
};

interface State { gl: WebGLRenderingContext, fov: number, cam: Camera, aspect: number, meshes: Mesh[] };

const init = (): State => {
    const gl = fullscreenCanvas3d();
    gl.clearColor(0, 0, 0, 1);
    return {
        gl: gl,
        fov: 80 * deg,
        aspect: gl.canvas.width / gl.canvas.height,
        cam: new Camera([20, 20, 10], [0, 0, 0]),
        meshes: [makeCube(gl)]
    };
}

const fixed = (delta: number, state: State): State => {
    return state;
}

const render = (delta: number, state: State) => {
    const cam = state.cam;
    const gl = state.gl;

    const pr = makePerspective(state.fov, state.aspect, 1, 100000);
    const view = inverse(lookAt(cam.pos, cam.lookat, cam.up));
    const proj = mul44(view, pr);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    state.meshes.forEach(o => o.draw(proj));
}
