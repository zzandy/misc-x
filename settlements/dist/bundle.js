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
System.register("settlements/src/render", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    function render(ctx, world) {
        for (var _i = 0, _a = world.graph.edges; _i < _a.length; _i++) {
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
            ctx.fillCircle(node.pos.x, node.pos.y, 5);
            ctx.fillText(node.name, node.pos.x, node.pos.y - 7);
        }
    }
    exports_8("render", render);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("settlements/src/main", ["lib/rnd", "lib/geometry", "lib/canvas", "settlements/src/world", "settlements/src/render", "settlements/src/cycle"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
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
            exports_9("main", main = function () {
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