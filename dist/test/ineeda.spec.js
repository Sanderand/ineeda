"use strict";
// Test Utilities:
var chai = require('chai');
// Test setup:
var expect = chai.expect;
// Dependencies:
var Hero_1 = require('./types/Hero');
// Under test:
var index_1 = require('../src/index');
describe('ineeda:', function () {
    describe('ineed.a:', function () {
        var hero;
        beforeEach(function () {
            hero = index_1.default.a();
        });
        it('should create a mock of a class', function () {
            expect(hero).to.not.be.undefined;
        });
        it('should create a mock of an interface', function () {
            var horse = index_1.default.a();
            expect(horse).to.not.be.undefined;
        });
        it('should set a property: any to an empty object', function () {
            expect(hero.currentTool).to.deep.equal({});
        });
        it('should set a property: array to an empty array', function () {
            expect(hero.tools).to.deep.equal([]);
        });
        it('should set a property: boolean to false', function () {
            expect(hero.isBrave).to.equal(false);
        });
        it('should set a property: number to 0', function () {
            expect(hero.age).to.equal(0);
        });
        it('should set a property: string to an empty string', function () {
            expect(hero.name).to.equal('');
        });
        it('should set a getter for a nested complex object', function () {
            expect(hero.weapon).to.not.be.undefined;
        });
        it('should set a stubbed function for a function', function () {
            expect(function () {
                hero.weapon.sharpen();
            }).to.throw('"Weapon.sharpen" is not implemented.');
        });
        it('should set the lowest value for an Enum', function () {
            expect(hero.species).to.equal(0);
            expect(hero.weapon.type).to.equal(3);
        });
    });
    describe('ineed.aninstanceof:', function () {
        var hero;
        beforeEach(function () {
            hero = index_1.default.aninstanceof(Hero_1.default);
        });
        it('should create a mock of a class', function () {
            expect(hero).to.not.be.undefined;
        });
        it('should be an actual instance of the class', function () {
            expect(hero).to.be.an.instanceof(Hero_1.default);
        });
    });
});
//# sourceMappingURL=ineeda.spec.js.map