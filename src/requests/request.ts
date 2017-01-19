// Dependencies:
import { normalisePath } from './normalise-path';

export class Request {
    constructor (
      public name: string,
      public path: string
    ) {
        this.path = normalisePath(this.path);
    }
}
