export class Random {
    public constructor(private seed: number = (new Date()).getTime()) {
    }

    public next(): number {
        return this.seed = +('0.' + Math.sin(this.seed).toString().substr(6));
    }

    public inext(min: number, max: number): number {
        return (min + (max - min) * this.next()) | 0;
    }

    public shuffle<T>(array: T[]): T[] {
        var currentIndex = array.length, temporaryValue: T, randomIndex: number;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = this.inext(0, currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}