System.register("elo/src/lib/canvas", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function fullscreenCanvas(relative) {
        if (relative === void 0) { relative = false; }
        var can = getCanvas(relative);
        var ctx = can.getContext('2d');
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
System.register("gl/src/loop", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Loop;
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
                    if (this.isRunning)
                        return;
                    var state = this.init();
                    this.isRunning = true;
                    this.update(0, state, true);
                };
                Loop.prototype.stop = function () {
                    this.isRunning = false;
                };
                Loop.prototype.update = function (delta, state, force) {
                    var _this = this;
                    if (force === void 0) { force = false; }
                    if (!this.isRunning)
                        return;
                    var time = new Date().getTime();
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
                    requestAnimationFrame(function () { return _this.update(new Date().getTime() - time, newState); });
                };
                return Loop;
            }());
            exports_2("Loop", Loop);
        }
    };
});
System.register("hexflow/src/supercell", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Point, sq, HexPos, Supercell;
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
            exports_3("Point", Point);
            sq = Math.sqrt(3) / 2;
            HexPos = (function () {
                function HexPos(i, j) {
                    this.i = i;
                    this.j = j;
                }
                HexPos.prototype.add = function (i, j) {
                    return new HexPos(this.i + i, this.j + j);
                };
                HexPos.prototype.toPoint = function () {
                    return new Point(this.j * sq, this.i - this.j / 2);
                };
                return HexPos;
            }());
            exports_3("HexPos", HexPos);
            Supercell = (function () {
                function Supercell(pos, rank) {
                    this.pos = pos;
                    this.rank = rank;
                }
                Object.defineProperty(Supercell.prototype, "corners", {
                    get: function () {
                        var r = this.rank;
                        return [
                            new HexPos(2 * r, r - 1),
                            new HexPos(2 * r, r),
                            new HexPos(r, 2 * r),
                            new HexPos(r - 1, 2 * r),
                            new HexPos(1 - r, r + 1),
                            new HexPos(-r, r),
                            new HexPos(-2 * r, -r),
                            new HexPos(-2 * r, -r - 1),
                            new HexPos(-r - 1, -2 * r),
                            new HexPos(-r, -2 * r),
                            new HexPos(r, -r),
                            new HexPos(r + 1, 1 - r),
                        ];
                    },
                    enumerable: true,
                    configurable: true
                });
                Supercell.prototype.contains = function (point) {
                    var x = point.j - this.pos.j;
                    var y = point.i - this.pos.i;
                    var a = this.rank * 3 + 1;
                    var b = this.rank * 3;
                    var leftup = 2 * x + b;
                    var top = (x + a) / 2;
                    var rightup = b - x;
                    var rightdown = 2 * x - a;
                    var bottom = (x - b) / 2;
                    var leftdown = -x - a;
                    return leftup >= y && top >= y && rightup >= y && rightdown <= y && bottom <= y && leftdown <= y;
                };
                return Supercell;
            }());
            exports_3("Supercell", Supercell);
        }
    };
});
System.register("hexflow/src/cellstore", ["hexflow/src/supercell"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var supercell_1, makeArray, CellStore;
    return {
        setters: [
            function (supercell_1_1) {
                supercell_1 = supercell_1_1;
            }
        ],
        execute: function () {
            makeArray = function (corners, array, initFn) {
                var min = Math.min;
                var max = Math.max;
                var minmax = corners.reduce(function (aggr, corner) {
                    return aggr == null
                        ? { min: corner, max: corner }
                        : {
                            min: new supercell_1.HexPos(min(aggr.min.i, corner.i), min(aggr.min.j, corner.j)),
                            max: new supercell_1.HexPos(max(aggr.max.i, corner.i), max(aggr.max.j, corner.j))
                        };
                }, null);
                var n = minmax.max.i - minmax.min.i + 1;
                var m = minmax.max.j - minmax.min.j + 1;
                for (var i = 0; i < n; ++i) {
                    var row = [];
                    for (var j = 0; j < m; ++j)
                        row.push(initFn(new supercell_1.HexPos(i + minmax.min.i, j + minmax.min.j)));
                    array.push(row);
                }
                return new supercell_1.HexPos(-minmax.min.j, -minmax.min.i);
            };
            CellStore = (function () {
                function CellStore(data, storeOrigin) {
                    this.storeOrigin = storeOrigin;
                    this.h = data.length;
                    this.w = data[0].length;
                    this.current = data;
                    this.next = [];
                    for (var i = 0; i < this.h; ++i) {
                        var row = [];
                        for (var j = 0; j < this.w; ++j) {
                            row.push(data[i][j]);
                        }
                        this.next.push(row);
                    }
                }
                CellStore.Create = function (corners, initFn) {
                    var data = [];
                    var storeOrigin = makeArray(corners, data, initFn);
                    return new CellStore(data, storeOrigin);
                };
                CellStore.prototype.forEach = function (callback) {
                    var data = this.current;
                    for (var i = 0; i < this.h; ++i) {
                        for (var j = 0; j < this.w; ++j) {
                            var d = data[i][j];
                            if (d != null)
                                callback(new supercell_1.HexPos(i - this.storeOrigin.i, j - this.storeOrigin.j), d);
                        }
                    }
                };
                CellStore.prototype.update = function (cloneFn, callback) {
                    var prev = this.current;
                    var next = this.next;
                    for (var i = 0; i < this.h; ++i) {
                        for (var j = 0; j < this.w; ++j) {
                            var d = prev[i][j];
                            next[i][j] = d == null ? null : cloneFn(d);
                        }
                    }
                    for (var i = 0; i < this.h; ++i) {
                        for (var j = 0; j < this.w; ++j) {
                            var d = prev[i][j];
                            if (d != null)
                                callback(new supercell_1.HexPos(i - this.storeOrigin.i, j - this.storeOrigin.j), prev[i][j], next[i][j], this.prevGetter.bind(this), this.nextGetter.bind(this));
                        }
                    }
                    this.next = prev;
                    this.current = next;
                };
                CellStore.prototype.prevGetter = function (pos) {
                    var i = pos.i + this.storeOrigin.i;
                    var j = pos.j + this.storeOrigin.j;
                    return i >= 0 && j >= 0 && i < this.h && j < this.w ? this.current[i][j] : null;
                };
                CellStore.prototype.nextGetter = function (pos) {
                    var i = pos.i + this.storeOrigin.i;
                    var j = pos.j + this.storeOrigin.j;
                    return i >= 0 && j >= 0 && i < this.h && j < this.w ? this.next[i][j] : null;
                };
                return CellStore;
            }());
            exports_4("CellStore", CellStore);
        }
    };
});
System.register("pellets/src/util", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    function rnd(min, max) {
        if (typeof max === 'number' && typeof min === 'number')
            return Math.floor(min + Math.random() * (max - min));
        if (typeof min === 'number')
            return Math.floor(min * Math.random());
        if (min instanceof Array)
            return min[Math.floor(min.length * Math.random())];
        throw new Error('invalid set of arguments to rnd');
    }
    exports_5("rnd", rnd);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("elo/src/lib/color", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
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
    exports_6("hcy", hcy);
    function tuple2rgb(r, g, b, a) {
        return 'rgba(' + (r * 255).toFixed(0) + ',' + (g * 255).toFixed(0) + ',' + (b * 255).toFixed(0) + ', ' + a + ')';
    }
    function hcy2rgb(h, c, y, a) {
        if (a === void 0) { a = 1; }
        var rgbdata = hcy(h, c, y);
        return tuple2rgb(rgbdata[0], rgbdata[1], rgbdata[2], a || 1);
    }
    exports_6("hcy2rgb", hcy2rgb);
    function rgbdata2rgb(t, a) {
        if (t.length == 3)
            return tuple2rgb(t[0], t[1], t[2], a === undefined ? 1 : a);
        return tuple2rgb(t[0], t[1], t[2], t[3]);
    }
    exports_6("rgbdata2rgb", rgbdata2rgb);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("pellets/src/world", ["hexflow/src/cellstore", "hexflow/src/supercell", "pellets/src/util", "elo/src/lib/color"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    function bucketData(w, h) {
        var a = [];
        var ox = (w / 2) | 0;
        var numrows = ((h - 1) || 1) + (w - 1) / 2;
        var oy = ((numrows - 1) / 2) | 0;
        for (var i = 0; i < numrows; ++i) {
            var row = [];
            for (var j = 0; j < w; ++j) {
                if (i < (j - 1) / 2 || i > (j - 1) / 2 + h - 1)
                    row.push(null);
                else
                    row.push(new Cell(util_1.rnd(types)));
            }
            a.push(row);
        }
        return new cellstore_1.CellStore(a, new supercell_2.HexPos(oy, ox));
    }
    var cellstore_1, supercell_2, util_1, color_1, red, blue, green, yellow, orange, silver, types, Cell, World;
    return {
        setters: [
            function (cellstore_1_1) {
                cellstore_1 = cellstore_1_1;
            },
            function (supercell_2_1) {
                supercell_2 = supercell_2_1;
            },
            function (util_1_1) {
                util_1 = util_1_1;
            },
            function (color_1_1) {
                color_1 = color_1_1;
            }
        ],
        execute: function () {
            exports_7("red", red = { color: color_1.hcy(0, 1, .3) });
            exports_7("blue", blue = { color: color_1.hcy(230, 1, .4) });
            exports_7("green", green = { color: color_1.hcy(130, 1, .5) });
            exports_7("yellow", yellow = { color: color_1.hcy(35, 1, .7) });
            exports_7("orange", orange = { color: color_1.hcy(50, 1, .8) });
            exports_7("silver", silver = { color: color_1.hcy(130, 0, .8) });
            exports_7("types", types = [red, blue, green, yellow, orange, silver]);
            Cell = (function () {
                function Cell(type) {
                    this.type = type;
                }
                return Cell;
            }());
            exports_7("Cell", Cell);
            World = (function () {
                function World() {
                    var w = 9;
                    var h = 5;
                    this.store = bucketData(w, h);
                }
                return World;
            }());
            exports_7("World", World);
        }
    };
});
System.register("pellets/src/render", ["elo/src/lib/color"], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var color_2, Renderer;
    return {
        setters: [
            function (color_2_1) {
                color_2 = color_2_1;
            }
        ],
        execute: function () {
            Renderer = (function () {
                function Renderer(ctx) {
                    this.ctx = ctx;
                }
                Renderer.prototype.clear = function () {
                    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                };
                Renderer.prototype.render = function (world) {
                    var ctx = this.ctx;
                    var s = 10;
                    world.store.forEach(function (pos, cell) {
                        var point = pos.toPoint().times(s, -s).plus(ctx.canvas.width / 2, ctx.canvas.height / 2);
                        ctx.fillStyle = color_2.rgbdata2rgb(cell.type.color);
                        ctx.fillCircle(point.x, point.y, s / 2);
                    });
                    ctx.fillStyle = 'black';
                    ctx.save();
                    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
                    ctx.fillRect(-100, 0, 200, 1);
                    ctx.fillRect(0, -100, 1, 200);
                    ctx.restore();
                };
                return Renderer;
            }());
            exports_8("Renderer", Renderer);
        }
    };
});
System.register("pellets/src/main", ["elo/src/lib/canvas", "gl/src/loop", "pellets/src/render", "pellets/src/world"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    function init() {
        return {
            renderer: new render_1.Renderer(canvas_1.fullscreenCanvas()),
            world: new world_1.World()
        };
    }
    function fixedUpdate(delta, state) {
        return state;
    }
    function variableUpdate(delta, state) {
        state.renderer.clear();
        state.renderer.render(state.world);
    }
    var canvas_1, loop_1, render_1, world_1, main;
    return {
        setters: [
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            },
            function (loop_1_1) {
                loop_1 = loop_1_1;
            },
            function (render_1_1) {
                render_1 = render_1_1;
            },
            function (world_1_1) {
                world_1 = world_1_1;
            }
        ],
        execute: function () {
            exports_9("main", main = function () {
                var loop = new loop_1.Loop(200, init, fixedUpdate, variableUpdate);
                loop.start();
            });
        }
    };
});
//# sourceMappingURL=bundle.js.map