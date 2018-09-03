import fs = require("fs");
import { Progress } from "./progress";

export async function stream(cb: (data: string) => void): Promise<void> {
    let prom = Promise.resolve();
    const path = __dirname + "\\..\\data";
    let n = 0;

    const files = fs.readdirSync(path);
    const len = files.length;

    const launch = new Progress('Starting', len);
    const finish = new Progress('Processing', len, true);

    for (const file of files) {
        launch.logOne(file);

        prom = prom.then(
            () =>
                new Promise<void>((res, x) => {
                    fs.readFile(path + "\\" + file, "utf8", (err, data) => {
                        if (err !== null) console.log(file + ": " + err);
                        cb(data);
                        finish.logOne(file);
                        res();
                    });
                })
        );
    }

    launch.done();
    finish.enable();

    await prom;
    finish.done();
}
