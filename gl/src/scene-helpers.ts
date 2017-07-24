import { Mesh, SimpleProgram } from './mesh';
import { Vec3, Matrix4 } from './types';
import { hcy } from '../../elo/src/lib/color';

export const makeCube = (gl: WebGLRenderingContext, pos: Vec3 = [0, 0, 0]): Mesh => {

    const p = new SimpleProgram(gl, 'vertex', 'fragment');

    const geometry = makeCubeMesh(0, 0, 0, 5, 5, 5);

    const colors = makeQuadColors(geometry, Math.random() * 360);

    return new Mesh(gl, p, geometry, colors, pos);
}

const makeCubeMesh = (x: number, y: number, z: number, w: number, hy: number, dz: number) => {

    const a: Vec3 = [x, y, z];
    const b: Vec3 = [x + w, y, z];
    const c: Vec3 = [x + w, y, z + dz];
    const d: Vec3 = [x, y, z + dz];
    const e: Vec3 = [x, y + hy, z];
    const f: Vec3 = [x + w, y + hy, z];
    const g: Vec3 = [x + w, y + hy, z + dz];
    const h: Vec3 = [x, y + hy, z + dz];

    function tri(a: Vec3, b: Vec3, c: Vec3) {
        return a.concat(b, c);
    }

    function quad(a: Vec3, b: Vec3, c: Vec3, d: Vec3) {
        return tri(a, b, c).concat(tri(c, d, a));
    }

    return new Float32Array((<number[]>[]).concat(
        quad(b, c, d, a),
        quad(e, a, d, h),
        quad(f, b, a, e),
        quad(g, c, b, f),
        quad(h, d, c, g),
        quad(g, f, e, h)
    ));
}

const makeQuadColors = (geometry: Float32Array, baseHue: number) => {
    const rnd = Math.random
    const colors = new Float32Array(geometry.length * 3);

    let i = 0;
    while (i < colors.length) {
        const c = baseHue === undefined
            ? hcy(Math.random() * 360, 1, .5)
            : hcy(baseHue + 100 * (rnd() - .5), 1, .5);

        for (let j = 0; j < 6 && (i + j * 3 < colors.length); ++j) {
            colors[i + j * 3 + 0] = c[0];
            colors[i + j * 3 + 1] = c[1];
            colors[i + j * 3 + 2] = c[2];
        }

        i += 6 * 3;
    }

    return colors;
}