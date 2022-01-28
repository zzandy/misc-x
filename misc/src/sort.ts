export function main() {
    let a = makeArray(10000);

    runSort('bubble', bubble, a);
    runSort('merge', merge, a);
}

function merge(a: Uint32Array, from: number = 0, to: number = -1) {
    if (to == -1) to = a.length - 1;
    if (to == from) return;

    if (to == from + 1) {
        if (a[from] > a[to]) [a[to], a[from]] = [a[from], a[to]];
        return;
    }

    let k = (from + to) / 2 | 0;

    merge(a, from, k);
    merge(a, k + 1, to);

    if (a[k] < a[k + 1]) return;

    let nleft = k - from + 1;
    let nright = to - k;

    let left = new Uint32Array(nleft);
    let right = new Uint32Array(nright);

    for (let i = 0; i < nleft; ++i) {
        left[i] = a[from + i];
        if (i < nright)
            right[i] = a[k + 1 + i]
    }

    let i = from;
    let ileft = 0;
    let iright = 0;

    while (ileft < nleft && iright < nright) {
        if (left[ileft] <= right[iright])
            a[i++] = left[ileft++];
        else
            a[i++] = right[iright++];
    }

    while (ileft < nleft)
        a[i++] = left[ileft++];

    while (iright < nright)
        a[i++] = right[iright++];
}

function bubble(a: Uint32Array) {
    for (let i = 0; i < a.length; ++i) {
        for (let j = 0; j < a.length - 1; ++j)
            if (a[j] > a[j + 1])
                [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
}

function makeArray(n: number) {
    let a = new Uint32Array(n);
    for (let i = 0; i < n; ++i) {
        a[i] = i;
    }

    shuffle(a);

    return a;
}

function shuffle(a: Uint32Array) {
    for (let i = 0; i < a.length - 1; ++i) {
        let j = (Math.random() * (a.length - i)) | 0;

        [a[i], a[j]] = [a[j], a[i]]
    }
}

function runSort(title: string, sort: (a: Uint32Array) => void, a: Uint32Array) {
    let b = new Uint32Array(a);

    let ms = time(() => sort(b));
    console.log(b)
    console.log(`${isSorted(b) ? 'OK  ' : 'FAIL'} ${ms}ms ${title}`);
}

function isSorted(a: Uint32Array) {
    for (let i = 1; i < a.length; ++i) {
        if (a[i - 1] > a[i]) return false;
    }
    return true;
}

function time(call: () => void) {
    let then = performance.now();
    call();
    return performance.now() - then;
}