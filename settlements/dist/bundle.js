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
System.register("settlements/src/cycle", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function findCycles(graph) {
        var cycles = [];
        graph.forEach(function (edge) { return edge.forEach(function (node) { return findNewCycles([node]); }); });
        function findNewCycles(path) {
            var start_node = path[0];
            var next_node = null;
            for (var _i = 0, graph_1 = graph; _i < graph_1.length; _i++) {
                var edge = graph_1[_i];
                var node1 = edge[0], node2 = edge[1];
                if (node1 == start_node || node2 == start_node) {
                    next_node = node1 === start_node ? node2 : node1;
                }
                else
                    continue;
                if (!visited(next_node, path)) {
                    findNewCycles([next_node].concat(path));
                }
                else if (path.length > 2 && next_node == path[path.length - 1]) {
                    var cycle = rotateToSmallest(path);
                    if (isNew(cycle) && isNew(reverse(cycle)))
                        cycles.push(cycle);
                }
            }
            function isNew(path) {
                var p = JSON.stringify(path);
                for (var _i = 0, cycles_1 = cycles; _i < cycles_1.length; _i++) {
                    var cycle = cycles_1[_i];
                    if (p === JSON.stringify(cycle)) {
                        return false;
                    }
                }
                return true;
            }
        }
        return cycles;
    }
    exports_1("findCycles", findCycles);
    function reverse(path) {
        return rotateToSmallest(path.slice().reverse());
    }
    function rotateToSmallest(path) {
        var n = path.indexOf(Math.min.apply(Math, path));
        return path.slice(n).concat(path.slice(0, n));
    }
    function visited(node, path) {
        return path.indexOf(node) != -1;
    }
    return {
        setters: [],
        execute: function () {
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
System.register("settlements/src/dist-map", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var DistMap;
    return {
        setters: [],
        execute: function () {
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
                            ? this.dists[((i1 - 1) * i1) / 2 + i0]
                            : this.dists[((i0 - 1) * i0) / 2 + i1];
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
            exports_3("DistMap", DistMap);
        }
    };
});
System.register("settlements/src/graph", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var Graph;
    return {
        setters: [],
        execute: function () {
            Graph = (function () {
                function Graph(dist, cutoff) {
                    var _this = this;
                    this.edges = [];
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
                                var src = cluster_1[_i];
                                for (var _a = 0, pending_1 = pending; _a < pending_1.length; _a++) {
                                    var tgt = pending_1[_a];
                                    links.push([src, tgt, dist.dist(src, tgt)]);
                                }
                            }
                            links.sort(function (_a, _b) {
                                var a = _a[0], b = _a[1], d1 = _a[2];
                                var c = _b[0], d = _b[1], d2 = _b[2];
                                return d1 - d2;
                            });
                            links
                                .filter(function (_a, i) {
                                var x = _a[0], y = _a[1], d = _a[2];
                                return i < 2 || i < 4 && d < cutoff / 2;
                            })
                                .forEach(function (v) {
                                var src = v[0], tgt = v[1];
                                connected[tgt] = true;
                                _this.edges.push([
                                    Math.min(src, tgt),
                                    Math.max(src, tgt)
                                ]);
                            });
                        }
                        else {
                            done = true;
                        }
                    }
                }
                return Graph;
            }());
            exports_4("Graph", Graph);
        }
    };
});
System.register("lib/rnd", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    function rnd(a, b, c) {
        if (a !== undefined && b !== undefined) {
            if (c !== undefined)
                return b + (a - b) * Math.random();
            return typeof b === "boolean"
                ? a * Math.random()
                : (b + (a - b) * Math.random()) | 0;
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
System.register("lib/canvas", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
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
    exports_6("fullscreenCanvas", fullscreenCanvas);
    var getCanvas, fullscreenCanvas3d;
    return {
        setters: [],
        execute: function () {
            exports_6("getCanvas", getCanvas = function (isRelative) {
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
            exports_6("fullscreenCanvas3d", fullscreenCanvas3d = function (relative) {
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
System.register("settlements/src/world", ["settlements/src/graph", "settlements/src/dist-map"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var graph_2, dist_map_1, Node, World;
    return {
        setters: [
            function (graph_2_1) {
                graph_2 = graph_2_1;
            },
            function (dist_map_1_1) {
                dist_map_1 = dist_map_1_1;
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
            exports_7("Node", Node);
            World = (function () {
                function World(nodes, cutoff) {
                    this.nodes = nodes;
                    this.dists = new dist_map_1.DistMap(nodes.map(function (n) { return n.pos; }));
                    this.graph = new graph_2.Graph(this.dists, cutoff);
                }
                return World;
            }());
            exports_7("World", World);
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
    exports_8("hcy", hcy);
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
System.register("settlements/src/render", ["lib/color"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    function render(ctx, world) {
        var maxdist = world.graph.edges.reduce(avgedge(world.dists), 0) * 1.01;
        var _a = ctx.canvas, w = _a.width, h = _a.height;
        var imgData = ctx.createImageData(w, h);
        var data = imgData.data;
        for (var i = 0; i < h; ++i) {
            for (var j = 0; j < w; ++j) {
                var v = world.nodes
                    .map(distto(j, i))
                    .filter(function (d) { return d < maxdist; })
                    .map(function (d) { return d / maxdist; })
                    .reduce(function (a, b) { return a + fade(1 - b); }, 0);
                var _b = mapColor(v), r = _b[0], g = _b[1], b = _b[2];
                var idx = (i * w + j) * 4;
                data[idx] = (r * 255) & 255;
                data[idx + 1] = (g * 255) & 255;
                data[idx + 2] = (b * 255) & 255;
                data[idx + 3] = 150;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        for (var _i = 0, _c = world.graph.edges; _i < _c.length; _i++) {
            var _d = _c[_i], i = _d[0], j = _d[1];
            var node = world.nodes[i];
            var other = world.nodes[j];
            ctx.beginPath();
            ctx.moveTo(node.pos.x, node.pos.y);
            ctx.lineTo(other.pos.x, other.pos.y);
            ctx.stroke();
        }
        for (var i = 0; i < world.nodes.length; ++i) {
            var node = world.nodes[i];
            ctx.fillCircle(node.pos.x, node.pos.y, 5);
            ctx.fillText(node.name, node.pos.x, node.pos.y - 7);
        }
    }
    exports_9("render", render);
    function avgedge(dist) {
        return function (max, _a, i, arr) {
            var a = _a[0], b = _a[1];
            return max + dist.dist(a, b) / arr.length;
        };
    }
    function distto(x, y) {
        return function (_a) {
            var pos = _a.pos;
            return dist(x, y, pos.x, pos.y);
        };
    }
    function dist(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    function mapColor(n) {
        return mapGrad(n, grad);
    }
    function mapGrad(v, grad) {
        var prev = grad[0];
        for (var i = 1; i < grad.length; ++i) {
            var _a = grad[i], lvl = _a[0], color = _a[1];
            if (v < lvl) {
                var lvl0 = prev[0], color0 = prev[1];
                var k = 1 - (v - lvl0) / (lvl - lvl0);
                return [
                    color0[0] * k + color[0] * (1 - k),
                    color0[1] * k + color[1] * (1 - k),
                    color0[2] * k + color[2] * (1 - k)
                ];
            }
            prev = grad[i];
        }
        return grad[grad.length - 1][1];
    }
    function fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    var color_1, grad;
    return {
        setters: [
            function (color_1_1) {
                color_1 = color_1_1;
            }
        ],
        execute: function () {
            grad = [
                [0, color_1.wheelHcy(0, 1, 1)],
                [0.4, color_1.wheelHcy(0, 1, 1)],
                [0.405, color_1.wheelHcy(0, 1, 0.5)],
                [0.55, color_1.wheelHcy(120, 1, 0.5)],
                [0.60, color_1.wheelHcy(60, 1, 0.8)],
            ];
        }
    };
});
System.register("settlements/src/main", ["lib/rnd", "lib/geometry", "lib/canvas", "settlements/src/world", "settlements/src/render", "settlements/src/cycle"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    function getScore(cycles) {
        return cycles
            .map(function (c) { return c.length; })
            .filter(function (l) { return l >= minlen; })
            .reduce(function (sum, len) { return sum + len / minlen; }, 0);
    }
    var rnd_1, geometry_1, canvas_1, world_1, render_1, cycle_1, tau, sin, cos, minlen, main;
    return {
        setters: [
            function (rnd_1_1) {
                rnd_1 = rnd_1_1;
            },
            function (geometry_1_1) {
                geometry_1 = geometry_1_1;
            },
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            },
            function (world_1_1) {
                world_1 = world_1_1;
            },
            function (render_1_1) {
                render_1 = render_1_1;
            },
            function (cycle_1_1) {
                cycle_1 = cycle_1_1;
            }
        ],
        execute: function () {
            tau = Math.PI * 2;
            sin = Math.sin;
            cos = Math.cos;
            minlen = 6;
            exports_10("main", main = function () {
                var q = Math.sqrt(3) / 2;
                var size = 120;
                var ctx = canvas_1.fullscreenCanvas();
                var cols = (ctx.canvas.width / size / q) | 0;
                var rows = (ctx.canvas.height / size) | 0;
                var bottomOut = rows * size + size / 2 > ctx.canvas.height;
                var world = null;
                var score = 0;
                var tries = 10;
                var satisfactoryScore = 50;
                while (tries-- > 0) {
                    var nodes = [];
                    for (var i = 0; i < rows; ++i) {
                        for (var j = 0; j < cols; ++j) {
                            if (i == rows - 1 && bottomOut && (j + 1) % 2)
                                continue;
                            var rmax = size / 2;
                            var x = rmax + j * rmax * 2 * q;
                            var y = rmax + i * rmax * 2 + ((j + 1) % 2) * rmax;
                            var isRim = (i == 0 && j % 2 == 0) ||
                                j == 0 ||
                                (i == rows - 1 && (bottomOut || j % 2 == 0)) ||
                                j == cols - 1;
                            var r = rnd_1.rnd(0.85 * rmax, true);
                            var a = isRim
                                ? Math.atan2(ctx.canvas.height / 2 - y, ctx.canvas.width / 2 - x) + rnd_1.rnd(-tau / 10, tau / 10, true)
                                : rnd_1.rnd(tau, true);
                            x += r * cos(a);
                            y += r * sin(a);
                            nodes.push(new world_1.Node(nodes.length + "-" + i + "x" + j, new geometry_1.Point(x, y)));
                        }
                    }
                    var newWorld = new world_1.World(nodes, size);
                    var newScore = getScore(cycle_1.findCycles(newWorld.graph.edges));
                    if (newScore > score) {
                        score = newScore;
                        world = newWorld;
                    }
                    if (score > satisfactoryScore) {
                        console.log("early break " + tries + " left");
                        break;
                    }
                }
                if (world != null) {
                    render_1.render(ctx, world);
                    var cycles = cycle_1.findCycles(world.graph.edges);
                    console.log(getScore(cycles));
                    console.log(cycles.filter(function (c) { return c.length > minlen; }));
                }
            });
        }
    };
});
//# sourceMappingURL=bundle.js.map