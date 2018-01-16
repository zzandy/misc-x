export const formatTimespan = (ts: number, inclMs: boolean = false): string => {
    var s = 1000;
    var m = 60 * s;
    var h = 60 * m;
    var d = 24 * h;

    var days = ts / d | 0;
    ts -= days * d;

    var hours = ts / h | 0;
    ts -= hours * h;

    var minutes = ts / m | 0;
    ts -= minutes * m;

    var seconds = ts / s | 0;
    ts -= seconds * s;

    var repr = [zf(hours, 2), zf(minutes, 2), zf(seconds, 2)].join(':')

    if (days > 0) repr = days + '.' + repr;
    if (inclMs) repr = repr + '.' + zf(ts, 3);

    return repr;
}

const formatDate = (date: Date): string => {
    var day = 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',');
    return day[date.getDay()] + ', ' + date.getFullYear() + '-' + zf(date.getMonth() + 1, 2) + '-' + zf(date.getDate(), 2)
}

const zf = (v: number, w: number): string => {
    let val = v.toString();
    if (val.length < w)
        val = new Array(w - val.length + 1).join('0') + val;

    return val;
}

const getMonday = (date: Date = new Date()): Date => {
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var monday = addDays(today, -Math.abs(today.getDay() - 1));
    return monday;
}

export const addDays = (date: Date, days: number): Date => {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}
