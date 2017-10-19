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
        var h2 = h < 180 ? 2 * h / 3 : 120 + (h - 180) * 4 / 3;
        return hcy(h2, c, y);
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
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("ironbow/src/main", ["lib/canvas", "lib/color"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function ease(t) {
        return t * t * t * (6 * t * t - 15 * t + 10);
    }
    function guess(color, debug, res) {
        if (debug === void 0) { debug = false; }
        if (res === void 0) { res = 1; }
        var r0 = color[0], g0 = color[1], b0 = color[2];
        var dif = Infinity;
        var best;
        for (var h = 0; h < 360 * res; ++h) {
            for (var c = 0; c < 255 * res; ++c) {
                for (var y = 0; y < 255 * res; ++y) {
                    var _a = color_1.wheelHcy(h / res, c / 255 / res, y / 255 / res), r_1 = _a[0], g_1 = _a[1], b_1 = _a[2];
                    var d = Math.abs((r_1 * 255 | 0) - r0) + Math.abs((g_1 * 255 | 0) - g0) + Math.abs((b_1 * 255 | 0) - b0);
                    if (d < dif) {
                        if (debug)
                            console.log(d, dif, fmt(r_1, g_1, b_1), fmt(r0, g0, b0));
                        best = [h / res, c / 255 / res, y / 255 / res];
                        dif = d;
                    }
                }
            }
        }
        best = best;
        var _b = color_1.wheelHcy(best[0], best[1], best[2]), r = _b[0], g = _b[1], b = _b[2];
        var clr = fmt(r, g, b);
        var diff = [Math.abs(color[0] - clr[0]), Math.abs(color[1] - clr[1]), Math.abs(color[2] - clr[2])];
        var md = diff[0] + diff[1] + diff[2];
        if (md > 0 && md < 3 && res == 1) {
            return guess(color, debug, 2);
        }
        console.log(color, clr, diff, 'hcy(' + best.join(', ') + ')');
        return best;
    }
    function fmt(r, g, b) {
        return [r * 255 | 0, g * 255 | 0, b * 255 | 0];
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
                var img = new Image();
                img.addEventListener('load', function () {
                    ctx.drawImage(img, 0, 0);
                    var data = ctx.getImageData(2, 2, img.width - 4, img.height - 4);
                    ctx.putImageData(data, data.width + 10, 0);
                    var rows = 8;
                    var size = (data.height / rows) | 0;
                    var cols = data.width / size | 0;
                    var colors = [];
                    for (var i = 0; i < rows; ++i) {
                        for (var j = 0; j < cols; ++j) {
                            var x = (j + .5);
                            var y = (i + .5);
                            if (x < 9)
                                x += 9;
                            else
                                x -= 9;
                            var id = size * (x + y * data.width) * 4 | 0;
                            var color = [data.data[id], data.data[id + 1], data.data[id + 2]];
                            colors.push(color);
                            ctx.strokeStyle = 'white';
                            ctx.fillStyle = 'rgb(' + color.join(',') + ')';
                            ctx.beginPath();
                            ctx.arc(data.width / 2 + (j + .5) * size, data.height + 10 + (i + .5) * size, size / 2, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                    var current = 0;
                    var guessNext = function () {
                        var color = colors[current];
                        var q = current / colors.length;
                        var _a = [(270 + 165 * ease(q)) % 360, .8 * Math.sqrt(q), q], h = _a[0], c = _a[1], y = _a[2];
                        console.log(h, c, y);
                        var _b = color_1.wheelHcy(h, c, y), h1 = _b[0], c1 = _b[1], y1 = _b[2];
                        ctx.fillStyle = color_1.wheel2rgb(h, c, y);
                        ctx.fillRect(current * size, data.height * 2 + 10 + size + 1, size - 1, size);
                        ctx.fillStyle = 'rgb(' + color.join(',') + ')';
                        ctx.fillRect(current * size, data.height * 2 + 10, size - 1, size);
                        if (++current < colors.length)
                            requestAnimationFrame(guessNext);
                    };
                    requestAnimationFrame(guessNext);
                });
                img.src = 'ironbow.png';
            });
        }
    };
});
//# sourceMappingURL=bundle.js.map