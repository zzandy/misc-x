export class EloPlayer {
    constructor(
        public readonly value: any,
        public score: number,
        public numGames: number = 0,
        public numWins: number = 0) { }
}

export class Elo {
    constructor(
        public readonly initScore: number = 800,
        public readonly x10diff: number = 400,
        public readonly kFactor: number = 32) { }

    public expectWin(a: EloPlayer, b: EloPlayer) {
        return 1 / (1 + Math.pow(10, (b.score - a.score) / this.x10diff));
    }

    public game(t1: EloPlayer, t2: EloPlayer, s1: number, s2: number) {
        // Expected
        let e1 = this.expectWin(t1, t2);
        let e2 = this.expectWin(t2, t1);

        // Scores to "Results"
        let r1 = s1 > s2 ? 1 : s1 < s2 ? 0 : .5;
        let r2 = s2 > s1 ? 1 : s2 < s1 ? 0 : .5;

        this.updatePlayer(t1, e1, r1, s1 > s2);
        this.updatePlayer(t2, e2, r2, s2 > s1);
    }

    private updatePlayer(a: EloPlayer, expected: number, scoreForA: number, isAWin: boolean) {
        var delta = this.kFactor * (scoreForA - expected);

        a.score = Math.max(0, a.score + delta);
        ++a.numGames;
        if (isAWin)
            ++a.numWins;
    }
}
