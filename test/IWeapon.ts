/// <reference path="../src/_references.d.ts" />
'use strict';

// Dependencies:
import WeaponTypeEnum from './WeaponTypeEnum';

interface IWeapon {
    sharpness: number;
    strength: number;
    isMagic: boolean;
    isBlunt: boolean;

    type: WeaponTypeEnum;

    sharpen (): void;
}

export default IWeapon;
