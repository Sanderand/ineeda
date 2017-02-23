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
import { ineeda, IneedaFactory, IneedaOptions } from '../src/index';

describe('ineeda:', () => {
    describe('ineeda:', () => {
        let hero: Hero;

        beforeEach(() => {
            let heroFactory: IneedaFactory<Hero> = ineeda.factory<Hero>();
            hero = heroFactory();
        });

        it('should create a mock of a class', () => {
            expect(hero).to.not.be.undefined;
        });

        it('should create a mock of an interface', () => {
            let horse: IHorse = ineeda<IHorse>();
            expect(horse).to.not.be.undefined;
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
    });

    describe('ineeda - instanceof:', () => {
        let hero: Hero;

        beforeEach(() => {
            let options: IneedaOptions = { instanceof: Hero }
            hero = ineeda<Hero>(options);
        });

        it('should create a mock of a class', () => {
            expect(hero).to.not.be.undefined;
        });

        it('should be an actual instance of the class', () => {
            expect(hero).to.be.an.instanceof(Hero);
        });
    });
});
