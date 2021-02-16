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
      .replace(/1/g, 'l')
      .replace(/0/g, 'o')
      .replace(/z/gi, '7')
      .replace(/x/gi, 'ks')
      .toLocaleLowerCase();

    let rnd = new Random();
    let [seed1, seed2] = [rnd.iNext(10000, 100000), rnd.iNext(10000, 100000)];
    let [columns, toprow, rest] = this.GetCodeTable(seed1, seed2);

    this.log(columns, toprow, rest);

    let res: string[] = [];
    let i = -1;
    let adj = -1;

    let push = (c: string | number) => {
      if (++adj >= 5) {
        adj = 0;
        res.push(' ');
      }
      res.push(c.toString());
    };

    (seed1.toString() + seed2.toString()).split('').map(push);

    let p = 0;
    let blank = rest.indexOf('.');

    while (p < plaintext.length) {
      const ch = plaintext[p];
      const slice = plaintext.slice(p);


      let idx = toprow.findIndex(m =>
        m.includes('/')
          ? m.split('/').some(k => ch == k)
          : slice.startsWith(m)
      );

      if (idx != -1) {
        push(columns[idx]);
        p += toprow[idx].includes('/') ? 1 : toprow[idx].length;
      }
      else {
        idx = rest.findIndex(m =>
          m.includes('/')
            ? m.split('/').some(k => ch == k)
            : slice.startsWith(m)
        );

        if (idx != -1) {
          p += rest[idx].includes('/') ? 1 : rest[idx].length;
        }
        else {
          idx = blank;
          ++p;
        }

        push(columns[7 + (idx / 10) | 0]);
        push(columns[idx % 10]);
      }
    }

    return res.join('');
  }

  private log(columns: number[], toprow: string[], rest: string[]) {

    const w = columns.length;
    const widhts = columns.map((_, i) => Math.max(i < toprow.length ? toprow[i].length : 0, rest[i].length, rest[i + w].length, rest[i + w * 2].length));

    const align: (v: string, i: number) => string = (str, i) => str.padEnd(widhts[i])

    console.log('  ' + columns.map((n, i) => align(n.toString(), i)).join(' '));
    console.log('  ' + toprow.map(align).join(' '));
    console.log(columns[7] + ' ' + rest.slice(0, w).map(align).join(' '));
    console.log(columns[8] + ' ' + rest.slice(w, w * 2).map(align).join(' '));
    console.log(columns[9] + ' ' + rest.slice(w * 2, w * 3).map(align).join(' '));
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
      let col = columns.indexOf(+ciphertext[i]);

      if (col < 7) {
        res.push(nice(toprow[col]));
      }
      else {
        let row = col - 7;
        col = columns.indexOf(+ciphertext[++i]);
        res.push(nice(rest[row * 10 + col]));
      }
    }

    return res.join('');
  }

  public GetCodeTable(seed1: number, seed2: number): [number[], string[], string[]] {
    let rnd1 = new Random(seed1);
    let rnd2 = new Random(seed2);

    const top = 13;

    const symbols = alphabeth();
    const high = symbols.slice(0, top)

    rnd1.Shuffle(high);

    const toprow = high.slice(0, 7);
    const rest = rnd2.Shuffle(symbols.slice(top).concat(high.slice(7)));

    let columns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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
    'e',//11.61%
    'o',//8.48%
    's',//6.80%
    'a',//5.86%
    't',//5.61%
    'i',//5.61%
    'd',//4.96%
    'r',//4.51%
    'l',//4.38%
    'h',//3.98%
    'n',//3.76%
    'u',//3.10%
    'th',//3.06%
    'm',//2.95%
    'w',//2.62%
    'c',//2.60%
    'f',//2.41%
    'g',//2.34%
    'y',//2.32%
    'in',//2.05%
    'p',//1.91%
    'er',//1.88%
    'an',//1.79%
    'b',//1.70%
    'k/q/x/j/z',//1.44%
    'at',//1.18%
    'v',//1.07%
    // 27
    ' ', '.', '2', '3', '4', '5', '6', '7', '8', '9'
  ]
}