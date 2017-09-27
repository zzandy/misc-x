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
System.register("lib/geometry", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
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
                    enumerable: true,
                    configurable: true
                });
                return Range;
            }());
            exports_2("Range", Range);
        }
    };
});
System.register("lib/supercell", ["lib/geometry"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
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
System.register("lib/cellstore", ["lib/supercell"], function (exports_4, context_4) {
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
            exports_4("CellStore", CellStore);
        }
    };
});
System.register("hexflow/src/cellrender", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var q, CellRender;
    return {
        setters: [],
        execute: function () {
            q = 1 / Math.sqrt(3);
            CellRender = (function () {
                function CellRender(cellsize) {
                    this.cellsize = cellsize;
                }
                CellRender.prototype.render = function (ctx, cells) {
                    var _this = this;
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    cells.forEach(function (pos, value) { return _this.renderCell(ctx, pos, value); });
                };
                CellRender.prototype.renderCell = function (ctx, pos, value) {
                    var s = this.cellsize;
                    var _a = this.getScreen(ctx, pos), x = _a.x, y = _a.y;
                    ctx.fillStyle = this.getCellColor(value);
                    this.fillHex(ctx, x, y, s);
                };
                CellRender.prototype.getScreen = function (ctx, pos) {
                    var s = this.cellsize;
                    var q = .95;
                    return pos.toPoint().times(s * q, -s * q).plus(ctx.canvas.width / 2, ctx.canvas.height / 2);
                };
                CellRender.prototype.fillHex = function (ctx, x, y, s) {
                    ctx.save();
                    ctx.translate(x, y);
                    var dx = q * s / 2;
                    var dy = s / 2;
                    ctx.beginPath();
                    ctx.moveTo(2 * dx, 0);
                    ctx.lineTo(dx, -dy);
                    ctx.lineTo(-dx, -dy);
                    ctx.lineTo(-2 * dx, 0);
                    ctx.lineTo(-dx, dy);
                    ctx.lineTo(dx, dy);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                };
                return CellRender;
            }());
            exports_5("CellRender", CellRender);
        }
    };
});
System.register("hexflow/src/hexvec", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var HexDir, HexVec;
    return {
        setters: [],
        execute: function () {
            (function (HexDir) {
                HexDir[HexDir["up"] = 0] = "up";
                HexDir[HexDir["upRight"] = 1] = "upRight";
                HexDir[HexDir["downRight"] = 2] = "downRight";
                HexDir[HexDir["down"] = 3] = "down";
                HexDir[HexDir["downLeft"] = 4] = "downLeft";
                HexDir[HexDir["upLeft"] = 5] = "upLeft";
            })(HexDir || (HexDir = {}));
            exports_6("HexDir", HexDir);
            HexVec = (function () {
                function HexVec(value) {
                    this.value = value;
                }
                HexVec.prototype.add = function (dir, value) {
                    return new HexVec(HexVec.resolve(this.value.map(function (v, i) { return i == dir ? v + value : v; })));
                };
                HexVec.resolve = function (a) {
                    for (var d = 0; d < 6; ++d) {
                        var e = (d + 2) % 6;
                        var c = (d + 1) % 6;
                        var min = Math.min(a[d], a[e]);
                        a[d] -= min;
                        a[e] -= min;
                        a[c] += min;
                    }
                    for (var _i = 0, _a = [HexDir.up, HexDir.upRight, HexDir.downRight]; _i < _a.length; _i++) {
                        var d = _a[_i];
                        var min = Math.min(a[d], a[(d + 3) % 6]);
                        a[d] -= min;
                        a[(d + 3) % 6] -= min;
                    }
                    return a;
                };
                HexVec.empty = new HexVec([0, 0, 0, 0, 0, 0]);
                return HexVec;
            }());
            exports_6("HexVec", HexVec);
        }
    };
});
System.register("gl/src/loop", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
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
            exports_7("Loop", Loop);
        }
    };
});
System.register("lib/color", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
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
    exports_8("hcy", hcy);
    function wheelHcy(h, c, y) {
        var h2 = h < 180 ? 2 * h / 3 : 120 + (h - 180) * 4 / 3;
        return hcy(h2, c, y);
    }
    exports_8("wheelHcy", wheelHcy);
    function wheel2rgb(h, c, y, a) {
        if (a === void 0) { a = 1; }
        var rgbdata = wheelHcy(h, c, y);
        return tuple2rgb(rgbdata[0], rgbdata[1], rgbdata[2], a || 1);
    }
    exports_8("wheel2rgb", wheel2rgb);
    function tuple2rgb(r, g, b, a) {
        return 'rgba(' + (r * 255).toFixed(0) + ',' + (g * 255).toFixed(0) + ',' + (b * 255).toFixed(0) + ', ' + a + ')';
    }
    function hcy2rgb(h, c, y, a) {
        if (a === void 0) { a = 1; }
        var rgbdata = hcy(h, c, y);
        return tuple2rgb(rgbdata[0], rgbdata[1], rgbdata[2], a || 1);
    }
    exports_8("hcy2rgb", hcy2rgb);
    function rgbdata2rgb(t, a) {
        if (t.length == 3)
            return tuple2rgb(t[0], t[1], t[2], a === undefined ? 1 : a);
        return tuple2rgb(t[0], t[1], t[2], t[3]);
    }
    exports_8("rgbdata2rgb", rgbdata2rgb);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("hexflow/src/main", ["lib/canvas", "gl/src/loop", "lib/cellstore", "lib/supercell", "hexflow/src/cellrender", "lib/color", "hexflow/src/hexvec"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    function clone(c) {
        return { value: c.value, vector: new hexvec_1.HexVec(c.vector.value) };
    }
    function targetDemand(source, dir, target) {
        return source.value + source.vector.value[dir] - target.value - target.vector.value[(dir + 3) % 6];
    }
    function update(pos, oldCell, newCell, oldGet, newGet) {
        var log = (pos.i == 0 && pos.j == 1) || (pos.i == 0 && pos.j == 0);
        var v = oldCell.value;
        g += oldCell.value;
        var adj = (surround(pos, oldGet).filter(function (a) { return a.cell != null; }));
        var clients = adj.filter(function (a) { return targetDemand(oldCell, a.dir, a.cell) > 0; });
        if (clients.length > 0) {
            var totalDemand = clients.reduce(function (s, a) { return s + targetDemand(oldCell, a.dir, a.cell); }, 0);
            var minLevel = 0;
            var totalProduct_1 = v - minLevel;
            var k_1 = totalDemand > totalProduct_1 ? totalProduct_1 / totalDemand : 1;
            clients
                .sort(function (a, b) { return a.cell.value - b.cell.value; })
                .forEach(function (a) {
                var take = Math.min(totalProduct_1, Math.round(k_1 * targetDemand(oldCell, a.dir, a.cell)));
                var target = newGet(a.pos);
                target.value += take;
                target.vector = target.vector.add(a.dir, take);
                newCell.value -= take;
                newCell.vector = newCell.vector.add(a.dir, -take);
                totalProduct_1 -= take;
            });
        }
        if (log)
            console.log(pos.i, pos.j, newCell.value, newCell.vector.value.join(';'));
    }
    function surround(pos, getter) {
        return [
            { dir: hexvec_1.HexDir.up, pos: pos.add(0, 1), cell: getter(pos.add(0, 1)) },
            { dir: hexvec_1.HexDir.upRight, pos: pos.add(1, 1), cell: getter(pos.add(1, 1)) },
            { dir: hexvec_1.HexDir.downRight, pos: pos.add(1, 0), cell: getter(pos.add(1, 0)) },
            { dir: hexvec_1.HexDir.down, pos: pos.add(0, -1), cell: getter(pos.add(0, -1)) },
            { dir: hexvec_1.HexDir.downLeft, pos: pos.add(-1, -1), cell: getter(pos.add(-1, -1)) },
            { dir: hexvec_1.HexDir.upLeft, pos: pos.add(-1, 0), cell: getter(pos.add(-1, 0)) },
        ];
    }
    var canvas_1, loop_1, cellstore_1, supercell_2, cellrender_1, color_1, hexvec_1, Cell, g, main, colors, XCellRender;
    return {
        setters: [
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            },
            function (loop_1_1) {
                loop_1 = loop_1_1;
            },
            function (cellstore_1_1) {
                cellstore_1 = cellstore_1_1;
            },
            function (supercell_2_1) {
                supercell_2 = supercell_2_1;
            },
            function (cellrender_1_1) {
                cellrender_1 = cellrender_1_1;
            },
            function (color_1_1) {
                color_1 = color_1_1;
            },
            function (hexvec_1_1) {
                hexvec_1 = hexvec_1_1;
            }
        ],
        execute: function () {
            Cell = (function () {
                function Cell() {
                }
                return Cell;
            }());
            g = 0;
            exports_9("main", main = function () {
                var ctx = canvas_1.fullscreenCanvas();
                var render = new XCellRender(10);
                var init = function () {
                    var cell = new supercell_2.Supercell(new supercell_2.HexPos(0, 0), 13);
                    var makeCell = function (pos) {
                        if (!cell.contains(pos))
                            return null;
                        var n = pos.i == 0 && pos.j == 0 ? 3000000 : 0;
                        return { value: n, vector: hexvec_1.HexVec.empty };
                    };
                    var storage = cellstore_1.CellStore.Create(cell.corners, makeCell);
                    return {
                        store: storage
                    };
                };
                var fixed = function (delta, s) {
                    g = 0;
                    s.store.update(clone, update);
                    return s;
                };
                var variable = function (delta, s) {
                    render.render(ctx, s.store);
                    render.applyValueScale();
                };
                var loop = new loop_1.Loop(1000 / 10, init, fixed, variable);
                var state = init();
                ctx.canvas.addEventListener('mousedown', function (_) { fixed(0, state); variable(0, state); });
            });
            colors = ['white', 'black', 'red', 'silver', 'black'];
            XCellRender = (function (_super) {
                __extends(XCellRender, _super);
                function XCellRender() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.min = Infinity;
                    _this.max = -Infinity;
                    _this.q = 1;
                    _this.o = 0;
                    return _this;
                }
                XCellRender.prototype.getCellColor = function (cell) {
                    this.min = Math.min(this.min, cell.value - 1);
                    this.max = Math.max(this.max, cell.value + 1);
                    var v = (cell.value - this.o) / this.q;
                    return color_1.hcy2rgb(360 * v, 0, .3 + .4 * v);
                };
                XCellRender.prototype.applyValueScale = function () {
                    this.o = this.min;
                    this.q = (this.max - this.min);
                    this.min = Infinity;
                    this.max = -Infinity;
                };
                return XCellRender;
            }(cellrender_1.CellRender));
        }
    };
});
//# sourceMappingURL=bundle.js.map