

export class Loop<TState>{
    private isRunning: boolean = false;
    private fixedAccum: number = 0;

    constructor(
        private readonly fixedDelta: number,
        private readonly init: () => TState,
        private readonly fixed: (delta: number, state: TState) => TState,
        private readonly variable: (delta: number, state: TState) => void
    ) { }

    public start() {
        if (this.isRunning) return;

        const state = this.init();

        this.isRunning = true;

        this.update(0, state, true);
    }

    public stop() {
        this.isRunning = false;
    }

    private update(delta: number, state: TState, force: boolean = false) {
        if (!this.isRunning) return;

        const time = new Date().getTime();

        let newState = state;

        this.fixedAccum += delta;

        let upd = false;
        if (force) {
            newState = this.fixed(this.fixedDelta, newState);
            upd = true;
        }
        else while (this.fixedAccum > this.fixedDelta) {
            this.fixedAccum -= this.fixedDelta;
            newState = this.fixed(this.fixedDelta, newState);
            upd = true;
        }

        if (upd)
            this.variable(delta, newState);

        requestAnimationFrame(() => this.update(new Date().getTime() - time, newState));
    }
}





