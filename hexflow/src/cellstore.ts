import { HexPos } from "./supercell";

export class Cell<TValue>{
    constructor(public value: TValue) { }
}
export class CellStore<TValue>{
    public forEach(callback: (pos: HexPos, value: TValue) => void) {


    }
}