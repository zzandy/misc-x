import { fullscreenCanvas } from '../../lib/canvas';
import { wheelHcy, wheel2rgb } from '../../lib/color';

export const main = function () {
    const ctx = fullscreenCanvas();

    const img = new Image();

    img.addEventListener('load', function () {
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(2, 2, img.width - 4, img.height - 4);

        ctx.putImageData(data, data.width + 10, 0);

        const rows = 8;
        const size = (data.height / rows) | 0;
        const cols = data.width / size | 0;
        const colors: [number, number, number][] = [];

        for (let i = 0; i < rows; ++i) {
            for (let j = 0; j < cols; ++j) {

                let x = (j + .5);
                let y = (i + .5);

                if (x < 9) x += 9;
                else x -= 9;

                const id = size * (x + y * data.width) * 4 | 0;

                let color: [number, number, number] = [data.data[id], data.data[id + 1], data.data[id + 2]];
                colors.push(color);

                ctx.strokeStyle = 'white';
                ctx.fillStyle = 'rgb(' + color.join(',') + ')';
                ctx.beginPath();
                ctx.arc(data.width / 2 + (j + .5) * size, data.height + 10 + (i + .5) * size, size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        let current = 0;
        const guessNext = function () {
            const color = colors[current];
            //const [h, c, y] = guess(color);


            const q = current / colors.length;
            const [h, c, y] = [(270 + 165 * ease(q))%360,.8*Math.sqrt(q), q];
            console.log(h,c,y)

            const [h1, c1, y1] = wheelHcy(h, c, y);

            ctx.fillStyle = wheel2rgb(h, c, y);
            ctx.fillRect(current * size, data.height * 2 + 10 + size + 1, size - 1, size);

            ctx.fillStyle = 'rgb(' + color.join(',') + ')';
            ctx.fillRect(current * size, data.height * 2 + 10, size - 1, size);

            if (++current < colors.length)
                requestAnimationFrame(guessNext);
        };

        requestAnimationFrame(guessNext);

        //guess([69, 3, 120], true);
    });

    img.src = 'ironbow.png';
}

function ease(t: number) {
    return t * t * t * (6 * t * t - 15 * t + 10);
}

function guess(color: [number, number, number], debug: boolean = false, res: number = 1): [number, number, number] {
    const [r0, g0, b0] = color;

    let dif = Infinity;
    let best: [number, number, number] | undefined;
    for (var h = 0; h < 360 * res; ++h) {
        for (let c = 0; c < 255 * res; ++c) {
            for (let y = 0; y < 255 * res; ++y) {
                let [r, g, b] = wheelHcy(h / res, c / 255 / res, y / 255 / res);
                let d = Math.abs((r * 255 | 0) - r0) + Math.abs((g * 255 | 0) - g0) + Math.abs((b * 255 | 0) - b0);
                if (d < dif) {
                    if (debug) console.log(d, dif, fmt(r, g, b), fmt(r0, g0, b0));
                    best = [h / res, c / 255 / res, y / 255 / res];
                    dif = d;
                }
            }
        }
    }

    best = <[number, number, number]>best;
    const [r, g, b] = wheelHcy(best[0], best[1], best[2]);
    const clr = fmt(r, g, b);
    const diff = [Math.abs(color[0] - clr[0]), Math.abs(color[1] - clr[1]), Math.abs(color[2] - clr[2])];
    let md = diff[0] + diff[1] + diff[2];
    if (md > 0 && md < 3 && res == 1) {
        return guess(color, debug, 2);
    }

    console.log(color, clr, diff, 'hcy(' + best.join(', ') + ')');

    return <[number, number, number]>best;
}

function fmt(r: number, g: number, b: number) {
    return [r * 255 | 0, g * 255 | 0, b * 255 | 0];
}