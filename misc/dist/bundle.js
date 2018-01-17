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
        document.body.style.margin = '0';
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
System.register("misc/src/map", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function rnd(a, b) {
        if (a !== undefined && b !== undefined) {
            return (b + (a - b) * Math.random()) | 0;
        }
        else if (a !== undefined && b === undefined) {
            if (a instanceof Array)
                return a[(Math.random() * a.length) | 0];
            else
                return (a * Math.random()) | 0;
        }
        else
            return Math.random();
    }
    function pad(str, w) {
        return str.length < w
            ? str + (new Array(w - str.length + 1)).join(' ')
            : str;
    }
    var Point, Token, Cell, Rule, RuleStub, RuleBuilder, None, Reef, Sea, Bay, Marsh, Mountain, Forest, Lake, Shore, Meadow, RectMap, Solver, RectRender, main;
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
            Token = (function () {
                function Token(name) {
                    this.name = name;
                }
                return Token;
            }());
            Cell = (function () {
                function Cell(value) {
                    this.value = value;
                    this.maybes = [];
                    this.noes = [];
                }
                return Cell;
            }());
            Rule = (function () {
                function Rule(token, nextTo, notNextTo) {
                    this.token = token;
                    this.nextTo = nextTo;
                    this.notNextTo = notNextTo;
                }
                return Rule;
            }());
            RuleStub = (function () {
                function RuleStub(token, builder) {
                    this.token = token;
                    this.builder = builder;
                    this.next = [];
                    this.notNext = [];
                }
                RuleStub.prototype.nextTo = function () {
                    var tokens = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        tokens[_i] = arguments[_i];
                    }
                    for (var _a = 0, tokens_1 = tokens; _a < tokens_1.length; _a++) {
                        var token = tokens_1[_a];
                        this.next.push(token);
                    }
                    return this;
                };
                RuleStub.prototype.notNextTo = function () {
                    var tokens = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        tokens[_i] = arguments[_i];
                    }
                    for (var _a = 0, tokens_2 = tokens; _a < tokens_2.length; _a++) {
                        var token = tokens_2[_a];
                        this.notNext.push(token);
                    }
                    return this;
                };
                RuleStub.prototype.rule = function (token) {
                    this.builder.add(new Rule(this.token, this.next, this.notNext));
                    return this.builder.rule(token);
                };
                RuleStub.prototype.build = function () {
                    this.builder.add(new Rule(this.token, this.next, this.notNext));
                    return this.builder.build();
                };
                return RuleStub;
            }());
            RuleBuilder = (function () {
                function RuleBuilder() {
                    this.rules = [];
                }
                RuleBuilder.prototype.rule = function (token) {
                    return new RuleStub(token, this);
                };
                RuleBuilder.prototype.add = function (rule) {
                    this.rules.push(rule);
                };
                RuleBuilder.prototype.build = function () {
                    return this.rules;
                };
                return RuleBuilder;
            }());
            None = new Token('n/a');
            Reef = new Token('reef');
            Sea = new Token('sea');
            Bay = new Token('bay');
            Marsh = new Token('marsh');
            Mountain = new Token('mount');
            Forest = new Token('forest');
            Lake = new Token('lake');
            Shore = new Token('shore');
            Meadow = new Token('meadow');
            RectMap = (function () {
                function RectMap(w, h) {
                    this.w = w;
                    this.h = h;
                    this.data = [];
                    for (var i = 0; i < h; ++i) {
                        var row = [];
                        for (var j = 0; j < w; ++j)
                            row.push(new Cell(None));
                        this.data.push(row);
                    }
                }
                RectMap.prototype.each = function (callback) {
                    for (var i = 0; i < this.h; ++i)
                        for (var j = 0; j < this.w; ++j)
                            callback(this.data[i][j], new Point(j, i), this);
                };
                RectMap.prototype.get = function (pos) {
                    return (pos.x >= 0 && pos.y >= 0 && pos.x < this.w && pos.y < this.h)
                        ? this.data[pos.y][pos.x]
                        : null;
                };
                RectMap.prototype.getAdj = function (pos) {
                    return [
                        this.get(new Point(pos.x + 1, pos.y)),
                        this.get(new Point(pos.x, pos.y + 1)),
                        this.get(new Point(pos.x - 1, pos.y)),
                        this.get(new Point(pos.x, pos.y - 1)),
                    ].filter(function (x) { return x != null; });
                };
                return RectMap;
            }());
            Solver = (function () {
                function Solver() {
                }
                Solver.prototype.solve = function (rules, map) {
                    var draw = [];
                    do {
                        draw.length = 0;
                        map.each(function (cell, pos, map) {
                            if (cell.value == None) {
                                var adj_1 = map.getAdj(pos).filter(function (a) { return a.value != None; });
                                cell.maybes.length = 0;
                                cell.noes.length = 0;
                                rules.forEach(function (rule) {
                                    if (adj_1.some(function (a) { return rule.notNextTo.indexOf(a.value) != -1; })) {
                                        cell.noes.push(rule.token);
                                    }
                                    else if (adj_1.some(function (a) { return rule.nextTo.indexOf(a.value) != -1; })) {
                                        cell.maybes.push(rule.token);
                                    }
                                });
                                if (cell.maybes.length)
                                    draw.push(cell);
                            }
                        });
                        if (draw.length) {
                            var cell = rnd(draw);
                            cell.value = rnd(cell.maybes);
                        }
                    } while (draw.length);
                };
                return Solver;
            }());
            RectRender = (function () {
                function RectRender() {
                }
                RectRender.prototype.render = function (map) {
                    var lengths = [];
                    for (var i = 0; i < map.w; ++i)
                        lengths.push(0);
                    map.each(function (cell, pos, map) {
                        lengths[pos.x] = Math.max(lengths[pos.x], cell.value.name.length);
                    });
                    var splitter = '+' + lengths.map(function (l) { return new Array(l + 3).join('-'); }).join('+') + '+';
                    var text = [splitter, '\n'];
                    for (var i = 0; i < map.h; ++i) {
                        text.push('|');
                        for (var j = 0; j < map.w; ++j) {
                            text.push(' ', pad((map.get(new Point(j, i))).value.name, lengths[j]));
                            text.push(' |');
                        }
                        text.push('\n', splitter, '\n');
                    }
                    document.body.style.whiteSpace = 'pre';
                    document.body.style.fontFamily = 'monospace';
                    document.body.innerHTML = text.join('');
                };
                return RectRender;
            }());
            exports_4("main", main = function () {
                var _a = [7, 7], w = _a[0], h = _a[1];
                var map = new RectMap(w, h);
                map.each(function (cell, pos, map) {
                    if (pos.x == 0 || pos.y == 0 || pos.x == w - 1 || pos.y == h - 1)
                        cell.value = Sea;
                });
                for (var i = 0; i < rnd(1, 3); ++i) {
                    var r = rnd(2)
                        ? map.get(new Point(rnd(2) * (w - 1), rnd(h)))
                        : map.get(new Point(rnd(w), rnd(1) * (h - 1)));
                    if (r != null)
                        r.value = Reef;
                }
                var rules = new RuleBuilder()
                    .rule(Shore).nextTo(Sea, Reef)
                    .rule(Marsh).nextTo(Sea, Reef)
                    .rule(Forest).nextTo(Shore, Bay, Forest, Mountain, Marsh)
                    .rule(Mountain).nextTo(Forest, Lake, Mountain, Bay)
                    .rule(Lake).nextTo(Bay, Mountain).notNextTo(Shore, Sea)
                    .rule(Meadow).nextTo(Lake, Meadow, Bay, Forest)
                    .rule(Bay).nextTo(Sea).notNextTo(Bay, Reef)
                    .build();
                new Solver().solve(rules, map);
                new RectRender().render(map);
            });
        }
    };
});
System.register("lib/rnd", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    function rnd(a, b) {
        if (a !== undefined && b !== undefined) {
            return (b + (a - b) * Math.random()) | 0;
        }
        else if (a !== undefined && b === undefined) {
            if (a instanceof Array)
                return a[(Math.random() * a.length) | 0];
            else
                return (a * Math.random()) | 0;
        }
        else
            return Math.random();
    }
    exports_5("rnd", rnd);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("lib/geometry", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
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
            exports_6("Point", Point);
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
            exports_6("Rect", Rect);
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
            exports_6("Range", Range);
        }
    };
});
System.register("misc/src/settle", ["lib/geometry", "lib/canvas"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    function blocks(width, height, size) {
        return [height / size, width / size];
    }
    function render(ctx, world) {
        ctx.fillStyle = '#262626';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#aeaeae';
        ctx.strokeStyle = '#aeaeae';
        for (var _i = 0, _a = world.graph.links; _i < _a.length; _i++) {
            var _b = _a[_i], i = _b[0], j = _b[1];
            var node = world.nodes[i];
            var other = world.nodes[j];
            ctx.beginPath();
            ctx.moveTo(node.pos.x, node.pos.y);
            ctx.lineTo(other.pos.x, other.pos.y);
            ctx.stroke();
        }
        for (var i = 0; i < world.nodes.length; ++i) {
            var node = world.nodes[i];
            ctx.fillRect(node.pos.x - 5, node.pos.y - 5, 10, 10);
            ctx.fillText(node.name, node.pos.x, node.pos.y);
        }
    }
    var geometry_1, canvas_2, Node, World, Graph, DistMap, main;
    return {
        setters: [
            function (geometry_1_1) {
                geometry_1 = geometry_1_1;
            },
            function (canvas_2_1) {
                canvas_2 = canvas_2_1;
            }
        ],
        execute: function () {
            Node = (function () {
                function Node(name, pos) {
                    this.name = name;
                    this.pos = pos;
                }
                return Node;
            }());
            World = (function () {
                function World(nodes) {
                    this.nodes = nodes;
                    this.dists = new DistMap(nodes.map(function (n) { return n.pos; }));
                    this.graph = new Graph(this.dists);
                }
                return World;
            }());
            Graph = (function () {
                function Graph(dist) {
                    this.links = [];
                    var connected = [true];
                    var done = false;
                    while (!done) {
                        var cluster = [];
                        var pending = [];
                        var links = [];
                        for (var i = 0; i < dist.length; ++i) {
                            (connected[i] ? cluster : pending).push(i);
                        }
                        if (pending.length > 0) {
                            for (var _i = 0, cluster_1 = cluster; _i < cluster_1.length; _i++) {
                                var src_1 = cluster_1[_i];
                                for (var _a = 0, pending_1 = pending; _a < pending_1.length; _a++) {
                                    var tgt_1 = pending_1[_a];
                                    links.push([src_1, tgt_1, dist.dist(src_1, tgt_1)]);
                                }
                            }
                            links.sort(function (_a, _b) {
                                var a = _a[0], b = _a[1], d1 = _a[2];
                                var c = _b[0], d = _b[1], d2 = _b[2];
                                return d1 - d2;
                            });
                            var _b = links[0], src = _b[0], tgt = _b[1];
                            connected[tgt] = true;
                            this.links.push([Math.min(src, tgt), Math.max(src, tgt)]);
                        }
                        else {
                            done = true;
                        }
                    }
                }
                return Graph;
            }());
            DistMap = (function () {
                function DistMap(points) {
                    this.dists = [];
                    this.length = points.length;
                    for (var i = 1; i < points.length; ++i)
                        for (var j = 0; j < i; ++j) {
                            var _a = points[i], x0 = _a.x, y0 = _a.y;
                            var _b = points[j], x1 = _b.x, y1 = _b.y;
                            var d = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
                            this.dists.push(d);
                        }
                }
                DistMap.prototype.dist = function (i0, i1) {
                    return i0 == i1
                        ? 0
                        : i1 > i0
                            ? this.dists[(i1 - 1) * i1 / 2 + i0]
                            : this.dists[(i0 - 1) * i0 / 2 + i1];
                };
                DistMap.prototype.closest = function (idx) {
                    var dist = Infinity;
                    var ix = -1;
                    for (var j = 0; j < idx; ++j) {
                        var d = this.dist(idx, j);
                        if (d < dist) {
                            dist = d;
                            ix = j;
                        }
                    }
                    for (var i = idx + 1; i < this.length; ++i) {
                        var d = this.dist(i, idx);
                        if (d < dist) {
                            dist = d;
                            ix = i;
                        }
                    }
                    return ix;
                };
                return DistMap;
            }());
            exports_7("main", main = function () {
                var q = Math.sqrt(3) / 2;
                var size = 100;
                var ctx = canvas_2.fullscreenCanvas();
                var _a = blocks(ctx.canvas.width, ctx.canvas.height / q, size), rows = _a[0], cols = _a[1];
                var _b = [ctx.canvas.width / cols, ctx.canvas.height / rows * q], bw = _b[0], bh = _b[1];
                var nodes = [];
                for (var i = 1; i < rows - 1; ++i)
                    for (var j = 1; j < cols - 1; ++j) {
                        var x = (j + i % 2 / 2) * bw;
                        var y = (i + .5) * bh;
                        var a = Math.random() * 2 * Math.PI;
                        var d = Math.random() * size * q * 2 / 3 * .8;
                        x += d * Math.cos(a);
                        y += d * Math.sin(a);
                        nodes.push(new Node(i + "x" + j, new geometry_1.Point(x, y)));
                    }
                var world = new World(nodes);
                render(ctx, world);
            });
        }
    };
});
System.register("lib/random", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
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
            exports_8("Random", Random);
        }
    };
});
System.register("lib/simplex", ["lib/random"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
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
            exports_9("SimplexNoise2d", SimplexNoise2d);
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
            exports_9("SimplexNoiseOctave", SimplexNoiseOctave);
        }
    };
});
System.register("misc/src/simplex", ["lib/canvas", "lib/color", "lib/simplex"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
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
    var canvas_3, color_2, simplex_1, main, waterlevel, sandlevel, greenslevel, grad;
    return {
        setters: [
            function (canvas_3_1) {
                canvas_3 = canvas_3_1;
            },
            function (color_2_1) {
                color_2 = color_2_1;
            },
            function (simplex_1_1) {
                simplex_1 = simplex_1_1;
            }
        ],
        execute: function () {
            exports_10("main", main = function () {
                var ctx = canvas_3.fullscreenCanvas();
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