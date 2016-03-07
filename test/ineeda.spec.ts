/// <reference path="../src/_references.d.ts" />
'use strict';

// Interfaces:
import IHero from './IHero';

// Test Utilities:
import * as chai from 'chai';
import * as path from 'path';

// Test setup:
const expect = chai.expect;

// Under test:
import ineeda from '../src/index';

describe('ineeda:', () => {
    let hero: IHero;

    beforeEach(() => {
        hero = ineeda<IHero>(path.resolve(__dirname, './IHero'));
    });

    it('should create a stub of an Interface', () => {
        expect(hero.name).to.not.be.undefined;
    });

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
        }).to.throw('"IWeapon.sharpen" is not implemented.');
    });

    it('should set the lowest value for an Enum', () => {
        expect(hero.species).to.equal(0);
        expect(hero.weapon.type).to.equal(3);
    });
});
