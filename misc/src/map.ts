function rnd(): number;
function rnd<T>(a: T[]): T;
function rnd(a: number): number;
function rnd(a: number, b: number): number;
function rnd<T>(a?: T[] | number, b?: number): T | number {
    if (a !== undefined && b !== undefined) {
        return (b + (<number>a - b) * Math.random()) | 0;
    }
    else if (a !== undefined && b === undefined) {
        if (a instanceof Array) return a[(Math.random() * a.length) | 0];
        else return (a * Math.random()) | 0;
    }
    else return Math.random();
}

interface IMap<TPos> {
    each(callback: (cell: Cell, pos: TPos, map: IMap<TPos>) => void): void;
    get(pos: TPos): Cell | null;
    getAdj(pos: TPos): Cell[];
}

class Point {
    constructor(public readonly x: number, public readonly y: number) { }
}

class Token {
    public constructor(public readonly name: string) { }
}

class Cell {
    public readonly maybes: Token[] = [];
    public readonly noes: Token[] = [];
    constructor(public value: Token) {

    }
}

class Rule {
    constructor(public readonly token: Token, public readonly nextTo: Token[], public readonly notNextTo: Token[]) { }
}

class RuleStub {
    private readonly next: Token[] = [];
    private readonly notNext: Token[] = [];
    constructor(private readonly token: Token, private readonly builder: RuleBuilder) { }

    public nextTo(...tokens: Token[]): RuleStub {
        for (const token of tokens)
            this.next.push(token);
        return this;
    }

    public notNextTo(...tokens: Token[]): RuleStub {
        for (const token of tokens)
            this.notNext.push(token)
        return this;
    }

    public rule(token: Token): RuleStub {
        this.builder.add(new Rule(this.token, this.next, this.notNext));
        return this.builder.rule(token);
    }

    public build(): Rule[] {
        this.builder.add(new Rule(this.token, this.next, this.notNext));
        return this.builder.build();
    }
}

class RuleBuilder {
    private readonly rules: Rule[] = [];

    public rule(token: Token) {
        return new RuleStub(token, this);
    }

    public add(rule: Rule) {
        this.rules.push(rule);
    }

    public build(): Rule[] {
        return this.rules;
    }
}

const None = new Token('n/a');
const Reef = new Token('reef');
const Sea = new Token('sea');
const Bay = new Token('bay');
const Marsh = new Token('marsh');
const Mountain = new Token('mount');
const Forest = new Token('forest');
const Lake = new Token('lake');
const Shore = new Token('shore');
const Meadow = new Token('meadow');

class RectMap implements IMap<Point>{
    private readonly data: Cell[][];

    constructor(public readonly w: number, public readonly h: number) {
        this.data = [];
        for (let i = 0; i < h; ++i) {
            const row = [];
            for (var j = 0; j < w; ++j)
                row.push(new Cell(None));

            this.data.push(row);
        }
    }

    each(callback: (cell: Cell, pos: Point, map: IMap<Point>) => void): void {
        for (var i = 0; i < this.h; ++i)
            for (var j = 0; j < this.w; ++j)
                callback(this.data[i][j], new Point(j, i), this);
    }

    get(pos: Point): Cell | null {
        return (pos.x >= 0 && pos.y >= 0 && pos.x < this.w && pos.y < this.h)
            ? this.data[pos.y][pos.x]
            : null;
    }

    getAdj(pos: Point): Cell[] {
        return <Cell[]>[
            this.get(new Point(pos.x + 1, pos.y)),
            this.get(new Point(pos.x, pos.y + 1)),
            this.get(new Point(pos.x - 1, pos.y)),
            this.get(new Point(pos.x, pos.y - 1)),
        ].filter(x => x != null);
    }
}

function pad(str: string, w: number): string {
    return str.length < w
        ? str + (new Array(w - str.length + 1)).join(' ')
        : str;
}

class Solver {
    public solve<TPos>(rules: Rule[], map: IMap<TPos>) {
        const draw: Cell[] = [];

        do {
            draw.length = 0;

            map.each((cell, pos, map) => {
                if (cell.value == None) {
                    const adj = map.getAdj(pos).filter(a => a.value != None);
                    cell.maybes.length = 0
                    cell.noes.length = 0;
                    rules.forEach(rule => {
                        if (adj.some(a => rule.notNextTo.indexOf(a.value) != -1)) {
                            cell.noes.push(rule.token);
                        }
                        else if (adj.some(a => rule.nextTo.indexOf(a.value) != -1)) {
                            cell.maybes.push(rule.token);
                        }
                    });

                    if (cell.maybes.length)
                        draw.push(cell);

                }
            });

            if (draw.length) {
                const cell = rnd(draw);
                cell.value = rnd(cell.maybes);
            }
        } while (draw.length);
    }
}

class RectRender {
    render(map: RectMap): void {

        const lengths: number[] = [];
        for (let i = 0; i < map.w; ++i)lengths.push(0);

        map.each((cell, pos, map) => {
            lengths[pos.x] = Math.max(lengths[pos.x], cell.value.name.length);
        });

        const splitter = '+' + lengths.map(l => new Array(l + 3).join('-')).join('+') + '+';
        const text = [splitter, '\n'];

        for (let i = 0; i < map.h; ++i) {
            text.push('|');
            for (let j = 0; j < map.w; ++j) {
                text.push(' ', pad((<Cell>(map.get(new Point(j, i)))).value.name, lengths[j]));
                text.push(' |');
            }

            text.push('\n', splitter, '\n');
        }

        document.body.style.whiteSpace = 'pre';
        document.body.style.fontFamily = 'monospace';
        document.body.innerHTML = text.join('');
    }
}

export const main = () => {
    const [w, h] = [7, 7];
    const map = new RectMap(w, h);
    map.each((cell, pos, map) => {
        if (pos.x == 0 || pos.y == 0 || pos.x == w - 1 || pos.y == h - 1) cell.value = Sea;
    });

    for (let i = 0; i < rnd(1, 3); ++i) {
        let r = rnd(2)
            ? map.get(new Point(rnd(2) * (w - 1), rnd(h)))
            : map.get(new Point(rnd(w), rnd(1) * (h - 1)));

        if (r != null) r.value = Reef;
    }

    var rules = new RuleBuilder()
        .rule(Shore).nextTo(Sea, Reef)
        .rule(Marsh).nextTo(Sea, Reef)
        .rule(Forest).nextTo(Shore, Bay, Forest, Mountain, Marsh)
        .rule(Mountain).nextTo(Forest, Lake, Mountain, Bay)
        .rule(Lake).nextTo(Bay, Mountain).notNextTo(Shore, Sea)
        .rule(Meadow).nextTo(Lake, Meadow, Bay, Forest)
        .rule(Bay).nextTo(Sea).notNextTo(Bay, Reef)

        .build();

    new Solver().solve(rules, map);

    new RectRender().render(map);
};