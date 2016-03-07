'use strict';
var Ineeda_1 = require('./Ineeda');
var Getter = (function () {
    function Getter() {
    }
    Getter.prototype.getMeAnEnumValue = function (description) {
        var values = description.values.sort();
        var value = values[0];
        return value;
    };
    Getter.prototype.getMeAPropertyValue = function (name, property, result) {
        var value;
        if (property.type === 'function') {
            value = this.getFunctionValue(name, property.name);
        }
        else {
            value = this.getPrimitiveValue(property.type);
        }
        if (value != null) {
            result[property.name] = value;
        }
        else {
            this.getTypedValue(property, result);
        }
    };
    Getter.prototype.getFunctionValue = function (className, methodName) {
        return function () {
            throw new Error("\"" + className + "." + methodName + "\" is not implemented.");
        };
    };
    Getter.prototype.getPrimitiveValue = function (type) {
        if (type === 'any') {
            return {};
        }
        else if (type === 'array') {
            return [];
        }
        else if (type === 'boolean') {
            return false;
        }
        else if (type === 'number') {
            return 0;
        }
        else if (type === 'string') {
            return '';
        }
    };
    Getter.prototype.getTypedValue = function (property, result) {
        Object.defineProperty(result, property.name, {
            get: function () {
                return Ineeda_1.default(null, property.type);
            }
        });
    };
    return Getter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Getter;
