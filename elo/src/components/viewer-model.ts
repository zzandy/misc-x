/// <reference path="../../node_modules/@types/knockout/index.d.ts" />

import { AlmazApi, ApiPlayer, ApiTeam, ApiGame } from '../lib/almaz-api';
import { Elo, EloPlayer } from '../lib/elo';
import { GameProcessor, Player, Team, Game } from './game-processor';
import { IAggregator, ScorewiseAggregator, BinaryAggregator, WinrateAggregator, RecentWinrateAggregator } from './aggregators';
import { Rect } from '../lib/geometry';
import { Plotter } from '../lib/plotter';
import { fullscreenCanvas } from '../lib/canvas';
import { addDays } from './date';

export interface StatPlayer extends Player {
    games: StatGame[]
}
export interface StatTeam extends Team<StatPlayer> {
    readonly ratings: { [name: string]: EloPlayer };
}

export interface StatGame extends Game<StatPlayer, StatTeam> {
    redDeltas: any;
    bluDeltas: any;
}

interface EloFn {
    (p1: EloPlayer, p2: EloPlayer, s1: number, s2: number): [number, number];
}

export const getViewerModel = () => {
    const loading = ko.observable(true);
    const ctx = fullscreenCanvas(true);
    ctx.canvas.width -= 10;
    ctx.canvas.height -= 10;

    const games = ko.observableArray<StatGame>([]);

    const haveData = ko.computed(() => games().length > 0);
    const shouldShowData = ko.observable((() => {
        const v = localStorage.getItem('show-games-table');
        return v === undefined || v == 'true';
    })());

    shouldShowData.subscribe(v => localStorage.setItem('show-games-table', v.toString()));

    const showData = ko.computed(() => !loading() && haveData() && shouldShowData());
    const showCanvas = ko.computed(() => !loading() && haveData());

    const cutoff = addDays(new Date(), -14.5);

    const aggregators: IAggregator[] = [
        new ScorewiseAggregator(cutoff),
        new BinaryAggregator(cutoff),
        new WinrateAggregator(cutoff),
        new RecentWinrateAggregator(cutoff, 50)
    ];

    const activeView = ko.observable('');
    const activeSubview = ko.observable('');
    const activeViews = ko.observableArray<string>([]);
    const activeSubviews = ko.observableArray<string>([]);

    activeSubviews.subscribe(v => { activeSubview(v[0]); render(); });
    activeViews.subscribe(v => { activeView(v[0]) })
    activeView.subscribe(v => {
        const activeAggregator = aggregators.filter(a => a.window.name == v)[0]
        if (activeAggregator !== undefined) {
            activeSubviews(activeAggregator.window.views.map(v => v.name))
            render();
        }
    });

    activeSubview.subscribe(v => render());

    activeViews(aggregators.map(a => a.window.name));

    const numGames = ko.observable<string | number>('...');
    const numGamesTotal = ko.observable<string | number>('...');

    const url = 'https://foosball-results.herokuapp.com/api/';
    const api = new AlmazApi(url);

    const newPlayer = (player: Player): StatPlayer => {
        return {
            apiPlayer: player.apiPlayer,
            games: []
        };
    }

    const elo = new Elo();

    const elos: any = {
        binary: (p1: EloPlayer, p2: EloPlayer, s1: number, s2: number): [number, number] => {
            const b1 = p1.score;
            const b2 = p2.score;
            elo.game(p1, p2, s1 > s2 ? 1 : 0, s1 < s2 ? 1 : 0)
            return [p1.score - b1, p2.score - b2];
        },
        scorewise: (p1: EloPlayer, p2: EloPlayer, s1: number, s2: number): [number, number] => {
            const b1 = p1.score;
            const b2 = p2.score;
            elo.game(p1, p2, s1, s2);
            return [p1.score - b1, p2.score - b2];
        }
    }

    const newTeam = (team: Team<StatPlayer>): StatTeam => {
        const ratings: any = {};

        for (const name in elos) {
            ratings[name] = new EloPlayer();
        }

        return {
            defence: team.defence,
            offence: team.offence,
            ratings: ratings
        };
    }

    const newGame = (game: Game<StatPlayer, StatTeam>): StatGame => {

        const redDeltas: any = {};
        const bluDeltas: any = {};

        for (const name in elos) {
            const fn = <(EloFn)>elos[name];
            const deltas = fn(game.red.ratings[name], game.blu.ratings[name], game.redScore, game.bluScore);

            redDeltas[name] = deltas[0];
            bluDeltas[name] = deltas[1];
        }

        const g = {
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

        aggregators.forEach(a => a.logGame(g));

        return g;
    }

    const gp = new GameProcessor<StatPlayer, StatTeam, StatGame>(newPlayer, newTeam, newGame);

    api.getGames("").then(loadGames)

    function loadGames(data: ApiGame[]) {
        numGamesTotal(data.length);

        gp.processGames(data)

        numGames(gp.numGames);

        games(gp.games);

        loading(false);

        aggregators.forEach(a => a.autobreak())
        render();
    }

    function render() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const r = new Rect(5, ctx.canvas.height - 5, ctx.canvas.width - 10, -ctx.canvas.height + 10);
        const p = new Plotter(ctx, r);

        const activeAggregator = aggregators.filter(a => a.window.name == activeView())[0]
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
    }
}