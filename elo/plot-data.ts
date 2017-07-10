import { Point, Rect } from 'geometry';

export class Break { constructor(public readonly label: string, public readonly coord: number) { } }

export class DataWindow {
    constructor(public readonly name: string, public readonly window: Rect, public readonly xBreaks: Break[], public readonly yBreaks: Break[], public readonly views: PlotData[]) { }
}

export class PlotData {
    constructor(public readonly name: string, public readonly data: Series[]) { }
}

export class Series {
    constructor(public readonly name: string, public readonly data: Point[]) { }
}

export interface IRender {
    render(data: DataWindow): void;
}