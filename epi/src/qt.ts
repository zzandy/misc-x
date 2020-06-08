export class AABB {
    constructor(public readonly x: number,
        public readonly y: number,
        public readonly w: number,
        public readonly h: number) { }

    public contains(p: IPoint) {
        const { x, y, w, h } = this;
        return p.x >= x && p.y >= y && p.x < (x + w) && p.y < (y + h);
    }

    public intersects(bb: AABB) {
        const { x, y, w, h } = this;
        return !(x + w < bb.x || y + h < bb.y || bb.x + bb.w < x || bb.y + bb.h < y);
    }
}

export interface IPoint {
    readonly x: number;
    readonly y: number;
}

export class QuadTree extends AABB {
    private readonly leafs: IPoint[] = [];
    private readonly branches: QuadTree[] = [];

    public add(point: IPoint): boolean {
        if (!this.contains(point)) return false;

        const { leafs, branches, leafs: { length: numleafs }, branches: { length: numbranches } } = this;

        if (numleafs < 4) {
            leafs.push(point);
            return true;
        }

        if (numbranches == 0) {
            const { x, y } = this;
            const [w, h] = [this.w / 2, this.h / 2];

            branches.push(
                new QuadTree(x, y, w, h),
                new QuadTree(x + w, y, w, h),
                new QuadTree(x, y + h, w, h),
                new QuadTree(x + w, y + h, w, h),
            );
        }

        return branches.some(branch => branch.add(point));
    }

    public get(area: AABB): IPoint[] {
        const points: IPoint[] = [];
        this.addPoints(area, points);
        return points;
    }

    private addPoints(area: AABB, points: IPoint[]): void {
        if (!this.intersects(area)) return;

        Array.prototype.push.apply(points, this.leafs.filter(leaf => area.contains(leaf)));
        this.branches.forEach(branch => branch.addPoints(area, points));
    }
}