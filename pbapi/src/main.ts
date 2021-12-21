import fetch from 'node-fetch'
import * as fs from 'fs';

async function main() {
    let terms = await readTerms();

    let data: string[][] = [];
    let nodata: string[] = [];

    for (let term of terms) {

        let matches = (await query(term))
            .filter(isPromisingName)
            .filter(isRecentEnough)
            .filter(isSeeded)
            .filter(isLargeEnough);

        if (matches.length > 0)
            data.push(...matches.map(m => [m.id, m.seeders, humanSize(m.size), m.name, humanDate(m.added)]));
        else
            nodata.push(bold(term));
    }

    let widths = data.reduce((w, row) => {
        return w.map((x, i) => Math.max(x, row[i].length))
    }, [0, 0, 0, 0, 0])

    for (let row of data) {
        console.log([
            link('https://thepiratebay.org/description.php?id=' + row[0], 'link'),
            row[1].padStart(widths[1]),
            row[2].padStart(widths[2]),
            row[3].padEnd(widths[3]),
            row[4]
        ].join('  '));
    }

    console.log('No results for ' + nodata.join(', '));
}

main();

async function readTerms() {
    let data = await new Promise<string>((resolve, reject) => {
        fs.readFile('terms.txt', 'utf8', (err, data) => {
            if (err) reject(err)
            else resolve(data)
        });
    });

    return data.split(/\r?\n/);
}

async function query(term: string): Promise<record[]> {
    let url = `https://apibay.org/q.php?q=${encodeURIComponent(term)}&cat=200`
    let res = await fetch(url);
    return <record[]>await res.json();
}

function isPromisingName(record: record) {
    return !record.name.match(/hdcam|camrip|\.cam\.|hd[-.]?ts/i)
}

function isRecentEnough(record: record) {
    let age = Date.now() - (+record.added * 1000);
    return age / (1000 * 60 * 60 * 24 * 7) < 2; // less than two weeks ago
}

function isSeeded(record: record) {
    return +record.seeders > 4
}

function isLargeEnough(record: record) {
    return +record.size > 200000000;
}

function humanSize(size: string) {
    return +size > 1000000000
        ? ((+size) / 1000000000).toFixed(1) + 'GiB'
        : ((+size) / 1000000).toFixed(1) + 'MiB'
}

function humanDate(date: string) {
    let age = Date.now() - (+date * 1000);

    let partNames = 'years months weeks days hours minutes seconds'.split(' ');
    let partFactors = [
        1000 * 60 * 60 * 24 * 365,
        1000 * 60 * 60 * 24 * 30,
        1000 * 60 * 60 * 24 * 7,
        1000 * 60 * 60 * 24,
        1000 * 60 * 60,
        1000 * 60,
        1000
    ];

    for (let i = 0; i < partFactors.length; ++i) {
        let ratio = age / partFactors[i];
        if (ratio > 1) {
            let fullParts = ratio | 0;
            let message = fullParts + ' ' + partNames[i];

            if (ratio > 1.3 && ratio < 2.7 && i < partFactors.length - 1) {
                fullParts = ((age - fullParts * partFactors[i]) / partFactors[i + 1]) | 0;
                message += ' ' + fullParts + ' ' + partNames[i + 1];
            }

            return message + ' ago';
        }
    }


    return date;
}

function link(text: string, title: string): string {
    return `\x1b]8;;${text}\x1b\\${title}\x1b]8;;\x1b\\`
}

function bold(text: string): string {
    return `\x1b[1m${text}\x1b[0m`
}

type record = {
    id: string,
    name: string,
    info_hash: string,
    leechers: string,
    seeders: string,
    num_files: string,
    size: string,
    username: string,
    added: string,
    status: string,
    category: string,
    imdb: string,
}