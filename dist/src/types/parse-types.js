"use strict";
// Constants:
var ANY_TYPE = 'any';
var ARRAY_REGEX = /.*\[\]$/;
var ARRAY_TYPE = 'array';
var CONSTRUCTOR_MEMBER_NAME = '__constructor';
var FUNCTION_REGEX = /\(.*\)\s=>\s.*/;
var FUNCTION_TYPE = 'function';
// Dependencies:
var ts = require('typescript');
var get_source_file_1 = require('../common/get-source-file');
var get_type_checker_1 = require('../common/get-type-checker');
var type_property_1 = require('./type-property');
var checker;
var types;
function parseTypes(request) {
    types = {};
    checker = get_type_checker_1.getTypeChecker();
    var sourceFile = get_source_file_1.getSourceFile(request.path);
    ts.forEachChild(sourceFile, function (node) { return visit(node); });
    return types;
}
exports.parseTypes = parseTypes;
function visit(node) {
    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
        getClassDescription(node);
    }
    else if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
        getInterfaceDescription(node);
    }
    else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
        ts.forEachChild(node, function (child) {
            visit(child);
        });
    }
}
function getClassDescription(node) {
    // TODO:
    // Need to work out a better way to get the name from the ClassDeclaration.
    var symbol = checker.getSymbolAtLocation(node);
    var classDeclaration = node;
    var classSymbol = (classDeclaration.localSymbol || symbol || classDeclaration.symbol);
    var name = classSymbol.name;
    if (types[name]) {
        return;
    }
    types[name] = node.members
        .filter(function (member) {
        return member.symbol.name !== CONSTRUCTOR_MEMBER_NAME;
    })
        .map(function (member) {
        var symbol = member.symbol;
        return getTypeProperty(symbol);
    });
}
function getInterfaceDescription(node) {
    // TODO:
    // Need to work out a better way to get the name from the InterfaceDeclaration.
    var symbol = checker.getSymbolAtLocation(node);
    var interfaceDeclaration = node;
    var interfaceSymbol = (interfaceDeclaration.localSymbol || symbol || interfaceDeclaration.symbol);
    var name = interfaceSymbol.name;
    if (types[name]) {
        return;
    }
    var interfaceType = checker.getDeclaredTypeOfSymbol(interfaceSymbol);
    var propertySymbols = checker.getPropertiesOfType(interfaceType);
    types[name] = propertySymbols.map(getTypeProperty);
}
function getTypeProperty(symbol) {
    var name = checker.symbolToString(symbol);
    var type = checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration));
    if (type.match(FUNCTION_REGEX)) {
        type = FUNCTION_TYPE;
    }
    if (type.match(ARRAY_REGEX)) {
        type = ARRAY_TYPE;
    }
    // TODO:
    // Need to work out a better way to get the name of an unresolved type.
    if (type === ANY_TYPE) {
        try {
            var declaration = symbol.declarations[0];
            var typeDeclaration = declaration;
            type = typeDeclaration.type.typeName.text;
        }
        catch (e) { }
    }
    if (!type) {
        type = ANY_TYPE;
    }
    return new type_property_1.TypeProperty(name, type);
}
//# sourceMappingURL=parse-types.js.map