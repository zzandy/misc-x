System.register("lib/canvas", [], function (exports_1, context_1) {
    "use strict";
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
        document.body.appendChild(can);
        return ctx;
    }
    exports_1("fullscreenCanvas", fullscreenCanvas);
    var getCanvas, fullscreenCanvas3d;
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
System.register("lib/color", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
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
    exports_2("hcy", hcy);
    function wheelHcy(h, c, y) {
        h %= 360;
        var h2 = h;
        var _a = [0, 0], s0 = _a[0], t0 = _a[1];
        for (var _i = 0, breaks_1 = breaks; _i < breaks_1.length; _i++) {
            var _b = breaks_1[_i], t = _b[0], s = _b[1];
            if (h < s) {
                h2 = t0 + (h - s0) * (t - t0) / (s - s0);
                break;
            }
            _c = [s, t], s0 = _c[0], t0 = _c[1];
        }
        return hcy(h2, c, y);
        var _c;
    }
    exports_2("wheelHcy", wheelHcy);
    function wheel2rgb(h, c, y, a) {
        if (a === void 0) { a = 1; }
        var rgbdata = wheelHcy(h, c, y);
        return tuple2rgb(rgbdata[0], rgbdata[1], rgbdata[2], a || 1);
    }
    exports_2("wheel2rgb", wheel2rgb);
    function tuple2rgb(r, g, b, a) {
        return 'rgba(' + (r * 255).toFixed(0) + ',' + (g * 255).toFixed(0) + ',' + (b * 255).toFixed(0) + ', ' + a + ')';
    }
    function hcy2rgb(h, c, y, a) {
        if (a === void 0) { a = 1; }
        var rgbdata = hcy(h, c, y);
        return tuple2rgb(rgbdata[0], rgbdata[1], rgbdata[2], a || 1);
    }
    exports_2("hcy2rgb", hcy2rgb);
    function rgbdata2rgb(t, a) {
        if (t.length == 3)
            return tuple2rgb(t[0], t[1], t[2], a === undefined ? 1 : a);
        return tuple2rgb(t[0], t[1], t[2], t[3]);
    }
    exports_2("rgbdata2rgb", rgbdata2rgb);
    var breaks;
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
System.register("misc/src/color", ["lib/canvas", "lib/color"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function renderWheel(ctx, r, t, colorFn, start) {
        if (start === void 0) { start = 0; }
        var steps = 30;
        var tau = Math.PI * 2;
        var _a = [Math.sin, Math.cos], sin = _a[0], cos = _a[1];
        for (var i = 0; i < steps; ++i) {
            var a = tau * i / steps;
            var b = tau * (i + 1) / steps;
            ctx.beginPath();
            ctx.closePath();
            ctx.moveTo(r * cos(a), -r * sin(a));
            ctx.lineTo((1 + t) * r * cos(a), -(1 + t) * r * sin(a));
            ctx.lineTo((1 + t) * r * cos(b), -(1 + t) * r * sin(b));
            ctx.lineTo(r * cos(b), -r * sin(b));
            ctx.fillStyle = colorFn(start + i * 360 / steps, 1, .6, .6);
            ctx.fill();
        }
    }
    function hsl(h, s, l, a) {
        if (a === void 0) { a = 1; }
        return 'hsla(' + [h % 360, s * 100 + '%', l * 100 + '%', a].join(',') + ')';
    }
    var canvas_1, color_1, main;
    return {
        setters: [
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            },
            function (color_1_1) {
                color_1 = color_1_1;
            }
        ],
        execute: function () {
            exports_3("main", main = function () {
                var ctx = canvas_1.fullscreenCanvas();
                document.body.style.backgroundColor = 'black';
                var r = 200;
                var t = .2;
                ctx.globalCompositeOperation = 'difference';
                ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
                ctx.translate(-r * 1.1, 0);
                renderWheel(ctx, r * .8, t * 2, color_1.wheel2rgb, 90);
                renderWheel(ctx, r * .7, t * 2, color_1.wheel2rgb, 270);
                ctx.translate(2.2 * r, 0);
                renderWheel(ctx, r * .8, t * 2, hsl, 90);
                renderWheel(ctx, r * .7, t * 2, hsl, 270);
            });
        }
    };
});
System.register("lib/random", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var Random;
    return {
        setters: [],
        execute: function () {
            Random = (function () {
                function Random(seed) {
                    if (seed === void 0) { seed = (new Date()).getTime(); }
                    this.seed = seed;
                }
                Random.prototype.next = function () {
                    return this.seed = +('0.' + Math.sin(this.seed).toString().substr(6));
                };
                Random.prototype.inext = function (min, max) {
                    return (min + (max - min) * this.next()) | 0;
                };
                Random.prototype.shuffle = function (array) {
                    var currentIndex = array.length, temporaryValue, randomIndex;
                    while (0 !== currentIndex) {
                        randomIndex = this.inext(0, currentIndex);
                        currentIndex -= 1;
                        temporaryValue = array[currentIndex];
                        array[currentIndex] = array[randomIndex];
                        array[randomIndex] = temporaryValue;
                    }
                    return array;
                };
                return Random;
            }());
            exports_4("Random", Random);
        }
    };
});
System.register("lib/simplex", ["lib/random"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    function generateShuffledArray(n, seed) {
        var a = new Array(n);
        for (var i = 0; i < n; ++i)
            a[i] = i;
        var r = new random_1.Random(seed);
        r.shuffle(a);
        return a;
    }
    function dot2d(x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
    }
    var random_1, grad3, F2, G2, SimplexNoise2d, SimplexNoiseOctave;
    return {
        setters: [
            function (random_1_1) {
                random_1 = random_1_1;
            }
        ],
        execute: function () {
            grad3 = [
                1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
                1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
                0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1
            ];
            F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
            G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
            SimplexNoise2d = (function () {
                function SimplexNoise2d(persistence, num_octaves, seed) {
                    if (seed === void 0) { seed = (new Date).getTime(); }
                    var r = new random_1.Random(seed);
                    this.octaves = new Array(num_octaves);
                    for (var i = 0; i < num_octaves; ++i) {
                        this.octaves.push({
                            octave: new SimplexNoiseOctave(r.inext(0, 9007199254740991)),
                            frequency: Math.pow(2, i),
                            amplitude: Math.pow(persistence, num_octaves - i)
                        });
                    }
                }
                SimplexNoise2d.prototype.getNoise2d = function (x, y) {
                    return this.octaves.reduce(function (res, o) { return res + o.amplitude * o.octave.getNoise2d(x / o.frequency, y / o.frequency); }, 0);
                };
                return SimplexNoise2d;
            }());
            exports_5("SimplexNoise2d", SimplexNoise2d);
            SimplexNoiseOctave = (function () {
                function SimplexNoiseOctave(seed) {
                    if (seed === void 0) { seed = 0; }
                    this.perm = generateShuffledArray(256, seed);
                    this.perm12 = this.perm.map(function (n) { return n % 12; });
                }
                SimplexNoiseOctave.prototype.getNoise2d = function (xin, yin) {
                    var p = this.perm;
                    var p12 = this.perm12;
                    var s = (xin + yin) * F2;
                    var i = (xin + s) | 0;
                    var j = (yin + s) | 0;
                    var t = (i + j) * G2;
                    var X0 = i - t;
                    var Y0 = j - t;
                    var x0 = xin - X0;
                    var y0 = yin - Y0;
                    var _a = (x0 > y0)
                        ? [1, 0]
                        : [0, 1], i1 = _a[0], j1 = _a[1];
                    var x1 = x0 - i1 + G2;
                    var y1 = y0 - j1 + G2;
                    var x2 = x0 - 1.0 + 2.0 * G2;
                    var y2 = y0 - 1.0 + 2.0 * G2;
                    var ii = i & 255;
                    var jj = j & 255;
                    var gi0 = p12[(ii + p[jj]) & 255];
                    var gi1 = p12[(ii + i1 + p[(jj + j1) & 255]) & 255];
                    var gi2 = p12[(ii + 1 + p[(jj + 1) & 255]) & 255];
                    var n0, n1, n2;
                    var t0 = 0.5 - x0 * x0 - y0 * y0;
                    if (t0 < 0)
                        n0 = 0.0;
                    else {
                        t0 *= t0;
                        n0 = t0 * t0 * dot2d(grad3[gi0 * 3], grad3[gi0 * 3 + 1], x0, y0);
                    }
                    var t1 = 0.5 - x1 * x1 - y1 * y1;
                    if (t1 < 0)
                        n1 = 0.0;
                    else {
                        t1 *= t1;
                        n1 = t1 * t1 * dot2d(grad3[gi1 * 3], grad3[gi1 * 3 + 1], x1, y1);
                    }
                    var t2 = 0.5 - x2 * x2 - y2 * y2;
                    if (t2 < 0)
                        n2 = 0.0;
                    else {
                        t2 *= t2;
                        n2 = t2 * t2 * dot2d(grad3[gi2 * 3], grad3[gi2 * 3 + 1], x2, y2);
                    }
                    return 70.0 * (n0 + n1 + n2);
                };
                return SimplexNoiseOctave;
            }());
            exports_5("SimplexNoiseOctave", SimplexNoiseOctave);
        }
    };
});
System.register("misc/src/simplex", ["lib/canvas", "lib/color", "lib/simplex"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    function renderNoise(ctx) {
        var noise = new simplex_1.SimplexNoise2d(.7, 10);
        var _a = ctx.canvas, w = _a.width, h = _a.height;
        var imgData = ctx.createImageData(w, h);
        var data = imgData.data;
        for (var i = 0; i < h; ++i) {
            for (var j = 0; j < w; ++j) {
                var v = noise.getNoise2d(j / 1, i / 1);
                var va = ease((v + 1) / 2);
                var borderdist = Math.min(i, j, h - i, w - j);
                var vignette = borderdist < 200 ? ease(borderdist / 200) : 1;
                var _b = mapColor(va * vignette), r = _b[0], g = _b[1], b = _b[2];
                var idx = (i * w + j) * 4;
                data[idx] = (r * 255) & 255;
                data[idx + 1] = (g * 255) & 255;
                data[idx + 2] = (b * 255) & 255;
                data[idx + 3] = 150;
            }
        }
        ctx.putImageData(imgData, 0, 0);
    }
    function ease(x) {
        return x * x * x * (x * (6 * x - 15) + 10);
    }
    function mapColor(v) {
        return mapGrad(v, grad);
    }
    function mapGrad(v, grad) {
        var prev = grad[0];
        for (var i = 1; i < grad.length; ++i) {
            var _a = grad[i], lvl = _a[0], color = _a[1];
            if (v < lvl) {
                var lvl0 = prev[0], color0 = prev[1];
                var k = 1 - (v - lvl0) / (lvl - lvl0);
                return [color0[0] * k + color[0] * (1 - k), color0[1] * k + color[1] * (1 - k), color0[2] * k + color[2] * (1 - k)];
            }
            prev = grad[i];
        }
        return grad[grad.length - 1][1];
    }
    var canvas_2, color_2, simplex_1, main, waterlevel, sandlevel, greenslevel, grad;
    return {
        setters: [
            function (canvas_2_1) {
                canvas_2 = canvas_2_1;
            },
            function (color_2_1) {
                color_2 = color_2_1;
            },
            function (simplex_1_1) {
                simplex_1 = simplex_1_1;
            }
        ],
        execute: function () {
            exports_6("main", main = function () {
                var ctx = canvas_2.fullscreenCanvas();
                document.body.style.backgroundColor = 'black';
                var before = (new Date).getTime();
                renderNoise(ctx);
                var after = (new Date).getTime();
                console.log('fullscreen in ', after - before);
            });
            waterlevel = .3;
            sandlevel = .33;
            greenslevel = .90;
            grad = [
                [0, color_2.wheelHcy(270, 1, .05)],
                [waterlevel, color_2.wheelHcy(270, 1, .4)],
                [waterlevel + .01, color_2.wheelHcy(60, 1, .8)],
                [sandlevel, color_2.wheelHcy(60, 1, .6)],
                [sandlevel + .01, color_2.wheelHcy(180, 1, .4)],
                [greenslevel, color_2.wheelHcy(100, 1, .4)],
                [greenslevel + .01, color_2.wheelHcy(170, 1, 1)],
                [1, color_2.wheelHcy(170, 1, .95)]
            ];
        }
    };
});
//# sourceMappingURL=bundle.js.map