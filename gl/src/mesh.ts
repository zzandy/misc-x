import { Vec3, Matrix4 } from './types';
import { mul, translate3d, rotate3d, scale3d, vectorAngleQuaternion } from './transform';
import { createProgram, createShader, compileShader } from './shader';

export class SimpleProgram {
    public readonly view: WebGLUniformLocation;
    public readonly trans: WebGLUniformLocation;
    public readonly color_attr: number;
    public readonly pos_attr: number;
    public readonly program: WebGLProgram;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly vertex: WebGLShader | string,
        private readonly fragment: WebGLShader | string
    ) {
        const p = this.program = createProgram(gl,
            typeof (vertex) === 'string'
                ? (vertex.length > 50
                    ? compileShader(gl, vertex, gl.VERTEX_SHADER)
                    : createShader(gl, vertex))
                : this.vertex,
            typeof (fragment) === 'string'
                ? (fragment.length > 50
                    ? compileShader(gl, fragment, gl.FRAGMENT_SHADER)
                    : createShader(gl, fragment))
                : this.fragment);

        this.pos_attr = gl.getAttribLocation(p, 'a_position');
        this.color_attr = gl.getAttribLocation(p, 'a_color');
        this.trans = <WebGLUniformLocation>gl.getUniformLocation(p, 'u_trans');
        this.view = <WebGLUniformLocation>gl.getUniformLocation(p, 'u_view');
    }
}

export class Mesh {
    private readonly vtxbuffer: WebGLBuffer;
    private readonly colbuffer: WebGLBuffer;

    constructor(
        private readonly gl: WebGLRenderingContext,
        private readonly program: SimpleProgram,
        private readonly geometry: Float32Array,
        private readonly colors: Float32Array,
        private readonly pos: Vec3 = [0, 0, 0],
        private readonly rotv: Vec3 = [0, 0, 1],
        private readonly rota: number = 0,
        private readonly scale: Vec3 = [1, 1, 1]) {

        const p = this.program;

        gl.useProgram(p.program);

        this.vtxbuffer = <WebGLBuffer>gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vtxbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.geometry, gl.STATIC_DRAW);

        this.colbuffer = <WebGLBuffer>gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colbuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    }

    public draw(proj: Matrix4) {
        var gl = this.gl;
        var p = this.program;

        gl.useProgram(p.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vtxbuffer);
        gl.enableVertexAttribArray(p.pos_attr);
        gl.vertexAttribPointer(p.pos_attr, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colbuffer);
        gl.enableVertexAttribArray(p.color_attr);
        gl.vertexAttribPointer(p.color_attr, 3, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(p.view, false, proj);
        gl.uniformMatrix4fv(p.trans, false, mul(translate3d(this.pos),
            rotate3d(vectorAngleQuaternion(this.rotv, this.rota)),
            scale3d(this.scale)));

        gl.drawArrays(gl.TRIANGLES, 0, this.geometry.length / 3);
    }
}