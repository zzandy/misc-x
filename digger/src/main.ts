import { fullscreenCanvas } from '../../lib/canvas';
import { Rect } from '../../lib/geometry';
import { Loop } from '../../lib/loop';
import { getFullscreenContext } from './canvas';
import { hex2rgb, Palette } from './color';
import { Tile } from './map';
import { array, shuffle } from '../../lib/util';
import { pick } from './util';
import { edgeIndex, Sprite } from './sprite';
import { fetchImage } from './image';
import spriteAtlas from './sprite-atlas';
import { rgbtuple } from '../../lib/color';

// geodes fall and break producing gems
// there are tunnels

const width = 320;
const height = 240;

let x = 0, y = 0;
let cw = width, ch = height;

let screenAspect = window.innerWidth / window.innerHeight;
let viewAspect = width / height;

if (viewAspect > screenAspect) {
    ch = (width / screenAspect) | 0
    y = ((ch - height) / 2) | 0
}
else {
    cw = (height * screenAspect) | 0
    x = ((cw - width) / 2) | 0
}

const view = new Rect(x, y, width, height);
const can = new Rect(0, 0, cw, ch);

const bg = getFullscreenContext(cw, ch, false);
const fg = getFullscreenContext(cw, ch, true);

bg.imageSmoothingEnabled = false;
fg.imageSmoothingEnabled = false;

const n = 10;
const m = 13;

const probabilities: [number, Tile][] = [
    [20, Tile.Solid],
    [2, Tile.Geode],
    [1, Tile.Void],
    [3, Tile.Nugget]
];

let totalProb = probabilities.reduce((sum, [prob, _]) => sum + prob, 0);
probabilities.forEach(pair => pair[0] /= totalProb);

const map = array(n, m, (i, j) => {
    return pick(probabilities)
});

for (let i = 0; i < n - 1; ++i)
    for (let j = 0; j < m; ++j) {
        let c = map[i][j];
        let b = map[i + 1][j];

        if (b == Tile.Void && c != Tile.Solid && c != Tile.Void) map[i + 1][j] = Tile.Solid
    }

//renderMap(bg, map);

let bgColors: Palette = <Palette>['#202B39', '#1C3645', '#215A69'].map(hex2rgb);
let geodeColors: Palette = <Palette>['#502C8D', '#504CaD', '#3DD9D8'].map(hex2rgb);
let nuggetColors: Palette = <Palette>['#A67C00', '#FFBF00', '#FFE878'].map(hex2rgb);
let gemColors: Palette = <Palette>['#3DD9D8', '#3D7988', '#AFF8CA'].map(hex2rgb);

console.log(nuggetColors)

fetchImage(spriteAtlas).then(data => {
    let s = 10;
    let sprites = [];

    sprites[edgeIndex(1, 1, 1, 1, 1)] =
        sprites[edgeIndex(1, 1, 1, 1, 0)] = new Sprite(data, 0, s, s, s);
    sprites[edgeIndex(1, 1, 1, 0, 1)] =
        sprites[edgeIndex(1, 0, 1, 0, 1)] = new Sprite(data, s, s, s, s);
    sprites[edgeIndex(1, 0, 1, 1, 1)] =
        sprites[edgeIndex(1, 0, 1, 1, 0)] = new Sprite(data, 2 * s, s, s, s);

    sprites[edgeIndex(1, 1, 0, 1, 1)] =
        sprites[edgeIndex(0, 1, 0, 1, 1)] = new Sprite(data, 0, 2 * s, s, s);
    sprites[edgeIndex(1, 0, 0, 1, 1)] =
        sprites[edgeIndex(0, 0, 0, 1, 1)] = new Sprite(data, 2 * s, 2 * s, s, s);

    sprites[edgeIndex(0, 1, 1, 1, 1)] =
        sprites[edgeIndex(0, 1, 1, 1, 0)] = new Sprite(data, 0, 3 * s, s, s);
    sprites[edgeIndex(0, 1, 1, 0, 1)] =
        sprites[edgeIndex(0, 0, 1, 0, 1)] = new Sprite(data, s, 3 * s, s, s);
    sprites[edgeIndex(0, 0, 1, 1, 1)] =
        sprites[edgeIndex(0, 0, 1, 1, 0)] = new Sprite(data, 2 * s, 3 * s, s, s);

    sprites[edgeIndex(0, 1, 1, 0, 0)] = new Sprite(data, 4 * s, 0, s, s);
    sprites[edgeIndex(0, 0, 1, 0, 0)] = new Sprite(data, 5 * s, 0, s, s);
    sprites[edgeIndex(1, 1, 1, 0, 0)] = new Sprite(data, 4 * s, s, s, s);
    sprites[edgeIndex(1, 0, 1, 0, 0)] = new Sprite(data, 5 * s, s, s, s);

    sprites[edgeIndex(1, 0, 0, 1, 0)] = new Sprite(data, 3 * s, 2 * s, s, s);
    sprites[edgeIndex(1, 1, 0, 1, 0)] = new Sprite(data, 4 * s, 2 * s, s, s);
    sprites[edgeIndex(0, 0, 0, 1, 0)] = new Sprite(data, 3 * s, 3 * s, s, s);
    sprites[edgeIndex(0, 1, 0, 1, 0)] = new Sprite(data, 4 * s, 3 * s, s, s);

    let textures = [
        new Sprite(data, 5 * s, 2 * s, 2 * s, 2 * s, bgColors),
        new Sprite(data, 7 * s, 2 * s, 2 * s, 2 * s, bgColors),
        new Sprite(data, 9 * s, 2 * s, 2 * s, 2 * s, bgColors),
        new Sprite(data, 11 * s, 2 * s, 2 * s, 2 * s, bgColors)
    ];

    let pups = [
        new Sprite(data, 7 * s, 0, 2 * s, 2 * s, geodeColors),
        new Sprite(data, 9 * s, 0, 2 * s, 2 * s, nuggetColors),
        new Sprite(data, 11 * s, 0, 2 * s, 2 * s, gemColors)
    ]

    console.log(pups[0].imgdata)

    let s2 = 3 * s;
    let x = s;
    let y = s;

    let bin: (0 | 1)[] = [0, 1];

    for (let t of bin)
        for (let l of bin)
            for (let v of bin)
                for (let h of bin)
                    for (let d of bin)
                        if (v + h > 0) {
                            fg.fillStyle = 'green'
                            fg.fillRect(x - 1, y - 1, s + 2, s + 2)

                            let ww = 3;

                            let dx = (!!l) ? -ww : s;
                            let dy = (!!t) ? -ww : s;

                            if (!!v) fg.fillRect(x, y + dy, s, ww);
                            if (!!h) fg.fillRect(x + dx, y, ww, s);

                            if (!!d) fg.fillRect(x + dx, y + dy, ww, ww)

                            fg.fillStyle = 'yellow'
                            fg.fillRect(x + ((!!l) ? -1 : 1), y + ((!!t) ? -1 : 1), s, s)

                            console.log(t, l, v, h, d)

                            sprites[edgeIndex(t, l, v, h, d)].draw(fg, x, y)

                            if ((x += s2) > 500) {
                                x = s; y += s2
                            }
                        }

    x = s; y += s2

    for (let txt of textures) {
        txt.draw(fg, x, y)
        txt.draw(fg, x + 2 * s, y)
        txt.draw(fg, x, y + 2 * s)
        txt.draw(fg, x + 2 * s, y + 2 * s)
        x += 2 * s2
    }

    x = s; y += s2

    for (let txt of pups) {
        txt.draw(fg, x, y)
        x += 2 * s2
    }
});

new Loop(1000 / 60, init, update, render);

function init() {

}

function update() {

}

function render() {

}
