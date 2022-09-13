import { fullscreenCanvas } from '../../lib/canvas';
import { AABB, Vector } from './geometry';
import { Rocket, Explosion } from './rocket';
import { tau } from './util';

export class Renderer {
    private readonly ctx = fullscreenCanvas(true);

    public draw(goals: Vector[], obstacles: AABB[], rockets: Rocket[], explosions: Explosion[], area: AABB) {
        const { ctx, width, height } = this;

        ctx.save();
        ctx.clearRect(0, 0, width, height);

        const pad = (Math.min(height / 50, width / 50) | 0) + .5;
        const w = width - pad * 2;
        const h = height - pad * 2;

        ctx.scale(w / area.w, -h / area.h);
        ctx.translate(pad - area.x, -pad - area.y - area.h);

        ctx.strokeStyle = '#aaa';
        ctx.strokeRect(area.x, area.y, area.w, area.h);

        for (let block of obstacles) {
            ctx.strokeRect(block.x, block.y, block.w, block.h);
        }

        ctx.fillStyle = 'gold';
        for (let goal of goals) {
            ctx.fillCircle(goal.x, goal.y, 10);
            ctx.strokeCircle(goal.x, goal.y, 50);
        }

        for (let rocket of rockets) {
            if (rocket.isDead) continue;

            ctx.save();
            ctx.translate(rocket.pos.x, rocket.pos.y);
            ctx.strokeCircle(0, 0, 10);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(20 * Math.cos(tau * rocket.a), 20 * Math.sin(tau * rocket.a))
            ctx.stroke();
            ctx.scale(10, 10)
            ctx.beginPath();
            ctx.moveTo(0, 0)
            ctx.lineTo(-8 * rocket.burnVector.x, -8 * rocket.burnVector.y);
            ctx.strokeStyle = 'red';
            ctx.stroke();

            ctx.restore();
        }

        ctx.fillStyle = 'white';
        for (let expl of explosions) {
            ctx.fillCircle(expl.pos.x, expl.pos.y, expl.age / 4);
            // ctx.globalCompositeOperation = "destination-out";
            // ctx.fillCircle(expl.pos.x, expl.pos.y, Math.max(0, expl.age / 4 - 5));
            // ctx.globalCompositeOperation = "source-over";
        }

        this.ctx.restore();
    }

    public get width() {
        return this.ctx.canvas.width;
    }

    public get height() {
        return this.ctx.canvas.height;
    }
}