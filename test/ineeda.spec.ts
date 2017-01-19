// Test Utilities:
import * as chai from 'chai';

// Test setup:
let { expect } = chai;

// Dependencies:
import Hero from './types/Hero';
import IHorse from './types/IHorse';

// Under test:
import ineed from '../src/index';

describe('ineeda:', () => {
    describe('ineed.a:', () => {
        let hero: Hero;

        beforeEach(() => {
            hero = ineed.a<Hero>();
        });

        it('should create a mock of a class', () => {
            expect(hero).to.not.be.undefined;
        });

        it('should create a mock of an interface', () => {
            let horse: IHorse = ineed.a<IHorse>();
            expect(horse).to.not.be.undefined;
        })

        it('should set a property: any to an empty object', () => {
            expect(hero.currentTool).to.deep.equal({});
        });

        it('should set a property: array to an empty array', () => {
            expect(hero.tools).to.deep.equal([]);
        });

        it('should set a property: boolean to false', () => {
            expect(hero.isBrave).to.equal(false);
        });

        it('should set a property: number to 0', () => {
            expect(hero.age).to.equal(0);
        });

        it('should set a property: string to an empty string', () => {
            expect(hero.name).to.equal('');
        });

        it('should set a getter for a nested complex object', () => {
            expect(hero.weapon).to.not.be.undefined;
        });

        it('should set a stubbed function for a function', () => {
            expect(() => {
                hero.weapon.sharpen();
            }).to.throw('"Weapon.sharpen" is not implemented.');
        });

        it('should set the lowest value for an Enum', () => {
            expect(hero.species).to.equal(0);
            expect(hero.weapon.type).to.equal(3);
        });
    });

    describe('ineed.aninstanceof:', () => {
        let hero: Hero;

        beforeEach(() => {
            hero = ineed.aninstanceof<Hero>(Hero);
        });

        it('should create a mock of a class', () => {
            expect(hero).to.not.be.undefined;
        });

        it('should be an actual instance of the class', () => {
            expect(hero).to.be.an.instanceof(Hero);
        });
    });
});
