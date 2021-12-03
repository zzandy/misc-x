import {rgb2hcl, triplet} from '../../lib/hcl';


export function parseColor(hex: string): triplet {
    return rgb2hcl(
        parseInt(hex.substr(1, 2), 16),
        parseInt(hex.substr(3, 2), 16),
        parseInt(hex.substr(5, 2), 16)
    );
}

export function colorString(color: triplet): string {
    return '#' + color.map(c => c.toString(16).substr(0, 2).padStart(2, '0')).join('');
}

