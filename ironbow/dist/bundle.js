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
    function grabColors(data, rows, cols, size) {
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
            }
        }
        return colors;
    }
    function previousAttempt(q) {
        var h = 240 + 180 * ease1(q);
        var y = q;
        return [h, 1, y];
    }
    function ease1(v) {
        return join(v, [0, .09, function (x) { return Math.pow(4 * x, 3); }], [.09, .31, function (x) { return (x / 1.15 - .033); }], [.31, .49, function (x) { return (.24 + Math.pow(2.4 * (x - .3), 2)); }], [.49, 1, function (x) { return (Math.log(5 * x) / 4.5 + .25); }]) / .6;
    }
    function join(v) {
        var segments = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            segments[_i - 1] = arguments[_i];
        }
        for (var _a = 0, segments_1 = segments; _a < segments_1.length; _a++) {
            var segment = segments_1[_a];
            if (v >= segment[0] && v < segment[1])
                return segment[2](v);
        }
        return v;
    }
    function ease(t) {
        return t * t * t * (6 * t * t - 15 * t + 10);
    }
    function fmt(r, g, b) {
        return [r * 255 | 0, g * 255 | 0, b * 255 | 0];
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
    function getHcyData() {
        return [[272, 0.0666666666666666, 0.0117647058823529],
            [275, 0.105882352941176, 0.0156862745098039],
            [272, 0.141176470588235, 0.0196078431372549],
            [272, 0.176470588235294, 0.0235294117647058],
            [272, 0.207843137254901, 0.0274509803921568],
            [274, 0.250980392156862, 0.0352941176470588],
            [272, 0.249019607843137, 0.0333333333333333],
            [272, 0.286274509803921, 0.0392156862745098],
            [272, 0.309803921568627, 0.0392156862745098],
            [270, 0.32156862745098, 0.0392156862745098],
            [270, 0.36078431372549, 0.0431372549019607],
            [270, 0.376470588235294, 0.0431372549019607],
            [271.5, 0.394117647058823, 0.0509803921568627],
            [272, 0.405882352941176, 0.0529411764705882],
            [273.5, 0.415686274509803, 0.0607843137254901],
            [275.5, 0.409803921568627, 0.0666666666666666],
            [276.5, 0.415686274509803, 0.0686274509803921],
            [279, 0.419607843137254, 0.084313725490196],
            [281, 0.435294117647058, 0.0901960784313725],
            [283.5, 0.441176470588235, 0.0901960784313725],
            [284, 0.447058823529411, 0.101960784313725],
            [288.5, 0.456862745098039, 0.109803921568627],
            [290, 0.464705882352941, 0.115686274509803],
            [291.5, 0.468627450980392, 0.12156862745098],
            [293, 0.462745098039215, 0.12156862745098],
            [295, 0.462745098039215, 0.129411764705882],
            [295.5, 0.476470588235294, 0.137254901960784],
            [295.5, 0.488235294117647, 0.139215686274509],
            [298.5, 0.480392156862745, 0.147058823529411],
            [299.5, 0.492156862745098, 0.152941176470588],
            [299, 0.486274509803921, 0.156862745098039],
            [299.5, 0.494117647058823, 0.162745098039215],
            [302, 0.501960784313725, 0.168627450980392],
            [302, 0.498039215686274, 0.172549019607843],
            [305.5, 0.507843137254901, 0.186274509803921],
            [308, 0.517647058823529, 0.192156862745098],
            [308.5, 0.535294117647058, 0.198039215686274],
            [310, 0.537254901960784, 0.20392156862745],
            [311, 0.533333333333333, 0.211764705882352],
            [312, 0.545098039215686, 0.215686274509803],
            [313.5, 0.547058823529411, 0.225490196078431],
            [313.5, 0.545098039215686, 0.225490196078431],
            [314.5, 0.56078431372549, 0.231372549019607],
            [315.5, 0.556862745098039, 0.239215686274509],
            [316, 0.574509803921568, 0.245098039215686],
            [316.5, 0.586274509803921, 0.252941176470588],
            [318, 0.598039215686274, 0.258823529411764],
            [318, 0.62156862745098, 0.26078431372549],
            [319.5, 0.637254901960784, 0.26078431372549],
            [321.5, 0.649019607843137, 0.274509803921568],
            [322, 0.649019607843137, 0.28235294117647],
            [324, 0.662745098039215, 0.290196078431372],
            [327.5, 0.676470588235294, 0.298039215686274],
            [328.5, 0.66078431372549, 0.307843137254902],
            [330, 0.664705882352941, 0.317647058823529],
            [331, 0.666666666666666, 0.325490196078431],
            [333, 0.668627450980392, 0.329411764705882],
            [334.5, 0.670588235294117, 0.333333333333333],
            [336.5, 0.66078431372549, 0.345098039215686],
            [338.5, 0.674509803921568, 0.347058823529411],
            [339.5, 0.664705882352941, 0.356862745098039],
            [339.5, 0.668627450980392, 0.366666666666666],
            [341, 0.666666666666666, 0.372549019607843],
            [343, 0.670588235294117, 0.378431372549019],
            [344.5, 0.676470588235294, 0.388235294117647],
            [346.5, 0.668627450980392, 0.398039215686274],
            [349.5, 0.676470588235294, 0.4],
            [353, 0.662745098039215, 0.396078431372549],
            [358.5, 0.650980392156862, 0.398039215686274],
            [4, 0.674509803921568, 0.411764705882352],
            [10, 0.725490196078431, 0.423529411764705],
            [13, 0.741176470588235, 0.423529411764705],
            [15.5, 0.750980392156862, 0.437254901960784],
            [18.5, 0.774509803921568, 0.439215686274509],
            [20.5, 0.790196078431372, 0.445098039215686],
            [22, 0.809803921568627, 0.441176470588235],
            [24.5, 0.813725490196078, 0.452941176470588],
            [24.5, 0.813725490196078, 0.46078431372549],
            [27.5, 0.837254901960784, 0.472549019607843],
            [27.5, 0.829411764705882, 0.480392156862745],
            [28.5, 0.835294117647058, 0.480392156862745],
            [31, 0.833333333333333, 0.492156862745098],
            [32, 0.835294117647058, 0.501960784313725],
            [32, 0.835294117647058, 0.501960784313725],
            [35, 0.84313725490196, 0.509803921568627],
            [35.5, 0.849019607843137, 0.529411764705882],
            [37, 0.858823529411764, 0.541176470588235],
            [38.5, 0.841176470588235, 0.552941176470588],
            [40, 0.84313725490196, 0.564705882352941],
            [42.5, 0.86078431372549, 0.572549019607843],
            [43, 0.874509803921568, 0.580392156862745],
            [43.5, 0.876470588235294, 0.590196078431372],
            [46.5, 0.86078431372549, 0.594117647058823],
            [47.5, 0.864705882352941, 0.601960784313725],
            [49, 0.854901960784313, 0.611764705882353],
            [49, 0.862745098039215, 0.615686274509804],
            [50, 0.866666666666666, 0.619607843137254],
            [52, 0.874509803921568, 0.627450980392156],
            [53, 0.874509803921568, 0.64313725490196],
            [52.5, 0.868627450980392, 0.641176470588235],
            [53.5, 0.868627450980392, 0.650980392156862],
            [55, 0.876470588235294, 0.664705882352941],
            [57, 0.905882352941176, 0.676470588235294],
            [60.5, 0.876470588235294, 0.688235294117647],
            [62.5, 0.884313725490196, 0.698039215686274],
            [64.5, 0.866666666666666, 0.711764705882353],
            [65, 0.870588235294117, 0.717647058823529],
            [66, 0.854901960784313, 0.72156862745098],
            [67.5, 0.856862745098039, 0.729411764705882],
            [68, 0.862745098039215, 0.733333333333333],
            [71, 0.890196078431372, 0.745098039215686],
            [70, 0.890196078431372, 0.752941176470588],
            [72, 0.890196078431372, 0.76078431372549],
            [71.5, 0.896078431372549, 0.770588235294117],
            [72, 0.907843137254902, 0.78235294117647],
            [71.5, 0.905882352941176, 0.786274509803921],
            [74, 0.917647058823529, 0.790196078431372],
            [75.5, 0.911764705882352, 0.798039215686274],
            [76, 0.886274509803921, 0.811764705882352],
            [75.5, 0.837254901960784, 0.825490196078431],
            [77, 0.772549019607843, 0.839215686274509],
            [77.5, 0.731372549019607, 0.845098039215686],
            [78, 0.694117647058823, 0.866666666666666],
            [78, 0.654901960784313, 0.874509803921568],
            [79, 0.592156862745098, 0.88235294117647],
            [80, 0.541176470588235, 0.890196078431372],
            [81, 0.498039215686274, 0.903921568627451],
            [83, 0.447058823529411, 0.909803921568627],
            [79, 0.407843137254901, 0.92156862745098],
            [75, 0.36078431372549, 0.925490196078431],
            [76, 0.309803921568627, 0.933333333333333],
            [83, 0.266666666666666, 0.945098039215686],
            [77, 0.219607843137254, 0.956862745098039],
            [77, 0.176470588235294, 0.956862745098039],
            [76, 0.133333333333333, 0.964705882352941],
            [66, 0.0588235294117647, 0.976470588235294]];
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
                    var colors = grabColors(data, rows, cols, size);
                    var hcycolors = getHcyData();
                    var current = 0;
                    var guessNext = function () {
                        var color = colors[current];
                        var q = current / colors.length;
                        ctx.fillStyle = 'rgb(' + color.join(',') + ')';
                        ctx.fillCircle(current * size + size / 2, data.height * 2 + 10 + size / 2, size / 2);
                        var _a = hcycolors[current], h = _a[0], c = _a[1], y = _a[2];
                        ctx.fillStyle = color_1.wheel2rgb(h, c, y);
                        ctx.fillRect(current * size, data.height * 2 + 10 + size + 1, size - 1, size);
                        _b = [(280 + 160 * ease(q) + .1 * q) % 360, q * 6 / (q * 6 + 1), Math.pow(q, 1.3) + .015 * (1 - q)], h = _b[0], c = _b[1], y = _b[2];
                        ctx.fillStyle = color_1.wheel2rgb(h, c, y);
                        ctx.fillRect(current * size, data.height * 2 + 10 + 2 * (size + 1), size - 1, size);
                        _c = previousAttempt(q), h = _c[0], c = _c[1], y = _c[2];
                        ctx.fillStyle = color_1.hcy2rgb(h, c, y);
                        ctx.fillRect(current * size, data.height * 2 + 10 + 3 * (size + 1), size - 1, size);
                        if (++current < colors.length)
                            requestAnimationFrame(guessNext);
                        var _b, _c;
                    };
                    requestAnimationFrame(guessNext);
                });
                img.src = 'ironbow.png';
            });
        }
    };
});
//# sourceMappingURL=bundle.js.map