/// <reference path="../../node_modules/@types/knockout/index.d.ts" />

import { AlmazApi, ApiPlayer, ApiTeam, ApiGame } from '../lib/almaz-api';
import { Elo, EloPlayer } from '../lib/elo';
import { getScoreModel } from 'score-model';

ko.bindingHandlers['text-as-pct'] = {
    update: (e, value, all) => {
        const v = ko.unwrap(value());
        if (typeof (v) == 'number')
            (<Element>e).innerHTML = Math.round(Math.max(Math.min(1, v)) * 100).toFixed(0) + '%';
        else
            (<Element>e).innerHTML = '&nbsp;';
    }
}

interface Player {
    readonly nickName: string;
    readonly apiPlayer: ApiPlayer;
}

interface Team {
    defence: Player;
    offence: Player;
    rating: EloPlayer;
}

interface Game {
    red: Team;
    blu: Team;
    redScore: number;
    bluScore: number
}

const getSource = () => {
    let apiSource = localStorage.getItem('kicker-api-source');
    if (apiSource == null) {
        apiSource = prompt("Please enter a name for this client.");

        if (apiSource == null)
            throw new Error('API Source parameter is required');

        localStorage.setItem('kicker-api-source', apiSource);
    }

    return apiSource;
}

const getCurrentTeamModel = () => {
    const d = ko.observable<Player>(null);
    const o = ko.observable<Player>(null);

    return {
        numTotalGames: ko.observable<number | null>(null),
        expectedWinProb: ko.observable<number | null>(null),
        historicWins: ko.observable<number | null>(null),
        historicWinRate: ko.observable<number | null>(null),
        defence: d,
        offence: o,
        defenceNickName: ko.computed(() => {
            const v: Player = d();
            return v == null ? null : v.nickName;
        }),
        offenceNickName: ko.computed(() => {
            const v: Player = o();
            return v == null ? null : v.nickName;
        })
    }
}

const getCurrentGameModel = () => {
    return {
        red: getCurrentTeamModel(),
        blu: getCurrentTeamModel(),
        historicGames: ko.observable<number | null>(null)
    }
}

const getPendingUploads = (): ApiGame[] => {
    const data = localStorage.getItem('kicker-pending-uploads');

    if (data == null)
        return [];

    else
        return JSON.parse(data);
}

const setPendingUploads = (games: ApiGame[]) => {
    localStorage.setItem('kicker-pending-uploads', JSON.stringify(games));
}

export const getSubmitterModel = () => {
    const url = 'https://foosball-results.herokuapp.com/api/';
    const api = new AlmazApi(url);
    const apiSource = 'og-source/' + getSource();

    const m: any = {};

    const teams: Team[] = [];
    const games: Game[] = [];

    const pendingUploads = getPendingUploads();

    let startTime: Date;
    let currentGame = getCurrentGameModel();
    m.currentGame = ko.observable(currentGame);
    const players = m.players = ko.observableArray<Player>([]);
    const gameReady = m.gameReady = ko.observable<boolean>(false);

    const playersReady = m.playersReady = ko.observable(false);
    const gamesReady = m.gamesReady = ko.observable(false);
    const numGames = m.numGames = ko.observable(0);

    const scores = m.scores = getScoreModel();
    const scoresReady = m.scoresReady = ko.computed(() => {
        return scores.red.score() != null && scores.blu.score() != null && scores.blu.score() != scores.red.score();
    });

    const findWins = (team: Team) => {
        return (game: Game) => {
            return (game.blu == team && game.bluScore > game.redScore)
                || (game.red == team && game.redScore > game.bluScore);
        };
    }

    gameReady.subscribe((v: boolean) => {
        if (v) {
            const red = findTeam(currentGame.red.defence(), currentGame.red.offence());
            const blu = findTeam(currentGame.blu.defence(), currentGame.blu.offence());

            const commonGames = findMutualGames(red, blu);
            const n = commonGames.length;

            currentGame.historicGames(n);

            const redWins = commonGames.filter(findWins(red));
            const bluWins = commonGames.filter(findWins(blu));

            currentGame.red.historicWins(redWins.length);
            currentGame.blu.historicWins(bluWins.length);

            currentGame.red.historicWinRate(n > 0 ? redWins.length / n : 0);
            currentGame.blu.historicWinRate(n > 0 ? bluWins.length / n : 0);

            currentGame.red.expectedWinProb(elo.expectWin(red.rating, blu.rating));
            currentGame.blu.expectedWinProb(elo.expectWin(blu.rating, red.rating));

            startTime = new Date();
        }
    });

    let picksPending: KnockoutObservable<Player>[] = [];

    const findPlayer = (id: string) => {
        return players().filter(p => p.apiPlayer._id == id)[0];
    }

    const findTeam = (defence: Player, offence: Player) => {
        const matches = teams.filter(t => t.defence == defence && t.offence == offence);

        if (matches.length == 0) {
            const team = {
                defence: defence,
                offence: offence,
                rating: new EloPlayer()
            };
            teams.push(team);
            return team;
        }
        else {
            return matches[0];
        }
    }

    const findGames = (team: Team) => {
        return games.filter(g => g.blu == team || g.red == team);
    };

    const findMutualGames = (a: Team, b: Team) => {
        return games.filter(g => (g.blu == a && g.red == b) || (g.blu == b && g.red == a));
    };

    const loadTeam = (side: 'red' | 'blu') => {
        whenAllNotNull(gamesReady).then(() => {
            const pickTeam = currentGame[side];

            const def = pickTeam.defence();
            const off = pickTeam.offence();

            const team = findTeam(def, off);
            const gamesx = findGames(team);

            pickTeam.numTotalGames(gamesx.length);
        });
    }

    const resetPicking = () => {
        currentGame = getCurrentGameModel();
        m.currentGame(currentGame);
        m.gameReady(false);

        picksPending = [
            currentGame.red.defence,
            currentGame.red.offence,
            currentGame.blu.offence,
            currentGame.blu.defence
        ];

        whenAllNotNull(currentGame.red.defence, currentGame.red.offence).then(() => loadTeam('red'));
        whenAllNotNull(currentGame.blu.defence, currentGame.blu.offence).then(() => loadTeam('blu'));
    };

    const consecutiveWins = { red: 0, blu: 0 };

    const updatePicker = (winners: 'red' | 'blu') => {

        const losers = winners == 'red' ? 'blu' : 'red';
        const winPicker = currentGame[winners];
        const lstPicker = currentGame[losers];

        lstPicker.defence(lstPicker.offence());

        if (++consecutiveWins[winners] >= 3) {
            // three consecutive wins, shuffle the winning team
            lstPicker.offence(winPicker.offence());
            winPicker.offence(null);
            picksPending = [winPicker.offence];
            consecutiveWins.red = 0;
            consecutiveWins.blu = 0;

            loadTeam(losers);
            whenAllNotNull(winPicker.offence).then(() => loadTeam(winners));
        }
        else {
            lstPicker.offence(null);
            picksPending = [lstPicker.offence];

            loadTeam(winners);
            whenAllNotNull(lstPicker.offence).then(() => loadTeam(losers));
        }

        gameReady(false);
    }

    const resetScores = () => {
        scores.red.score(null);
        scores.blu.score(null);
    };

    m.resetGame = () => {
        consecutiveWins.red = 0;
        consecutiveWins.blu = 0;

        resetPicking();
        resetScores();
    };

    m.submitGame = () => {

        const gamePlayed: ApiGame = {
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

        const redScore = scores.red.score();
        const bluScore = scores.blu.score();

        if (redScore != null && bluScore != null && redScore != bluScore)
            updatePicker(bluScore > redScore ? 'blu' : 'red');
        else
            resetPicking();

        resetScores();
    };

    m.pick = (player: Player) => {
        let next: KnockoutObservable<Player> | undefined;
        if ((next = picksPending.shift()) != null) {
            next(player);
            m.gameReady(picksPending.length == 0);
        }
    };

    m.anyPicked = ko.computed(() => {
        let currentGame = m.currentGame();
        return currentGame.red.defence() != null
            || currentGame.red.offence() != null
            || currentGame.blu.defence() != null
            || currentGame.blu.offence() != null;
    });

    m.isNotPicked = (player: Player) => {
        let currentGame = m.currentGame();
        return currentGame.red.defence() != player
            && currentGame.red.offence() != player
            && currentGame.blu.defence() != player
            && currentGame.blu.offence() != player;
    };

    api.getPlayers().then((apiPlayers) => {
        apiPlayers.forEach(player => {
            m.players.push({
                nickName: uniqueNickName(player, apiPlayers),
                apiPlayer: player,
            })
        });

        m.playersReady(true);
    });

    const dumpPendingUploads = function () {

        while (pendingUploads.length > 0) {
            const next = pendingUploads.shift();
            if (next)
                uploadGame(next, true);
        }

        setPendingUploads(pendingUploads);
    }

    const uploadGame = (game: ApiGame, isDumping: boolean = false) => {
        api.postGame(game, apiSource)
            .then(() => {
                if (!isDumping)
                    dumpPendingUploads();
            })
            .catch((e) => {
                console.log(e);

                pendingUploads.push(game);
                setPendingUploads(pendingUploads);
            });
    }

    dumpPendingUploads();

    const elo = new Elo();
    const logGame = (game: ApiGame) => {
        const red = findTeam(findPlayer(game.red.defense._id), findPlayer(game.red.offense._id));
        const blu = findTeam(findPlayer(game.blue.defense._id), findPlayer(game.blue.offense._id));

        const gameRecord = {
            red: red,
            blu: blu,
            redScore: game.red.score || 0,
            bluScore: game.blue.score || 0,
        };

        elo.game(red.rating, blu.rating, gameRecord.redScore, gameRecord.bluScore);

        games.push(gameRecord);
    };

    api.getGames('').then((apiGames) => {
        apiGames.sort(byEndDate)
            .filter(removeStagingData)
            .filter(removeDuplicates)
            .forEach(logGame);
        m.numGames(games.length);
        m.gamesReady(true);
    });

    resetPicking();

    return m;
};

const byEndDate = (a: ApiGame, b: ApiGame) => {
    return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
}

const removeDuplicates = (game: ApiGame, i: number, a: ApiGame[]) => {
    return i == 0 || !areDuplicates(game, a[i - 1]);
};

const areDuplicates = (a: ApiGame, b: ApiGame) => {
    const diff = Math.abs(new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    return diff < 120000 && ((teamEqual(a.red, b.red) && teamEqual(a.blue, b.blue)) || (teamEqual(a.red, b.blue) && teamEqual(a.blue, b.red)));
}

const teamEqual = (a: ApiTeam, b: ApiTeam) => {
    return a.score == b.score && a.defense._id == b.defense._id && a.offense._id == b.offense._id;
}

const removeStagingData = (game: ApiGame) => {
    return 'source' in game && game.source.indexOf('staging') == -1;
}

const uniqueNickName = (player: ApiPlayer, players: ApiPlayer[]) => {
    let nickName = normalizeName(player.firstName);

    if (!players.some(p => p._id != player._id && normalizeName(p.firstName) == nickName))
        return nickName;

    nickName = player.lastName;

    if (!players.some(p => p._id != player._id && p.lastName == nickName))
        return nickName;

    return player.firstName + ' ' + player.lastName;
}

const normalizeName = (name: string) => {
    if ('Mykyta'.indexOf(name) >= 0) return 'Nikita';
    if ('Dmytro'.indexOf(name) >= 0) return 'Dima';
    if ('Andriy;Andrii;Andrey'.indexOf(name) >= 0) return 'Andriy';
    if ('Sergei;Sergii;Serhii;Serge'.indexOf(name) >= 0) return 'Sergii';
    if ('Vova;Volodymyr;Vladimir'.indexOf(name) >= 0) return 'Vova';

    return name;
}

const isNullObservable = <T>(o: KnockoutObservable<T>) => {
    const v = o();
    return typeof (v) == 'boolean' ? v === false : v == null;
};

const whenAllNotNull = <T>(...observables: KnockoutObservable<T>[]) => {
    return new Promise((resolve, reject) => {
        const test = () => {
            const res = !observables.some(isNullObservable);
            if (res) {
                resolve();
            }
            return res;
        };

        if (!test())
            observables.forEach(o => o.subscribe(test));
    });
}