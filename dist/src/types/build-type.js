"use strict";
// Dependencies:
var get_types_1 = require('./get-types');
var get_request_1 = require('../requests/get-request');
var ineeda_1 = require('../ineeda');
function buildType(request) {
    var typeDescription = get_types_1.getTypes(request)[request.name];
    if (typeDescription) {
        var result_1 = {};
        typeDescription.forEach(function (property) {
            getPropertyValue(request, property, result_1);
        });
        return result_1;
    }
}
exports.buildType = buildType;
function getPropertyValue(request, property, result) {
    var value;
    if (property.type === 'function') {
        value = getFunctionValue(request.name, property.name);
    }
    else {
        value = getPrimitiveValue(property.type);
    }
    if (value != null) {
        result[property.name] = value;
    }
    else {
        getTypedValue(request, property, result);
    }
}
function getFunctionValue(className, methodName) {
    return function () {
        throw new Error("\"" + className + "." + methodName + "\" is not implemented.");
    };
}
function getPrimitiveValue(type) {
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
}
function getTypedValue(request, property, result) {
    Object.defineProperty(result, property.name, {
        get: function () {
            return ineeda_1.build(get_request_1.getRequest.fromImport(request.path, property.type));
        }
    });
}
//# sourceMappingURL=build-type.js.map