import { Point, Rect } from '../lib/geometry';
import { IDataWindow, IPlotData, ISeries, Break } from '../lib/plot-data';
import { StatGame, StatTeam, StatPlayer } from './viewer-model';

export interface IAggregator {
    logGame(g: StatGame): void;
    readonly window: IDataWindow;
    autobreak(): void;
}

abstract class RatingAggregator implements IAggregator {
    private readonly ratings: { [id: string]: number[] } = {};
    private readonly ratingso: { [id: string]: number[] } = {};
    private readonly ratingsd: { [id: string]: number[] } = {};

    public readonly window: IDataWindow;

    protected readonly plot: IPlotData = { name: 'all', data: [] }
    protected readonly plotd: IPlotData = { name: 'def', data: [] }
    protected readonly ploto: IPlotData = { name: 'off', data: [] }
    private region: Rect = new Rect(0, NaN, 0, 0);

    private n: number = 0;
    private prev: Date | null = null;
    private cc = -1;
    private colors = '#f44336;#3f51b5;#8bc34a;#607d8b;#ff5722;#00bcd4;#e91e63;#00b294;#03a9f4;#ffb900;#107c10'.split(';');
    private colormap: { [key: string]: string } = {};

    protected constructor(windowName: string) {
        const that = this;
        this.window = {
            name: windowName,
            get window() { return that.region },
            breaks: { x: [], y: [] },
            views: [this.plot, this.plotd, this.ploto]
        };
    }

    private accomodate(p: Point) {
        const r = this.region;

        let x = r.x;
        let y = isNaN(r.y) ? p.y : r.y;
        let w = r.w;
        let h = r.h;

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

        this.region = new Rect(x, y, w, h);
    }

    public autobreak(): void {
        const h = (((this.region.h + 15) / 10) | 0) * 10;
        const miny = ((this.region.y / 10) | 0) * 10;

        for (let i = 0; i <= h; i += 10) {
            this.window.breaks.y.push(new Break((miny + i).toString(), miny + i));
        }

        this.region = new Rect(this.region.x, miny, this.region.w, h);
    }

    public logGame(g: StatGame): void {
        if (this.prev == null || g.endDate.getDate() != this.prev.getDate()) {
            this.window.breaks.x.push(new Break(g.endDate.toString(), this.n + 1))
            this.n += 3;
        }
        else if (this.prev != null && g.endDate.getTime() - this.prev.getTime() > 30 * 60 * 1000) {
            this.window.breaks.x.push(new Break("", this.n + 1))
            this.n += 3;
        }

        this.prev = g.endDate;

        this.logTeam(g.red);
        this.logTeam(g.blu);

        ++this.n;
    }

    private logTeam(t: StatTeam): void {
        const r = this.getRating(t);
        this.logPlayer(r, t.defence, true);
        this.logPlayer(r, t.offence, false);
    }

    private logPlayer(r: number, p: StatPlayer, isDef: boolean) {
        const key = p.apiPlayer._id;
        const name = p.apiPlayer.firstName + ' ' + p.apiPlayer.lastName;

        const subratings = isDef ? this.ratingsd : this.ratingso;

        const rall = avg(this.logRating(key, r, this.ratings));
        const rsub = avg(this.logRating(key, r, subratings));

        this.postRating(name, rall, this.plot);
        this.postRating(name, rsub, isDef ? this.plotd : this.ploto);
    }

    private logRating(id: string, r: number, ratings: { [id: string]: number[] }) {
        if (!(id in ratings))
            ratings[id] = [];

        ratings[id].push(r);
        return ratings[id];
    }

    private postRating(key: string, r: number, stream: IPlotData) {
        let series = stream.data.filter(s => s.name == key)[0];

        if (series == undefined) {
            series = { name: key, data: [], color: this.getColor(key) };
            stream.data.push(series);
        }

        const p = new Point(this.n, r);
        this.accomodate(p);
        series.data.unshift(p)
    }

    private getColor(key: string): string {
        if (!(key in this.colormap))
            this.colormap[key] = this.colors[this.cc = (this.cc + 1) % this.colors.length];

        return this.colormap[key];
    }

    protected abstract getRating(t: StatTeam): number;
}


export class ScorewiseAggregator extends RatingAggregator {
    constructor() {
        super("Scorewise rating");
    }

    protected getRating(t: StatTeam): number {
        return t.ratings.scorewise.score;
    }
}

export class BinaryAggregator extends RatingAggregator {
    constructor() {
        super("Binary rating");
    }

    protected getRating(t: StatTeam): number {
        return t.ratings.binary.score;
    }
}

const avg = (a: number[]): number => {
    return a.length == 0 ? NaN : a.reduce((a, b) => a + b) / a.length;
}
