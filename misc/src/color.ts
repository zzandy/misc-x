import { fullscreenCanvas, ICanvasRenderingContext2D } from '../../lib/canvas';
import { wheel2rgb , hcy2rgb} from '../../lib/color';

export const main = () => {
    const ctx = fullscreenCanvas();
    document.body.style.backgroundColor = 'black';

    const r = 200;
    const t = .2;

    //const before = (new Date).getTime();
    //renderNoise(ctx);
    //const after = (new Date).getTime();
    //console.log('fullscreen in ', after - before);

    ctx.globalCompositeOperation = 'difference';
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

    ctx.translate(-r*1.1, 0)
    renderWheel(ctx, r * .8, t * 2, wheel2rgb, 90);
    renderWheel(ctx, r * .7, t * 2, wheel2rgb, 270);

    ctx.translate(2.2*r, 0)
    renderWheel(ctx, r * .8, t * 2, hsl, 90);
    renderWheel(ctx, r * .7, t * 2, hsl, 270);
}


function renderWheel(ctx: ICanvasRenderingContext2D, r: number, t: number, colorFn: (h: number, c: number, y: number, a: number) => string, start: number = 0) {
    const steps = 30;
    const tau = Math.PI * 2;
    const [sin, cos] = [Math.sin, Math.cos];

    for (let i = 0; i < steps; ++i) {
        const a = tau * i / steps;
        const b = tau * (i + 1) / steps;

        ctx.beginPath();
        ctx.closePath();

        ctx.moveTo(r * cos(a), -r * sin(a));
        ctx.lineTo((1 + t) * r * cos(a), -(1 + t) * r * sin(a));

        ctx.lineTo((1 + t) * r * cos(b), - (1 + t) * r * sin(b));
        ctx.lineTo(r * cos(b), -r * sin(b));

        ctx.fillStyle = colorFn(start + i * 360 / steps, 1, .6, .6);
        ctx.fill();
    }
}

function hsl(h: number, s: number, l: number, a: number = 1) {
    return 'hsla(' + [h % 360, s * 100 + '%', l * 100 + '%', a].join(',') + ')';
}