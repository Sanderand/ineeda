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
import Weapon from './types/Weapon';

// Under test:
import { ineeda, IneedaFactory } from '../src/index';

ineeda.unproxy({
    values: { restore: null, calledBefore: null }
})

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

        it('should set a stubbed function for a function', () => {
            expect(() => {
                hero.weapon.sharpen();
            }).to.throw('"sharpen" is not implemented.');
        });

        it('should allow you to use sinon to stub a function', () => {
            sinon.stub(hero.weapon, 'sharpen');

            hero.weapon.sharpen();

            expect(hero.weapon.sharpen).to.have.been.called;
        });

        it('should allow you to use sinon to spy on function', () => {
            let weapon = ineeda<Weapon>({
                sharpen: () => {}
            });
            sinon.spy(weapon, 'sharpen');
            weapon.sharpen();

            expect(weapon.sharpen).to.have.been.called;
        });

        it('should allow you to build up deeply nexted objects', () => {
            let hero = ineeda<Hero>();

            sinon.stub(hero.holdOut, 'then').returns(Promise.resolve());

            return hero.holdOut.then()
            .then(() => {
                expect(hero.holdOut.then).to.not.be.undefined;
            });
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
});
