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
System.register("hexflow/src/supercell", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var HexPos, Supercell;
    return {
        setters: [],
        execute: function () {
            HexPos = (function () {
                function HexPos(i, j) {
                    this.i = i;
                    this.j = j;
                }
                HexPos.prototype.add = function (i, j) {
                    return new HexPos(this.i + i, this.j + j);
                };
                return HexPos;
            }());
            exports_2("HexPos", HexPos);
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
            exports_2("Supercell", Supercell);
        }
    };
});
System.register("hexflow/src/cellstore", ["hexflow/src/supercell"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var supercell_1, Cell, makeArray, CellStore;
    return {
        setters: [
            function (supercell_1_1) {
                supercell_1 = supercell_1_1;
            }
        ],
        execute: function () {
            Cell = (function () {
                function Cell(value) {
                    this.value = value;
                }
                return Cell;
            }());
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
            exports_3("CellStore", CellStore);
        }
    };
});
System.register("hexflow/src/cellrender", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var Point, q, sq32, CellRender;
    return {
        setters: [],
        execute: function () {
            Point = (function () {
                function Point(x, y) {
                    this.x = x;
                    this.y = y;
                }
                return Point;
            }());
            exports_4("Point", Point);
            q = 1 / Math.sqrt(3);
            sq32 = Math.sqrt(3) / 2;
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
                    return new Point(ctx.canvas.width / 2 + q * s * pos.j * sq32, ctx.canvas.height / 2 + q * -s * (pos.i - pos.j / 2));
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
            exports_4("CellRender", CellRender);
        }
    };
});
System.register("gl/src/loop", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
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
                    this.update(state, 0);
                };
                Loop.prototype.stop = function () {
                    this.isRunning = false;
                };
                Loop.prototype.update = function (state, delta) {
                    var _this = this;
                    if (!this.isRunning)
                        return;
                    var time = new Date().getTime();
                    var newState = state;
                    this.fixedAccum += delta;
                    while (this.fixedAccum > this.fixedDelta) {
                        this.fixedAccum -= this.fixedDelta;
                        newState = this.fixed(this.fixedDelta, newState);
                    }
                    this.variable(delta, newState);
                    requestAnimationFrame(function () { return _this.update(newState, new Date().getTime() - time); });
                };
                return Loop;
            }());
            exports_5("Loop", Loop);
        }
    };
});
System.register("hexflow/src/main", ["elo/src/lib/canvas", "gl/src/loop", "hexflow/src/cellstore", "hexflow/src/supercell", "hexflow/src/cellrender"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    function clone(c) {
        return { value: c.value };
    }
    function update(pos, oldCell, newCell, oldGet, newGet) {
        var adj = surround(pos, oldGet);
        var living = adj.reduce(function (a, b) { return a + (b != null && b.value == 1 ? 1 : 0); }, 0);
        var red = adj.reduce(function (a, b) { return a + (b != null && b.value == 2 ? 1 : 0); }, 0);
        var isalive = oldCell.value == 1;
        if (isalive && (living > 4 || living < 2))
            newCell.value = 2;
        if (!isalive) {
            if ((living == 0 && red == 1) || living == 3) {
                newCell.value = 1;
            }
            else
                newCell.value = 0;
        }
    }
    function surround(pos, getter) {
        return [
            getter(pos.add(0, 1)),
            getter(pos.add(1, 1)),
            getter(pos.add(1, 0)),
            getter(pos.add(0, -1)),
            getter(pos.add(-1, -1)),
            getter(pos.add(-1, 0)),
        ];
    }
    var canvas_1, loop_1, cellstore_1, supercell_2, cellrender_1, Cell, main, colors, XCellRender;
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
            }
        ],
        execute: function () {
            Cell = (function () {
                function Cell() {
                }
                return Cell;
            }());
            exports_6("main", main = function () {
                var ctx = canvas_1.fullscreenCanvas();
                var init = function () {
                    var cell = new supercell_2.Supercell(new supercell_2.HexPos(0, 0), 13);
                    var makeCell = function (pos) {
                        if (!cell.contains(pos))
                            return null;
                        var n = Math.floor(3 * Math.random());
                        return { value: n };
                    };
                    var storage = cellstore_1.CellStore.Create(cell.corners, makeCell);
                    return {
                        store: storage
                    };
                };
                var fixed = function (delta, s) {
                    s.store.update(clone, update);
                    return s;
                };
                var variable = function (delta, s) {
                    var render = new XCellRender(10);
                    render.render(ctx, s.store);
                };
                var loop = new loop_1.Loop(1000 / 10, init, fixed, variable);
                loop.start();
            });
            colors = ['white', 'black', 'red', 'silver', 'black'];
            XCellRender = (function (_super) {
                __extends(XCellRender, _super);
                function XCellRender() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                XCellRender.prototype.getCellColor = function (cell) {
                    return colors[cell.value];
                };
                return XCellRender;
            }(cellrender_1.CellRender));
        }
    };
});
//# sourceMappingURL=bundle.js.map