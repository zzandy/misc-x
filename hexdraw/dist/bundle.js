var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
System.register("lib/color", [], function (exports_1, context_1) {
    "use strict";
    var breaks;
    var __moduleName = context_1 && context_1.id;
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
    exports_1("hcy", hcy);
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
    exports_1("wheelHcy", wheelHcy);
    function wheel2rgb(h, c, y, a) {
        if (a === void 0) { a = 1; }
        var rgbdata = wheelHcy(h, c, y);
        return tuple2rgb(rgbdata[0], rgbdata[1], rgbdata[2], a || 1);
    }
    exports_1("wheel2rgb", wheel2rgb);
    function tuple2rgb(r, g, b, a) {
        return 'rgba(' + (r * 255).toFixed(0) + ',' + (g * 255).toFixed(0) + ',' + (b * 255).toFixed(0) + ', ' + a + ')';
    }
    function hcy2rgb(h, c, y, a) {
        if (a === void 0) { a = 1; }
        var rgbdata = hcy(h, c, y);
        return tuple2rgb(rgbdata[0], rgbdata[1], rgbdata[2], a || 1);
    }
    exports_1("hcy2rgb", hcy2rgb);
    function rgbdata2rgb(t, a) {
        return tuple2rgb(t[0], t[1], t[2], a === undefined ? 1 : a);
    }
    exports_1("rgbdata2rgb", rgbdata2rgb);
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
System.register("lib/geometry", [], function (exports_2, context_2) {
    "use strict";
    var Point, Rect, Range;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            Point = (function () {
                function Point(x, y) {
                    this.x = x;
                    this.y = y;
                }
                Point.prototype.times = function (a, b) {
                    if (typeof (a) === 'number')
                        return new Point(this.x * a, this.y * b);
                    return new Point(this.x * a.x, this.y * a.y);
                };
                Point.prototype.plus = function (a, b) {
                    if (typeof (a) === 'number')
                        return new Point(this.x + a, this.y + b);
                    return new Point(this.x + a.x, this.y + a.y);
                };
                return Point;
            }());
            exports_2("Point", Point);
            Rect = (function (_super) {
                __extends(Rect, _super);
                function Rect(x, y, w, h) {
                    var _this = _super.call(this, x, y) || this;
                    _this.w = w;
                    _this.h = h;
                    return _this;
                }
                Object.defineProperty(Rect.prototype, "horizontal", {
                    get: function () {
                        return new Range(this.x, this.w);
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Rect.prototype, "vertical", {
                    get: function () {
                        return new Range(this.y, this.h);
                    },
                    enumerable: false,
                    configurable: true
                });
                return Rect;
            }(Point));
            exports_2("Rect", Rect);
            Range = (function () {
                function Range(start, length) {
                    this.start = start;
                    this.length = length;
                }
                Object.defineProperty(Range.prototype, "end", {
                    get: function () {
                        return this.start + this.length;
                    },
                    enumerable: false,
                    configurable: true
                });
                return Range;
            }());
            exports_2("Range", Range);
        }
    };
});
System.register("lib/loop", [], function (exports_3, context_3) {
    "use strict";
    var Loop;
    var __moduleName = context_3 && context_3.id;
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
            exports_3("Loop", Loop);
        }
    };
});
System.register("lib/canvas", [], function (exports_4, context_4) {
    "use strict";
    var getCanvas, fullscreenCanvas3d;
    var __moduleName = context_4 && context_4.id;
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
    exports_4("fullscreenCanvas", fullscreenCanvas);
    return {
        setters: [],
        execute: function () {
            exports_4("getCanvas", getCanvas = function (isRelative) {
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
            exports_4("fullscreenCanvas3d", fullscreenCanvas3d = function (relative) {
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
System.register("hexdraw/src/sprite-renderer", [], function (exports_5, context_5) {
    "use strict";
    var stencil, SpriteRenderer, isSet;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [],
        execute: function () {
            stencil = (""
                + ". . . . . . . ^ ^ ^ ^ . . . . . . . . . . . . .\n"
                + ". . . . . . ^ ^ ^ ^ ^ # # # # T T . . . . . . .\n"
                + ". . . . . ^ ^ # # # # # # # # # T T T T . . . .\n"
                + ". . . . # # # # # # # # # # # # # T T T . . . .\n"
                + ". . . # # # # # # # # # # # # # # # # T T . . .\n"
                + ". . < # # # # # # # # # # # # # # # # # T . . .\n"
                + ". < < # # # # # # # # # # # # # # # # # # . . .\n"
                + "< < < # # # # # # # # # # # # # # # # # # # . .\n"
                + "< < # # # # # # # # # # # # # # # # # # # # . .\n"
                + ". < # # # # # # # # # # # # # # # # # # # # > .\n"
                + ". < # # # # # # # # # # # # # # # # # # # # > .\n"
                + ". < # # # # # # # # # # # # # # # # # # # # > .\n"
                + ". . # # # # # # # # # # # # # # # # # # # # > >\n"
                + ". . # # # # # # # # # # # # # # # # # # # > > >\n"
                + ". . . # # # # # # # # # # # # # # # # # # > > .\n"
                + ". . . L # # # # # # # # # # # # # # # # # > . .\n"
                + ". . . L L # # # # # # # # # # # # # # # # . . .\n"
                + ". . . . L L L # # # # # # # # # # # # # . . . .\n"
                + ". . . . L L L L # # # # # # # # # v v . . . . .\n"
                + ". . . . . . . L L # # # # v v v v v . . . . . .\n"
                + ". . . . . . . . . . . . . v v v v . . . . . . .")
                .split('\n')
                .map(function (row) { return row.split(' ').map(function (c) {
                switch (c) {
                    case '#':
                        return 7;
                    case '^':
                        return 1;
                    case 'T':
                        return 2;
                    case '>':
                        return 3;
                    case 'v':
                        return 4;
                    case 'L':
                        return 5;
                    case '<':
                        return 6;
                    default:
                        return 0;
                }
            }); });
            SpriteRenderer = (function () {
                function SpriteRenderer(sx, sy) {
                    this.sx = sx;
                    this.sy = sy;
                }
                SpriteRenderer.prototype.render = function (coreSet, color, adj) {
                    var _a = this, sx = _a.sx, sy = _a.sy;
                    var can = document.createElement('canvas');
                    can.width = 24 * sx;
                    can.height = 21 * sx;
                    var ctx = (can).getContext('2d');
                    var id = ctx.createImageData(24 * sx, 21 * sy);
                    var data = id.data;
                    for (var i = 0; i < 21; ++i) {
                        for (var j = 0; j < 24; ++j) {
                            var set = isSet(coreSet, stencil[i][j], adj);
                            var col = set ? color : [0, 0, 0, 0];
                            for (var si = 0; si < sy; ++si) {
                                for (var sj = 0; sj < sx; ++sj) {
                                    var index = ((sy * i + si) * 24 * sx + sx * j + sj) * 4;
                                    data[index] = col[0];
                                    data[index + 1] = col[1];
                                    data[index + 2] = col[2];
                                    data[index + 3] = col.length > 3 ? col[3] : 255;
                                }
                            }
                        }
                    }
                    ctx.putImageData(id, 0, 0);
                    return can;
                };
                return SpriteRenderer;
            }());
            exports_5("SpriteRenderer", SpriteRenderer);
            isSet = function (v, p, n) {
                return (v && p === 7)
                    || (((v && n[5]) || (v && n[0]) || (n[5] && n[0])) && p === 1)
                    || (((v && n[0]) || (v && n[1]) || (n[0] && n[1])) && p === 2)
                    || (((v && n[1]) || (v && n[2]) || (n[1] && n[2])) && p === 3)
                    || (((v && n[2]) || (v && n[3]) || (n[2] && n[3])) && p === 4)
                    || (((v && n[3]) || (v && n[4]) || (n[3] && n[4])) && p === 5)
                    || (((v && n[4]) || (v && n[5]) || (n[4] && n[5])) && p === 6);
            };
        }
    };
});
System.register("hexdraw/src/palette", [], function (exports_6, context_6) {
    "use strict";
    var Palette;
    var __moduleName = context_6 && context_6.id;
    function rgb(color) {
        return '#' + color.map(function (c) { return c.toString(16).padStart(2, '0'); }).join('');
    }
    exports_6("rgb", rgb);
    return {
        setters: [],
        execute: function () {
            Palette = (function () {
                function Palette(bg, secondary, primary, accent) {
                    this.bg = bg;
                    this.secondary = secondary;
                    this.primary = primary;
                    this.accent = accent;
                }
                return Palette;
            }());
            exports_6("Palette", Palette);
        }
    };
});
System.register("hexdraw/src/world-renderer", ["hexdraw/src/palette"], function (exports_7, context_7) {
    "use strict";
    var palette_1, WorldRenderer, getHexPos;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (palette_1_1) {
                palette_1 = palette_1_1;
            }
        ],
        execute: function () {
            WorldRenderer = (function () {
                function WorldRenderer(ctx, background, ox, oy, sx, sy) {
                    this.ctx = ctx;
                    this.background = background;
                    this.ox = ox;
                    this.oy = oy;
                    this.sx = sx;
                    this.sy = sy;
                }
                WorldRenderer.prototype.render = function (i, j, sprite) {
                    var _a = getHexPos(i, j), hj = _a[0], hi = _a[1];
                    var _b = this, ox = _b.ox, oy = _b.oy, sx = _b.sx, sy = _b.sy;
                    this.ctx.drawImage(sprite, ox + hj * sx, oy + hi * sy);
                };
                WorldRenderer.prototype.clear = function () {
                    var ctx = this.ctx;
                    var can = ctx.canvas;
                    ctx.fillStyle = palette_1.rgb(this.background);
                    ctx.fillRect(0, 0, can.width, can.height);
                };
                return WorldRenderer;
            }());
            exports_7("WorldRenderer", WorldRenderer);
            exports_7("getHexPos", getHexPos = function (i, j) { return [j * 20 - i * 4 - (j / 2 | 0) * 4, i * 19 - (j % 2) * 5 + (j / 2 | 0) * 9]; });
        }
    };
});
System.register("lib/util", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    function rnd(min, max) {
        if (typeof max === 'number' && typeof min === 'number')
            return Math.floor(min + Math.random() * (max - min));
        if (typeof min === 'number')
            return Math.floor(min * Math.random());
        if (min instanceof Array)
            return min[Math.floor(min.length * Math.random())];
        return Math.random();
    }
    exports_8("rnd", rnd);
    function array(w, h, fn) {
        var res = [];
        for (var i = 0; i < h; ++i) {
            var row = [];
            for (var j = 0; j < w; ++j)
                row.push(fn(i, j));
            res.push(row);
        }
        return res;
    }
    exports_8("array", array);
    function shuffle(a) {
        var _a;
        for (var i = a.length - 1; i > 0; --i) {
            var idx = rnd(i + 1);
            _a = [a[idx], a[i]], a[i] = _a[0], a[idx] = _a[1];
        }
    }
    exports_8("shuffle", shuffle);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("hexdraw/src/world", ["lib/util"], function (exports_9, context_9) {
    "use strict";
    var util_1, Cell, World, collectAdjacency, isSolid, getAdj;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (util_1_1) {
                util_1 = util_1_1;
            }
        ],
        execute: function () {
            Cell = (function () {
                function Cell(value, color) {
                    this.value = value;
                    this.color = color;
                    this.sprite = null;
                }
                return Cell;
            }());
            World = (function () {
                function World(w, h, palette, sr, wr) {
                    var _this = this;
                    this.w = w;
                    this.h = h;
                    this.palette = palette;
                    this.wr = wr;
                    var data = this.data = util_1.array(w, h, function (i, j) {
                        var cell = new Cell((j === 0 || j === w - 1 || (i === 0 && j % 2 === 1) || i === h - 1 && !!(j % 2)) ? 0 : Math.random() < .7 ? 1 : 0, _this.palette.secondary);
                        return cell;
                    });
                    var overflow = 0;
                    while (1) {
                        var i = util_1.rnd(h);
                        var j = util_1.rnd(w / 2);
                        var k = h - i - 1;
                        var l = w - j - 1;
                        if (i >= 0 && i < h && j >= 0 && j < w && k >= 0 && k < h && l >= 0 && l < w && data[i][j].value && data[k][l].value) {
                            data[i][j].color = this.palette.primary;
                            data[k][l].color = this.palette.accent;
                            break;
                        }
                        if (++overflow > 100)
                            throw new Error("Failed to place source and destination");
                    }
                    for (var i = 0; i < this.data.length; ++i)
                        for (var j = 0; j < this.data[i].length; ++j) {
                            var cell = this.data[i][j];
                            var adjs = collectAdjacency(this.data, i, j, cell.value);
                            cell.sprite = sr.render(cell.value != 0, cell.color, adjs);
                        }
                }
                World.prototype.render = function () {
                    this.wr.clear();
                    for (var i = 0; i < this.data.length; ++i)
                        for (var j = 0; j < this.data[i].length; ++j) {
                            var cell = this.data[i][j];
                            if (cell.sprite != null)
                                this.wr.render(i, j, cell.sprite);
                        }
                };
                return World;
            }());
            exports_9("World", World);
            collectAdjacency = function (data, i, j, value) {
                return [
                    isSolid(getAdj(data, 0, i, j)),
                    isSolid(getAdj(data, 1, i, j)),
                    isSolid(getAdj(data, 2, i, j)),
                    isSolid(getAdj(data, 3, i, j)),
                    isSolid(getAdj(data, 4, i, j)),
                    isSolid(getAdj(data, 5, i, j))
                ];
            };
            isSolid = function (adj) {
                return adj !== null && adj.value != 0;
            };
            getAdj = function (data, n, i, j) {
                var ni = i, nj = j;
                switch (n) {
                    case 0:
                        ni -= 1;
                        break;
                    case 1:
                        ni -= j % 2 ? 1 : 0;
                        nj += 1;
                        break;
                    case 2:
                        ni += j % 2 ? 0 : 1;
                        nj += 1;
                        break;
                    case 3:
                        ni += 1;
                        break;
                    case 4:
                        ni += j % 2 ? 0 : 1;
                        nj -= 1;
                        break;
                    case 5:
                        ni -= j % 2 ? 1 : 0;
                        nj -= 1;
                        break;
                }
                return ni >= 0 && nj >= 0 && ni < data.length && nj < data[ni].length ? data[ni][nj] : null;
            };
        }
    };
});
System.register("hexdraw/src/main", ["lib/canvas", "hexdraw/src/sprite-renderer", "hexdraw/src/world-renderer", "hexdraw/src/world", "hexdraw/src/palette"], function (exports_10, context_10) {
    "use strict";
    var canvas_1, sprite_renderer_1, world_renderer_1, world_1, palette_2, main;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            },
            function (sprite_renderer_1_1) {
                sprite_renderer_1 = sprite_renderer_1_1;
            },
            function (world_renderer_1_1) {
                world_renderer_1 = world_renderer_1_1;
            },
            function (world_1_1) {
                world_1 = world_1_1;
            },
            function (palette_2_1) {
                palette_2 = palette_2_1;
            }
        ],
        execute: function () {
            exports_10("main", main = function () {
                var _a = [3, 2], sx = _a[0], sy = _a[1];
                var _b = [30, 20], w = _b[0], h = _b[1];
                var ctx = canvas_1.fullscreenCanvas();
                var _c = world_renderer_1.getHexPos(h / 2, w / 2), ox = _c[0], oy = _c[1];
                var palette = new palette_2.Palette([0x00, 0x36, 0x38], [0x05, 0x50, 0x52], [0x53, 0xB8, 0xBB], [0xF3, 0xF2, 0xC9]);
                var world = new world_1.World(w, h, palette, new sprite_renderer_1.SpriteRenderer(sx, sy), new world_renderer_1.WorldRenderer(ctx, palette.bg, ctx.canvas.width / 2 - ox * sx, ctx.canvas.height / 2 - oy * sy, sx, sy));
                world.render();
            });
        }
    };
});
//# sourceMappingURL=bundle.js.map