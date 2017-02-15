// Dependencies:
import { normalisePath } from './normalise-path';

export class Request {
    public name?: string;
    public path: string;
    public type: string;

    constructor (
        options: Request
    ) {
        this.path = normalisePath(options.path);
        this.type = options.type;
        this.name = options.name || this.type;
    }
}
