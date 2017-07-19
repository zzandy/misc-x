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
System.register("components/score-model", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
            exports_1("getScoreModel", getScoreModel = function () {
                return {
                    red: getScoreSideModel(),
                    blu: getScoreSideModel()
                };
            });
        }
    };
});
System.register("lib/ajax", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
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
    exports_2("request", request);
    function postJson(url, data) {
        return request('POST', url, data);
    }
    exports_2("postJson", postJson);
    function getJson(url) {
        return request('GET', url);
    }
    exports_2("getJson", getJson);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("lib/almaz-api", ["lib/ajax"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
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
            exports_3("ApiPlayer", ApiPlayer);
            ApiTeam = (function () {
                function ApiTeam() {
                }
                return ApiTeam;
            }());
            exports_3("ApiTeam", ApiTeam);
            ApiGame = (function () {
                function ApiGame() {
                }
                return ApiGame;
            }());
            exports_3("ApiGame", ApiGame);
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
            exports_3("AlmazApi", AlmazApi);
        }
    };
});
System.register("lib/elo", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
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
            exports_4("EloPlayer", EloPlayer);
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
            exports_4("Elo", Elo);
        }
    };
});
System.register("components/submitter-model", ["lib/almaz-api", "lib/elo", "components/score-model"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var almaz_api_1, elo_1, score_model_1, getSource, getCurrentTeamModel, getCurrentGameModel, getPendingUploads, setPendingUploads, getSubmitterModel, byEndDate, removeDuplicates, areDuplicates, teamEqual, removeStagingData, uniqueNickName, normalizeName, isNullObservable, whenAllNotNull;
    return {
        setters: [
            function (almaz_api_1_1) {
                almaz_api_1 = almaz_api_1_1;
            },
            function (elo_1_1) {
                elo_1 = elo_1_1;
            },
            function (score_model_1_1) {
                score_model_1 = score_model_1_1;
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
            exports_5("getSubmitterModel", getSubmitterModel = function () {
                var url = 'https://foosball-results.herokuapp.com/api/';
                var api = new almaz_api_1.AlmazApi(url);
                var apiSource = 'og-source/' + getSource();
                var m = {};
                var teams = [];
                var games = [];
                var pendingUploads = getPendingUploads();
                var startTime;
                var currentGame = getCurrentGameModel();
                m.currentGame = ko.observable(currentGame);
                var players = m.players = ko.observableArray([]);
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
                        var red = findTeam(currentGame.red.defence(), currentGame.red.offence());
                        var blu = findTeam(currentGame.blu.defence(), currentGame.blu.offence());
                        var commonGames = findMutualGames(red, blu);
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
                var findPlayer = function (id) {
                    return players().filter(function (p) { return p.apiPlayer._id == id; })[0];
                };
                var findTeam = function (defence, offence) {
                    var matches = teams.filter(function (t) { return t.defence == defence && t.offence == offence; });
                    if (matches.length == 0) {
                        var team = {
                            defence: defence,
                            offence: offence,
                            rating: new elo_1.EloPlayer()
                        };
                        teams.push(team);
                        return team;
                    }
                    else {
                        return matches[0];
                    }
                };
                var findGames = function (team) {
                    return games.filter(function (g) { return g.blu == team || g.red == team; });
                };
                var findMutualGames = function (a, b) {
                    return games.filter(function (g) { return (g.blu == a && g.red == b) || (g.blu == b && g.red == a); });
                };
                var loadTeam = function (side) {
                    whenAllNotNull(gamesReady).then(function () {
                        var pickTeam = currentGame[side];
                        var def = pickTeam.defence();
                        var off = pickTeam.offence();
                        var team = findTeam(def, off);
                        var gamesx = findGames(team);
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
                    logGame(gamePlayed);
                    m.numGames(games.length);
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
                var elo = new elo_1.Elo();
                var logGame = function (game) {
                    var red = findTeam(findPlayer(game.red.defense._id), findPlayer(game.red.offense._id));
                    var blu = findTeam(findPlayer(game.blue.defense._id), findPlayer(game.blue.offense._id));
                    var gameRecord = {
                        red: red,
                        blu: blu,
                        redScore: game.red.score || 0,
                        bluScore: game.blue.score || 0,
                    };
                    elo.game(red.rating, blu.rating, gameRecord.redScore, gameRecord.bluScore);
                    games.push(gameRecord);
                };
                api.getGames('').then(function (apiGames) {
                    apiGames.sort(byEndDate)
                        .filter(removeStagingData)
                        .filter(removeDuplicates)
                        .forEach(logGame);
                    m.numGames(games.length);
                    m.gamesReady(true);
                });
                resetPicking();
                return m;
            });
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
System.register("lib/canvas", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
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
    exports_6("fullscreenCanvas", fullscreenCanvas);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("lib/color", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
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
    exports_7("hcy2rgb", hcy2rgb);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("lib/geometry", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
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
            exports_8("Point", Point);
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
            exports_8("Rect", Rect);
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
            exports_8("Range", Range);
        }
    };
});
System.register("lib/plot-data", [], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
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
            exports_9("Break", Break);
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
            exports_9("DataWindow", DataWindow);
            PlotData = (function () {
                function PlotData(name, data) {
                    this.name = name;
                    this.data = data;
                }
                return PlotData;
            }());
            exports_9("PlotData", PlotData);
            Series = (function () {
                function Series(name, data) {
                    this.name = name;
                    this.data = data;
                }
                return Series;
            }());
            exports_9("Series", Series);
        }
    };
});
System.register("lib/plotter", ["lib/geometry"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    function last(array) {
        return array[array.length - 1];
    }
    exports_10("last", last);
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
            exports_10("Plotter", Plotter);
        }
    };
});
System.register("lib/view-selector", [], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
//# sourceMappingURL=bundle.js.map