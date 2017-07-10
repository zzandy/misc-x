type rgbastring = string;

// hue Chroma luma
export function hcy2rgb(h: number, c: number, y: number, a: number):rgbastring {
    // 601
    let r = .3;
    let g = .59;
    let b = .11;

    h /= 60;

    let k = (1 - Math.abs((h % 2) - 1));

    let K = h < 1 ? r + k * g
        : h < 2 ? g + k * r
            : h < 3 ? g + k * b
                : h < 4 ? b + k * g
                    : h < 5 ? b + k * r
                        : r + k * b;

    let cmax = 1;

    if (y <= 0 || y >= 1) cmax = 0;
    else cmax *= K < y ? (y - 1) / (K - 1) : K > y ? y / K : 1;
    //c *= cmax;
    c = Math.min(c, cmax);

    let x = c * k;
    let rgb = h < 1 ? [c, x, 0]
        : h < 2 ? [x, c, 0]
            : h < 3 ? [0, c, x]
                : h < 4 ? [0, x, c]
                    : h < 5 ? [x, 0, c]
                        : [c, 0, x];

    let m = y - (r * rgb[0] + g * rgb[1] + b * rgb[2]);

    let rgbdata = [rgb[0] + m, rgb[1] + m, rgb[2] + m];
    return 'rgba(' + (rgbdata[0] * 255).toFixed(0) + ',' + (rgbdata[1] * 255).toFixed(0) + ',' + (rgbdata[2] * 255).toFixed(0) + ', ' + (a || 1) + ')';
}