export function main() {
    makeUI();
}

type codes = { tree: node };
type node = string | { left: node, right: node };

function makeUI() {
    let input = document.createElement('textarea');
    input.setAttribute('cols', '45');
    input.setAttribute('rows', '15');

    let output = document.createElement('div');

    input.addEventListener('keyup', () => render(calc(input.value), output))

    let form = document.createElement('div');
    form.appendChild(input);
    form.appendChild(output);

    input.value = 'disjfh alksdhfjlaskjdchfn alseukifycpqwnoeiur[cpoif;sdlkgfdkgjdksfjg;dlfkjgcvmp[oeirutcpmoigudfs;lkgjmdfs;glkjsmcd;fgisdfg;lkmsjcdf;lkgj]]'
    render(calc(input.value), output)
    document.body.appendChild(form);
}

function calc(text: string): codes {
    let freqs: { [key: string]: number } = {};
    for (let char of text.split('')) {
        if (!(char in freqs)) freqs[char] = 1;
        else freqs[char]++;
    }

    let a: [number, node][] = [];
    for (let char in freqs) {
        a.push([freqs[char], char])
    }

    if (a.length > 1)
        do {
            a.sort((a, b) => a[0] - b[0])
            a.splice(0, 2, [a[0][0] + a[1][0], { right: a[0][1], left: a[1][1] }]);
        } while (a.length > 1);

    let res = { tree: a[0][1] };
    return res;
}

function render(huff: codes, output: HTMLDivElement) {
    output.innerHTML = renderNode(huff.tree, '')[1];
}

function renderNode(node: node, prefix: string): [number, string] {
    if (typeof (node) == 'string')
        return [1, `<div class="leaf">${prefix} ${node == ' ' ? '_' : node}</div>`];

    let left = renderNode(node.left, prefix + '0');
    let right = renderNode(node.right, prefix + '1');

    let total = left[0] + right[0];

    return [total, `
        <div class="node">
            <div class="bracing">
            <div><span class="prefix">${prefix}</span></div>
                <div class="brace" style="min-height: 50%; min-width: .5em"></div>
            </div>
            <div class="split">
                ${left[1]}${right[1]}
            </div>
        </div>
        `];
}
