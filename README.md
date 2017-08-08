# ineeda

[![npm version](https://img.shields.io/npm/v/ineeda.svg)](https://img.shields.io/npm/v/ineeda.svg)

Auto-mocking with [Proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy)! Works best with TypeScript, but works just as well with JavaScript!

# Installation:

```
npm install ineeda --dev
```

# Usage:

### To get a mock of a concrete class:

```typescript
import { Hero } from './Hero';

import { ineeda } from 'ineeda';

let hero: Hero = ineeda<Hero>();
console.log(hero.age); // [IneedaProxy] (truthy!)
console.log(hero.weapon.isMagic); // [IneedaProxy] (truthy!)
console.log(hero.weapon.sharpen()); // Error('"sharpen" is not implemented.');

let bonnie: Hero = ineeda<Hero>({ name: 'Bonnie' });
console.log(bonnie.name); // 'Bonnie'
```

### To get a mock of an interface:

```typescript
import { IHorse } from './IHorse';

import { ineeda } from 'ineeda';

let horse: IHorse = ineeda<IHorse>();
horse.hero.weapon.sharpen(); // Error('"sharpen" is not implemented.');
```

### To get a mock of a concrete class that is an actual instance of that class:

```typescript
import { Hero } from './Hero';

import { ineeda } from 'ineeda';

let realHero: Hero = ineeda.instanceof<Hero>();
console.log(realHero instanceof Hero); // true;
```

### To get a factory that produces mocks of a concrete class:

```typescript
import { Hero } from './Hero';

import { ineeda, IneedaFactory } from 'ineeda';

let heroFactory: IneedaFactory<Hero> = ineeda.factory<Hero>();
let heroMock: Hero = heroFactory();
```

# Extra stuff:

### `ineeda.config - unproxy`:

Since the result of a call to `ineeda` is a proxy, it will happily pretend to be any kind of object you ask it to be! That can cause some issues, such as when dealing with `Promises` or `Observables`. To get around that, you can use `unproxy`.

First, somewhere in your test setup do something like the following.

```typeScript
ineeda.config(
    unproxy: [{
        // Prevent Bluebird from thinking ineeda mocks are Promises:
        when: Promise,
        keys: ['then']
    }, {
        // Prevent RxJS from thinking ineeda mocks are Observables:
        when: Observable,
        keys: ['schedule']
    }]
});
```

Then, when you need a fake `Promise` or `Observable`:

```typescript
let mockObject = ineeda<MyObject>();

function looksLikePromise (obj) {
    return !!obj.then;
}

console.log(looksLikePromise(mockObject)) // true;
console.log(looksLikePromise(mockObject.unproxy(Promise))) // false;

let mockObject = ineeda<MyObject>();
let myObservable$ = Observable.of(mockObject.unproxy(Observable));
```

You can also *globally* unproxy something, by omitting the `when` token:

```typeScript
ineeda.config(
    unproxy: [{
        // Prevent zone.js from thinking ineeda mocks are unconfigurable:
        keys: ['__zone_symbol__unconfigurables']
    }]
});
```
