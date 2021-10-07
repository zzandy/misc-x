
export type color = [number, number, number] | [number, number, number, number];

export function rgb(color: color) {
    return '#' + color.map(c => c.toString(16).padStart(2, '0')).join('');
}

export class Palette {
    constructor(
        public readonly bg: color,
        public readonly secondary: color,
        public readonly primary: color,
        public readonly accent: color
    ) { }
}
