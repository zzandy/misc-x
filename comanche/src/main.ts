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
let maps = ['C1W.png', 'C2W.png', 'C3.png', 'C4.png', 'C5W.png', 'C6.png', 'C6W.png', 'C7W.png', 'C9W.png', 'C10W.png', 'C11.png', 'C11W.png', 'C13.png', 'C14.png', 'C15.png', 'C15W.png', 'C16.png', 'C16W.png', 'C17W.png', 'C18.png', 'C18W.png', 'C19W.png', 'C20W.png', 'C21.png', 'C21W.png', 'C22W.png', 'C24W.png', 'C25.png', 'C25W.png'];
let currentMap = 0;

main();

async function main() {
    [color, height] = await loadImages(maps[currentMap]);

    let loop = new Loop(1000 / 60, init, update, render);
    loop.start();
}

function init(): WorldState {
    let ctx = fullscreenCanvas(false, true);

    let player = {
        x: .35, y: .53, azimuth: -60, alt: 0,
    }

    player.alt = sample1d(height, player.x, player.y) + 10;

    let movement = {
        heading: new Inertial(10, 2, .1, 5),
        velocity: new Inertial(100, 10, .1, 100000),
        altitude: new Inertial(10, 1, .1, 30)
    };

    let camera = {
        fov: 110,
        range: .5
    }

    let inputs = {
        throttle: 0,
        steer: 0,
        alt: 0,
        nextMap: 0
    }

    bind(inputs, [
        ['throttle', 'KeyS', 'KeyW'],
        ['steer', 'KeyA', 'KeyD'],
        ['alt', 'ControlLeft', 'ShiftLeft'],
        ['nextMap', 'KeyN', 'KeyM']
    ]);

    return {
        ctx, color, height, player, camera, inputs, movement
    }
}

function update(delta: number, state: WorldState): WorldState {
    let { movement, player, inputs } = state;

    if (inputs.nextMap) {

        currentMap = (currentMap + maps.length + inputs.nextMap) % maps.length;
        loadImages(maps[currentMap]).then((res) => [state.color, state.height] = res);

        inputs.nextMap = 0;
    }

    let velocity = movement.velocity.update(inputs.throttle);
    let heading = movement.heading.update(inputs.steer);
    let altitude = movement.altitude.update(inputs.alt);

    player.azimuth += heading;

    player.alt += altitude;
    if (player.alt < 0) player.alt = 0;
    else if (player.alt > 300) player.alt = 300;

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

    let renderTarget = new ImageData(viewport.width, viewport.height);
    let numRays = viewport.width / 2;

    let rayWidth = (viewport.width / numRays) | 0;

    let sky: triplet = [0, 130, 137]

    const vw = viewport.width;
    const vh = viewport.height;
    const data = renderTarget.data;

    function putPar(color: triplet, ray: number, alt1: number, alt2: number) {
        let top = ((1 - alt2) * vh) | 0;
        let bottom = ((1 - alt1) * vh) | 0;

        for (let y = top; y < bottom; ++y) {
            let j = y * vw;
            for (let x = 0; x < rayWidth; ++x) {
                let i = j + ray * rayWidth + x;
                data[i * 4] = color[0];
                data[i * 4 + 1] = color[1];
                data[i * 4 + 2] = color[2];
                data[i * 4 + 3] = 255;
            }
        }
    }

    alt = Math.max(alt, sample1d(height, x, y) + 10)

    for (let i = 0; i < numRays; ++i) {
        let ylevel = 0;

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

            if (onscreensize > ylevel) {
                let c = sample(color, x + tx * q, y + ty * q);

                if (onscreensize > 0) {
                    putPar(c, i, ylevel, onscreensize)
                }

                ylevel = onscreensize;
            }

            z += dz;
            dz *= dq;
        }

        putPar(sky, i, ylevel, 1);
    }

    ctx.putImageData(renderTarget, viewport.ox, viewport.oy)
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

function bind<T extends { [key in P]: number }, P extends keyof T>(inputs: T, map: [P, string, string][]) {
    let keymap: { [key: string]: [P & keyof T, number] } = {};

    for (let [prop, dec, inc] of map) {
        keymap[inc] = [prop, 1];
        keymap[dec] = [prop, -1];
    }

    addEventListener('keydown', (e) => {
        let prop = keymap[e.code];
        if (prop !== undefined) {
            (inputs as { [key in P]: number })[prop[0]] = prop[1];
            e.preventDefault();
        }
    });

    addEventListener('keyup', (e) => {
        let prop = keymap[e.code];
        if (prop !== undefined) {
            (inputs as { [key in P]: number })[prop[0]] = 0;
            e.preventDefault();
        }
    });
}
