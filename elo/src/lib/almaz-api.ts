import { getJson, postJson, request } from '../../../lib/ajax';

export class ApiPlayer {
    public readonly _id: string;
    public readonly firstName: string;
    public readonly lastName: string;
}

export class ApiTeam {
    public readonly defense: ApiPlayer;
    public readonly offense: ApiPlayer;
    public readonly score: number;
}

export class ApiGame {
    public readonly _id?: string;
    public readonly source: string;
    public readonly startDate: string;
    public readonly endDate: string;
    public readonly red: ApiTeam;
    public readonly blue: ApiTeam;
    public readonly metadata?: any;
}

type scope = { url: string, players: ApiPlayer[] };

export class AlmazApi {
    private scope: Promise<scope>;

    constructor(baseUrl: string) {
        const state = { url: baseUrl, players: [] };
        this.scope = Promise.resolve(state).then(this.refreshPlayers);
    }

    public getPlayers(): Promise<ApiPlayer[]> {
        return new Promise((resolve) => {
            this.scope = this.scope.then((ctx: scope) => { resolve(ctx.players); return ctx; });
        });
    }

    public getGames(source: string): Promise<ApiGame[]> {
        const api = this;

        return new Promise((resolve) => {
            api.scope = api.scope.then((ctx) => {
                if (!('url' in ctx))
                    throw 'Invalid context';

                return getJson(ctx.url + (!!source ? 'games?source=' + encodeURIComponent(source) : 'games'))
                    .catch(function (e) { console.error(e); return ctx; })
                    .then(function (data: ApiGame[]) {
                        resolve(data);
                        return ctx;
                    });

            });
        });
    }

    public postGame(game: ApiGame, source: string): Promise<string> {
        const api = this;

        if (game == null)
            throw new Error('Game cannot be empty.')

        if (source == null || source == '')
            throw new Error('Source must not be empty.')

        return new Promise((resolve, reject) => {
            api.scope = api.scope.then((ctx) => {
                return postJson(ctx.url + 'games', game)
                    .then((data: ApiGame) => { resolve(data._id); return ctx })
                    .catch((e) => { reject(e); return ctx });
            });
        });
    }

    public deleteGame(id: string): Promise<ApiGame> {
        const api = this;
        return new Promise((resolve, reject) => {
            api.scope = api.scope.then((ctx) => {
                return request('DELETE', ctx.url + 'games/' + id)
                    .then((d: ApiGame) => { resolve(d); return ctx })
                    .catch(e => { reject(e); return ctx })
            })
        });
    }

    private refreshPlayers(ctx: scope) {
        return getJson(ctx.url + 'players')
            .then(function (players) { ctx.players = players; return ctx; })
            .catch(function (e) {
                console.error(e);
                return ctx;
            });
    }
}