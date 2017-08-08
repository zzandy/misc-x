

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

        this.update(state, 0);
    }

    public stop() {
        this.isRunning = false;
    }

    private update(state: TState, delta: number) {
        if (!this.isRunning) return;

        const time = new Date().getTime();

        let newState = state;

        this.fixedAccum += delta;

        while (this.fixedAccum > this.fixedDelta) {
            this.fixedAccum -= this.fixedDelta;
            newState = this.fixed(this.fixedDelta, newState);
        }

        this.variable(delta, newState);

        requestAnimationFrame(() => this.update(newState, new Date().getTime() - time));
    }
}





