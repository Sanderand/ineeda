/// <reference path="../src/_references.d.ts" />
'use strict';

// Dependencies:
import HeroSpeciesEnum from './HeroSpeciesEnum';

// Interfaces:
import IWeapon from './IWeapon';

interface IHero {
    currentTool: any,
    tools: Array<any>,
    isBrave: boolean;
    age: number;
    name: string;
    species: HeroSpeciesEnum;
    weapon: IWeapon;
}

export default IHero;
