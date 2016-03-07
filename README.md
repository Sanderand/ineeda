# ineeda - auto-mocking from TypeScript interfaces!

```typescript
// Interfaces:
import IHero from './IHero';

// Dependencies:
import * as path from 'path';
import ineeda from 'ineeda';

let hero: IHero = ineeda<IHero>(path.resolve(__dirname, './IHero'));
console.log(hero.age); // 0
console.log(hero.name); // ''
console.log(hero.weapon.isMagic); // false
console.log(hero.weapon.type); // 3
console.log(hero.weapon.sharpen()); // Error('"IWeapon.sharpen" is not implemented.');
```
