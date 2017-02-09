# ineeda

[![npm version](https://img.shields.io/npm/v/ineeda.svg)](https://img.shields.io/npm/v/ineeda.svg)

Auto-mocking from TypeScript interfaces!

# Installation:

```
npm install ineeda --D
```

# Usage:

To get a mock of a concrete class:

```typescript
import Hero from './Hero';

import ineeda from 'ineeda';

let hero: Hero = ineeda<Hero>();
console.log(hero.age); // 0
console.log(hero.name); // ''
console.log(hero.weapon.isMagic); // false
console.log(hero.weapon.type); // 3
console.log(hero.weapon.sharpen()); // Error('"Weapon.sharpen" is not implemented.');
```

To get a mock of a concrete class that is an actual instance of that class:

```typescript
import Hero from './Hero';

import ineed from 'ineeda';

let realHero: Hero = ineeda<Hero>({ instanceof: Hero });
console.log(realHero instanceof Hero); // true;
```

To get a mock of an interface:

```typescript
import IHorse from './IHorse';

import ineed from 'ineeda';

let horse: IHorse = ineeda<IHorse>();
horse.hero.weapon.sharpen(); // Error('"Weapon.sharpen" is not implemented.');
```

To get a mock of something that has no type information:

```typescript
// Hero.ts
import * as Promise from 'bluebird'; // Has no types:

export default class Hero {
    // ...
    holdOut: Promise<any>;
}

// Hero.spec.ts
import Hero from './Hero';

import ineed from 'ineeda';

let hero: Hero = ineeda<Hero>({ proxy: true });
hero.holdOut.then(); // Error('"Hero.holdOut.then" is not implemented.');
```
