public class Random{
	constructor(private seed: number = (new Date()).getTime()){}

	public Next(): number{
  	return this.seed = +('0.'+Math.sin(this.seed).toString().substr(6));
  }
  
  public iNext(min, max):number{
  	return (min + (max-min)*this.Next())|0;
  }
  
  public Shuffle<T>(array:T[]):T[] {
    var currentIndex = array.length, temporaryValue:T, randomIndex:number;

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

interface ICipher{
	Encode(plaintext: string): string;
  Decode(ciphertext: string): string;
}

public class KgbCipher implements ICipher{
	public Encode(plaintext: string): string{

		let rnd = new Random();
    let [seed1, seed2] = [rnd.iNext(100,1000), rnd.iNext(100,1000)];
    let [columns, toprow, rest] = this.GetCodeTable(seed1, seed2);
    
    //this.log(columns, toprow, rest);
    
    let res: string[] = [];
    let i = -1;
    let adj = -1;
    
    let push = (c:string)=>{
				if(++adj>=5){
         	adj=0;
        	res.push(' ');
        }
      	res.push(c);
    };
    
    (seed1.toString()+seed2.toString()).split('').map(push);
    
    while(++i<plaintext.length){
    	let ch = plaintext[i];
    	let i1 = toprow.indexOf(ch);
      let i2 = rest.indexOf(ch);
      
      if(i1 != -1){
      	push(columns[i1]);
      }
      else {
      	if(i2==-1){
        	i2 = rest.indexOf(' ');
        }
        
        push(columns[7+(i2/10)|0]);
        push(columns[i2%10]);
      }
    }
  	
  	return res.join('');
  }
  
  private log(columns, toprow, rest){
  	console.log('  ' + columns.join(' '));
    console.log('  ' + toprow.join(' '));
    console.log(columns[7] + ' ' + rest.slice(0, 10).split('').join(' '));
    console.log(columns[8] + ' ' + rest.slice(10, 20).split('').join(' '));
    console.log(columns[9] + ' ' + rest.slice(20, 30).split('').join(' '));
  }
  
  public Decode(ciphertext: string): string {
  	ciphertext = ciphertext.replace(/ /g, '');
      	
  	let seed1 = +ciphertext.substr(0,3);
    let seed2 = +ciphertext.substr(3,3);
    
    let [columns, toprow, rest] = this.GetCodeTable(seed1, seed2);
    
    let res:string[] = [];
    let i=5;
    
    while(++i<ciphertext.length){
    	let col = columns.indexOf(+ciphertext[i]);
      
      if(col < 7){
        res.push(toprow[col]);
      }
      else{
      	let row = col-7;
        col = columns.indexOf(+ciphertext[++i]);
        res.push(rest[row*10+col]);
      }
    }
    
    return res.join('');
  }
  
  public GetCodeTable(seed1: number, seed2: number): any[] {
  	let rnd1 = new Random(seed1);
    let rnd2 = new Random(seed2);
    
    let toprow = 'eations'.split('');
    let rest =   ('bcdfghjklm'
                 +'pqrtuvwxyz'
                 +'. ').split('');
                
		let columns = [0,1,2,3,4,5,6,7,8,9];
    
    rnd1.Shuffle(toprow);
    rnd1.Shuffle(rest);
    
    rnd2.Shuffle(columns);
    
    return [columns, toprow, rest];
  }
}

let cipher = new KgbCipher();



let message = "beaver accends the perforce. render sausages";
console.log(message);

let ciphertext = cipher.Encode(message);
console.log(ciphertext);

let decoded = cipher.Decode(ciphertext);
console.log(decoded);