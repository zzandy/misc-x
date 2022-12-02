import { rgbtuple } from '../../lib/color'

export type Palette = [rgbtuple, rgbtuple, rgbtuple];

export function hex2rgb(hex: string): rgbtuple {
    return [
        parseInt(hex.substring(1, 3), 16),
        parseInt(hex.substring(3, 5), 16),
        parseInt(hex.substring(5, 7), 16)
    ]
}