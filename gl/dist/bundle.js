var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
System.register("lib/canvas", [], function (exports_1, context_1) {
    "use strict";
    var getCanvas, fullscreenCanvas3d;
    var __moduleName = context_1 && context_1.id;
    function fullscreenCanvas(relative, noAlpha) {
        if (relative === void 0) { relative = false; }
        if (noAlpha === void 0) { noAlpha = false; }
        var can = getCanvas(relative);
        var ctx = can.getContext('2d', { alpha: !noAlpha });
        if (ctx == null)
            throw new Error('failed to get \'2d\' context');
        ctx.clear = function () {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            return ctx;
        };
        ctx.makePath = function (vertices) {
            ctx.beginPath();
            ctx.moveTo(vertices[0], vertices[1]);
            for (var i = 2; i < vertices.length; i += 2) {
                ctx.lineTo(vertices[i], vertices[i + 1]);
            }
            ctx.closePath();
            return ctx;
        };
        ctx.strokeCircle = function (x, y, r) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.stroke();
            return ctx;
        };
        ctx.fillCircle = function (x, y, r) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.fill();
            return ctx;
        };
        document.body.style.overflow = 'hidden';
        document.body.appendChild(can);
        return ctx;
    }
    exports_1("fullscreenCanvas", fullscreenCanvas);
    return {
        setters: [],
        execute: function () {
            exports_1("getCanvas", getCanvas = function (isRelative) {
                if (isRelative === void 0) { isRelative = false; }
                var can = document.createElement('canvas');
                can.width = window.innerWidth;
                can.height = window.innerHeight;
                if (!isRelative) {
                    can.style.position = 'absolute';
                    can.style.top = '0';
                    can.style.left = '0';
                }
                return can;
            });
            exports_1("fullscreenCanvas3d", fullscreenCanvas3d = function (relative) {
                if (relative === void 0) { relative = false; }
                var can = getCanvas(relative);
                var gl = can.getContext('webgl');
                if (gl == null)
                    throw new Error('failed to get \'webgl\' context');
                document.body.appendChild(can);
                return gl;
            });
        }
    };
});
System.register("gl/src/types", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("gl/src/matrix", [], function (exports_3, context_3) {
    "use strict";
    var iden3, iden4, mul33, mul44v, mul44, inverse;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            iden3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            iden4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            exports_3("mul33", mul33 = function (a, b) {
                return [
                    a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
                    a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
                    a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
                    a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
                    a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
                    a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
                    a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
                    a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
                    a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
                ];
            });
            exports_3("mul44v", mul44v = function (m, v) {
                return [
                    m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3] * v[3],
                    m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7] * v[3],
                    m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11] * v[3],
                    m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3]
                ];
            });
            exports_3("mul44", mul44 = function (a, b) {
                return [
                    a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
                    a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
                    a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
                    a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],
                    a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
                    a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
                    a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
                    a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],
                    a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
                    a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
                    a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
                    a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],
                    a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
                    a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
                    a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
                    a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15],
                ];
            });
            exports_3("inverse", inverse = function (m) {
                var m00 = m[0 * 4 + 0];
                var m01 = m[0 * 4 + 1];
                var m02 = m[0 * 4 + 2];
                var m03 = m[0 * 4 + 3];
                var m10 = m[1 * 4 + 0];
                var m11 = m[1 * 4 + 1];
                var m12 = m[1 * 4 + 2];
                var m13 = m[1 * 4 + 3];
                var m20 = m[2 * 4 + 0];
                var m21 = m[2 * 4 + 1];
                var m22 = m[2 * 4 + 2];
                var m23 = m[2 * 4 + 3];
                var m30 = m[3 * 4 + 0];
                var m31 = m[3 * 4 + 1];
                var m32 = m[3 * 4 + 2];
                var m33 = m[3 * 4 + 3];
                var tmp_0 = m22 * m33;
                var tmp_1 = m32 * m23;
                var tmp_2 = m12 * m33;
                var tmp_3 = m32 * m13;
                var tmp_4 = m12 * m23;
                var tmp_5 = m22 * m13;
                var tmp_6 = m02 * m33;
                var tmp_7 = m32 * m03;
                var tmp_8 = m02 * m23;
                var tmp_9 = m22 * m03;
                var tmp_10 = m02 * m13;
                var tmp_11 = m12 * m03;
                var tmp_12 = m20 * m31;
                var tmp_13 = m30 * m21;
                var tmp_14 = m10 * m31;
                var tmp_15 = m30 * m11;
                var tmp_16 = m10 * m21;
                var tmp_17 = m20 * m11;
                var tmp_18 = m00 * m31;
                var tmp_19 = m30 * m01;
                var tmp_20 = m00 * m21;
                var tmp_21 = m20 * m01;
                var tmp_22 = m00 * m11;
                var tmp_23 = m10 * m01;
                var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
                    (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
                var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
                    (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
                var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
                    (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
                var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
                    (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
                var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
                return [
                    d * t0,
                    d * t1,
                    d * t2,
                    d * t3,
                    d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                        (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
                    d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                        (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
                    d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                        (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
                    d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                        (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
                    d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                        (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
                    d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                        (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
                    d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                        (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
                    d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                        (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
                    d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                        (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
                    d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                        (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
                    d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                        (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
                    d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                        (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
                ];
            });
        }
    };
});
System.register("gl/src/transform", ["gl/src/matrix"], function (exports_4, context_4) {
    "use strict";
    var matrix_1, Camera, translate3d, scale3d, diff, vectorAngleQuaternion, rotateAArroundB, rotate3d, makePerspective, mul, makeProjection3d, projection, cross, epsilon, tau, deg, length, substract, norm, lookAt;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (matrix_1_1) {
                matrix_1 = matrix_1_1;
            }
        ],
        execute: function () {
            Camera = (function () {
                function Camera(pos, lookat, up, fov) {
                    if (up === void 0) { up = [0, 0, 1]; }
                    this.pos = pos;
                    this.lookat = lookat;
                    this.up = up;
                    this.fov = fov;
                }
                return Camera;
            }());
            exports_4("Camera", Camera);
            exports_4("translate3d", translate3d = function (trans) {
                return [
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    trans[0], trans[1], trans[2], 1
                ];
            });
            exports_4("scale3d", scale3d = function (scale) {
                return [
                    scale[0], 0, 0, 0,
                    0, scale[1], 0, 0,
                    0, 0, scale[2], 0,
                    0, 0, 0, 1
                ];
            });
            exports_4("diff", diff = function (a, b) {
                return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
            });
            exports_4("vectorAngleQuaternion", vectorAngleQuaternion = function (v, a) {
                var s = Math.sin(a / 2);
                return [s * v[0], s * v[1], s * v[2], Math.cos(a / 2)];
            });
            exports_4("rotateAArroundB", rotateAArroundB = function (a, b, angle, axis) {
                var relative = [a[0] - b[0], a[1] - b[1], a[2] - b[2], 1];
                var r = matrix_1.mul44v(rotate3d(vectorAngleQuaternion(axis, angle)), relative);
                return [b[0] + r[0], b[1] + r[1], b[2] + r[2]];
            });
            exports_4("rotate3d", rotate3d = function (q) {
                var x = q[0];
                var y = q[1];
                var z = q[2];
                var w = q[3] || 1;
                return [
                    1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * z * w, 2 * x * z + 2 * y * w, 0,
                    2 * x * y + 2 * z * w, 1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * x * w, 0,
                    2 * x * z - 2 * y * w, 2 * y * z + 2 * x * w, 1 - 2 * x * x - 2 * y * y, 0,
                    0, 0, 0, 1
                ];
            });
            exports_4("makePerspective", makePerspective = function (fov, aspect, near, far) {
                var f = Math.tan((Math.PI - fov) / 2);
                var r = 1 / (near - far);
                return [
                    f / aspect, 0, 0, 0,
                    0, f, 0, 0,
                    0, 0, (near + far) * r, -1,
                    0, 0, near * far * r * 2, 0
                ];
            });
            exports_4("mul", mul = function () {
                var matrices = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    matrices[_i] = arguments[_i];
                }
                if (matrices.length < 2)
                    return matrices[0];
                return matrices.reverse().reduce(function (a, b) { return matrix_1.mul44(a, b); });
            });
            exports_4("makeProjection3d", makeProjection3d = function (view, proj, origin, rv, ra, scales) {
                var scale = scale3d(scales);
                var rot = rotate3d(vectorAngleQuaternion(rv, ra));
                var translate = translate3d(origin);
                return mul(proj, view, rot, scale, translate);
            });
            exports_4("projection", projection = function (cam, pos, rot, scale) {
                return mul(cam, translate3d(pos), rotate3d(rot), scale3d(scale));
            });
            exports_4("cross", cross = function (a, b) {
                return [a[1] * b[2] - a[2] * b[1],
                    a[2] * b[0] - a[0] * b[2],
                    a[0] * b[1] - a[1] * b[0]];
            });
            epsilon = 1e-10;
            exports_4("tau", tau = 2 * Math.PI);
            exports_4("deg", deg = tau / 360);
            exports_4("length", length = function (a) {
                return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
            });
            exports_4("substract", substract = function (a, b) {
                return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
            });
            exports_4("norm", norm = function (a) {
                var len = length(a);
                return len > epsilon
                    ? [a[0] / len, a[1] / len, a[2] / len]
                    : [0, 0, 0];
            });
            exports_4("lookAt", lookAt = function (pos, target, up) {
                var z = norm(substract(pos, target));
                var x = norm(cross(up, z));
                var y = norm(cross(z, x));
                return [
                    x[0], x[1], x[2], 0,
                    y[0], y[1], y[2], 0,
                    z[0], z[1], z[2], 0,
                    pos[0], pos[1], pos[2], 1
                ];
            });
        }
    };
});
System.register("gl/src/shader", [], function (exports_5, context_5) {
    "use strict";
    var mimeFragmentShader, mimeVertexShader;
    var __moduleName = context_5 && context_5.id;
    function compileShader(gl, shaderSource, shaderType) {
        var shader = gl.createShader(shaderType);
        if (shader == null)
            throw gl.getError();
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            throw new Error(gl.getShaderInfoLog(shader) + ':\n' + shaderSource || 'failed to compile shader');
        return shader;
    }
    exports_5("compileShader", compileShader);
    function createShader(gl, shaderId) {
        var tag = document.getElementById(shaderId);
        if (!tag)
            throw new Error('Shader script tag ' + shaderId + ' not found.');
        var type = null;
        if (tag.type === mimeFragmentShader)
            type = gl.FRAGMENT_SHADER;
        else if (tag.type === mimeVertexShader)
            type = gl.VERTEX_SHADER;
        else
            throw new Error('Unknown shader type, expected "' + mimeVertexShader + '" or "' + mimeFragmentShader + '", got "' + tag.type + '"');
        return compileShader(gl, tag.text, type);
    }
    exports_5("createShader", createShader);
    function createProgram(gl, vertex, fragment) {
        var program = gl.createProgram();
        if (program == null)
            throw gl.getError();
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            throw new Error(gl.getProgramInfoLog(program) || 'failed to link program');
        return program;
    }
    exports_5("createProgram", createProgram);
    function createProgramFromScripts(gl, vertexId, fragmentId) {
        var vertex = createShader(gl, vertexId);
        var fragment = createShader(gl, fragmentId);
        return createProgram(gl, vertex, fragment);
    }
    exports_5("createProgramFromScripts", createProgramFromScripts);
    return {
        setters: [],
        execute: function () {
            mimeFragmentShader = 'x-shader/x-fragment';
            mimeVertexShader = 'x-shader/x-vertex';
        }
    };
});
System.register("gl/src/mesh", ["gl/src/transform", "gl/src/shader"], function (exports_6, context_6) {
    "use strict";
    var transform_1, shader_1, SimpleProgram, Mesh;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (transform_1_1) {
                transform_1 = transform_1_1;
            },
            function (shader_1_1) {
                shader_1 = shader_1_1;
            }
        ],
        execute: function () {
            SimpleProgram = (function () {
                function SimpleProgram(gl, vertex, fragment) {
                    this.gl = gl;
                    this.vertex = vertex;
                    this.fragment = fragment;
                    var p = this.program = shader_1.createProgram(gl, typeof (vertex) === 'string'
                        ? (vertex.length > 50
                            ? shader_1.compileShader(gl, vertex, gl.VERTEX_SHADER)
                            : shader_1.createShader(gl, vertex))
                        : this.vertex, typeof (fragment) === 'string'
                        ? (fragment.length > 50
                            ? shader_1.compileShader(gl, fragment, gl.FRAGMENT_SHADER)
                            : shader_1.createShader(gl, fragment))
                        : this.fragment);
                    this.pos_attr = gl.getAttribLocation(p, 'a_position');
                    this.color_attr = gl.getAttribLocation(p, 'a_color');
                    this.trans = gl.getUniformLocation(p, 'u_trans');
                    this.view = gl.getUniformLocation(p, 'u_view');
                }
                return SimpleProgram;
            }());
            exports_6("SimpleProgram", SimpleProgram);
            Mesh = (function () {
                function Mesh(gl, program, geometry, colors, pos, rotv, rota, scale) {
                    if (pos === void 0) { pos = [0, 0, 0]; }
                    if (rotv === void 0) { rotv = [0, 0, 1]; }
                    if (rota === void 0) { rota = 0; }
                    if (scale === void 0) { scale = [1, 1, 1]; }
                    this.gl = gl;
                    this.program = program;
                    this.geometry = geometry;
                    this.colors = colors;
                    this.pos = pos;
                    this.rotv = rotv;
                    this.rota = rota;
                    this.scale = scale;
                    var p = this.program;
                    gl.useProgram(p.program);
                    this.vtxbuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.vtxbuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, this.geometry, gl.STATIC_DRAW);
                    this.colbuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.colbuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
                }
                Mesh.prototype.draw = function (proj) {
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
                    gl.uniformMatrix4fv(p.trans, false, transform_1.mul(transform_1.translate3d(this.pos), transform_1.rotate3d(transform_1.vectorAngleQuaternion(this.rotv, this.rota)), transform_1.scale3d(this.scale)));
                    gl.drawArrays(gl.TRIANGLES, 0, this.geometry.length / 3);
                };
                return Mesh;
            }());
            exports_6("Mesh", Mesh);
        }
    };
});
System.register("lib/color", [], function (exports_7, context_7) {
    "use strict";
    var breaks;
    var __moduleName = context_7 && context_7.id;
    function hcy(h, c, y) {
        var r = .3;
        var g = .59;
        var b = .11;
        h %= 360;
        h /= 60;
        var k = (1 - Math.abs((h % 2) - 1));
        var K = h < 1 ? r + k * g
            : h < 2 ? g + k * r
                : h < 3 ? g + k * b
                    : h < 4 ? b + k * g
                        : h < 5 ? b + k * r
                            : r + k * b;
        var cmax = 1;
        if (y <= 0 || y >= 1)
            cmax = 0;
        else
            cmax *= K < y ? (y - 1) / (K - 1) : K > y ? y / K : 1;
        c = Math.min(c, cmax);
        var x = c * k;
        var rgb = h < 1 ? [c, x, 0]
            : h < 2 ? [x, c, 0]
                : h < 3 ? [0, c, x]
                    : h < 4 ? [0, x, c]
                        : h < 5 ? [x, 0, c]
                            : [c, 0, x];
        var m = y - (r * rgb[0] + g * rgb[1] + b * rgb[2]);
        return [rgb[0] + m, rgb[1] + m, rgb[2] + m];
    }
    exports_7("hcy", hcy);
    function wheelHcy(h, c, y) {
        var _a;
        h %= 360;
        var h2 = h;
        var _b = [0, 0], s0 = _b[0], t0 = _b[1];
        for (var _i = 0, breaks_1 = breaks; _i < breaks_1.length; _i++) {
            var _c = breaks_1[_i], t = _c[0], s = _c[1];
            if (h < s) {
                h2 = t0 + (h - s0) * (t - t0) / (s - s0);
                break;
            }
            _a = [s, t], s0 = _a[0], t0 = _a[1];
        }
        return hcy(h2, c, y);
    }
    exports_7("wheelHcy", wheelHcy);
    function wheel2rgb(h, c, y, a) {
        if (a === void 0) { a = 1; }
        var rgbdata = wheelHcy(h, c, y);
        return tuple2rgb(rgbdata[0], rgbdata[1], rgbdata[2], a || 1);
    }
    exports_7("wheel2rgb", wheel2rgb);
    function tuple2rgb(r, g, b, a) {
        return 'rgba(' + (r * 255).toFixed(0) + ',' + (g * 255).toFixed(0) + ',' + (b * 255).toFixed(0) + ', ' + a + ')';
    }
    function hcy2rgb(h, c, y, a) {
        if (a === void 0) { a = 1; }
        var rgbdata = hcy(h, c, y);
        return tuple2rgb(rgbdata[0], rgbdata[1], rgbdata[2], a || 1);
    }
    exports_7("hcy2rgb", hcy2rgb);
    function rgbdata2rgb(t, a) {
        return tuple2rgb(t[0], t[1], t[2], a === undefined ? 1 : a);
    }
    exports_7("rgbdata2rgb", rgbdata2rgb);
    return {
        setters: [],
        execute: function () {
            breaks = [
                [39, 60],
                [60, 120],
                [120, 180],
                [240, 240],
                [290, 300],
                [360, 360]
            ];
        }
    };
});
System.register("gl/src/scene-helpers", ["gl/src/mesh", "lib/color"], function (exports_8, context_8) {
    "use strict";
    var mesh_1, color_1, s3, s6, rnd, makeCube, repeat, makeGrid, makeDodecahedronMesh, makeDodecahedrons, makeCubeMesh, makeQuadColors;
    var __moduleName = context_8 && context_8.id;
    function tri(a, b, c) {
        return __spreadArray(__spreadArray(__spreadArray([], a, true), b, true), c, true);
    }
    function quad(a, b, c, d) {
        return __spreadArray(__spreadArray([], tri(a, b, c), true), tri(c, d, a), true);
    }
    return {
        setters: [
            function (mesh_1_1) {
                mesh_1 = mesh_1_1;
            },
            function (color_1_1) {
                color_1 = color_1_1;
            }
        ],
        execute: function () {
            s3 = Math.sqrt(3);
            s6 = Math.sqrt(6);
            rnd = function (x) {
                return Math.random() * x;
            };
            exports_8("makeCube", makeCube = function (gl, pos) {
                if (pos === void 0) { pos = [0, 0, 0]; }
                var p = new mesh_1.SimpleProgram(gl, 'vertex', 'fragment');
                var geometry = makeCubeMesh(0, 0, 0, 5, 5, 5);
                var colors = makeQuadColors(geometry, Math.random() * 360);
                return new mesh_1.Mesh(gl, p, geometry, colors, pos);
            });
            repeat = function (a, n) {
                var res = [];
                var m = a.length;
                for (var i = 0; i < n; ++i)
                    for (var j = 0; j < m; ++j)
                        res.push(a[j]);
                return res;
            };
            exports_8("makeGrid", makeGrid = function (gl, n, m, d, color) {
                var mesh = makeCubeMesh(0, 0, 0, .1, .1, .1);
                var p = new mesh_1.SimpleProgram(gl, 'vertex', 'fragment');
                var colors = new Float32Array(repeat(color, mesh.length));
                var res = [];
                for (var i = 0; i < n; ++i)
                    for (var j = 0; j < m; ++j) {
                        res.push(new mesh_1.Mesh(gl, p, mesh, colors, [i * d - n * d / 2, j * d - m * d / 2, 0]));
                    }
                return res;
            });
            exports_8("makeDodecahedronMesh", makeDodecahedronMesh = function (a) {
                var z = a * 3 / 2 / s6;
                var x = a / 2;
                var y = a / s3;
                var y2 = a / 2 / s3;
                var z2 = a / s6;
                var z3 = a / 2 / s6;
                var v = [
                    [0, 0, -z],
                    [-x, -y2, -z2],
                    [0, -y, -z3],
                    [x, -y2, -z2],
                    [x, y2, -z3],
                    [0, y, -z2],
                    [-x, y2, -z3],
                    [-x, -y2, z3],
                    [0, -y, z2],
                    [x, -y2, z3],
                    [x, y2, z2],
                    [0, y, z3],
                    [-x, y2, z2],
                    [0, 0, z]
                ];
                var iquad = function (i, j, k, l) {
                    return quad(v[i], v[j], v[k], v[l]);
                };
                return new Float32Array(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], iquad(0, 3, 2, 1), true), iquad(0, 5, 4, 3), true), iquad(0, 1, 6, 5), true), iquad(2, 8, 7, 1), true), iquad(2, 3, 9, 8), true), iquad(4, 10, 9, 3), true), iquad(4, 5, 11, 10), true), iquad(6, 12, 11, 5), true), iquad(6, 1, 7, 12), true), iquad(7, 8, 13, 12), true), iquad(9, 10, 13, 8), true), iquad(11, 12, 13, 10), true));
            });
            exports_8("makeDodecahedrons", makeDodecahedrons = function (gl, a, cols, rows, layers, o) {
                if (o === void 0) { o = [0, 0, 0]; }
                var mesh = makeDodecahedronMesh(a);
                var p = new mesh_1.SimpleProgram(gl, 'vertex', 'fragment');
                var dy = s3 / 2;
                var dz = 2 * a / s6;
                var oyz = a / 2 / s3;
                var res = [];
                for (var i = 0; i < rows; ++i)
                    for (var j = 0; j < cols; ++j)
                        for (var k = 0; k < layers; ++k)
                            res.push(new mesh_1.Mesh(gl, p, mesh, makeQuadColors(mesh, rnd(360)), [
                                -cols / 2 + o[0] + ((i + (k % 3)) % 2) * a / 2 + a * j,
                                -rows / 2 + o[1] + a * i * dy - oyz * (k % 3),
                                -layers / 2 + o[2] + dz * k
                            ]));
                return res;
            });
            makeCubeMesh = function (x, y, z, w, hy, dz) {
                var a = [x, y, z];
                var b = [x + w, y, z];
                var c = [x + w, y, z + dz];
                var d = [x, y, z + dz];
                var e = [x, y + hy, z];
                var f = [x + w, y + hy, z];
                var g = [x + w, y + hy, z + dz];
                var h = [x, y + hy, z + dz];
                return new Float32Array([].concat(quad(b, c, d, a), quad(e, a, d, h), quad(f, b, a, e), quad(g, c, b, f), quad(h, d, c, g), quad(g, f, e, h)));
            };
            makeQuadColors = function (geometry, baseHue) {
                var rnd = Math.random;
                var colors = new Float32Array(geometry.length * 3);
                var i = 0;
                while (i < colors.length) {
                    var c = baseHue === undefined
                        ? color_1.hcy(Math.random() * 360, 1, .5)
                        : color_1.hcy(baseHue + 100 * (rnd() - .5), 1, .5);
                    for (var j = 0; j < 6 && (i + j * 3 < colors.length); ++j) {
                        colors[i + j * 3 + 0] = c[0];
                        colors[i + j * 3 + 1] = c[1];
                        colors[i + j * 3 + 2] = c[2];
                    }
                    i += 6 * 3;
                }
                return colors;
            };
        }
    };
});
System.register("lib/loop", [], function (exports_9, context_9) {
    "use strict";
    var Loop;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
            Loop = (function () {
                function Loop(fixedDelta, init, fixed, variable) {
                    this.fixedDelta = fixedDelta;
                    this.init = init;
                    this.fixed = fixed;
                    this.variable = variable;
                    this.isRunning = false;
                    this.fixedAccum = 0;
                }
                Loop.prototype.start = function () {
                    var _this = this;
                    if (this.isRunning)
                        return;
                    var state = this.init();
                    this.isRunning = true;
                    var time = 0;
                    var frame = function (ts) {
                        var force = time == 0;
                        var delta = force ? 0 : ts - time;
                        time = ts;
                        state = _this.update(delta, state, force);
                        if (_this.isRunning)
                            requestAnimationFrame(frame);
                    };
                    requestAnimationFrame(frame);
                };
                Loop.prototype.stop = function () {
                    this.isRunning = false;
                };
                Loop.prototype.update = function (delta, state, force) {
                    if (force === void 0) { force = false; }
                    var newState = state;
                    this.fixedAccum += delta;
                    var upd = false;
                    if (force) {
                        newState = this.fixed(this.fixedDelta, newState);
                        upd = true;
                    }
                    else
                        while (this.fixedAccum > this.fixedDelta) {
                            this.fixedAccum -= this.fixedDelta;
                            newState = this.fixed(this.fixedDelta, newState);
                            upd = true;
                        }
                    if (upd)
                        this.variable(delta, newState);
                    return newState;
                };
                return Loop;
            }());
            exports_9("Loop", Loop);
        }
    };
});
System.register("gl/src/mouse", ["gl/src/matrix", "gl/src/transform"], function (exports_10, context_10) {
    "use strict";
    var matrix_2, transform_2, clamp, ViewController, MouseAdapter;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (matrix_2_1) {
                matrix_2 = matrix_2_1;
            },
            function (transform_2_1) {
                transform_2 = transform_2_1;
            }
        ],
        execute: function () {
            clamp = function (v, min, max) {
                return v > max ? max : v < min ? min : v;
            };
            ViewController = (function () {
                function ViewController(cam) {
                    this.cam = cam;
                    this.minfov = 3 * transform_2.deg;
                    this.maxfov = 140 * transform_2.deg;
                    this.qpanh = 1 / 4 * transform_2.deg;
                    this.qpanv = 1 / 32 * transform_2.deg;
                    this.qorbh = 1 / 4 * transform_2.deg;
                    this.qorbv = 1 / 24 * transform_2.deg;
                }
                ViewController.prototype.zoom = function (delta) {
                    var k = 1.2;
                    var targetfov = delta > 0 ? this.cam.fov * k : this.cam.fov / k;
                    this.cam.fov = clamp(targetfov, this.minfov, this.maxfov);
                };
                ViewController.prototype.turn = function (dx, dy) {
                    var cam = this.cam;
                    cam.lookat = transform_2.rotateAArroundB(cam.lookat, cam.pos, dx * this.qpanh, cam.up);
                    cam.lookat = transform_2.rotateAArroundB(cam.lookat, cam.pos, dy * this.qpanv, transform_2.cross(cam.up, transform_2.diff(cam.pos, cam.lookat)));
                };
                ViewController.prototype.orbit = function (dx, dy) {
                    var cam = this.cam;
                    var v = transform_2.cross(cam.up, transform_2.diff(cam.pos, cam.lookat));
                    cam.pos = transform_2.rotateAArroundB(cam.pos, cam.lookat, dx * this.qorbh, cam.up);
                    cam.pos = transform_2.rotateAArroundB(cam.pos, cam.lookat, -dy * this.qorbv, v);
                    cam.up = matrix_2.mul44v(transform_2.rotate3d(transform_2.vectorAngleQuaternion(v, -dy * this.qorbv)), [cam.up[0], cam.up[1], cam.up[2], 1]).slice(0, 3);
                };
                return ViewController;
            }());
            exports_10("ViewController", ViewController);
            MouseAdapter = (function () {
                function MouseAdapter(controller) {
                    var _this = this;
                    this.controller = controller;
                    addEventListener('wheel', function (e) { return _this.handleWheel(e); });
                    addEventListener('contextmenu', function (e) { return _this.handleContextMenu(e); }, true);
                    addEventListener('mousemove', function (e) { return _this.handleMouseMove(e); });
                }
                MouseAdapter.prototype.handleWheel = function (e) {
                    this.controller.zoom(e.deltaY);
                    e.preventDefault();
                };
                MouseAdapter.prototype.handleContextMenu = function (e) {
                    e.preventDefault();
                };
                MouseAdapter.prototype.handleMouseMove = function (e) {
                    if (!!(e.buttons & 1))
                        this.controller.turn(e.movementX, e.movementY);
                    else if (!!(e.buttons & 2))
                        this.controller.orbit(e.movementX, e.movementY);
                };
                return MouseAdapter;
            }());
            exports_10("MouseAdapter", MouseAdapter);
        }
    };
});
System.register("gl/src/main", ["lib/canvas", "gl/src/scene-helpers", "gl/src/matrix", "gl/src/transform", "lib/loop", "gl/src/mouse"], function (exports_11, context_11) {
    "use strict";
    var canvas_1, scene_helpers_1, matrix_3, transform_3, loop_1, mouse_1, run, init, fixed, render;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            },
            function (scene_helpers_1_1) {
                scene_helpers_1 = scene_helpers_1_1;
            },
            function (matrix_3_1) {
                matrix_3 = matrix_3_1;
            },
            function (transform_3_1) {
                transform_3 = transform_3_1;
            },
            function (loop_1_1) {
                loop_1 = loop_1_1;
            },
            function (mouse_1_1) {
                mouse_1 = mouse_1_1;
            }
        ],
        execute: function () {
            exports_11("run", run = function () {
                var loop = new loop_1.Loop(60, init, fixed, render);
                loop.start();
            });
            ;
            init = function () {
                var gl = canvas_1.fullscreenCanvas3d();
                gl.clearColor(0, 0, 0, 1);
                var state = {
                    gl: gl,
                    aspect: gl.canvas.width / gl.canvas.height,
                    cam: new transform_3.Camera([20, 20, 10], [0, 0, 0], [0, 0, 1], 80 * transform_3.deg),
                    meshes: __spreadArray(__spreadArray([scene_helpers_1.makeCube(gl)], scene_helpers_1.makeGrid(gl, 20, 20, 5, [1, 1, 1]), true), scene_helpers_1.makeDodecahedrons(gl, 3, 7, 7, 5), true)
                };
                var mouse = new mouse_1.MouseAdapter(new mouse_1.ViewController(state.cam));
                return state;
            };
            fixed = function (delta, state) {
                return state;
            };
            render = function (delta, state) {
                var cam = state.cam;
                var gl = state.gl;
                var pr = transform_3.makePerspective(cam.fov, state.aspect, 1, 100000);
                var view = matrix_3.inverse(transform_3.lookAt(cam.pos, cam.lookat, cam.up));
                var proj = matrix_3.mul44(view, pr);
                gl.enable(gl.CULL_FACE);
                gl.enable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                state.meshes.forEach(function (o) { return o.draw(proj); });
            };
        }
    };
});
//# sourceMappingURL=bundle.js.map