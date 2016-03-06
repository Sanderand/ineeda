/// <reference path="./_references.d.ts" />
// Constants:
var ARRAY_REGEX = /.*\[\]$/;
var FUNCTION_REGEX = /\(.*\)\s=>\s.*/;
var INTERFACES = {};
// Dependencies:
var path = require('path');
var ts = require('typescript');
function findTypes(path) {
    var files = [];
    if (path) {
        files.push(path);
    }
    var program = ts.createProgram(files, {
        target: ts.ScriptTarget.ES6,
        module: ts.ModuleKind.CommonJS
    });
    var checker = program.getTypeChecker();
    var sourceFiles = program.getSourceFiles();
    sourceFiles.forEach(function (sourceFile) {
        ts.forEachChild(sourceFile, function (node) {
            visit(checker, node);
        });
    });
}
function visit(checker, node) {
    if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
        var interfaceSymbol = checker.getSymbolAtLocation(node.name);
        if (INTERFACES[interfaceSymbol.name]) {
            return;
        }
        var properties = [];
        var interfaceType = checker.getDeclaredTypeOfSymbol(interfaceSymbol);
        var propertySybmbols = checker.getPropertiesOfType(interfaceType);
        propertySybmbols.forEach(function (propertySymbol) {
            var name = checker.symbolToString(propertySymbol);
            var type = checker.typeToString(checker.getTypeOfSymbolAtLocation(propertySymbol, propertySymbol.valueDeclaration));
            if (type.match(FUNCTION_REGEX)) {
                type = 'function';
            }
            if (type.match(ARRAY_REGEX)) {
                type = 'array';
            }
            properties.push({ name: name, type: type });
        });
        INTERFACES[interfaceSymbol.name] = properties;
    }
    else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
        ts.forEachChild(node, function (node) {
            visit(checker, node);
        });
    }
}
function getErrorMethod(className, methodName) {
    return function () {
        throw new Error("\"" + className + "." + methodName + "\" is n.");
    };
}
function getValue(type) {
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
findTypes();
function hereYouGo(interfacePath, name) {
    if (interfacePath) {
        findTypes(interfacePath);
    }
    if (!name) {
        name = interfacePath.split(path.sep).slice(-1);
    }
    var properties = INTERFACES[name];
    var result = {};
    properties.forEach(function (property) {
        var value;
        if (property.type === 'function') {
            value = getErrorMethod(name, property.name);
        }
        else {
            value = getValue(property.type);
        }
        if (value != null) {
            result[property.name] = value;
        }
        else {
            Object.defineProperty(result, property.name, {
                get: function () {
                    return hereYouGo(null, property.type);
                }
            });
        }
    });
    return result;
}
exports.__esModule = true;
exports["default"] = hereYouGo;
