import { Point, Rect } from 'geometry';

export class Break { constructor(public readonly label: string, public readonly coord: number) { } }

export class IDataWindow {
    readonly name: string;
    readonly window: Rect;
    readonly breaks: { x: Break[], y: Break[] };
    readonly views: IPlotData[];
}

export interface IPlotData {
    readonly name: string;
    readonly data: ISeries[];
}

export interface ISeries {
    readonly name: string;
    readonly data: Point[];
    readonly color: string;
}

export interface IPlotter {
    render(data: IDataWindow, viewName: string): void;
}
