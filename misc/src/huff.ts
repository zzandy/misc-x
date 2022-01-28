export function main() {
    makeUI();
}

type codes = { tree: node };
type node = string | { left: node, right: node };

function makeUI() {
    let input = document.createElement('textarea');
    input.setAttribute('cols', '80');
    input.setAttribute('rows', '25');

    let output = document.createElement('div');

    input.addEventListener('keyup', () => render(calc(input.value), output))

    let form = document.createElement('div');
    form.appendChild(input);
    form.appendChild(output);

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
    output.innerHTML = renderNode(huff.tree, '');
}

function renderNode(node: node, prefix: string): string {
    if (typeof (node) == 'string')
        return `${node == ' ' ? '_' : node} ${prefix}`;

    let left = renderNode(node.left, prefix + '0');
    let right = renderNode(node.right, prefix + '1');

    return `<div>${left}</div><div>${right}</div>`;
}