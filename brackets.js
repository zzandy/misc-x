
const a = { repr: () => [{ "A": true }] };
const b = { repr: () => [{ "B": true }] };
const c = { repr: () => [{ "C": true }] };
const d = { repr: () => [{ "D": true }] };
const e = { repr: () => [{ "E": true }] };

const or = (a, b) => ({
    repr: () => {
        const x = a.repr();
        const y = b.repr();

        res = [];

        for (let i = 0; i < x.length; ++i)
            res.push(x[i]);

        for (let j = 0; j < y.length; ++j)
            res.push(y[j]);

        return res;
    }
});

const and = (a, b) => ({
    repr: () => {

        const x = a.repr();
        const y = b.repr();

        res = [];

        for (let i = 0; i < x.length; ++i)
            for (let j = 0; j < y.length; ++j)
                res.push(Object.assign(Object.assign({}, x[i]), y[j]))

        return res;
    }
});

console.log(or(and(and(a, b), or(c, d)), e).repr());
