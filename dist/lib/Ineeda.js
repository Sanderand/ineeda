'use strict';
var path = require('path');
var Finder_1 = require('./Finder');
var Getter_1 = require('./Getter');
function Ineeda(interfacePath, name) {
    var finder = new Finder_1.default();
    if (interfacePath) {
        finder.findTypes(interfacePath);
    }
    if (!name) {
        name = interfacePath.split(path.sep).slice(-1)[0];
    }
    var interfaceDescription = finder.getInterface(name);
    var enumDescription = finder.getEnum(name);
    var getter = new Getter_1.default();
    if (interfaceDescription) {
        var result_1 = {};
        interfaceDescription.forEach(function (property) {
            getter.getMeAPropertyValue(name, property, result_1);
        });
        return result_1;
    }
    if (enumDescription) {
        return getter.getMeAnEnumValue(enumDescription);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Ineeda;
