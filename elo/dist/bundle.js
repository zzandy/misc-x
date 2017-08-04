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
System.register("lib/geometry", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
            exports_1("Point", Point);
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
            exports_1("Rect", Rect);
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
            exports_1("Range", Range);
        }
    };
});
System.register("lib/plot-data", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Break, IDataWindow;
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
            exports_2("Break", Break);
            IDataWindow = (function () {
                function IDataWindow() {
                }
                return IDataWindow;
            }());
            exports_2("IDataWindow", IDataWindow);
        }
    };
});
System.register("lib/ajax", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
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
    exports_3("request", request);
    function postJson(url, data) {
        return request('POST', url, data);
    }
    exports_3("postJson", postJson);
    function getJson(url) {
        return request('GET', url);
    }
    exports_3("getJson", getJson);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("lib/almaz-api", ["lib/ajax"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var ajax_1, ApiPlayer, ApiTeam, ApiGame, AlmazApi;
    return {
        setters: [
            function (ajax_1_1) {
                ajax_1 = ajax_1_1;
            }
        ],
        execute: function () {
            ApiPlayer = (function () {
                function ApiPlayer() {
                }
                return ApiPlayer;
            }());
            exports_4("ApiPlayer", ApiPlayer);
            ApiTeam = (function () {
                function ApiTeam() {
                }
                return ApiTeam;
            }());
            exports_4("ApiTeam", ApiTeam);
            ApiGame = (function () {
                function ApiGame() {
                }
                return ApiGame;
            }());
            exports_4("ApiGame", ApiGame);
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
                    var api = this;
                    return new Promise(function (resolve) {
                        api.scope = api.scope.then(function (ctx) {
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
                AlmazApi.prototype.postGame = function (game, source) {
                    var api = this;
                    if (game == null)
                        throw new Error('Game cannot be empty.');
                    if (source == null || source == '')
                        throw new Error('Source must not be empty.');
                    return new Promise(function (resolve, reject) {
                        api.scope = api.scope.then(function (ctx) {
                            return ajax_1.postJson(ctx.url + 'games', game)
                                .then(function (data) { resolve(data._id); return ctx; })
                                .catch(function (e) { reject(e); return ctx; });
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
            exports_4("AlmazApi", AlmazApi);
        }
    };
});
System.register("lib/elo", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var EloPlayer, Elo;
    return {
        setters: [],
        execute: function () {
            EloPlayer = (function () {
                function EloPlayer(score, numGames, numWins) {
                    if (score === void 0) { score = 800; }
                    if (numGames === void 0) { numGames = 0; }
                    if (numWins === void 0) { numWins = 0; }
                    this.score = score;
                    this.numGames = numGames;
                    this.numWins = numWins;
                }
                return EloPlayer;
            }());
            exports_5("EloPlayer", EloPlayer);
            Elo = (function () {
                function Elo(x10diff, kFactor) {
                    if (x10diff === void 0) { x10diff = 400; }
                    if (kFactor === void 0) { kFactor = 32; }
                    this.x10diff = x10diff;
                    this.kFactor = kFactor;
                }
                Elo.prototype.expectWin = function (a, b) {
                    return 1 / (1 + Math.pow(10, (b.score - a.score) / this.x10diff));
                };
                Elo.prototype.game = function (t1, t2, s1, s2) {
                    var e1 = this.expectWin(t1, t2);
                    var e2 = this.expectWin(t2, t1);
                    var r1 = (s1 + s2) > 0 ? s1 / (s1 + s2) : 0;
                    var r2 = (s1 + s2) > 0 ? s2 / (s1 + s2) : 0;
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
System.register("components/game-processor", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var GameProcessor, byEndDate, removeDuplicates, areDuplicates, teamEqual, removeStagingData;
    return {
        setters: [],
        execute: function () {
            GameProcessor = (function () {
                function GameProcessor(playerAdapter, teamAdapter, gameAdapter) {
                    this.playerAdapter = playerAdapter;
                    this.teamAdapter = teamAdapter;
                    this.gameAdapter = gameAdapter;
                    this.games = [];
                    this.teams = [];
                    this.players = [];
                }
                Object.defineProperty(GameProcessor.prototype, "numGames", {
                    get: function () { return this.games.length; },
                    enumerable: true,
                    configurable: true
                });
                ;
                GameProcessor.prototype.findPlayer = function (player) {
                    var p = this.players.filter(function (p) { return p.apiPlayer._id == player._id; })[0];
                    if (p === undefined) {
                        p = this.playerAdapter({ apiPlayer: player });
                        this.players.push(p);
                    }
                    return p;
                };
                GameProcessor.prototype.findTeam = function (defence, offence) {
                    var matches = this.teams.filter(function (t) { return t.defence == defence && t.offence == offence; });
                    if (matches.length == 0) {
                        var team = {
                            defence: defence,
                            offence: offence,
                        };
                        var record = this.teamAdapter(team);
                        this.teams.push(record);
                        return record;
                    }
                    else {
                        return matches[0];
                    }
                };
                GameProcessor.prototype.findGames = function (team) {
                    return this.games.filter(function (g) { return g.blu == team || g.red == team; });
                };
                ;
                GameProcessor.prototype.findMutualGames = function (a, b) {
                    return this.games.filter(function (g) { return (g.blu == a && g.red == b) || (g.blu == b && g.red == a); });
                };
                ;
                GameProcessor.prototype.processGames = function (games) {
                    games.sort(byEndDate)
                        .filter(removeStagingData)
                        .filter(removeDuplicates)
                        .forEach(this.logGame.bind(this));
                };
                GameProcessor.prototype.logGame = function (game) {
                    var red = this.findTeam(this.findPlayer(game.red.defense), this.findPlayer(game.red.offense));
                    var blu = this.findTeam(this.findPlayer(game.blue.defense), this.findPlayer(game.blue.offense));
                    var gameRecord = {
                        red: red,
                        blu: blu,
                        redScore: game.red.score || 0,
                        bluScore: game.blue.score || 0,
                        startDate: new Date(game.startDate),
                        endDate: new Date(game.endDate)
                    };
                    this.games.push(this.gameAdapter(gameRecord));
                };
                ;
                return GameProcessor;
            }());
            exports_6("GameProcessor", GameProcessor);
            byEndDate = function (a, b) {
                return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
            };
            removeDuplicates = function (game, i, a) {
                return i == 0 || !areDuplicates(game, a[i - 1]);
            };
            areDuplicates = function (a, b) {
                var diff = Math.abs(new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
                return diff < 120000 && ((teamEqual(a.red, b.red) && teamEqual(a.blue, b.blue)) || (teamEqual(a.red, b.blue) && teamEqual(a.blue, b.red)));
            };
            teamEqual = function (a, b) {
                return a.score == b.score && a.defense._id == b.defense._id && a.offense._id == b.offense._id;
            };
            removeStagingData = function (game) {
                return 'source' in game && game.source.indexOf('staging') == -1;
            };
        }
    };
});
System.register("lib/canvas", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
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
    exports_7("fullscreenCanvas", fullscreenCanvas);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("lib/plotter", ["lib/geometry"], function (exports_8, context_8) {
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
            Plotter = (function () {
                function Plotter(ctx, region) {
                    this.ctx = ctx;
                    this.region = region;
                }
                Plotter.prototype.render = function (data, viewName) {
                    var view = data.views.filter(function (v) { return v.name == viewName; })[0];
                    if (view === undefined)
                        throw new Error("View " + viewName + " not found");
                    var labels = view.data.map(function (s) { return s.name; });
                    this.ctx.font = '10pt Segoe UI';
                    var axisLabels = Plotter.getMaxTextWidth(this.ctx, data.breaks.y.map(function (b) { return b.label; })) + 2;
                    this.ctx.font = '12pt Segoe UI';
                    var labelWidth = Plotter.getMaxTextWidth(this.ctx, labels) + 5;
                    var region = new geometry_1.Rect(this.region.x + axisLabels, this.region.y - 30, this.region.w - labelWidth - axisLabels, this.region.h + 30);
                    var scale = Plotter.getScale(region, data.window);
                    var labelPos = view.data.map(function (s) { return { text: s.name, pos: scale(new geometry_1.Point(0, s.data[0].y)).y, color: s.color }; });
                    Plotter.adjustLabelPositions(20, labelPos);
                    this.ctx.fillStyle = 'silver';
                    this.placeLabels(axisLabels + region.x + region.w + 2, labelPos);
                    this.drawBreaks(data.breaks, region, scale, axisLabels);
                    this.plotData(scale, view);
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
                Plotter.adjustLabelPositions = function (height, labels) {
                    labels.sort(function (a, b) { return a.pos - b.pos; });
                    var overlap = true;
                    var retries = 0;
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
                Plotter.prototype.placeLabels = function (offset, labels) {
                    for (var _i = 0, labels_3 = labels; _i < labels_3.length; _i++) {
                        var label = labels_3[_i];
                        this.ctx.fillStyle = label.color;
                        this.ctx.fillText(label.text, offset, label.pos);
                    }
                };
                Plotter.prototype.drawBreaks = function (breaks, region, scale, pad) {
                    this.ctx.font = '10pt Segoe UI';
                    for (var _i = 0, _a = breaks.x; _i < _a.length; _i++) {
                        var $break = _a[_i];
                        var x = scale(new geometry_1.Point($break.coord, 0)).x;
                        this.ctx.fillStyle = $break.label == '' ? '#333' : '#555';
                        this.ctx.fillRect(x | 0 + .5, region.y, 1, region.h);
                    }
                    for (var _b = 0, _c = breaks.y; _b < _c.length; _b++) {
                        var $break = _c[_b];
                        var y = scale(new geometry_1.Point(0, $break.coord)).y;
                        this.ctx.fillStyle = 'silver';
                        this.ctx.fillRect(region.x, y | 0 + .5, region.w, 1);
                        this.ctx.fillText($break.label, region.x - pad, y + 5);
                    }
                };
                Plotter.prototype.plotData = function (scale, view) {
                    for (var _i = 0, _a = view.data; _i < _a.length; _i++) {
                        var series = _a[_i];
                        this.ctx.fillStyle = series.color;
                        this.ctx.strokeStyle = series.color;
                        var prev = null;
                        for (var _b = 0, _c = series.data; _b < _c.length; _b++) {
                            var point = _c[_b];
                            var p = scale(point);
                            this.ctx.fillCircle(p.x, p.y, 1.7);
                            if (prev !== null) {
                                this.ctx.beginPath();
                                this.ctx.moveTo(prev.x, prev.y);
                                this.ctx.lineTo(p.x, p.y);
                                this.ctx.stroke();
                            }
                            prev = p;
                        }
                    }
                };
                return Plotter;
            }());
            exports_8("Plotter", Plotter);
        }
    };
});
System.register("components/viewer-model", ["lib/almaz-api", "lib/elo", "components/game-processor", "components/aggregators", "lib/geometry", "lib/plotter", "lib/canvas"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var almaz_api_1, elo_1, game_processor_1, aggregators_1, geometry_2, plotter_1, canvas_1, getViewerModel;
    return {
        setters: [
            function (almaz_api_1_1) {
                almaz_api_1 = almaz_api_1_1;
            },
            function (elo_1_1) {
                elo_1 = elo_1_1;
            },
            function (game_processor_1_1) {
                game_processor_1 = game_processor_1_1;
            },
            function (aggregators_1_1) {
                aggregators_1 = aggregators_1_1;
            },
            function (geometry_2_1) {
                geometry_2 = geometry_2_1;
            },
            function (plotter_1_1) {
                plotter_1 = plotter_1_1;
            },
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            }
        ],
        execute: function () {
            exports_9("getViewerModel", getViewerModel = function () {
                var loading = ko.observable(true);
                var ctx = canvas_1.fullscreenCanvas(true);
                ctx.canvas.width -= 10;
                ctx.canvas.height -= 10;
                var games = ko.observableArray([]);
                var haveData = ko.computed(function () { return games().length > 0; });
                var shouldShowData = ko.observable((function () {
                    var v = localStorage.getItem('show-games-table');
                    return v === undefined || v == 'true';
                })());
                shouldShowData.subscribe(function (v) { return localStorage.setItem('show-games-table', v.toString()); });
                var showData = ko.computed(function () { return !loading() && haveData() && shouldShowData(); });
                var showCanvas = ko.computed(function () { return !loading() && haveData(); });
                var aggregators = [
                    new aggregators_1.ScorewiseAggregator(),
                    new aggregators_1.BinaryAggregator()
                ];
                var activeView = ko.observable('');
                var activeSubview = ko.observable('');
                var activeViews = ko.observableArray([]);
                var activeSubviews = ko.observableArray([]);
                activeSubviews.subscribe(function (v) { activeSubview(v[0]); render(); });
                activeViews.subscribe(function (v) { activeView(v[0]); });
                activeView.subscribe(function (v) {
                    console.log('update main to ' + v);
                    var activeAggregator = aggregators.filter(function (a) { return a.window.name == v; })[0];
                    if (activeAggregator !== undefined) {
                        activeSubviews(activeAggregator.window.views.map(function (v) { return v.name; }));
                        render();
                    }
                });
                activeSubview.subscribe(function (v) { console.log('update sub to ' + v); render(); });
                activeViews(aggregators.map(function (a) { return a.window.name; }));
                var numGames = ko.observable('...');
                var numGamesTotal = ko.observable('...');
                var url = 'https://foosball-results.herokuapp.com/api/';
                var api = new almaz_api_1.AlmazApi(url);
                var newPlayer = function (player) {
                    return {
                        apiPlayer: player.apiPlayer,
                        games: []
                    };
                };
                var elo = new elo_1.Elo();
                var elos = {
                    binary: function (p1, p2, s1, s2) {
                        var b1 = p1.score;
                        var b2 = p2.score;
                        elo.game(p1, p2, s1 > s2 ? 1 : 0, s1 < s2 ? 1 : 0);
                        return [p1.score - b1, p2.score - b2];
                    },
                    scorewise: function (p1, p2, s1, s2) {
                        var b1 = p1.score;
                        var b2 = p2.score;
                        elo.game(p1, p2, s1, s2);
                        return [p1.score - b1, p2.score - b2];
                    }
                };
                var newTeam = function (team) {
                    var ratings = {};
                    for (var name_1 in elos) {
                        ratings[name_1] = new elo_1.EloPlayer();
                    }
                    return {
                        defence: team.defence,
                        offence: team.offence,
                        ratings: ratings
                    };
                };
                var newGame = function (game) {
                    var redDeltas = {};
                    var bluDeltas = {};
                    for (var name_2 in elos) {
                        var fn = elos[name_2];
                        var deltas = fn(game.red.ratings[name_2], game.blu.ratings[name_2], game.redScore, game.bluScore);
                        redDeltas[name_2] = deltas[0];
                        bluDeltas[name_2] = deltas[1];
                    }
                    var g = {
                        red: game.red,
                        blu: game.blu,
                        redScore: game.redScore,
                        bluScore: game.bluScore,
                        redDeltas: redDeltas,
                        bluDeltas: bluDeltas,
                        startDate: game.startDate,
                        endDate: game.endDate
                    };
                    game.red.defence.games.push(g);
                    game.red.offence.games.push(g);
                    game.blu.defence.games.push(g);
                    game.blu.offence.games.push(g);
                    aggregators.forEach(function (a) { return a.logGame(g); });
                    return g;
                };
                var gp = new game_processor_1.GameProcessor(newPlayer, newTeam, newGame);
                api.getGames("").then(loadGames);
                function loadGames(data) {
                    numGamesTotal(data.length);
                    gp.processGames(data);
                    numGames(gp.numGames);
                    games(gp.games);
                    loading(false);
                    aggregators.forEach(function (a) { return a.autobreak(); });
                    render();
                }
                function render() {
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    var r = new geometry_2.Rect(5, ctx.canvas.height - 5, ctx.canvas.width - 10, -ctx.canvas.height + 10);
                    var p = new plotter_1.Plotter(ctx, r);
                    var activeAggregator = aggregators.filter(function (a) { return a.window.name == activeView(); })[0];
                    console.log(activeAggregator, activeView(), activeSubview());
                    if (activeAggregator !== undefined)
                        p.render(activeAggregator.window, activeSubview());
                }
                return {
                    loading: loading,
                    haveData: haveData,
                    shouldShowData: shouldShowData,
                    showData: showData,
                    showCanvas: showCanvas,
                    games: games,
                    numGames: numGames,
                    numGamesTotal: numGamesTotal,
                    activeView: activeView,
                    activeSubview: activeSubview,
                    activeViews: activeViews,
                    activeSubviews: activeSubviews
                };
            });
        }
    };
});
System.register("components/aggregators", ["lib/geometry", "lib/plot-data"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var geometry_3, plot_data_1, RatingAggregator, ScorewiseAggregator, BinaryAggregator, avg;
    return {
        setters: [
            function (geometry_3_1) {
                geometry_3 = geometry_3_1;
            },
            function (plot_data_1_1) {
                plot_data_1 = plot_data_1_1;
            }
        ],
        execute: function () {
            RatingAggregator = (function () {
                function RatingAggregator(windowName) {
                    this.ratings = {};
                    this.ratingso = {};
                    this.ratingsd = {};
                    this.plot = { name: 'all', data: [] };
                    this.plotd = { name: 'def', data: [] };
                    this.ploto = { name: 'off', data: [] };
                    this.region = new geometry_3.Rect(0, NaN, 0, 0);
                    this.n = 0;
                    this.prev = null;
                    this.cc = -1;
                    this.colors = '#f44336;#3f51b5;#8bc34a;#607d8b;#ff5722;#00bcd4;#e91e63;#00b294;#03a9f4;#ffb900;#107c10'.split(';');
                    this.colormap = {};
                    var that = this;
                    this.window = {
                        name: windowName,
                        get window() { return that.region; },
                        breaks: { x: [], y: [] },
                        views: [this.plot, this.plotd, this.ploto]
                    };
                }
                RatingAggregator.prototype.accomodate = function (p) {
                    var r = this.region;
                    var x = r.x;
                    var y = isNaN(r.y) ? p.y : r.y;
                    var w = r.w;
                    var h = r.h;
                    if (p.x < x) {
                        w += x - p.x;
                        x = p.x;
                    }
                    if (p.x > x + w) {
                        w += p.x - x - w;
                    }
                    if (p.y < y) {
                        h += y - p.y;
                        y = p.y;
                    }
                    if (p.y > y + h) {
                        h += p.y - y - h;
                    }
                    this.region = new geometry_3.Rect(x, y, w, h);
                };
                RatingAggregator.prototype.autobreak = function () {
                    var h = (((this.region.h + 15) / 10) | 0) * 10;
                    var miny = ((this.region.y / 10) | 0) * 10;
                    for (var i = 0; i <= h; i += 10) {
                        this.window.breaks.y.push(new plot_data_1.Break((miny + i).toString(), miny + i));
                    }
                    this.region = new geometry_3.Rect(this.region.x, miny, this.region.w, h);
                };
                RatingAggregator.prototype.logGame = function (g) {
                    if (this.prev == null || g.endDate.getDate() != this.prev.getDate()) {
                        this.window.breaks.x.push(new plot_data_1.Break(g.endDate.toString(), this.n + 1));
                        this.n += 3;
                    }
                    else if (this.prev != null && g.endDate.getTime() - this.prev.getTime() > 30 * 60 * 1000) {
                        this.window.breaks.x.push(new plot_data_1.Break("", this.n + 1));
                        this.n += 3;
                    }
                    this.prev = g.endDate;
                    this.logTeam(g.red);
                    this.logTeam(g.blu);
                    ++this.n;
                };
                RatingAggregator.prototype.logTeam = function (t) {
                    var r = this.getRating(t);
                    this.logPlayer(r, t.defence, true);
                    this.logPlayer(r, t.offence, false);
                };
                RatingAggregator.prototype.logPlayer = function (r, p, isDef) {
                    var key = p.apiPlayer._id;
                    var name = p.apiPlayer.firstName + ' ' + p.apiPlayer.lastName;
                    var subratings = isDef ? this.ratingsd : this.ratingso;
                    var rall = avg(this.logRating(key, r, this.ratings));
                    var rsub = avg(this.logRating(key, r, subratings));
                    this.postRating(name, rall, this.plot);
                    this.postRating(name, rsub, isDef ? this.plotd : this.ploto);
                };
                RatingAggregator.prototype.logRating = function (id, r, ratings) {
                    if (!(id in ratings))
                        ratings[id] = [];
                    ratings[id].push(r);
                    return ratings[id];
                };
                RatingAggregator.prototype.postRating = function (key, r, stream) {
                    var series = stream.data.filter(function (s) { return s.name == key; })[0];
                    if (series == undefined) {
                        series = { name: key, data: [], color: this.getColor(key) };
                        stream.data.push(series);
                    }
                    var p = new geometry_3.Point(this.n, r);
                    this.accomodate(p);
                    series.data.unshift(p);
                };
                RatingAggregator.prototype.getColor = function (key) {
                    if (!(key in this.colormap))
                        this.colormap[key] = this.colors[this.cc = (this.cc + 1) % this.colors.length];
                    return this.colormap[key];
                };
                return RatingAggregator;
            }());
            ScorewiseAggregator = (function (_super) {
                __extends(ScorewiseAggregator, _super);
                function ScorewiseAggregator() {
                    return _super.call(this, "Scorewise rating") || this;
                }
                ScorewiseAggregator.prototype.getRating = function (t) {
                    return t.ratings.scorewise.score;
                };
                return ScorewiseAggregator;
            }(RatingAggregator));
            exports_10("ScorewiseAggregator", ScorewiseAggregator);
            BinaryAggregator = (function (_super) {
                __extends(BinaryAggregator, _super);
                function BinaryAggregator() {
                    return _super.call(this, "Binary rating") || this;
                }
                BinaryAggregator.prototype.getRating = function (t) {
                    return t.ratings.binary.score;
                };
                return BinaryAggregator;
            }(RatingAggregator));
            exports_10("BinaryAggregator", BinaryAggregator);
            avg = function (a) {
                return a.length == 0 ? NaN : a.reduce(function (a, b) { return a + b; }) / a.length;
            };
        }
    };
});
System.register("components/score-model", [], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var getScoreSideModel, getScoreModel;
    return {
        setters: [],
        execute: function () {
            getScoreSideModel = function () {
                var score = ko.observable(null);
                var extendedScore = ko.computed({
                    read: function () {
                        var v = score();
                        return v != null && v > 3 ? v : 'more';
                    },
                    write: function (value) {
                        if (typeof (value) === 'number')
                            score(value);
                        else
                            score(null);
                    }
                });
                var isActive = function (n) {
                    return score() == n;
                };
                var setScore = function (n) {
                    score(n);
                };
                return { score: score, extendedScore: extendedScore, isActive: isActive, setScore: setScore };
            };
            exports_11("getScoreModel", getScoreModel = function () {
                return {
                    red: getScoreSideModel(),
                    blu: getScoreSideModel()
                };
            });
        }
    };
});
System.register("components/submitter-model", ["lib/almaz-api", "lib/elo", "components/score-model", "components/game-processor"], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var almaz_api_2, elo_2, score_model_1, game_processor_2, getSource, getCurrentTeamModel, getCurrentGameModel, getPendingUploads, setPendingUploads, getSubmitterModel, uniqueNickName, normalizeName, isNullObservable, whenAllNotNull;
    return {
        setters: [
            function (almaz_api_2_1) {
                almaz_api_2 = almaz_api_2_1;
            },
            function (elo_2_1) {
                elo_2 = elo_2_1;
            },
            function (score_model_1_1) {
                score_model_1 = score_model_1_1;
            },
            function (game_processor_2_1) {
                game_processor_2 = game_processor_2_1;
            }
        ],
        execute: function () {
            ko.bindingHandlers['text-as-pct'] = {
                update: function (e, value, all) {
                    var v = ko.unwrap(value());
                    if (typeof (v) == 'number')
                        e.innerHTML = Math.round(Math.max(Math.min(1, v)) * 100).toFixed(0) + '%';
                    else
                        e.innerHTML = '&nbsp;';
                }
            };
            getSource = function () {
                var apiSource = localStorage.getItem('kicker-api-source');
                if (apiSource == null) {
                    apiSource = prompt("Please enter a name for this client.");
                    if (apiSource == null)
                        throw new Error('API Source parameter is required');
                    localStorage.setItem('kicker-api-source', apiSource);
                }
                return apiSource;
            };
            getCurrentTeamModel = function () {
                var d = ko.observable(null);
                var o = ko.observable(null);
                return {
                    numTotalGames: ko.observable(null),
                    expectedWinProb: ko.observable(null),
                    historicWins: ko.observable(null),
                    historicWinRate: ko.observable(null),
                    defence: d,
                    offence: o,
                    defenceNickName: ko.computed(function () {
                        var v = d();
                        return v == null ? null : v.nickName;
                    }),
                    offenceNickName: ko.computed(function () {
                        var v = o();
                        return v == null ? null : v.nickName;
                    })
                };
            };
            getCurrentGameModel = function () {
                return {
                    red: getCurrentTeamModel(),
                    blu: getCurrentTeamModel(),
                    historicGames: ko.observable(null)
                };
            };
            getPendingUploads = function () {
                var data = localStorage.getItem('kicker-pending-uploads');
                if (data == null)
                    return [];
                else
                    return JSON.parse(data);
            };
            setPendingUploads = function (games) {
                localStorage.setItem('kicker-pending-uploads', JSON.stringify(games));
            };
            exports_12("getSubmitterModel", getSubmitterModel = function () {
                var url = 'https://foosball-results.herokuapp.com/api/';
                var api = new almaz_api_2.AlmazApi(url);
                var apiSource = 'og-source/' + getSource();
                var m = {};
                var elo = new elo_2.Elo();
                var players = m.players = ko.observableArray([]);
                var newPlayer = function (player) {
                    var p = players().filter(function (p) { return p.apiPlayer._id == player.apiPlayer._id; })[0];
                    console.log(players().length, player, p);
                    return p;
                };
                var newTeam = function (team) {
                    return {
                        defence: team.defence,
                        offence: team.offence,
                        rating: new elo_2.EloPlayer()
                    };
                };
                var newGame = function (game) {
                    elo.game(game.red.rating, game.blu.rating, game.redScore, game.bluScore);
                    return {
                        red: game.red,
                        blu: game.blu,
                        redScore: game.redScore,
                        bluScore: game.bluScore,
                        startDate: game.startDate,
                        endDate: game.endDate
                    };
                };
                var gp = new game_processor_2.GameProcessor(newPlayer, newTeam, newGame);
                var pendingUploads = getPendingUploads();
                var startTime;
                var currentGame = getCurrentGameModel();
                m.currentGame = ko.observable(currentGame);
                var gameReady = m.gameReady = ko.observable(false);
                var playersReady = m.playersReady = ko.observable(false);
                var gamesReady = m.gamesReady = ko.observable(false);
                var numGames = m.numGames = ko.observable(0);
                var scores = m.scores = score_model_1.getScoreModel();
                var scoresReady = m.scoresReady = ko.computed(function () {
                    return scores.red.score() != null && scores.blu.score() != null && scores.blu.score() != scores.red.score();
                });
                var findWins = function (team) {
                    return function (game) {
                        return (game.blu == team && game.bluScore > game.redScore)
                            || (game.red == team && game.redScore > game.bluScore);
                    };
                };
                gameReady.subscribe(function (v) {
                    if (v) {
                        var red = gp.findTeam(currentGame.red.defence(), currentGame.red.offence());
                        var blu = gp.findTeam(currentGame.blu.defence(), currentGame.blu.offence());
                        var commonGames = gp.findMutualGames(red, blu);
                        var n = commonGames.length;
                        currentGame.historicGames(n);
                        var redWins = commonGames.filter(findWins(red));
                        var bluWins = commonGames.filter(findWins(blu));
                        currentGame.red.historicWins(redWins.length);
                        currentGame.blu.historicWins(bluWins.length);
                        currentGame.red.historicWinRate(n > 0 ? redWins.length / n : 0);
                        currentGame.blu.historicWinRate(n > 0 ? bluWins.length / n : 0);
                        currentGame.red.expectedWinProb(elo.expectWin(red.rating, blu.rating));
                        currentGame.blu.expectedWinProb(elo.expectWin(blu.rating, red.rating));
                        startTime = new Date();
                    }
                });
                var picksPending = [];
                var loadTeam = function (side) {
                    whenAllNotNull(gamesReady).then(function () {
                        var pickTeam = currentGame[side];
                        var def = pickTeam.defence();
                        var off = pickTeam.offence();
                        var team = gp.findTeam(def, off);
                        var gamesx = gp.findGames(team);
                        pickTeam.numTotalGames(gamesx.length);
                    });
                };
                var resetPicking = function () {
                    currentGame = getCurrentGameModel();
                    m.currentGame(currentGame);
                    m.gameReady(false);
                    picksPending = [
                        currentGame.red.defence,
                        currentGame.red.offence,
                        currentGame.blu.offence,
                        currentGame.blu.defence
                    ];
                    whenAllNotNull(currentGame.red.defence, currentGame.red.offence).then(function () { return loadTeam('red'); });
                    whenAllNotNull(currentGame.blu.defence, currentGame.blu.offence).then(function () { return loadTeam('blu'); });
                };
                var consecutiveWins = { red: 0, blu: 0 };
                var updatePicker = function (winners) {
                    var losers = winners == 'red' ? 'blu' : 'red';
                    var winPicker = currentGame[winners];
                    var lstPicker = currentGame[losers];
                    lstPicker.defence(lstPicker.offence());
                    if (++consecutiveWins[winners] >= 3) {
                        lstPicker.offence(winPicker.offence());
                        winPicker.offence(null);
                        picksPending = [winPicker.offence];
                        consecutiveWins.red = 0;
                        consecutiveWins.blu = 0;
                        loadTeam(losers);
                        whenAllNotNull(winPicker.offence).then(function () { return loadTeam(winners); });
                    }
                    else {
                        lstPicker.offence(null);
                        picksPending = [lstPicker.offence];
                        consecutiveWins[losers] = 0;
                        loadTeam(winners);
                        whenAllNotNull(lstPicker.offence).then(function () { return loadTeam(losers); });
                    }
                    gameReady(false);
                };
                var resetScores = function () {
                    scores.red.score(null);
                    scores.blu.score(null);
                };
                m.resetGame = function () {
                    consecutiveWins.red = 0;
                    consecutiveWins.blu = 0;
                    resetPicking();
                    resetScores();
                };
                m.submitGame = function () {
                    var gamePlayed = {
                        startDate: startTime.toISOString(),
                        endDate: new Date().toISOString(),
                        source: apiSource,
                        red: {
                            defense: currentGame.red.defence().apiPlayer,
                            offense: currentGame.red.offence().apiPlayer,
                            score: scores.red.score() || 0,
                        },
                        blue: {
                            defense: currentGame.blu.defence().apiPlayer,
                            offense: currentGame.blu.offence().apiPlayer,
                            score: scores.blu.score() || 0,
                        }
                    };
                    gp.logGame(gamePlayed);
                    m.numGames(gp.numGames);
                    uploadGame(gamePlayed);
                    var redScore = scores.red.score();
                    var bluScore = scores.blu.score();
                    if (redScore != null && bluScore != null && redScore != bluScore)
                        updatePicker(bluScore > redScore ? 'blu' : 'red');
                    else
                        resetPicking();
                    resetScores();
                };
                m.pick = function (player) {
                    var next;
                    if ((next = picksPending.shift()) != null) {
                        next(player);
                        m.gameReady(picksPending.length == 0);
                    }
                };
                m.anyPicked = ko.computed(function () {
                    var currentGame = m.currentGame();
                    return currentGame.red.defence() != null
                        || currentGame.red.offence() != null
                        || currentGame.blu.defence() != null
                        || currentGame.blu.offence() != null;
                });
                m.isNotPicked = function (player) {
                    var currentGame = m.currentGame();
                    return currentGame.red.defence() != player
                        && currentGame.red.offence() != player
                        && currentGame.blu.defence() != player
                        && currentGame.blu.offence() != player;
                };
                api.getPlayers().then(function (apiPlayers) {
                    apiPlayers.forEach(function (player) {
                        m.players.push({
                            nickName: uniqueNickName(player, apiPlayers),
                            apiPlayer: player,
                        });
                    });
                    m.playersReady(true);
                });
                var dumpPendingUploads = function () {
                    while (pendingUploads.length > 0) {
                        var next = pendingUploads.shift();
                        if (next)
                            uploadGame(next, true);
                    }
                    setPendingUploads(pendingUploads);
                };
                var uploadGame = function (game, isDumping) {
                    if (isDumping === void 0) { isDumping = false; }
                    api.postGame(game, apiSource)
                        .then(function () {
                        if (!isDumping)
                            dumpPendingUploads();
                    })
                        .catch(function (e) {
                        console.log(e);
                        pendingUploads.push(game);
                        setPendingUploads(pendingUploads);
                    });
                };
                dumpPendingUploads();
                api.getGames('').then(function (apiGames) {
                    gp.processGames(apiGames);
                    m.numGames(gp.numGames);
                    m.gamesReady(true);
                });
                resetPicking();
                return m;
            });
            uniqueNickName = function (player, players) {
                var nickName = normalizeName(player.firstName);
                if (!players.some(function (p) { return p._id != player._id && normalizeName(p.firstName) == nickName; }))
                    return nickName;
                nickName = player.lastName;
                if (!players.some(function (p) { return p._id != player._id && p.lastName == nickName; }))
                    return nickName;
                return player.firstName + ' ' + player.lastName;
            };
            normalizeName = function (name) {
                if ('Mykyta'.indexOf(name) >= 0)
                    return 'Nikita';
                if ('Dmytro'.indexOf(name) >= 0)
                    return 'Dima';
                if ('Andriy;Andrii;Andrey'.indexOf(name) >= 0)
                    return 'Andriy';
                if ('Sergei;Sergii;Serhii;Serge'.indexOf(name) >= 0)
                    return 'Sergii';
                if ('Vova;Volodymyr;Vladimir'.indexOf(name) >= 0)
                    return 'Vova';
                return name;
            };
            isNullObservable = function (o) {
                var v = o();
                return typeof (v) == 'boolean' ? v === false : v == null;
            };
            whenAllNotNull = function () {
                var observables = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    observables[_i] = arguments[_i];
                }
                return new Promise(function (resolve, reject) {
                    var test = function () {
                        var res = !observables.some(isNullObservable);
                        if (res) {
                            resolve();
                        }
                        return res;
                    };
                    if (!test())
                        observables.forEach(function (o) { return o.subscribe(test); });
                });
            };
        }
    };
});
System.register("lib/color", [], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
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
    exports_13("hcy2rgb", hcy2rgb);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("lib/view-selector", [], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=bundle.js.map