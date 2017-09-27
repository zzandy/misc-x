var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
System.register("pellets/src/color", ["lib/canvas", "lib/color"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function renderWheel(ctx, r, t, colorFn) {
        var steps = 360;
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
            ctx.fillStyle = colorFn(i * 360 / steps, 1, .5);
            ctx.fill();
        }
    }
    function wheelColor(h, c, y, a) {
        var h2 = h < 180 ? 2 * h / 3 : 120 + (h - 180) * 4 / 3;
        return color_1.hcy2rgb(h2, c, y, a);
    }
    function wheelHsl(h, s, l) {
        var h2 = h < 180 ? 2 * h / 3 : 120 + (h - 180) * 4 / 3;
        return 'hsl(' + h2 + ', ' + s * 100 + '%, ' + l * 100 + '%)';
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
                ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
                var r = 200;
                var t = .2;
                renderWheel(ctx, r, t, color_1.hcy2rgb);
                renderWheel(ctx, r * .7, t * 2, wheelColor);
                renderWheel(ctx, r * .4, t * 3, wheelHsl);
            });
        }
    };
});
System.register("lib/loop", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
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
            exports_4("Loop", Loop);
        }
    };
});
System.register("lib/geometry", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var Point, Rect, Range;
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
            exports_5("Point", Point);
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
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Rect.prototype, "vertical", {
                    get: function () {
                        return new Range(this.y, this.h);
                    },
                    enumerable: true,
                    configurable: true
                });
                return Rect;
            }(Point));
            exports_5("Rect", Rect);
            Range = (function () {
                function Range(start, length) {
                    this.start = start;
                    this.length = length;
                }
                Object.defineProperty(Range.prototype, "end", {
                    get: function () {
                        return this.start + this.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Range;
            }());
            exports_5("Range", Range);
        }
    };
});
System.register("lib/supercell", ["lib/geometry"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var geometry_1, sq, HexPos, Supercell;
    return {
        setters: [
            function (geometry_1_1) {
                geometry_1 = geometry_1_1;
            }
        ],
        execute: function () {
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
                    return new geometry_1.Point(this.j * sq, this.i - this.j / 2);
                };
                HexPos.fromPoint = function (p) {
                    var j = (p.x / sq) | 0;
                    return new HexPos((p.y + (j / 2) | 0) | 0, j);
                };
                return HexPos;
            }());
            exports_6("HexPos", HexPos);
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
            exports_6("Supercell", Supercell);
        }
    };
});
System.register("lib/cellstore", ["lib/supercell"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
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
                                callback(new supercell_1.HexPos(i - this.storeOrigin.i, j - this.storeOrigin.j), prev[i][j], next[i][j], this.get.bind(this), this.nextGetter.bind(this));
                        }
                    }
                    this.next = prev;
                    this.current = next;
                };
                CellStore.prototype.get = function (pos) {
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
            exports_7("CellStore", CellStore);
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
        throw new Error('invalid set of arguments to rnd');
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
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("pellets/src/world", ["lib/cellstore", "lib/supercell", "lib/util", "lib/color"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
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
    var cellstore_1, supercell_2, util_1, color_2, red, blue, green, yellow, orange, silver, violet, types, Cell, World;
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
            function (color_2_1) {
                color_2 = color_2_1;
            }
        ],
        execute: function () {
            exports_9("red", red = { color: color_2.wheelHcy(0, 1, .25) });
            exports_9("blue", blue = { color: color_2.wheelHcy(240, 1, .35) });
            exports_9("green", green = { color: color_2.wheelHcy(180, 1, .45) });
            exports_9("yellow", yellow = { color: color_2.wheelHcy(90, 1, .8) });
            exports_9("orange", orange = { color: color_2.wheelHcy(45, 1, .5) });
            exports_9("silver", silver = { color: color_2.wheelHcy(90, .1, .9) });
            exports_9("violet", violet = { color: color_2.wheelHcy(305, 1, .5) });
            exports_9("types", types = [red, blue, green, yellow, orange, silver, violet]);
            Cell = (function () {
                function Cell(type) {
                    this.type = type;
                }
                return Cell;
            }());
            exports_9("Cell", Cell);
            World = (function () {
                function World(w, h) {
                    this.store = bucketData(w, h);
                }
                World.prototype.beginDrag = function (point) {
                    var pos = supercell_2.HexPos.fromPoint(point);
                    console.log(pos, this.store.get(pos));
                    if (this.store.get(pos) != null)
                        this.dragStart = pos;
                    else
                        this.dragStart = this.dragEnd = null;
                };
                World.prototype.endDrag = function (point) {
                    var pos = supercell_2.HexPos.fromPoint(point);
                    if (this.store.get(pos) != null)
                        this.dragEnd = pos;
                    else
                        this.dragStart = this.dragEnd = null;
                };
                World.prototype.update = function (delta) {
                };
                return World;
            }());
            exports_9("World", World);
        }
    };
});
System.register("pellets/src/render", ["lib/color"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var color_3, Renderer;
    return {
        setters: [
            function (color_3_1) {
                color_3 = color_3_1;
            }
        ],
        execute: function () {
            Renderer = (function () {
                function Renderer(ctx, size) {
                    this.ctx = ctx;
                    this.size = size;
                }
                Renderer.prototype.clear = function () {
                    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                };
                Renderer.prototype.mapPoint = function (p) {
                    var ctx = this.ctx;
                    var s = this.size;
                    return p.plus(-ctx.canvas.width / 2, -ctx.canvas.height / 2).times(1 / s, -1 / s);
                };
                Renderer.prototype.render = function (world, cursor) {
                    var ctx = this.ctx;
                    var s = this.size;
                    world.store.forEach(function (pos, cell) {
                        var point = pos.toPoint().times(s, -s).plus(ctx.canvas.width / 2, ctx.canvas.height / 2);
                        ctx.fillStyle = color_3.rgbdata2rgb(cell.type.color);
                        if (world.dragStart != null && world.dragStart.i == pos.i && world.dragStart.j == pos.j)
                            ctx.fillStyle = 'grey';
                        ctx.fillCircle(point.x, point.y, s / 2);
                        if (cursor != null) {
                            ctx.fillStyle = 'rgba(255, 255, 255, .3)';
                            var dx = cursor.x - point.x;
                            var dy = cursor.y - point.y;
                            var d = Math.sqrt(dx * dx + dy * dy);
                            var q = d / (d + 101);
                            ctx.fillCircle(point.x + q * dx / d * s / 2, point.y + q * dy / d * s / 2, s / 10);
                        }
                    });
                    if (cursor != null) {
                        ctx.fillStyle = 'white';
                        ctx.fillRect(cursor.x - 10, cursor.y, 20, 1);
                        ctx.fillRect(cursor.x, cursor.y - 10, 1, 20);
                    }
                };
                return Renderer;
            }());
            exports_10("Renderer", Renderer);
        }
    };
});
System.register("pellets/src/main", ["lib/canvas", "lib/loop", "pellets/src/render", "pellets/src/world", "lib/geometry"], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    function init() {
        var ctx = canvas_2.fullscreenCanvas(false, true);
        var cursor = {
            position: null,
            updated: false,
            down: null,
            up: null
        };
        var state = {
            renderer: new render_1.Renderer(ctx, 50),
            world: new world_1.World(9, 9),
            cursor: cursor,
        };
        ctx.canvas.addEventListener('mousemove', function (e) {
            cursor.position = new geometry_2.Point(e.clientX, e.clientY);
            cursor.down = new geometry_2.Point(e.clientX, e.clientY);
        });
        ctx.canvas.addEventListener('mousedown', function (e) {
            cursor.down = new geometry_2.Point(e.clientX, e.clientY);
        });
        ctx.canvas.addEventListener('mouseup', function (e) {
            cursor.up = new geometry_2.Point(e.clientX, e.clientY);
        });
        return state;
    }
    function fixedUpdate(delta, state) {
        if (state.cursor.down != null)
            state.world.beginDrag(state.renderer.mapPoint(state.cursor.down));
        if (state.cursor.up != null)
            state.world.endDrag(state.renderer.mapPoint(state.cursor.up));
        state.world.update(delta);
        state.cursor.updated = false;
        state.cursor.down = null;
        state.cursor.up = null;
        return state;
    }
    function variableUpdate(delta, state) {
        state.renderer.clear();
        state.renderer.render(state.world, state.cursor.position);
    }
    var canvas_2, loop_1, render_1, world_1, geometry_2, main;
    return {
        setters: [
            function (canvas_2_1) {
                canvas_2 = canvas_2_1;
            },
            function (loop_1_1) {
                loop_1 = loop_1_1;
            },
            function (render_1_1) {
                render_1 = render_1_1;
            },
            function (world_1_1) {
                world_1 = world_1_1;
            },
            function (geometry_2_1) {
                geometry_2 = geometry_2_1;
            }
        ],
        execute: function () {
            exports_11("main", main = function () {
                var loop = new loop_1.Loop(16, init, fixedUpdate, variableUpdate);
                loop.start();
            });
        }
    };
});
//# sourceMappingURL=bundle.js.map