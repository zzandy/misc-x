import Vue from 'vue';

type Quantity = [number, Asset];
type Asset = { name: string };
type Generator = { name: string, isOn: boolean, yield: number, fuel: number, maxFuel: number, fuelTopUp: number };
type Machine = { name: string, isOn: boolean, draw: number, inputs: Quantity[], products: Quantity[] };

export const start = () => {
    const uranium: Quantity = [1000, { name: 'Uranium' }];
    const data = {
        store: [uranium, [10000, { name: 'Iron Ore' }], [3000, { name: 'Coal' }]],
        generators: [
            gen(1, 'main', 1000, 1000, ),
            gen(0, 'aux #1', 200, 1000),
            gen(0, 'aux #2', 200, 1000),
            gen(0, 'aux #3', 200, 1000),
            gen(0, 'aux #4', 200, 1000),
            gen(0, 'aux #5', 200, 1000)
        ]
    };

    const app = new Vue({
        el: '#doc',
        data,
        methods: {
            boost() {
                data.generators[0].yield *= 1.2;
                wait(2000).then(() => data.generators[0].yield /= 1.2);
            },
            fill(g: Generator) {
                g.fuel += g.fuelTopUp;
                uranium[0] -= g.fuelTopUp;
            },
            canFill(g: Generator) {
                return g.maxFuel - g.fuel > g.fuelTopUp && uranium[0] > g.fuelTopUp;
            }
        }
    });
};

function gen(isOn: 1 | 0, name: string, yld: number, maxFuel: number, topUp: number = maxFuel / 20): Generator {
    return {
        isOn: isOn == 1,
        name, yield: yld, fuel: maxFuel, maxFuel, fuelTopUp: topUp
    }
}

function wait(n: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, n);
    });
}