type rgbastring = string;
type rgbtuple = [number, number, number];

// hue Chroma luma
export function hcy(h: number, c: number, y: number): rgbtuple {
    // 601
    const r = .3;
    const g = .59;
    const b = .11;

    h %= 360;
    h /= 60;

    const k = (1 - Math.abs((h % 2) - 1));

    const K = h < 1 ? r + k * g
        : h < 2 ? g + k * r
            : h < 3 ? g + k * b
                : h < 4 ? b + k * g
                    : h < 5 ? b + k * r
                        : r + k * b;

    let cmax = 1;

    if (y <= 0 || y >= 1) cmax = 0;
    else cmax *= K < y ? (y - 1) / (K - 1) : K > y ? y / K : 1;

    c = Math.min(c, cmax);

    const x = c * k;
    const rgb = h < 1 ? [c, x, 0]
        : h < 2 ? [x, c, 0]
            : h < 3 ? [0, c, x]
                : h < 4 ? [0, x, c]
                    : h < 5 ? [x, 0, c]
                        : [c, 0, x];

    const m = y - (r * rgb[0] + g * rgb[1] + b * rgb[2]);

    return [rgb[0] + m, rgb[1] + m, rgb[2] + m];
}

const breaks = [
    [39, 60],
    [60, 120],
    [120, 180],
    [240, 240],
    [290, 300],
    [360, 360]
];

export function wheelHcy(h: number, c: number, y: number): rgbtuple {
    h %= 360;

    let h2 = h;
    let [s0, t0] = [0, 0];

    for (const [t, s] of breaks) {
        if (h < s) {
            h2 = t0 + (h - s0) * (t - t0) / (s - s0);
            break;
        }

        [s0, t0] = [s, t];
    }

    return hcy(h2, c, y);
}

export function wheel2rgb(h: number, c: number, y: number, a: number = 1): rgbastring {
    const rgbdata = wheelHcy(h, c, y);
    return tuple2rgb(rgbdata[0], rgbdata[1], rgbdata[2], a || 1);
}

function tuple2rgb(r: number, g: number, b: number, a: number): rgbastring {
    return 'rgba(' + (r * 255).toFixed(0) + ',' + (g * 255).toFixed(0) + ',' + (b * 255).toFixed(0) + ', ' + a + ')';
}

export function hcy2rgb(h: number, c: number, y: number, a: number = 1): rgbastring {
    const rgbdata = hcy(h, c, y);
    return tuple2rgb(rgbdata[0], rgbdata[1], rgbdata[2], a || 1);
}

export function rgbdata2rgb(data: rgbtuple): rgbastring;
export function rgbdata2rgb(data: rgbtuple, a: number): rgbastring;
export function rgbdata2rgb(data: rgbtuple): rgbastring;
export function rgbdata2rgb(t: rgbtuple, a?: number): rgbastring {
    return tuple2rgb(t[0], t[1], t[2], a === undefined ? 1 : a);
}
