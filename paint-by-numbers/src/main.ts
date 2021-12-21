import { Loop } from '../../lib/loop';
import { fullscreenCanvas, ICanvasRenderingContext2D } from '../../lib/canvas'
import { hcl2rgb, rgb2hcl, triplet } from '../../lib/hcl';
import { colorString, rgba, rgbaColor } from './color';
import { Rect } from '../../lib/geometry';

type TState = {
    ctx: ICanvasRenderingContext2D,
    width: number,
    height: number,
    image: ImageData | null,
    cursor: [number, number]
}


//
// triangular grid array
//
//  o   2   4   6   8
//    1   3   5   7   9
//
//  o   o   o   o   o
//    o   o   o   o   o
//

let loop = new Loop(1000 / 60, init, update, render);
loop.start();

function init(): TState {
    let ctx = fullscreenCanvas();

    let state: TState = { ctx, width: ctx.canvas.width, height: ctx.canvas.height, image: null, cursor: [0, 0] };

    fetchImage('https://static.wikia.nocookie.net/amphibiapedia/images/d/de/5)_Hop_Pop.png')
        .then(imgdata => state.image = convertImageData(imgdata));

    ctx.canvas.addEventListener('mousemove', e => state.cursor = [e.clientX, e.clientY]);

    return state;
}

function convertImageData(data: ImageData): ImageData {
    let scale = 40;
    let aspect = data.width / data.height;

    let width = 0, height = 0;

    if (aspect > 1) { // wide
        width = Math.round(scale);
        height = Math.round(width * sq32 / aspect);
    }
    else { // tall
        height = Math.round(scale);
        width = Math.round(aspect * height / sq32);
    }

    let jagged = new ImageData(new Uint8ClampedArray(width * height * 4), width);

    for (let i = 0; i < jagged.data.length; i += 4) {
        let [x, y] = jaggedToStraight(i / 4 / width | 0, i / 4 % width);

        let c = sample(data, x / width / sq32, y / height);
        jagged.data[i] = c[0]
        jagged.data[i + 1] = c[1]
        jagged.data[i + 2] = c[2]
        jagged.data[i + 3] = c[3] > 120 ? 255 : 0;
    }


    return jagged;
}

function update(delta: number, state: TState): TState {
    return state;
}

function render(delta: number, state: TState) {
    let { ctx, image, cursor } = state;
    if (image != null) {
        let area = new Rect(300, 0, ctx.canvas.height * image.width * sq32 / image.height, ctx.canvas.height);
        ctx.clear();

        let r = area.w / sq32 / image.width/2;
        let d = r * 2;

        for (let i = 0; i < image.data.length; i += 4) {

            let [x, y] = jaggedToStraight(i / 4 / image.width | 0, i / 4 % image.width);

            ctx.fillStyle = rgbaColor([image.data[i], image.data[i + 1], image.data[i + 2], image.data[i + 3]]);
            ctx.fillHex(300 + r + x * d, r + y * d, r);
        }

        ctx.strokeStyle = ctx.fillStyle = 'red';
        ctx.strokeRect(area.x, area.y, area.w, area.h);
        ctx.fillCircle(cursor[0], cursor[1], 4);
    }
}

const sq32 = Math.sqrt(3) / 2;

function sample(data: ImageData, x: number, y: number): rgba {

    let xx = (data.width * x) | 0
    let yy = (data.height * y) | 0;

    let i = (xx + data.width * yy) * 4;

    return [data.data[i], data.data[i + 1], data.data[i + 2], data.data[i + 3]];
}

function straightToJagged(x: number, y: number) {
    return [
        (y - (x / sq32) % 2 / 2) | 0, (x / sq32) | 0
    ];
}

function jaggedToStraight(i: number, j: number) {
    return [j * sq32, i + (j % 2) / 2];
}

async function fetchImage(url: string): Promise<ImageData> {
    return new Promise((resolve, reject) => {
        var img = new Image();

        img.setAttribute('crossOrigin', 'anonymous');

        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            let ctx = canvas.getContext("2d");

            if (ctx != null) {
                ctx.drawImage(img, 0, 0);
                resolve(ctx.getImageData(0, 0, canvas.width, canvas.height))
            }
            else reject("Failed to load image");
        };

        img.src = url;
    })
}