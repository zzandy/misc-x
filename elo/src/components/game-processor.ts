import { AlmazApi, ApiPlayer, ApiTeam, ApiGame } from '../lib/almaz-api';
import { EloPlayer } from '../lib/elo';

export interface Player {
    readonly apiPlayer: ApiPlayer;
}

export interface Team<TPlayer> {
    defence: TPlayer;
    offence: TPlayer;
}

export interface Game<TPlayer, TTeam extends Team<TPlayer>> {
    _id: string;
    red: TTeam;
    blu: TTeam;
    redScore: number;
    bluScore: number;
    startDate: Date;
    endDate: Date;
}

export class GameProcessor<TPlayer extends Player, TTeam extends Team<TPlayer>, TGame extends Game<TPlayer, TTeam>> {
    public readonly games: TGame[] = [];
    public readonly teams: TTeam[] = [];
    private readonly players: TPlayer[] = [];

    constructor(private readonly playerAdapter: (p: Player) => TPlayer,
        private readonly teamAdapter: (t: Team<TPlayer>) => TTeam,
        private readonly gameAdapter: (g: Game<TPlayer, TTeam>) => TGame) { }

    public get numGames() { return this.games.length };

    public findPlayer(player: ApiPlayer): TPlayer {
        let p = this.players.filter(p => p.apiPlayer._id == player._id)[0];
        if (p === undefined) {
            p = this.playerAdapter({ apiPlayer: player })
            this.players.push(p);
        }
        return p;
    }

    public findTeam(defence: TPlayer, offence: TPlayer): TTeam {
        const matches = this.teams.filter(t => t.defence == defence && t.offence == offence);

        if (matches.length == 0) {
            const team = {
                defence: defence,
                offence: offence,
            };
            const record = this.teamAdapter(team);
            this.teams.push(record);
            return record;
        }
        else {
            return matches[0];
        }
    }

    public findGames(team: TTeam): TGame[] {
        return this.games.filter(g => g.blu == team || g.red == team);
    };

    public findMutualGames(a: TTeam, b: TTeam): TGame[] {
        return this.games.filter(g => (g.blu == a && g.red == b) || (g.blu == b && g.red == a));
    };

    public processGames(games: ApiGame[]): void {
        games.sort(byEndDate)
            .filter(removeStagingData)
            .filter(removeDuplicates)
            .forEach(this.logGame.bind(this));
    }

    public getGame(game: ApiGame, id: string | null = null): Game<TPlayer, TTeam> {
        const red = this.findTeam(this.findPlayer(game.red.defense), this.findPlayer(game.red.offense));
        const blu = this.findTeam(this.findPlayer(game.blue.defense), this.findPlayer(game.blue.offense));

        const gameId: string = <string>(game._id === null || game._id == undefined ? id : game._id);

        if (gameId == null) throw new Error('game._id cannot be left empty');

        return {
            _id: gameId,
            red: red,
            blu: blu,
            redScore: game.red.score || 0,
            bluScore: game.blue.score || 0,
            startDate: new Date(game.startDate),
            endDate: new Date(game.endDate)
        };
    }

    public logGame(game: ApiGame, id: string | null = null): Game<TPlayer, TTeam> {
        const gameRecord = this.getGame(game, id);
        this.games.push(this.gameAdapter(gameRecord));

        return gameRecord;
    };
}

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

