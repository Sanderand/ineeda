"use strict";
// Dependencies:
var ts = require('typescript');
var enum_value_1 = require('./enum-value');
var get_type_checker_1 = require('../common/get-type-checker');
var get_source_file_1 = require('../common/get-source-file');
var checker;
var enums;
function parseEnums(request) {
    enums = {};
    checker = get_type_checker_1.getTypeChecker();
    var sourceFile = get_source_file_1.getSourceFile(request.path);
    ts.forEachChild(sourceFile, function (node) { return visit(node); });
    return enums;
}
exports.parseEnums = parseEnums;
function visit(node) {
    if (node.kind === ts.SyntaxKind.EnumDeclaration) {
        getEnumDescription(node);
    }
    else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
        ts.forEachChild(node, function (child) { return visit(child); });
    }
}
function getEnumDescription(node) {
    var symbol = checker.getSymbolAtLocation(node.name);
    var enumSymbol = node.localSymbol || symbol;
    var name = enumSymbol.name;
    if (enums[name]) {
        return;
    }
    enums[name] = node.members.map(getEnumValue);
}
function getEnumValue(member, index) {
    var value;
    if (member.initializer) {
        value = parseInt(member.initializer.text, 10);
    }
    else {
        value = index;
    }
    return new enum_value_1.EnumValue(value);
}
//# sourceMappingURL=parse-enums.js.map