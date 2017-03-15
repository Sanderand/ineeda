// Utilities:
import * as Promise from 'bluebird';
import { Observable } from 'rxjs/Observable';

// Dependencies:
import Weapon from './Weapon';

export default class Hero {
    currentTool: any;
    tools: Array<any>;
    isBrave: boolean;
    age: number;
    name: string;
    weapon: Weapon;
    holdOut: Promise<any>;
    victories$: Observable<number>;
}
