// Test Utilities:
import * as chai from 'chai';
import * as dedent from 'dedent';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

// Test setup:
let { expect } = chai;
chai.use(sinonChai);

// Dependencies:
import * as Promise from 'bluebird';
import Hero from './types/Hero';
import IHorse from './types/IHorse';
import Weapon from './types/Weapon';

// Under test:
import { ineeda, IneedaFactory } from '../src/index';

describe('ineeda:', () => {
    describe('ineeda:', () => {
        it('should create a mock of a class', () => {
            let hero = ineeda<Hero>();

            expect(hero).to.not.equal(undefined);
        });

        it('should create a mock of an interface', () => {
            let horse: IHorse = ineeda<IHorse>();
            expect(horse).to.not.equal(undefined);
        });

        it('should allow you to provide specific values', () => {
            let hero = ineeda<Hero>({ name: 'bonnie' });

            expect(hero.name).to.equal('bonnie');
        });

        it('should allow you to provide nested specific values', () => {
            let hero = ineeda<Hero>({
                weapon: ineeda<Weapon>({
                    strength: 5
                })
            });

            expect(hero.weapon.strength).to.equal(5);
        });

        it('should set a stubbed function for a function', () => {
            let hero = ineeda<Hero>();

            expect(() => {
                hero.weapon.sharpen();
            }).to.throw('"sharpen" is not implemented.');
        });

        it('should allow you to use sinon to stub a function', () => {
            ineeda.intercept({
                calledBefore: null,
                restore: null
            });

            let hero = ineeda<Hero>();
            sinon.stub(hero.weapon, 'sharpen');

            hero.weapon.sharpen();

            expect(hero.weapon.sharpen).to.have.callCount(1);

            ineeda.reset();
        });

        it('should allow you to use sinon to spy on function', () => {
            ineeda.intercept({
                calledBefore: null,
                restore: null
            });

            let weapon = ineeda<Weapon>();
            sinon.spy(weapon, 'sharpen');

            expect(() => {
                weapon.sharpen();
            }).to.throw();
            expect(weapon.sharpen).to.have.callCount(1);

            ineeda.reset();
        });

        it('should allow you to build up deeply nexted objects', () => {
            ineeda.intercept({
                calledBefore: null,
                restore: null
            });

            let hero = ineeda<Hero>();

            sinon.stub(hero.holdOut, 'then').returns(Promise.resolve());

            let result = hero.holdOut.then()
            .then(() => {
                expect(hero.holdOut.then).to.not.equal(undefined);
            });

            ineeda.reset();

            return result;
        });

        it('should create an object that can handle being cast', () => {
            let hero = ineeda<Hero>();

            expect(() => new Date(<any>hero)).to.not.throw();
        });

        it('should have a `toString` implementation', () => {
            let hero = ineeda<Hero>();

            expect(hero.toString()).to.equal('[object IneedaMock]');
        });

        it('should have a `toJSON` implementation', () => {
            let hero = ineeda<Hero>({
                weapon: ineeda<Weapon>({
                    strength: 5
                })
            });

            expect(JSON.stringify(hero, null, '    ')).to.equal(dedent(`{
                "weapon": {
                    "strength": 5
                }
            }`));
        });

        it('should work with Object.keys', () => {
            let hero = ineeda<Hero>({
                weapon: ineeda<Weapon>()
            });

            expect(Object.keys(hero)).to.deep.equal(['prototype', 'weapon']);
        });
    });

    describe('ineeda - instanceof:', () => {
        it('should create a mock of a class', () => {
            let hero = ineeda.instanceof<Hero>(Hero);

            expect(hero).to.not.equal(undefined);
        });

        it('should be an actual instance of the class', () => {
            let hero = ineeda.instanceof<Hero>(Hero);

            expect(hero).to.be.an.instanceof(Hero);
        });
    });

    describe('ineeda - factory:', () => {
        it('should create a factory', () => {
            let heroFactory: IneedaFactory<Hero> = ineeda.factory<Hero>();

            expect(heroFactory).to.not.equal(undefined);
        });

        it('should create a factory that creates mock instances when you call it', () => {
            let heroFactory: IneedaFactory<Hero> = ineeda.factory<Hero>();

            let hero: Hero = heroFactory();

            expect(hero).to.not.equal(undefined);
        });

        it('should let you access instances made by the factory', () => {
            let heroFactory: IneedaFactory<Hero> = ineeda.factory<Hero>();

            let hero1 = heroFactory();
            let hero2 = heroFactory();

            expect(heroFactory.getLatest()).to.equal(hero2);
        });
    });

    describe('ineeda - intercept', () => {
        it('should let you intercept proxied values globally', () => {
            ineeda.intercept(value => value + 10);

            let hero = ineeda<Hero>({
                age: 18
            });

            expect(hero.age).to.equal(28);

            ineeda.reset();
        });

        it('should let you intercept proxied values on an instance', () => {
            let hero = ineeda<Hero>({
                age: 18
            })
            .intercept(value => value + 10);

            expect(hero.age).to.equal(28);

            ineeda.reset();
        });

        it('should let you replace all functions with a stub', () => {
            ineeda.intercept({
                calledBefore: null,
                restore: null
            });
            ineeda.intercept((value, key: string, values, target) => {
                if (value instanceof Function) {
                    /* tslint:disable:no-empty */
                    target[key] = () => { };
                    /* tslint:enable:no-empty */
                    return sinon.stub(target, key, values[key]);
                }
                return value;
            });

            let weapon = ineeda<Weapon>();
            weapon.sharpen();

            expect(weapon.sharpen).to.have.callCount(1);

            ineeda.reset();
        });

        it('should let you replace all functions with a mock implementation', () => {
            ineeda.intercept({
                calledBefore: null,
                restore: null
            });

            let weapon = ineeda<Weapon>({
                sharpen: () => 5
            })
            .intercept((value, key, values, target) => {
                if (value instanceof Function) {
                    /* tslint:disable:no-empty */
                    target[key] = () => { };
                    /* tslint:enable:no-empty */
                    return sinon.stub(target, key, values[key]);
                }
                return value;
            });

            let result = weapon.sharpen();

            expect(result).to.equal(5);
            expect(weapon.sharpen).to.have.callCount(1);

            ineeda.reset();
        });

        it('should let you use a key to stub pre-configured values', () => {
            ineeda.intercept<Promise<any>>(Promise, { then: null });

            let promise = ineeda<Promise<any>>().intercept(Promise);

            expect(promise.then).to.equal(null);

            ineeda.reset();
        });
    });
});
