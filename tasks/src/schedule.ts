import moment from 'moment';

export enum ScheduleType {
    OnceAt,
    Dayly,
    Weekly,
    Monthly,
    Yearly
}

export class Schedule {
    format() {
        switch (this.type) {
            case ScheduleType.OnceAt:
                return moment(this.dateOrTime).fromNow();
                break;
            default:
                return 'N/A';
        }
    }

    constructor(public readonly type: ScheduleType, public readonly dateOrTime: Date, public readonly param?: string) {

    }
}

export const at = (date: Date) => {
    return new Schedule(ScheduleType.OnceAt, date);
}