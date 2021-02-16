class Random {
  constructor(private seed: number = Date.now()) { }

  public Next(): number {
    return this.seed = +('0.' + Math.sin(this.seed).toString().substr(6));
  }

  public iNext(min: number, max: number): number {
    return (min + (max - min) * this.Next()) | 0;
  }

  public Shuffle<T>(array: T[]): T[] {
    var currentIndex = array.length, temporaryValue: T, randomIndex: number;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = this.iNext(0, currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}

interface ICipher {
  Encode(plaintext: string): string;
  Decode(ciphertext: string): string;
}

// implementation of a VIC cipher
class KgbCipher implements ICipher {
  public Encode(plaintext: string): string {
    plaintext = plaintext
      .replace(/j/gi, 'i')
      .toLocaleLowerCase();

    let rnd = new Random();
    let [seed1, seed2] = [rnd.iNext(10000, 100000), rnd.iNext(10000, 100000)];
    let [columns, toprow, rest] = this.GetCodeTable(seed1, seed2);

    this.log(columns, toprow, rest);

    let res: string[] = [];
    let adj = -1;

    let push = (c: string) => {
      if (++adj >= 5) {
        adj = 0;
        res.push(' ');
      }
      res.push(c);
    };

    (seed1.toString() + seed2.toString()).split('').map(push);

    let p = 0;


    type aggv = { idx: number, len: number };

    const find: (str: string, symbols: string[]) => number = (str, symbols) => {
      const aggfn = (agg: aggv, sym: string, i: number) => {
        if (sym.includes('/')) {
          for (let s of sym.split('/')) {
            if (s.length > agg.len && str.startsWith(s))
              return { idx: i, len: s.length }
          }
        }
        else if (sym.length > agg.len && str.startsWith(sym))
          return { idx: i, len: sym.length }

        return agg;
      };

      return symbols.reduce(aggfn, { idx: -1, len: -Infinity }).idx;
    };

    const data = toprow.concat(rest);
    let blank = data.indexOf('.');

    while (p < plaintext.length) {
      const slice = plaintext.slice(p);

      let idx = find(slice, data);

      if (idx == -1) idx = blank;

      if (idx < 9) {
        push(columns[idx]);
        p += toprow[idx].includes('/') ? 1 : toprow[idx].length;
      }
      else {
        push(columns[9 + ((idx - 9) / 12) | 0]);
        push(columns[(idx - 9) % 12]);

        p += data[idx].includes('/') ? 1 : data[idx].length;
      }
    }

    return res.join('');
  }

  private log(columns: string[], toprow: string[], rest: string[]) {

    const w = columns.length;

    const nice: (s: string) => string = (str) => str.replace(/\//g, '').replace(' ', '␣');
    const widhts = columns.map((_, i) => Math.max(i < toprow.length ? nice(toprow[i]).length : 0, nice(rest[i]).length, nice(rest[i + w]).length, nice(rest[i + w * 2]).length));

    const align: (v: string, i: number) => string = (str, i) => nice(str).padEnd(widhts[i])

    const bright = "\x1b[1m";
    const reset = "\x1b[0m";

    console.log(bright + '  ' + columns.map(align).join(' ') + reset);
    console.log('  ' + toprow.map(align).join(' '));
    console.log(bright + columns[9] + reset + ' ' + rest.slice(0, w).map(align).join(' '));
    console.log(bright + columns[10] + reset + ' ' + rest.slice(w, w * 2).map(align).join(' '));
    console.log(bright + columns[11] + reset + ' ' + rest.slice(w * 2, w * 3).map(align).join(' '));
  }

  public Decode(ciphertext: string): string {
    ciphertext = ciphertext.replace(/ /g, '');

    let seed1 = +ciphertext.substr(0, 5);
    let seed2 = +ciphertext.substr(5, 5);

    let [columns, toprow, rest] = this.GetCodeTable(seed1, seed2);

    let res: string[] = [];
    let i = 9;

    const nice: (a: string) => string = str => str.includes('/')
      ? str.split('/')[0]
      : str;

    while (++i < ciphertext.length) {
      let col = columns.indexOf(ciphertext[i]);

      if (col < 9) {
        res.push(nice(toprow[col]));
      }
      else {
        let row = col - 9;
        col = columns.indexOf(ciphertext[++i]);
        res.push(nice(rest[row * 12 + col]));
      }
    }

    return res.join('');
  }

  public GetCodeTable(seed1: number, seed2: number): [string[], string[], string[]] {
    let rnd1 = new Random(seed1);
    let rnd2 = new Random(seed2);

    const chars = '1234567890AB'.split('');

    const columns = rnd1.Shuffle(chars).slice(0, 12);

    const top = 21;
    const firstRow = columns.length - 3;

    const symbols = alphabeth();
    const high = symbols.slice(0, top)

    rnd1.Shuffle(high);

    const toprow = high.slice(0, firstRow);
    const rest = rnd2.Shuffle(symbols.slice(top).concat(high.slice(firstRow)));

    rnd2.Shuffle(columns);

    return [columns, toprow, rest];
  }
}

let cipher = new KgbCipher();

cycle("beaver accends the perforce. render sausages");
cycle("He learned the important lesson that a picnic at the beach on a windy day is a bad idea.");
cycle("Call me 345-67-89 at 12:20");
cycle("Queen's kestrel jumps at the zebra with the xander root xylophone");

function cycle(message: string) {
  let ciphertext = cipher.Encode(message);
  console.log(message);
  console.log(ciphertext);

  let decoded = cipher.Decode(ciphertext);
  console.log(decoded);
}

function alphabeth() {
  return [
    /*1.*/  'o' //7.79%
    /*2.*/, 'e' //7.26%
    /*3.*/, 's' //7.23%
    /*4.*/, 'a' //7.06%
    /*5.*/, 't' //6.15%
    /*6.*/, 'i' //4.88%
    /*7.*/, 'l' //4.66%
    /*8.*/, 'h' //4.22%
    /*9.*/, 'r' //4.05%
    /*10.*/, 'n' //3.61%
    /*11.*/, 'u' //3.30%
    /*12.*/, 'm' //3.13%
    /*13.*/, 'd' //3.13%
    /*14.*/, 'w' //2.79%
    /*15.*/, 'c' //2.76%
    /*16.*/, 'f' //2.57%
    /*17.*/, 'g' //2.49%
    /*18.*/, 'y' //2.47%
    /*19.*/, 'in' //2.18%
    /*20.*/, 'p' //2.03%
    /*21.*/, 'the' //1.98%
    /*22.*/, 'b' //1.81%
    /*23.*/, 'er' //1.40%
    /*24.*/, 're' //1.35%
    /*25.*/, 'he' //1.29%
    /*26.*/, 'at' //1.26%
    /*27.*/, 'on' //1.23%
    /*28.*/, 'v' //1.14%
    /*29.*/, 'it' //1.09%
    /*30.*/, 'and' //1.08%
    /*31.*/, 'k' //1.02%
    /*32.*/, 'q/x/z'// 0.52%
    , '.', ' ', ','
    , '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ]
}