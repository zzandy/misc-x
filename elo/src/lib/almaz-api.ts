import { getJson } from './ajax';

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
    public readonly _id: string;
    public readonly source: string;
    public readonly startDate: Date;
    public readonly endDate: Date;
    public readonly red: ApiTeam;
    public readonly blue: ApiTeam;
    public readonly metadata: any;
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
        var self = this;

        return new Promise((resolve) => {
            self.scope = self.scope.then((ctx) => {
                if (!('url' in ctx))
                    throw 'Invalid context';

                return getJson(ctx.url + (!!source ? 'games?source=' + encodeURIComponent(source) : 'games'))
                    .catch(function (e) { console.error(e); return ctx; })
                    .then(function (data) {
                        resolve(data);
                        return ctx;
                    });

            });
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