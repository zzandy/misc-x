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

        let state = this.init();

        this.isRunning = true;

        let time = 0;

        const frame = (ts: number) => {
            const force = time == 0;

            const delta = force ? 0 : ts - time;
            time = ts;

            state = this.update(delta, state, force);

            if (this.isRunning)
                requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

    public stop() {
        this.isRunning = false;
    }

    private update(delta: number, state: TState, force: boolean = false): TState {
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

        return newState;
    }
}





