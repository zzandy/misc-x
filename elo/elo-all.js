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
System.register("ajax", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function request(verb, url, data) {
        if (data === void 0) { data = null; }
        return new Promise(function (resolve, reject) {
            var http = new XMLHttpRequest();
            http.open(verb, url, true);
            http.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            http.onreadystatechange = function () {
                if (http.readyState == 4) {
                    if (http.status == 200) {
                        resolve(JSON.parse(http.responseText));
                    }
                    else {
                        reject(verb + ' ' + url + ': ' + http.statusText + '. ' + http.responseText);
                    }
                }
            };
            if (data)
                http.send(JSON.stringify(data));
            else
                http.send(null);
        });
    }
    exports_1("request", request);
    function postJson(url, data) {
        return request('POST', url, data);
    }
    exports_1("postJson", postJson);
    function getJson(url) {
        return request('GET', url);
    }
    exports_1("getJson", getJson);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("almaz-api", ["ajax"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var ajax_1, AlmazApi;
    return {
        setters: [
            function (ajax_1_1) {
                ajax_1 = ajax_1_1;
            }
        ],
        execute: function () {
            AlmazApi = (function () {
                function AlmazApi(baseUrl) {
                    var state = { url: baseUrl, players: [] };
                    this.scope = Promise.resolve(state).then(this.refreshPlayers);
                }
                AlmazApi.prototype.getPlayers = function () {
                    var _this = this;
                    return new Promise(function (resolve) {
                        _this.scope = _this.scope.then(function (ctx) { resolve(ctx.players); return ctx; });
                    });
                };
                AlmazApi.prototype.getGames = function (source) {
                    var self = this;
                    return new Promise(function (resolve) {
                        self.scope = self.scope.then(function (ctx) {
                            if (!('url' in ctx))
                                throw 'Invalid context';
                            return ajax_1.getJson(ctx.url + (!!source ? 'games?source=' + encodeURIComponent(source) : 'games'))
                                .catch(function (e) { console.error(e); return ctx; })
                                .then(function (data) {
                                resolve(data);
                                return ctx;
                            });
                        });
                    });
                };
                AlmazApi.prototype.refreshPlayers = function (ctx) {
                    return ajax_1.getJson(ctx.url + 'players')
                        .then(function (players) { ctx.players = players; return ctx; })
                        .catch(function (e) {
                        console.error(e);
                        return ctx;
                    });
                };
                return AlmazApi;
            }());
            exports_2("AlmazApi", AlmazApi);
        }
    };
});
System.register("canvas", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function fullscreenCanvas(relative) {
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
    exports_3("fullscreenCanvas", fullscreenCanvas);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("color", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function hcy2rgb(h, c, y, a) {
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
        var rgbdata = [rgb[0] + m, rgb[1] + m, rgb[2] + m];
        return 'rgba(' + (rgbdata[0] * 255).toFixed(0) + ',' + (rgbdata[1] * 255).toFixed(0) + ',' + (rgbdata[2] * 255).toFixed(0) + ', ' + (a || 1) + ')';
    }
    exports_4("hcy2rgb", hcy2rgb);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("elo", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var EloPlayer, Elo;
    return {
        setters: [],
        execute: function () {
            EloPlayer = (function () {
                function EloPlayer(value, score, numGames, numWins) {
                    if (numGames === void 0) { numGames = 0; }
                    if (numWins === void 0) { numWins = 0; }
                    this.value = value;
                    this.score = score;
                    this.numGames = numGames;
                    this.numWins = numWins;
                }
                return EloPlayer;
            }());
            exports_5("EloPlayer", EloPlayer);
            Elo = (function () {
                function Elo(initScore, x10diff, kFactor) {
                    if (initScore === void 0) { initScore = 800; }
                    if (x10diff === void 0) { x10diff = 400; }
                    if (kFactor === void 0) { kFactor = 32; }
                    this.initScore = initScore;
                    this.x10diff = x10diff;
                    this.kFactor = kFactor;
                }
                Elo.prototype.expectWin = function (a, b) {
                    return 1 / (1 + Math.pow(10, (b.score - a.score) / this.x10diff));
                };
                Elo.prototype.game = function (t1, t2, s1, s2) {
                    var e1 = this.expectWin(t1, t2);
                    var e2 = this.expectWin(t2, t1);
                    var r1 = s1 > s2 ? 1 : s1 < s2 ? 0 : .5;
                    var r2 = s2 > s1 ? 1 : s2 < s1 ? 0 : .5;
                    this.updatePlayer(t1, e1, r1, s1 > s2);
                    this.updatePlayer(t2, e2, r2, s2 > s1);
                };
                Elo.prototype.updatePlayer = function (a, expected, scoreForA, isAWin) {
                    var delta = this.kFactor * (scoreForA - expected);
                    a.score = Math.max(0, a.score + delta);
                    ++a.numGames;
                    if (isAWin)
                        ++a.numWins;
                };
                return Elo;
            }());
            exports_5("Elo", Elo);
        }
    };
});
System.register("geometry", [], function (exports_6, context_6) {
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
System.register("plot-data", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var Break, DataWindow, PlotData, Series;
    return {
        setters: [],
        execute: function () {
            Break = (function () {
                function Break(label, coord) {
                    this.label = label;
                    this.coord = coord;
                }
                return Break;
            }());
            exports_7("Break", Break);
            DataWindow = (function () {
                function DataWindow(name, window, xBreaks, yBreaks, views) {
                    this.name = name;
                    this.window = window;
                    this.xBreaks = xBreaks;
                    this.yBreaks = yBreaks;
                    this.views = views;
                }
                return DataWindow;
            }());
            exports_7("DataWindow", DataWindow);
            PlotData = (function () {
                function PlotData(name, data) {
                    this.name = name;
                    this.data = data;
                }
                return PlotData;
            }());
            exports_7("PlotData", PlotData);
            Series = (function () {
                function Series(name, data) {
                    this.name = name;
                    this.data = data;
                }
                return Series;
            }());
            exports_7("Series", Series);
        }
    };
});
System.register("plotter", ["geometry"], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    function last(array) {
        return array[array.length - 1];
    }
    exports_8("last", last);
    var geometry_1, Plotter;
    return {
        setters: [
            function (geometry_1_1) {
                geometry_1 = geometry_1_1;
            }
        ],
        execute: function () {
            Array.prototype.mapMany = function (fn) {
                var res = new Array();
                this.forEach(function (item, index, array) {
                    var subres = fn(item, index, array);
                    res = res.concat(subres);
                });
                return res;
            };
            Plotter = (function () {
                function Plotter(ctx, region) {
                    this.ctx = ctx;
                    this.region = region;
                }
                Plotter.prototype.render = function (world, data) {
                    var allSeries = data.data.map(function (d) { return last(d.data).y.toFixed(0) + " " + d.name; });
                    var labelWidth = Plotter.getMaxTextWidth(this.ctx, allSeries);
                    var region = new geometry_1.Rect(this.region.x, this.region.y, this.region.w - 30, this.region.h);
                    var scale = Plotter.getScale(region, world);
                    var labels = Plotter.getLabelPositions(data.data.map(function (s) { return { text: s.name, pos: s.data[0].y }; }));
                };
                Plotter.getScale = function (screen, world) {
                    var ws = screen.horizontal.length;
                    var hs = screen.vertical.length;
                    var ww = world.horizontal.length;
                    var hw = world.vertical.length;
                    var sx = ws / ww;
                    var sy = hs / hw;
                    return function (coords) {
                        var wx = coords.x - world.horizontal.start;
                        var wy = coords.y - world.vertical.start;
                        return new geometry_1.Point(screen.horizontal.start + sx * wx, screen.vertical.start + sy * wy);
                    };
                };
                Plotter.getMaxTextWidth = function (ctx, labels) {
                    var res = 0;
                    for (var _i = 0, labels_1 = labels; _i < labels_1.length; _i++) {
                        var label = labels_1[_i];
                        var w = ctx.measureText(label).width;
                        res = Math.max(res, w);
                    }
                    return res;
                };
                Plotter.getLabelPositions = function (labels) {
                    labels.sort(function (a, b) { return a.pos - b.pos; });
                    var overlap = true;
                    var retries = 0;
                    var height = 16;
                    while (retries < 10 && overlap) {
                        overlap = false;
                        ++retries;
                        var last_1 = labels[0];
                        for (var _i = 0, labels_2 = labels; _i < labels_2.length; _i++) {
                            var next = labels_2[_i];
                            if (last_1 == next)
                                continue;
                            var gap = next.pos - last_1.pos;
                            if (gap < height) {
                                last_1.pos -= (height - gap) / 2;
                                next.pos += (height - gap) / 2;
                                overlap = true;
                            }
                            last_1 = next;
                        }
                    }
                };
                return Plotter;
            }());
            exports_8("Plotter", Plotter);
        }
    };
});
System.register("view-selector", [], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
