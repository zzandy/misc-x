import { fullscreenCanvas, ICanvasRenderingContext2D } from '../../lib/canvas';
import { hcy2rgb } from '../../lib/color';

export const main = () => {
    const ctx = fullscreenCanvas();
    document.body.style.backgroundColor = 'black';

    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

    const r = 200;
    const t = .2

    renderWheel(ctx, r, t, hcy2rgb);
    renderWheel(ctx, r * .7, t * 2, wheelColor);
    renderWheel(ctx, r * .4, t * 3, wheelHsl);
}

function renderWheel(ctx: ICanvasRenderingContext2D, r: number, t: number, colorFn: (h: number, c: number, y: number) => string) {
    const steps = 360;
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

        ctx.fillStyle = colorFn(i * 360 / steps, 1, .5);
        ctx.fill();
    }
}

function wheelColor(h: number, c: number, y: number, a?: number): string {
    const h2 = h < 180 ? 2 * h / 3 : 120 + (h - 180) * 4 / 3;

    return hcy2rgb(h2, c, y, a);
}

function wheelHsl(h: number, s: number, l: number) {
    const h2 = h < 180 ? 2 * h / 3 : 120 + (h - 180) * 4 / 3;
    return 'hsl(' + h2 + ', ' + s * 100 + '%, ' + l * 100 + '%)';
}