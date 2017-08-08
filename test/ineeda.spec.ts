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
        let hero: Hero;

        beforeEach(() => {
            hero = ineeda<Hero>();
        });

        it('should create a mock of a class', () => {
            expect(hero).to.not.be.undefined;
        });

        it('should create a mock of an interface', () => {
            let horse: IHorse = ineeda<IHorse>();
            expect(horse).to.not.be.undefined;
        });

        it('should allow you to provide specific values', () => {
            let hero = ineeda<Hero>({ name: 'bonnie' });

            expect(hero.name).to.equal('bonnie');
        });

        it('should allow you to provide nested specific values', () => {
            let hero = ineeda<Hero>({ weapon: { strength: 5 } });

            expect(hero.weapon.strength).to.equal(5);
        });

        it('should set a stubbed function for a function', () => {
            expect(() => {
                hero.weapon.sharpen();
            }).to.throw('"sharpen" is not implemented.');
        });

        it('should allow you to use sinon to stub a function', () => {
            ineeda.config({
                unproxy: {
                    keys: ['restore', 'calledBefore']
                }
            });

            sinon.stub(hero.weapon, 'sharpen');

            hero.weapon.sharpen();

            expect(hero.weapon.sharpen).to.have.been.called;

            ineeda.reset();
        });

        it('should allow you to use sinon to spy on function', () => {
            ineeda.config({
                unproxy: {
                    keys: ['restore', 'calledBefore']
                }
            });

            let weapon = ineeda<Weapon>();
            sinon.spy(weapon, 'sharpen');

            expect(() => {
                weapon.sharpen();
            }).to.throw();
            expect(weapon.sharpen).to.have.been.called;

            ineeda.reset();
        });

        it('should allow you to build up deeply nexted objects', () => {
            ineeda.config({
                unproxy: {
                    keys: ['restore', 'calledBefore']
                }
            });

            let hero = ineeda<Hero>();

            sinon.stub(hero.holdOut, 'then').returns(Promise.resolve());

            let result = hero.holdOut.then()
            .then(() => {
                expect(hero.holdOut.then).to.not.be.undefined;
            });

            ineeda.reset();

            return result;
        });

        it('should have a `toString` implementation', () => {
            let hero = ineeda<Hero>();

            expect(hero.toString()).to.equal('[object IneedaMock]');
        });

        it('should have a `toJSON` implementation', () => {
            let hero = ineeda<Hero>({ weapon: { strength: 5 } });

            expect(JSON.stringify(hero, null, '    ')).to.equal(dedent(`{
                "weapon": {
                    "strength": 5
                }
            }`));
        });
    });

    describe('ineeda - instanceof:', () => {
        let hero: Hero;

        beforeEach(() => {
            hero = ineeda.instanceof<Hero>(Hero);
        });

        it('should create a mock of a class', () => {
            expect(hero).to.not.be.undefined;
        });

        it('should be an actual instance of the class', () => {
            expect(hero).to.be.an.instanceof(Hero);
        });
    });

    describe('ineeda - factory:', () => {
        it('should create a factory', () => {
            let heroFactory: IneedaFactory<Hero> = ineeda.factory<Hero>();

            expect(heroFactory).to.not.be.undefined;
        });

        it('should create a factory that creates mock instances when you call it', () => {
            let heroFactory: IneedaFactory<Hero> = ineeda.factory<Hero>();

            let hero: Hero = heroFactory();

            expect(hero).to.not.be.undefined;
        });
    });

    describe('ineeda - unproxy', () => {
        it('should let you "unproxy" proxied values globally', () => {
            ineeda.config({
                unproxy: {
                    keys: ['age']
                }
            });

            let hero = ineeda<Hero>();

            expect(hero.age).to.equal(null);

            ineeda.reset();
        });

        it('should let you "unproxy" proxied values on an instance', () => {
            ineeda.config({
                unproxy: {
                    when: Hero,
                    keys: ['age', 'name']
                }
            });

            let hero = ineeda<Hero>().unproxy(Hero);

            expect(hero.age).to.equal(null);
            expect(hero.name).to.equal(null);

            ineeda.reset();
        });
    });

    describe('ineeda - intercept', () => {
        it('should let you "intercept" proxied values globally', () => {
            ineeda.config({
                intercept: value => value + 10
            });

            let hero = ineeda<Hero>({
                age: 18
            });

            expect(hero.age).to.equal(28);

            ineeda.reset();
        });

        it('should let you "intercept" proxied values on an instance', () => {
            let hero = ineeda<Hero>({
                age: 18
            })
            .intercept(value => value + 10);

            expect(hero.age).to.equal(28);

            ineeda.reset();
        });

        it('should let you stub all functions', () => {
            ineeda.config({
                intercept: (value, key: string, values, target) => {
                    if (value instanceof Function) {
                        target[key] = () => { };
                        return sinon.stub(target, key, values[key]);
                    }
                    return value;
                },
                unproxy: {
                    keys: ['restore', 'calledBefore']
                }
            });

            let weapon = ineeda<Weapon>();
            weapon.sharpen();

            expect(weapon.sharpen).to.have.been.called;

            ineeda.reset();
        });

        it('should let you stub functions with a given implementation', () => {
            ineeda.config({
                unproxy: {
                    keys: ['restore', 'calledBefore']
                }
            });

            let weapon = ineeda<Weapon>({
                sharpen: () => 5
            })
            .intercept((value, key: string, values, target) => {
                if (value instanceof Function) {
                    target[key] = () => { };
                    return sinon.stub(target, key, values[key]);
                }
                return value;
            });

            let result = weapon.sharpen();

            expect(result).to.equal(5);
            expect(weapon.sharpen).to.have.been.called;

            ineeda.reset();
        });
    });
});
