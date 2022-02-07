import { ICanvasRenderingContext2D } from '../../lib/canvas';

export type Heightmap = { width: number, height: number, data: Uint8ClampedArray };

export type Player = {
    x: number,
    y: number,
    azimuth: number,
    alt: number,
}

export type Movement = {
    velocity: Inertial,
    heading: Inertial
}

export type Camera = {
    fov: number;
    range: number;
}

export type Inputs = {
    throttle: number,
    steer: number
}

export type WorldState = {
    can: ICanvasRenderingContext2D,
    color: ImageData,
    height: Heightmap,
    player: Player,
    camera: Camera,
    inputs: Inputs,
    movement: Movement
};

export class Inertial {
    private value: number = 0;
    constructor(private max: number, private acceleration: number, private drag: number, private scale: number = 1) { }

    public update(throttle: number) {
        let value = this.value + this.acceleration * throttle;

        if (throttle < .01) {
            value *= 1 - this.drag;
            if (Math.abs(value) < .1) value = 0;
        }

        this.value = Math.max(-this.max, Math.min(value, this.max));

        return this.value / this.scale;
    }
}

export type triplet = [number, number, number];