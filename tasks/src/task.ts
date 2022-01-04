import { Schedule } from "./schedule";


export class Task {
    constructor(public readonly title: string, public readonly schedule: Schedule) { }
}
