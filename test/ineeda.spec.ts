// Test Utilities:
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

// Test setup:
let { expect } = chai;
chai.use(sinonChai);

// Dependencies:
import * as Promise from 'bluebird';
import Hero from './types/Hero';
import IHorse from './types/IHorse';

// Under test:
import ineeda from '../src/index';

describe('ineeda:', () => {
    describe('ineeda:', () => {
        let hero: Hero;

        beforeEach(() => {
            let heroFactory = ineeda.factory<Hero>();
            hero = heroFactory();
        });

        it('should create a mock of a class', () => {
            expect(hero).to.not.be.undefined;
        });

        it('should create a mock of an interface', () => {
            let horse: IHorse = ineeda<IHorse>();
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
            }).to.throw('"Hero.weapon.sharpen" is not implemented.');
        });

        it('should allow you to use sinon to stub a function', () => {
            sinon.stub(hero.weapon, 'sharpen');

            hero.weapon.sharpen();

            expect(hero.weapon.sharpen).to.have.been.called;
        });

        it('should set the lowest value for an Enum', () => {
            expect(hero.species).to.equal(0);
            expect(hero.weapon.type).to.equal(3);
        });

        it('should throw an error when mocking a value of an unknown type', () => {
            expect(() => {
                let promise = ineeda<Promise<any>>();
            }).to.throw(`
        Could not mock <Promise>.
            This probably means there was no type information available for <Promise>.
            Either add type information, or call \`ineeda<Promise>({ proxy: true });\`
    `);
        });

        it('should throw an error when mocking a property of an unknown type', () => {
            let hero = ineeda<Hero>();

            expect(() => {
                console.log(hero.holdOut);
            }).to.throw(`
        Could not mock "holdOut" on <Hero>.
            This probably means there was no type information available for <Promise>.
            Either add type information, or call \`ineeda<Hero>({ proxy: true });\`
    `);
        });
    });

    describe('ineeda - instanceof:', () => {
        let hero: Hero;

        beforeEach(() => {
            hero = ineeda<Hero>({ instanceof: Hero });
        });

        it('should create a mock of a class', () => {
            expect(hero).to.not.be.undefined;
        });

        it('should be an actual instance of the class', () => {
            expect(hero).to.be.an.instanceof(Hero);
        });
    });

    describe('ineeda - proxy', () => {
        let hero: Hero;

        beforeEach(() => {
            hero = ineeda<Hero>({ proxy: true });
        });

        it('should return a proxied mock when mocking a value of an unknown type', () => {
            expect(hero.holdOut).to.not.equal(undefined);
        });

        it('should return a proxied function when mocking a function of an unknown type', () => {
            expect(() => {
                hero.holdOut.then()
            }).to.throw('"Hero.holdOut.then" is not implemented.');
        });

        it('should allow you to use sinon to stub a proxied function', () => {
            sinon.stub(hero.holdOut, 'then').returns(Promise.resolve());

            return hero.holdOut.then()
            .then(() => {
                expect(hero.holdOut.then).to.have.been.called;
            });
        });
    });
});
