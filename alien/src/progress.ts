export class Progress {
    private progress: number = 0;
    private prevlen: number = 0;
    constructor(
        private name: string,
        private total: number,
        private supress: boolean = false
    ) {}

    public logOne(message: string) {
        this.progress++;

        if (!this.supress) {
            const msg = `${this.name} ${this.progress} / ${this.total} (${(
                (100 * this.progress) /
                this.total
            ).toFixed(2)}%): ${message}`;

            process.stdout.write(pad(msg, this.prevlen) + "\r");
            this.prevlen = msg.length;
        }
    }

    public done() {
        process.stdout.write(pad("", this.prevlen) + "\r");
    }

    public enable() {
        this.supress = false;
    }
}

function pad(string: string, width: number): string {
    return string + new Array(Math.max(0, width - string.length) + 1).join(" ");
}
