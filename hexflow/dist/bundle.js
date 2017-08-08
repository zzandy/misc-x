System.register("elo/src/lib/canvas", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function fullscreenCanvas(relative) {
        if (relative === void 0) { relative = false; }
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        if (ctx == null)
            throw new Error('failed to get \'2d\' context');
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        if (!relative) {
            ctx.canvas.style.position = 'absolute';
            ctx.canvas.style.top = '0';
            ctx.canvas.style.left = '0';
        }
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
        document.body.appendChild(c);
        return ctx;
    }
    exports_1("fullscreenCanvas", fullscreenCanvas);
    return {
        setters: [],
        execute: function () {
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
                    var top = (x + 1) / 2;
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
System.register("hexflow/src/cellstore", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Cell, CellStore;
    return {
        setters: [],
        execute: function () {
            Cell = (function () {
                function Cell(value) {
                    this.value = value;
                }
                return Cell;
            }());
            exports_3("Cell", Cell);
            CellStore = (function () {
                function CellStore() {
                }
                CellStore.prototype.forEach = function (callback) {
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
                    var _a = this.getScreen(pos), x = _a.x, y = _a.y;
                    ctx.fillStyle = this.getCellColor(value);
                    this.fillHex(ctx, x, y, s);
                };
                CellRender.prototype.getScreen = function (pos) {
                    var s = this.cellsize;
                    var q = .95;
                    return new Point(q * s * pos.j * sq32, q * -s * (pos.i - pos.j / 2));
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
        }
    };
});
System.register("hexflow/src/main", ["elo/src/lib/canvas"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var canvas_1, main;
    return {
        setters: [
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            }
        ],
        execute: function () {
            exports_5("main", main = function () {
                var ctx = canvas_1.fullscreenCanvas();
                var storage = new CellStorage();
                console.log('x');
            });
        }
    };
});
//# sourceMappingURL=bundle.js.map