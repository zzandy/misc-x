import { fullscreenCanvas } from '../../lib/canvas';
import { loadImages } from './image';
import { Loop } from '../../lib/loop';
import { Heightmap, Inertial, Inputs, Player, triplet, WorldState } from './types';

// maps lifted from https://github.com/s-macke/VoxelSpace

const deg = Math.PI / 180;
const sin = Math.sin;
const cos = Math.cos;
const tan = Math.tan;

let color: ImageData, height: Heightmap;

let first = true;
let debug = false;
let debugSample = false;

main();

async function main() {
    let maps = ["C10W.png", "C13.png", "C15.png", "C18W.png", "C20W.png", "C23W.png", "C26W.png", "C29W.png", "C4.png", "C7W.png", "C11W.png", "C14.png", "C16W.png", "C19W.png", "C21.png", "C24W.png", "C27W.png", "C2W.png", "C5W.png", "C8.png", "C12W.png", "C14W.png", "C17W.png", "C1W.png", "C22W.png", "C25W.png", "C28W.png", "C3.png", "C6W.png", "C9W.png"];
    [color, height] = await loadImages(maps[0]);

    let loop = new Loop(1000 / 60, init, update, render);
    loop.start();
}

function init(): WorldState {
    let ctx = fullscreenCanvas(false, true);

    let player = {
        x: .35, y: .53, azimuth: -60, alt: height.data[(height.data.length / 2) | 0] + 20,
    }

    let movement = {
        heading: new Inertial(10, 2, .1, 5),
        velocity: new Inertial(100, 10, .1, 100000)
    };

    let camera = {
        fov: 110,
        range: .5
    }

    let inputs = {
        throttle: 0,
        steer: 0
    }

    addEventListener('keydown', press(inputs));
    addEventListener('keyup', release(inputs));

    return {
        ctx, color, height, player, camera, inputs, movement
    }
}

function update(delta: number, state: WorldState): WorldState {
    let { movement, player, inputs } = state;

    let velocity = movement.velocity.update(inputs.throttle);
    let heading = movement.heading.update(inputs.steer);

    player.azimuth += heading;

    player.x += velocity * Math.cos(player.azimuth * deg);
    player.y += velocity * Math.sin(player.azimuth * deg);

    if (player.x < 0 || player.x > 1) player.x -= (player.x | 0) - (player.x > 0 ? 0 : 1);
    if (player.y < 0 || player.y > 1) player.y -= (player.y | 0) - (player.y > 0 ? 0 : 1);

    return state;
}

function clamp(v: number): number {
    if (v < 0 || v > 1) return v - (v | 0) - (v > 0 ? 0 : 1);
    else return v;
}

function render(delta: number, state: WorldState) {
    let { ctx, player: { x, y, azimuth, alt }, color, height, camera: { fov, range } } = state;

    ctx.putImageData(color, 0, 0);

    let k = 600;
    let dq = 1.01
    let vfov = 70;

    let viewport = {
        ox: 1100,
        oy: 20,
        width: 640,
        height: 480
    };

    let numRays = viewport.width / 2;
    let sky: triplet = [0, 130, 137]

    function putPar(color: triplet, ray: number, alt1: number, alt2: number) {
        let w = viewport.width / numRays;
        ctx.fillStyle = format(color);
        ctx.fillRect(viewport.ox + ray * w, viewport.oy + viewport.height - alt2 * viewport.height, w, (alt2 - alt1) * viewport.height);
    }

    for (let i = 0; i < numRays; ++i) {
        debug = i == 50
        let ylevel = 0;
        let prevC: triplet = [255, 0, 255];

        let a = ((azimuth - fov / 2) + (i + .5) * fov / numRays) * deg;

        let z = 1;
        let dz = 1;

        let tx = range * cos(a), ty = range * sin(a);

        while (z < k) {
            let q = z / k;

            let h = sample1d(height, x + tx * q, y + ty * q);
            let d = q * range;

            let screenheight = 2000 * d * tan(vfov / 2 * deg) * 2
            let screenfloor = alt - screenheight / 2;

            let onscreensize = h < screenfloor ? 0 : h > screenfloor + screenheight ? 1 : (h - screenfloor) / screenheight;

            // if (debug) {
            //     if (first) console.log(alt, h, d, screenheight, screenfloor, onscreensize)
            //     can.strokeCircle((x + tx * q) * color.width, (y + ty * q) * color.height, 2);
            // }

            if (onscreensize > ylevel) {
                let c = sample(color, x + tx * q, y + ty * q);

                if (onscreensize > 0) {
                    putPar(c, i, ylevel, onscreensize)
                }

                // if (debug) {
                //     can.fillStyle = 'red';
                //     can.fillCircle((x + tx * q) * color.width, (y + ty * q) * color.height, 5);
                // }

                prevC = c;
                ylevel = onscreensize;
            }

            z += dz;
            dz *= dq;
        }

        if (debug && first) {
            first = false;
        }

        putPar(sky, i, ylevel, 1);
    }

    ctx.save()
    ctx.translate(x * color.width, y * color.height);

    ctx.strokeCircle(0, 0, 10);

    ctx.rotate(azimuth * deg)
    ctx.strokeRect(0, 0, 100, 0);

    ctx.restore();
}

function sample1d(image: ImageData, x: number, y: number): number {
    let i = (image.height * clamp(y)) | 0;
    let j = (image.width * clamp(x)) | 0;
    let k = i * image.width + j

    return image.data[k];
}

function sample(image: ImageData, x: number, y: number): triplet {
    let i = (image.height * clamp(y)) | 0;
    let j = (image.width * clamp(x)) | 0;
    let k = (i * image.width + j) * 4;

    return [
        image.data[k],
        image.data[k + 1],
        image.data[k + 2]
    ];
}

function format(c: triplet): string {
    return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function press(inputs: Inputs) {
    return (e: KeyboardEvent) => {
        switch (e.code) {
            case "KeyW": inputs.throttle = 1; break;
            case "KeyS": inputs.throttle = -1; break;
            case "KeyA": inputs.steer = -1; break;
            case "KeyD": inputs.steer = 1; break;
        }
    }
}

function release(inputs: Inputs) {
    return (e: KeyboardEvent) => {
        switch (e.code) {
            case "KeyW":
            case "KeyS": inputs.throttle = 0; break;
            case "KeyA":
            case "KeyD": inputs.steer = 0; break;
        }
    }
}
