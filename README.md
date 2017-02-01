# ineeda

[![npm version](https://img.shields.io/npm/v/ineeda.svg)](https://img.shields.io/npm/v/ineeda.svg)

Auto-mocking from TypeScript interfaces!

# Installation:

```
npm install ineeda --DE
```

# Usage:

To get a mock of a concrete class:

```typescript
// Types:
import Hero from './Hero';

// Dependencies:
import ineed from 'ineeda';

let hero: Hero = ineed.a<Hero>();
console.log(hero.age); // 0
console.log(hero.name); // ''
console.log(hero.weapon.isMagic); // false
console.log(hero.weapon.type); // 3
console.log(hero.weapon.sharpen()); // Error('"Weapon.sharpen" is not implemented.');
```

To get a mock of a concrete class that is an actual instance of that class:

```typescript
// Types:
import Hero from './Hero';

// Dependencies:
import ineed from 'ineeda';

let realHero: Hero = ineed.aninstanceof<Hero>(Hero);
console.log(realHero instanceof Hero); // true;
```

To get a mock of an interface:

```typescript
// Types:
import IHorse from './IHorse';

// Dependencies:
import ineed from 'ineeda';

let horse: IHorse = ineed.a<IHorse>();
console.log(horse.hero.weapon.sharpen()); // Error('"Weapon.sharpen" is not implemented.');
```
