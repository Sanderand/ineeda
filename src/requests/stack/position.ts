// Dependencies:
import { normalisePath } from '../normalise-path';

export class Position {
    constructor (
      public column: number,
      public line: number,
      public path: string
    ) {
        this.path = normalisePath(this.path);
    }
}
