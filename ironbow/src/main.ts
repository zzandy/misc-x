import { fullscreenCanvas } from '../../lib/canvas';
import { hcy2rgb, hcy } from '../../lib/color';
import { ironbowImage } from './ironbowImage';

type color = [number, number, number];

export const main = function () {
    const ctx = fullscreenCanvas();

    const img = new Image();

    img.src = ironbowImage;

    img.addEventListener('load', function () {

        let current = 0;
        const [rgbColors, size, data] = ((): [color[], number, ImageData] => {
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(2, 2, img.width - 4, img.height - 4);

            ctx.putImageData(data, data.width + 10, 0);

            const rows = 8;
            let size = (data.height / rows) | 0;
            const cols = data.width / size | 0;
            const rgbColors = grabColors(data, rows, cols, size);

            size = (ctx.canvas.width / rgbColors.length) | 0;

            return [rgbColors, size, data];
        })();

        requestAnimationFrame(render);

        function render() {
            const color = rgbColors[current];
            const q = current / rgbColors.length;

            // Source
            draw(0, 'rgb(' + color.join(',') + ')');

            // delta
            let [h, c, y] = previousAttempt(q);
            draw(2, 'rgb(' + hcy(h, c, y).map((x, i) => 127 + (x - color[i]) * 5).join(',') + ')');

            // HCY formula
            [h, c, y] = previousAttempt(q);
            draw(1, hcy2rgb(h, c, y));

            if (++current < rgbColors.length) requestAnimationFrame(render);

            function draw(row: number, color: string) {
                ctx.fillStyle = color;
                ctx.fillRect(current * size, data.height * 2 + 10 + row * (size * 2 + 1), size, size * 2);
            }
        }
    });
}

function grabColors(data: ImageData, rows: number, cols: number, size: number): color[] {
    const colors: color[] = [];

    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < cols; ++j) {

            let x = (j + .5);
            let y = (i + .5);

            if (x < 9) x += 9;
            else x -= 9;

            const id = size * (x + y * data.width) * 4 | 0;

            const color: color = [data.data[id], data.data[id + 1], data.data[id + 2]];
            colors.push(color);
        }
    }

    return colors;
}

function previousAttempt(q: number) {
    const h = 240 + 180 * ease1(q);
    const y = q;
    return [h, 1, y];
}

function ease1(v: number): number {
    return join(v,

        [0, .09, x => Math.pow(4 * x, 3)],
        [.09, .31, x => (x / 1.15 - .033)],
        [.31, .49, x => (.24 + Math.pow(2.4 * (x - .3), 2))],
        [.49, 1, x => (Math.log(5 * x) / 4.5 + .25)]

    ) / .6;
}

function join(v: number, ...segments: [number, number, (x: number) => number][]): number {
    for (const segment of segments) {
        if (v >= segment[0] && v < segment[1])
            return segment[2](v);
    }
    return v;
}

function ease(t: number) {
    return t * t * t * (6 * t * t - 15 * t + 10);
}

function fmt(r: number, g: number, b: number) {
    return [r * 255 | 0, g * 255 | 0, b * 255 | 0];
}
