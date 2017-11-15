/// <reference path="../../node_modules/@types/knockout/index.d.ts" />

import { AlmazApi, ApiPlayer, ApiTeam, ApiGame } from '../lib/almaz-api';
import { Elo, EloPlayer } from '../lib/elo';
import { getScoreModel } from 'score-model';
import { GameProcessor, Player, Team, Game } from './game-processor';

interface NickPlayer extends Player {
    nickName: string;
    hide: boolean;
}

interface EloTeam extends Team<NickPlayer> {
    rating: EloPlayer
}

interface EloGame extends Game<NickPlayer, EloTeam> {
}

ko.bindingHandlers['text-as-pct'] = {
    update: (e, value, all) => {
        const v = ko.unwrap(value());
        if (typeof (v) == 'number')
            (<Element>e).innerHTML = Math.round(Math.max(Math.min(1, v)) * 100).toFixed(0) + '%';
        else
            (<Element>e).innerHTML = '&nbsp;';
    }
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
    const d = ko.observable<NickPlayer>(null);
    const o = ko.observable<NickPlayer>(null);

    return {
        numTotalGames: ko.observable<number | null>(null),
        expectedWinProb: ko.observable<number | null>(null),
        historicWins: ko.observable<number | null>(null),
        historicWinRate: ko.observable<number | null>(null),
        defence: d,
        offence: o,
        defenceNickName: ko.computed(() => {
            const v: NickPlayer = d();
            return v == null ? null : v.nickName;
        }),
        offenceNickName: ko.computed(() => {
            const v: NickPlayer = o();
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
    const elo = new Elo();
    const players = m.players = ko.observableArray<NickPlayer>([]);
    m.visiblePlayers = ko.computed<NickPlayer[]>(() => m.players().filter((p: NickPlayer) => !hidePlayer(p.apiPlayer)));

    const newPlayer = (player: Player): NickPlayer => {

        const p = players().filter(p => p.apiPlayer._id == player.apiPlayer._id)[0];

        return p;
    }

    const newTeam = (team: Team<NickPlayer>): EloTeam => {
        return {
            defence: team.defence,
            offence: team.offence,
            rating: new EloPlayer()
        }
    }

    const newGame = (game: Game<NickPlayer, EloTeam>): EloGame => {
        elo.game(game.red.rating, game.blu.rating, game.redScore, game.bluScore);

        return {
            _id: game._id,
            red: game.red,
            blu: game.blu,
            redScore: game.redScore,
            bluScore: game.bluScore,
            startDate: game.startDate,
            endDate: game.endDate
        }
    }

    const gp = new GameProcessor<NickPlayer, EloTeam, EloGame>(newPlayer, newTeam, newGame);

    const pendingUploads = getPendingUploads();

    let startTime: Date;
    let currentGame = getCurrentGameModel();
    m.currentGame = ko.observable(currentGame);

    const gameReady = m.gameReady = ko.observable<boolean>(false);

    const playersReady = m.playersReady = ko.observable(false);
    const gamesReady = m.gamesReady = ko.observable(false);
    const numGames = m.numGames = ko.observable(0);

    const submittedGames = m.submittedGames = ko.observableArray<EloGame>();

    const scores = m.scores = getScoreModel();
    const scoresReady = m.scoresReady = ko.computed(() => {
        return scores.red.score() != null && scores.blu.score() != null && scores.blu.score() != scores.red.score();
    });

    const findWins = (team: EloTeam) => {
        return (game: EloGame) => {
            return (game.blu == team && game.bluScore > game.redScore)
                || (game.red == team && game.redScore > game.bluScore);
        };
    }

    gameReady.subscribe((v: boolean) => {
        if (v) {
            const red = gp.findTeam(currentGame.red.defence(), currentGame.red.offence());
            const blu = gp.findTeam(currentGame.blu.defence(), currentGame.blu.offence());

            const commonGames = gp.findMutualGames(red, blu);
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

    const loadTeam = (side: 'red' | 'blu') => {
        whenAllNotNull(gamesReady).then(() => {
            const pickTeam = currentGame[side];

            const def = pickTeam.defence();
            const off = pickTeam.offence();

            const team = gp.findTeam(def, off);
            const gamesx = gp.findGames(team);

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
            consecutiveWins[losers] = 0;

            loadTeam(winners);
            whenAllNotNull(lstPicker.offence).then(() => loadTeam(losers));
        }

        gameReady(false);
    }

    const resetScores = () => {
        scores.red.score(null);
        scores.blu.score(null);
    };

    m.cancelGame = function (this: EloGame) {
        console.log(this)
        if (this._id === undefined)
            return;

        const red = this.red.defence.nickName + ' (def) ' + this.red.offence.nickName + ' (off)';
        const blu = this.blu.offence.nickName + ' (off) ' + this.blu.defence.nickName + ' (def)';

        if (confirm(`About to delete game between\n${red} and ${blu}.\n\nAre you sure?`))
            api.deleteGame(this._id).then(d => {
                submittedGames(submittedGames().filter(g => g._id != this._id));
            });
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

        m.numGames(gp.numGames);
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
        const uniqueName = getUniqueNames(apiPlayers.filter(showPlayer));
        apiPlayers.forEach((player, i, players) => {
            m.players.push({
                nickName: uniqueName[player._id] || player.firstName + ' ' + player.lastName,
                hide: hidePlayer(player),
                apiPlayer: player,
            })
        });

        m.playersReady(true);
    });

    const dumpPendingUploads = function () {

        while (pendingUploads.length > 0) {
            const next = pendingUploads.shift();
            setPendingUploads(pendingUploads);

            if (next)
                uploadGame(next, true);
        }
    }

    const uploadGame = (game: ApiGame, isDumping: boolean = false) => {
        api.postGame(game, apiSource)
            .then(gameid => {
                submittedGames.push(gp.logGame(game, gameid))
                const now = new Date().getTime();
                const a = submittedGames();
                const n = a.length - 5
                submittedGames(a.filter((g, i) => {
                    return (now - g.endDate.getTime()) < 1000 * 60 * 5 && i >= n;
                }));
            })
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

    api.getGames('').then((apiGames) => {
        gp.processGames(apiGames);

        m.numGames(gp.numGames);
        m.gamesReady(true);
    });

    resetPicking();

    return m;
};
const getUniqueNames = (players: ApiPlayer[]) => {
    const names: { [key: string]: ApiPlayer[] } = {};
    for (const player of players) {
        const name = normalizeName(player.firstName);

        if (!(name in names)) names[name] = [];
        names[name].push(player);
    }

    const res: { [key: string]: string } = {};

    for (const name in names) {
        const player = names[name];

        if(player.length == 1)res[player[0]._id] = name;
        else for(const p of player){
            res[p._id] = name + ' ' + p.lastName[0];
        }
    }

    return res;
}

const nameMapping: { [key: string]: string } = {
    'Mykyta': 'Nikita',
    'Dmytro,Dmitrii,Dmitriy': 'Dima',
    'Andrii,Andrey': 'Andriy',
    'Sergei,Serhii': 'Sergii',
    'Volodymyr,Vladimir': 'Vova',
    'Alexander,Oleksandr': 'Sasha'
};

const normalizeName = (name: string) => {
    for (let key in nameMapping) {
        if (key.indexOf(name) != -1) return nameMapping[key];
    }

    return name;
}

const showPlayer = (player: ApiPlayer): boolean => !hidePlayer(player);
const hidePlayer = (player: ApiPlayer): boolean => player._id == '593efed3f36d2806fcd5cd7e' // player._id == '5948ffa87e00b50004cd35ed';

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