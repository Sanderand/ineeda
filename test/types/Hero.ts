// Utilities:
import * as Promise from 'bluebird';
import { Observable } from 'rxjs/Observable';

// Dependencies:
import HeroSpeciesEnum from './HeroSpecies.enum';
import Weapon from './Weapon';

export default class Hero {
    currentTool: any;
    tools: Array<any>;
    isBrave: boolean;
    age: number;
    name: string;
    species: HeroSpeciesEnum;
    weapon: Weapon;
    holdOut: Promise<any>;
    victories$: Observable<number>;
}
