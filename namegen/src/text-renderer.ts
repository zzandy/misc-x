export class TextRenderer {

    constructor(private readonly mapping: { [key: string]: string | (() => string) }) {

    }

    render(input: string): string {

        let b4 = input;
        do {
            b4 = input;
            input = input.replace(/(?:\$)(\w+)|(?:\$\{)([^\}]+)(?:\})/, (r, a, b) => {
                const rpl = this.mapping[a || b];

                if (rpl === undefined) return r;
                else if (rpl instanceof Function) return rpl();
                else return rpl;
            });


        } while (b4 != input);

        return input;
    }
}