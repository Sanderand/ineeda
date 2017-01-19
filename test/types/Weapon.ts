// Dependencies:
import WeaponTypeEnum from './WeaponType.enum';

export default class Weapon {
    sharpness: number;
    strength: number;
    isMagic: boolean;
    isBlunt: boolean;

    type: WeaponTypeEnum;

    sharpen (): void { }
}
