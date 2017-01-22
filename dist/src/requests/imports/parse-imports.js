"use strict";
// Dependencies:
var ts = require('typescript');
var get_source_file_1 = require('../../common/get-source-file');
var import_1 = require('./import');
var imports;
function parseImports(path) {
    imports = [];
    var sourceFile = get_source_file_1.getSourceFile(path);
    ts.forEachChild(sourceFile, function (node) {
        visit(node);
    });
    return imports;
}
exports.parseImports = parseImports;
function visit(node) {
    if (node.kind === ts.SyntaxKind.ImportDeclaration) {
        getImportDescription(node);
    }
}
function getImportDescription(node) {
    // TODO:
    // Need to work out a better way to get:
    //     * node.moduleSpecifier.text
    //     * node.importClause.namedBindings.elements
    //     * node.importClause.namedBindings.name
    var importDeclaration = node;
    var importClause = importDeclaration.importClause;
    var relativePath = importDeclaration.moduleSpecifier.text;
    if (importClause.name) {
        imports.push(new import_1.Import(importDeclaration.importClause.name.text, relativePath));
    }
    if (importClause.namedBindings) {
        var namedBindings = importClause.namedBindings;
        if (namedBindings.elements) {
            var elements = namedBindings.elements;
            elements.forEach(function (element) {
                imports.push(new import_1.Import(element.name.text, relativePath));
            });
        }
        else {
            imports.push(new import_1.Import(namedBindings.name.text, relativePath));
        }
    }
}
//# sourceMappingURL=parse-imports.js.map