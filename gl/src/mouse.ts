import { mul44v } from './matrix';
import { Camera, deg, rotateAArroundB, cross, diff, rotate3d, vectorAngleQuaternion, mul, sum, norm, scale } from './transform';
import { Vec3 } from './types';

const clamp = (v: number, min: number, max: number) => {
    return v > max ? max : v < min ? min : v;
}

export class ViewController {
    private readonly minfov = 3 * deg;
    private readonly maxfov = 140 * deg;

    private readonly qpanh = 1 / 4 * deg;
    private readonly qpanv = 1 / 32 * deg;

    private readonly qorbh = 1 / 4 * deg;
    private readonly qorbv = 1 / 24 * deg;

    constructor(private readonly cam: Camera) { }

    public zoom(delta: number) {
        const k = 1.2;
        const targetfov = delta > 0 ? this.cam.fov * k : this.cam.fov / k;

        this.cam.fov = clamp(targetfov, this.minfov, this.maxfov);
    }

    public turn(dx: number, dy: number) {
        const cam = this.cam;

        cam.lookat = rotateAArroundB(cam.lookat, cam.pos, dx * this.qpanh, cam.up);
        cam.lookat = rotateAArroundB(cam.lookat, cam.pos, dy * this.qpanv, cross(cam.up, diff(cam.pos, cam.lookat)));
    }

    public orbit(dx: number, dy: number) {
        const cam = this.cam;
        const v = cross(cam.up, diff(cam.pos, cam.lookat));

        cam.pos = rotateAArroundB(cam.pos, cam.lookat, dx * this.qorbh, cam.up);
        cam.pos = rotateAArroundB(cam.pos, cam.lookat, -dy * this.qorbv, v);
        cam.up = <Vec3>mul44v(rotate3d(vectorAngleQuaternion(v, -dy * this.qorbv)), [cam.up[0], cam.up[1], cam.up[2], 1]).slice(0, 3);
    }

    public move(v: Vec3) {
        mul
        const cam = this.cam;

        console.log(v, cam.lookat, cam.pos, norm(diff(cam.lookat, cam.pos)))
        let dir = norm(diff(cam.lookat, cam.pos));
        let side = norm(cross(dir, cam.up));

        v = sum(scale(dir, v[0]), scale(side, v[1]), scale(cam.up, v[2]));


        cam.pos = sum(cam.pos, v);
        cam.lookat = sum(cam.lookat, v);
    }
}

export class MouseAdapter {
    constructor(private readonly controller: ViewController) {
        addEventListener('wheel', (e) => this.handleWheel(e));
        addEventListener('contextmenu', (e) => this.handleContextMenu(e), true);
        addEventListener('mousemove', (e) => this.handleMouseMove(e));
        addEventListener('keydown', (e) => this.handleKey(e))
    }

    private handleKey(e: KeyboardEvent) {
        let unhandled = false;
        switch (e.code) {
            case 'KeyW':
                this.controller.move([1, 0, 0])
                break;
            case 'KeyA':
                this.controller.move([0, -1, 0])
                break;
            case 'KeyS':
                this.controller.move([-1, 0, 0])
                break;
            case 'KeyD':
                this.controller.move([0, 1, 0])
                break;
            case 'Space':
                this.controller.move([0, 0, 1])
                break;
            case 'ControlLeft':
                this.controller.move([0, 0, -1])
                break;
            default:
                unhandled = true;
        }

        if (!unhandled)
            e.preventDefault();
    }

    private handleWheel(e: WheelEvent) {
        this.controller.zoom(e.deltaY);

        e.preventDefault();
    }

    private handleContextMenu(e: Event) {
        e.preventDefault();
    }

    private handleMouseMove(e: MouseEvent) {
        if (!!(e.buttons & 1))
            this.controller.turn(e.movementX, e.movementY);
        else if (!!(e.buttons & 2))
            this.controller.orbit(e.movementX, e.movementY);
    }
}