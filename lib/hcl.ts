export type triplet = [number, number, number];

const TAU = 6.283185307179586476925287;
const ill = [0.96421, 1.00000, 0.82519];

/**
 * @param h - hueue 0..360
 * @param c - chroma 0..5, but realistically 0..1.2
 * @param l - lightness 0..~1.7
 * @returns 
 */
export function hcl2rgb(h: number, c: number, l: number): triplet {
    return lab2rgb(...hcl2lab(h, c, l));
}

export function rgb2hcl(r: number, g: number, b: number): triplet {
    return lab2hcl(...rgb2lab(r, g, b));
}

function hcl2lab(h: number, c: number, l: number): triplet {
    h /= 360.0;
    let L = l * 0.61 + 0.09;
    let angle = TAU / 6 - h * TAU;
    let r = (l * 0.311 + 0.125) * c;
    let a = Math.sin(angle) * r;
    let b = Math.cos(angle) * r;
    return [L, a, b];
}

function lab2hcl(l: number, a: number, b: number): triplet {
    l = (l - 0.09) / 0.61;
    let r = Math.sqrt(a * a + b * b);
    let c = r / (l * 0.311 + 0.125);
    let angle = Math.atan2(a, b);
    let h = (TAU / 6 - angle) / TAU;
    h *= 360;
    if (h < 0) h += 360;

    return [h, c, l];
}

function lab2rgb(l: number, a: number, b: number): triplet {
    return xyz2rgb(...lab2xyz(l, a, b));
}

function rgb2lab(r: number, g: number, b: number): triplet {
    return xyz2lab(...rgb2xyz(r, g, b))
}

function lab2xyz(l: number, a: number, b: number): triplet {
    let sl = (l + 0.16) / 1.16;

    let y = ill[1] * finv(sl);
    let x = ill[0] * finv(sl + (a / 5.0));
    let z = ill[2] * finv(sl - (b / 2.0));

    return [x, y, z];
}

function xyz2lab(x: number, y: number, z: number): triplet {
    let l = 1.16 * f(y / ill[1]) - 0.16;
    let a = 5 * (f(x / ill[0]) - f(y / ill[1]));
    let b = 2 * (f(y / ill[1]) - f(z / ill[2]));

    return [l, a, b];
}

function xyz2rgb(x: number, y: number, z: number): triplet {
    let rl = 3.2406 * x - 1.5372 * y - 0.4986 * z;
    let gl = -0.9689 * x + 1.8758 * y + 0.0415 * z;
    let bl = 0.0557 * x - 0.2040 * y + 1.0570 * z;

    let clip = Math.min(rl, gl, bl) < -0.001 || Math.max(rl, gl, bl) > 1.001;

    if (clip) {
        rl = rl < 0 ? 0 : rl > 1 ? 1 : rl;
        gl = gl < 0 ? 0 : gl > 1 ? 1 : gl;
        bl = bl < 0 ? 0 : bl > 1 ? 1 : bl;
    }

    let r = Math.round(255 * correctLin(rl));
    let g = Math.round(255 * correctLin(gl));
    let b = Math.round(255 * correctLin(bl));

    return [r, g, b];
}

function rgb2xyz(r: number, g: number, b: number): triplet {
    let rl = correctGam(r / 255.0);
    let gl = correctGam(g / 255.0);
    let bl = correctGam(b / 255.0);
    let x = 0.4124 * rl + 0.3576 * gl + 0.1805 * bl;
    let y = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
    let z = 0.0193 * rl + 0.1192 * gl + 0.9505 * bl;
    return [x, y, z];
}

const k1 = 6 / 29;
const k2 = 29 / 6;
const k = Math.pow(k1, 3);

const ka = k2 * k2 / 3
const kb = 2 * k1 * k1;

function f(t: number) {
    return t > k
        ? Math.pow(t, 1 / 3)
        : ka * t + 4 / 29;
}

function finv(t: number) {
    return t > k1
        ? t * t * t
        : kb * (t - 4 / 29);
}

function correctLin(cl: number) {
    const a = 0.055;
    return cl <= 0.0031308
        ? 12.92 * cl
        : (1 + a) * Math.pow(cl, 1 / 2.4) - a;
}

function correctGam(c: number) {
    const a = 0.055;
    return c <= 0.04045
        ? c / 12.92
        : Math.pow((c + a) / (1 + a), 2.4);
}
