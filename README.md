# ineeda - auto-mocking from TypeScript interfaces!

```typescript
// Types:
import Hero from './Hero';
import IHorse from './IHorse';

// Dependencies:
import * as path from 'path';
import ineed from 'ineeda';

let hero: Hero = ineed.a<Hero>();
console.log(hero.age); // 0
console.log(hero.name); // ''
console.log(hero.weapon.isMagic); // false
console.log(hero.weapon.type); // 3
console.log(hero.weapon.sharpen()); // Error('"Weapon.sharpen" is not implemented.');

let realHero: Hero = ineed.aninstanceof<Hero>(Hero);
console.log(realHero instanceof Hero); // true;

let horse: IHorse = ineed.a<IHorse>();
console.log(horse.hero.weapon.sharpen()); // // Error('"Weapon.sharpen" is not implemented.');
```
