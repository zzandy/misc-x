
export interface ICanvasRenderingContext2D extends CanvasRenderingContext2D {
    clear(): ICanvasRenderingContext2D;
    makePath(vertices: number[]): ICanvasRenderingContext2D;
    fillCircle(x: number, y: number, r: number): ICanvasRenderingContext2D;
    strokeCircle(x: number, y: number, r: number): ICanvasRenderingContext2D;
}

export function fullscreenCanvas(relative: boolean = false): ICanvasRenderingContext2D {

    let c = document.createElement('canvas');
    let ctx = <ICanvasRenderingContext2D>c.getContext('2d');

    if (ctx == null)
        throw new Error('failed to get \'2d\' context');

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    if (!relative) {
        ctx.canvas.style.position = 'absolute';
        ctx.canvas.style.top = '0';
        ctx.canvas.style.left = '0';
    }

    ctx.clear = function () {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return ctx;
    };

    ctx.makePath = function (vertices: number[]) {
        ctx.beginPath();
        ctx.moveTo(vertices[0], vertices[1]);
        for (var i = 2; i < vertices.length; i += 2) {
            ctx.lineTo(vertices[i], vertices[i + 1]);
        }
        ctx.closePath();

        return ctx;
    }

    ctx.strokeCircle = function (x: number, y: number, r: number) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        return ctx;
    }

    ctx.fillCircle = function (x: number, y: number, r: number) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
        return ctx;
    }

    document.body.appendChild(c);
    return ctx;
}