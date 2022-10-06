import { fullscreenCanvas } from '../../lib/canvas';
import { AABB, Vector } from './geometry';
import { Rocket, Explosion } from './rocket';
import { Stats, tau } from './util';

export class Renderer {
    private readonly ctx = fullscreenCanvas(true, true);

    public draw(goals: Vector[], obstacles: AABB[], rockets: Rocket[], explosions: Explosion[], area: AABB, stats: Stats) {
        const { ctx, width, height } = this;

        ctx.save();
        ctx.clearRect(0, 0, width, height);

        const pad = (Math.min(height / 50, width / 50) | 0) + .5;
        const w = width - pad * 2;
        const h = height - pad * 2;

        ctx.scale(w / area.w, -h / area.h);
        ctx.translate(pad - area.x, -pad - area.y - area.h);

        ctx.beginPath()
        ctx.rect(area.x, area.y, area.w, area.h);
        ctx.clip();

        ctx.fillStyle = 'gold';
        for (let goal of goals) {
            ctx.fillCircle(goal.x, goal.y, 10);
            ctx.strokeCircle(goal.x, goal.y, 50);
        }

        // render rockets
        for (let rocket of rockets) {
            if (rocket.isDead) continue;

            ctx.save();
            ctx.translate(rocket.pos.x, rocket.pos.y);

            ctx.strokeStyle = 'grey';
            ctx.lineWidth = 1;
            ctx.strokeCircle(0, 0, 10);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(20 * Math.cos(tau * rocket.a), 20 * Math.sin(tau * rocket.a))
            ctx.stroke();

            ctx.restore();
        }

        // render exausts
        for (let rocket of rockets) {
            if (rocket.isDead) continue;

            ctx.save();
            ctx.translate(rocket.pos.x, rocket.pos.y);

            ctx.scale(10, 10)
            ctx.beginPath();
            ctx.moveTo(0, 0)
            ctx.lineTo(-8 * rocket.burnVector.x, -8 * rocket.burnVector.y);

            ctx.lineWidth = 1;
            ctx.strokeStyle = 'white';
            ctx.stroke();

            ctx.restore();
        }

        ctx.fillStyle = 'white';
        for (let expl of explosions) {
            ctx.fillCircle(expl.pos.x, expl.pos.y, easeOutQuint(expl.age / expl.lifespan) * 150);
        }

        ctx.lineWidth = 2;
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#fc0';
        ctx.strokeRect(area.x, area.y, area.w, area.h);

        for (let block of obstacles) {
            ctx.fillRect(block.x, block.y, block.w, block.h);
            ctx.strokeRect(block.x, block.y, block.w, block.h);
        }

        ctx.translate(area.x + 10, area.h - 10);
        ctx.scale(1, -1);

        let y = 0;
        let line = 3;
        let s = 80;


        for (let i = 0; i < 12; ++i) {
            let rocket = rockets[(i + (stats.frame/10|0)) % rockets.length];

            let x = 0;
            for (let command of rocket.commands) {

                x += command.leadTime;

                ctx.fillStyle = 'white';
                ctx.fillRect(x / s, y * line, command.burnTime / s, line - 1);

                x += command.burnTime;
                x += command.outTime;
            }

            if (++y > 12) break;
        }

        y += 45;

        this.ctx.fillStyle = 'grey';
        this.ctx.fillText(stats.first + 's', 0, y)
        this.ctx.fillText(stats.globalBest.toFixed(2) + 'pts % ' + (1 / stats.rate / 1000).toFixed(3) + "s/pt", 0, y + 20)

        this.ctx.restore();
    }

    public get width() {
        return this.ctx.canvas.width;
    }

    public get height() {
        return this.ctx.canvas.height;
    }
}

function easeOutQuint(x: number): number {
    return 1 - Math.pow(1 - x, 5);
}
